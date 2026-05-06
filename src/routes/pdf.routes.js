import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromPDF, cleanupFile } from '../services/pdf.service.js';
import { chunkText } from '../utils/chunker.js';
import { embedChunks } from '../services/embeddings.service.js';
import { storeChunksInVectorStore } from '../services/vectorstore.service.js'; 

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  file.mimetype === 'application/pdf'
    ? cb(null, true)
    : cb(new Error('Only PDF files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  try {
    const { text, pageCount } = await extractTextFromPDF(req.file.path);
    const cleanedText = text.replace(/\n{3,}/g, '\n\n').trim();

    const chunks = await chunkText(cleanedText);

    const vectors = await embedChunks(chunks);

    await storeChunksInVectorStore(chunks, req.file.originalname);

    res.json({
      success: true,
      filename: req.file.originalname,
      pageCount,
      textLength: cleanedText.length,
      chunking: { totalChunks: chunks.length },
      embeddings: {
        totalVectors: vectors.length,
        dimensions: vectors[0].length,
      },
      storage: {
        status: '✅ Stored in FAISS (in-memory)',
        chunksStored: chunks.length,
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to process PDF',
      details: error.message
    });
  } finally {
    cleanupFile(req.file.path);
  }
});

export default router;
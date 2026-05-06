import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import pdfRoutes from './routes/pdf.routes.js';
import qaRoutes from './routes/qa.routes.js';

const app = express();
app.use(express.json());

app.use('/api/pdf', pdfRoutes);
app.use('/api/qa', qaRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PDF RAG System is running',
    version: '1.0.0',
    endpoints: {
      upload: 'POST /api/pdf/upload',
      ask: 'POST /api/qa/ask',
      summarize: 'POST /api/qa/summarize',
    },
    config: {
      embeddingModel: 'text-embedding-3-small',
      llmModel: 'gpt-3.5-turbo',
      vectorStore: 'FAISS (in-memory)',
      chunkSize: 1000,
      chunkOverlap: 200,
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('OpenAI Key:', process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing');
});
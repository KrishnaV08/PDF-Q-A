import { Router } from 'express';
import { answerQuestion } from '../services/rag.service.js';
import { generateSummary } from '../services/rag.service.js';

const router = Router();


router.post('/ask', async (req, res) => {
  const { question, topK = 3 } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({
      error: 'Question is required',
      example: { question: 'What is this document about?' }
    });
  }

  if (typeof question !== 'string' || question.length > 500) {
    return res.status(400).json({
      error: 'Question must be a string under 500 characters'
    });
  }

  try {
    const startTime = Date.now();
    const { answer, sourceChunks } = await answerQuestion(question, topK);

    res.json({
      success: true,
      question,
      answer,
      metadata: {
        chunksSearched: topK,
        responseTimeMs: Date.now() - startTime,
        sourcesFound: sourceChunks.length,
      },
      sources: sourceChunks,
    });

  } catch (error) {
    if (error.message.includes('No documents loaded')) {
      return res.status(400).json({
        error: 'No PDF loaded',
        message: 'Please upload a PDF first via POST /api/pdf/upload'
      });
    }
    res.status(500).json({
      error: 'Failed to answer question',
      details: error.message
    });
  }
});


router.post('/summarize', async (req, res) => {
  try {
    const startTime = Date.now();
    const summary = await generateSummary();

    res.json({
      success: true,
      summary,
      metadata: {
        responseTimeMs: Date.now() - startTime,
      }
    });

  } catch (error) {
    if (error.message.includes('No documents loaded')) {
      return res.status(400).json({
        error: 'No PDF loaded',
        message: 'Please upload a PDF first via POST /api/pdf/upload'
      });
    }
    res.status(500).json({
      error: 'Failed to generate summary',
      details: error.message
    });
  }
});

export default router;
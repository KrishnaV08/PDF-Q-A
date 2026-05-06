import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { searchSimilarChunks } from './vectorstore.service.js';

let llmInstance = null;

function getLLM() {
  if (!llmInstance) {
    llmInstance = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0,
      maxTokens: 500,
    });
  }
  return llmInstance;
}

const RAG_PROMPT = PromptTemplate.fromTemplate(`
You are a precise document assistant. Answer ONLY from the context provided.
If the answer isn't in the context, say exactly: "This information is not available in the document."

Rules:
- Be concise and direct
- Never guess or use external knowledge
- If asked to summarize, cover all key points

Context:
{context}

Question: {question}

Answer (be specific and cite relevant details from the context):`);

const SUMMARY_PROMPT = PromptTemplate.fromTemplate(`
You are a document summarizer. Based on the following document excerpts, 
write a clear and concise summary covering:
1. What the document is about
2. Key topics or sections covered
3. Any important findings or highlights

Document excerpts:
{context}

Summary:`);

export async function answerQuestion(question, topK = 3) {
  const relevantChunks = await searchSimilarChunks(question, topK);

  if (relevantChunks.length === 0) {
    return {
      answer: 'No relevant information found. Please upload a PDF first.',
      sourceChunks: []
    };
  }

  const context = relevantChunks
    .map((chunk, i) => `[Chunk ${i + 1}]: ${chunk.pageContent}`)
    .join('\n\n');

  const chain = RAG_PROMPT.pipe(getLLM()).pipe(new StringOutputParser());
  const answer = await chain.invoke({ context, question });

  return {
    answer: answer.trim(),
    sourceChunks: relevantChunks.map(chunk => ({
      content: chunk.pageContent.substring(0, 200) + '...',
      source: chunk.metadata?.source || 'unknown',
      chunkIndex: chunk.metadata?.chunkIndex,
    }))
  };
}

export async function generateSummary() {
  const chunks = await searchSimilarChunks('document overview summary main topics', 6);

  if (chunks.length === 0) {
    throw new Error('No documents loaded. Please upload a PDF first.');
  }

  const context = chunks
    .map((chunk, i) => `[Section ${i + 1}]: ${chunk.pageContent}`)
    .join('\n\n');

  const chain = SUMMARY_PROMPT.pipe(getLLM()).pipe(new StringOutputParser());
  const summary = await chain.invoke({ context });

  return summary.trim();
}
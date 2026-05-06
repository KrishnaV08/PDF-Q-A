import { OpenAIEmbeddings } from '@langchain/openai';

let embeddingsInstance = null;

function getEmbeddings() {
  if (!embeddingsInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('❌ OPENAI_API_KEY not found in .env file');
    }
    embeddingsInstance = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });
  }
  return embeddingsInstance;
}

export async function embedText(text) {
  const vector = await getEmbeddings().embedQuery(text);
  return vector;
}

export async function embedChunks(chunks) {
  const texts = chunks.map(chunk => chunk.pageContent);
  const vectors = await getEmbeddings().embedDocuments(texts);
  return vectors;
}

export { getEmbeddings as getEmbeddingsInstance };
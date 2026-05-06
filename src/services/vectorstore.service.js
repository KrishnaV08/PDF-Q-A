import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { getEmbeddingsInstance } from './embeddings.service.js';

let vectorStoreInstance = null;

export async function storeChunksInVectorStore(chunks, filename) {
  const chunksWithMeta = chunks.map((chunk, index) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      source: filename,
      chunkIndex: index,
    }
  }));

  vectorStoreInstance = await FaissStore.fromDocuments(
    chunksWithMeta,
    getEmbeddingsInstance()
  );

  return vectorStoreInstance;
}

export async function searchSimilarChunks(query, topK = 3) {
  if (!vectorStoreInstance) {
    throw new Error('No documents loaded. Please upload a PDF first.');
  }

  const results = await vectorStoreInstance.similaritySearch(query, topK);
  return results;
}
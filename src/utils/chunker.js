import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export async function chunkText(text, options = {}) {
  const {
    chunkSize = 1000,
    chunkOverlap = 200,
  } = options;

  if (text.length > 100000) {
    console.warn(`⚠️ Large document detected (${text.length} chars). Consider increasing chunkSize.`);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  });

  const chunks = await splitter.createDocuments([text]);

  return chunks.map((chunk, index) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
      position: `${index + 1}/${chunks.length}`,
    }
  }));
}
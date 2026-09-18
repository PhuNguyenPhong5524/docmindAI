import mongoose from 'mongoose';
import Chunk from '../models/chunk.model.js';
import { generateQueryEmbedding } from './ai.service.js';

export const retrieveRelevantChunks = async (documentId, question, limit = 5) => {
  const queryVector = await generateQueryEmbedding(question);
  const objectId = new mongoose.Types.ObjectId(documentId);

  return Chunk.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector,
        numCandidates: 100,
        limit,
        filter: {
          document_id: objectId
        }
      }
    },
    {
      $project: {
        document_id: 1,
        text_content: 1,
        chunk_index: 1,
        page_number: 1,
        score: { $meta: 'vectorSearchScore' }
      }
    }
  ]);
};

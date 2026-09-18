import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

try {
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: 'Xin chào DOCMIND AI'
  });

  console.log('GEMINI OK');
  console.log(result.embeddings[0].values.slice(0, 5));
} catch (error) {
  console.error('GEMINI ERROR');
  console.error(error);
}
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Khởi tạo Gemini với chìa khóa trong .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Hàm biến text thành Vector (Embedding)
export const generateEmbedding = async (text) => {
  try {
    // Sử dụng model text-embedding-001 chuyên dụng cho RAG của Google
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    
    // Trả về mảng các con số (vector)
    return result.embedding.values;
  } catch (error) {
    console.error("Lỗi khi tạo embedding từ Gemini:", error);
    throw error;
  }
};
// Hàm đọc tài liệu và sinh ra câu trả lời ( model gemini-3.6-flash)
export const generateAnswer = async (context, question) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    
    const prompt = `Bạn là trợ lý AI thông minh của dự án DOCMIND.
Dựa vào các đoạn thông tin được trích xuất từ tài liệu dưới đây:
---
${context}
---
Hãy trả lời câu hỏi: "${question}"
Lưu ý: Nếu trong thông tin trên không có câu trả lời, hãy nói "Tôi không tìm thấy thông tin này trong tài liệu" chứ đừng tự bịa ra.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Lỗi khi sinh câu trả lời:", error);
    throw error;
  }
};
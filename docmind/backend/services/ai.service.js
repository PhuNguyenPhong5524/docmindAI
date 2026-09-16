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

// Hàm tóm tắt tài liệu theo cấu trúc chuẩn
export const generateSummary = async (documentText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    
    const prompt = `Bạn là chuyên gia phân tích tài liệu của DOCMIND.
Hãy đọc nội dung tài liệu dưới đây và tóm tắt nó một cách súc tích, chuyên nghiệp.
BẮT BUỘC phải trình bày theo đúng 4 phần sau (dùng định dạng Markdown):
1. **Tổng quan:** (Mục đích và chủ đề chính của tài liệu)
2. **Nội dung chính:** (Các luận điểm hoặc thông tin cốt lõi)
3. **Điểm quan trọng:** (Những chi tiết, con số hoặc quy định đáng chú ý nhất)
4. **Kết luận:** (Tóm lược lại giá trị của tài liệu)

--- NỘI DUNG TÀI LIỆU ---
${documentText}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Lỗi khi sinh tóm tắt:", error);
    throw error;
  }
};

// AI So sánh 2 tài liệu
export const generateComparison = async (contextA, contextB, criteria) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = `Bạn là chuyên gia phân tích tài liệu AI của DOCMIND.
Hãy so sánh hai tài liệu sau dựa trên tiêu chí/câu hỏi: "${criteria}"

--- THÔNG TIN TÀI LIỆU A ---
${contextA}

--- THÔNG TIN TÀI LIỆU B ---
${contextB}

Yêu cầu: Hãy lập một bảng so sánh chi tiết. Nếu một trong hai tài liệu không chứa thông tin về tiêu chí này, hãy ghi rõ "Không tìm thấy thông tin", tuyệt đối không tự bịa ra.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Lỗi khi sinh so sánh:", error);
    throw error;
  }
};
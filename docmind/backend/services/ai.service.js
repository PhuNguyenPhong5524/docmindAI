import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log(
  'Gemini key:',
  process.env.GEMINI_API_KEY
    ? `${process.env.GEMINI_API_KEY.slice(0, 4)}...${process.env.GEMINI_API_KEY.slice(-4)}`
    : 'CHƯA LOAD'
);
if (!apiKey) {
  throw new Error('Thiếu GEMINI_API_KEY trong file .env');
}

const ai = new GoogleGenAI({ apiKey });

const GENERATIVE_MODEL = 'gemini-3.6-flash';
const EMBEDDING_MODEL = 'gemini-embedding-001';

const validateText = (text, fieldName = 'Nội dung') => {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error(`${fieldName} không được để trống`);
  }

  return text.trim();
};

// Dùng cho chunk tài liệu
export const generateDocumentEmbedding = async (text) => {
  try {
    const content = validateText(text, 'Nội dung chunk');

    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: content,
      config: {
        taskType: 'RETRIEVAL_DOCUMENT'
      }
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding?.length) {
      throw new Error('Gemini không trả về embedding hợp lệ');
    }

    return embedding;
  } catch (error) {
    console.error('Lỗi tạo Document Embedding:', error.message);
    throw error;
  }
};

// Dùng cho câu hỏi khi làm RAG
export const generateQueryEmbedding = async (question) => {
  try {
    const content = validateText(question, 'Câu hỏi');

    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: content,
      config: {
        taskType: 'RETRIEVAL_QUERY'
      }
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding?.length) {
      throw new Error('Gemini không trả về query embedding hợp lệ');
    }

    return embedding;
  } catch (error) {
    console.error('Lỗi tạo Query Embedding:', error.message);
    throw error;
  }
};

// Sinh câu trả lời từ context RAG
export const generateAnswer = async (context, question) => {
  try {
    const safeContext = validateText(context, 'Context');
    const safeQuestion = validateText(question, 'Câu hỏi');

    const prompt = `
Bạn là trợ lý AI của hệ thống DOCMIND AI.

Chỉ trả lời dựa trên CONTEXT được cung cấp.
Không sử dụng kiến thức bên ngoài.
Không tự suy đoán hoặc bịa thông tin.
Không tự tạo tên tài liệu hoặc số trang.
Nếu CONTEXT không đủ thông tin, hãy trả lời:
"Tôi không tìm thấy thông tin này trong các tài liệu đã chọn."

CONTEXT:
${safeContext}

CÂU HỎI:
${safeQuestion}
`;

    const response = await ai.models.generateContent({
      model: GENERATIVE_MODEL,
      contents: prompt
    });

    const answer = response.text?.trim();

    if (!answer) {
      throw new Error('Gemini không trả về câu trả lời');
    }

    return answer;
  } catch (error) {
    console.error('Lỗi sinh câu trả lời:', error.message);
    throw error;
  }
};

// Tóm tắt tài liệu
export const generateSummary = async (documentText) => {
  try {
    const content = validateText(documentText, 'Nội dung tài liệu');

    const prompt = `
Bạn là trợ lý phân tích tài liệu của DOCMIND AI.

Hãy tóm tắt tài liệu dưới đây bằng tiếng Việt.
Chỉ sử dụng thông tin có trong tài liệu, không tự bổ sung thông tin bên ngoài.

Trình bày theo cấu trúc Markdown:

## 1. Tổng quan
## 2. Nội dung chính
## 3. Điểm quan trọng
## 4. Kết luận

NỘI DUNG TÀI LIỆU:
${content}
`;

    const response = await ai.models.generateContent({
      model: GENERATIVE_MODEL,
      contents: prompt
    });

    const summary = response.text?.trim();

    if (!summary) {
      throw new Error('Gemini không trả về nội dung tóm tắt');
    }

    return summary;
  } catch (error) {
    console.error('Lỗi sinh tóm tắt:', error.message);
    throw error;
  }
};

// So sánh 2 tài liệu
export const generateComparison = async (contextA, contextB, criteria) => {
  try {
    const documentA = validateText(contextA, 'Context tài liệu A');
    const documentB = validateText(contextB, 'Context tài liệu B');
    const compareCriteria = validateText(criteria, 'Tiêu chí so sánh');

    const prompt = `
Bạn là trợ lý phân tích tài liệu của DOCMIND AI.

Hãy so sánh hai tài liệu dựa trên tiêu chí:
"${compareCriteria}"

Yêu cầu:
- Chỉ sử dụng thông tin được cung cấp.
- Không tự suy đoán hoặc bịa thông tin.
- Nếu một tài liệu không có thông tin tương ứng, ghi "Không tìm thấy thông tin".
- Không tự tạo citation hoặc số trang.
- Trình bày kết quả bằng Markdown.
- Ưu tiên sử dụng bảng.

TÀI LIỆU A:
${documentA}

TÀI LIỆU B:
${documentB}
`;

    const response = await ai.models.generateContent({
      model: GENERATIVE_MODEL,
      contents: prompt
    });

    const comparison = response.text?.trim();

    if (!comparison) {
      throw new Error('Gemini không trả về kết quả so sánh');
    }

    return comparison;
  } catch (error) {
    console.error('Lỗi sinh so sánh:', error.message);
    throw error;
  }
};
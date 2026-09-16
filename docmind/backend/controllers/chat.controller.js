import Chunk from '../models/chunk.model.js';
import Message from '../models/message.model.js';
import { generateEmbedding, generateAnswer } from '../services/ai.service.js';

// 1. Gửi câu hỏi và lưu lại lịch sử
export const askQuestion = async (req, res) => {
  try {
    const { document_id, question } = req.body;
    
    if (!question || !document_id) {
      return res.status(400).json({ success: false, message: 'Thiếu câu hỏi hoặc ID tài liệu!' });
    }
    
    console.log(`\n--- CÓ CÂU HỎI MỚI: "${question}" ---`);

    const questionVector = await generateEmbedding(question);
    
    const searchResults = await Chunk.aggregate([
      {
        "$vectorSearch": {
          "index": "vector_index",
          "path": "embedding",
          "queryVector": questionVector,
          "numCandidates": 100,
          "limit": 3
        }
      }
    ]);

    let answer = "Không tìm thấy thông tin nào liên quan trong tài liệu.";
    if (searchResults && searchResults.length > 0) {
      const context = searchResults.map(doc => doc.text_content).join('\n\n');
      answer = await generateAnswer(context, question);
    }

    // --- ĐIỂM MỚI: Lưu 2 tin nhắn vào Database ---
    await Message.create([
      { document_id: document_id, role: 'user', content: question },
      { document_id: document_id, role: 'ai', content: answer }
    ]);

    console.log("Đã trả lời và lưu lịch sử thành công!\n");
    res.status(200).json({ success: true, answer: answer });

  } catch (error) {
    console.error("Lỗi Chat API:", error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};

// 2. API mới: Lấy lịch sử chat để hiển thị lên giao diện
export const getChatHistory = async (req, res) => {
  try {
    const { document_id } = req.params;
    
    // Tìm tất cả tin nhắn của file này, sắp xếp theo thời gian cũ -> mới
    const history = await Message.find({ document_id }).sort({ createdAt: 1 });
    
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy lịch sử: ' + error.message });
  }
};
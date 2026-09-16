import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  document_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'ai'], // 'user' là bạn hỏi, 'ai' là Gemini trả lời
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  },
  citations: [{
    document_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true
    },
    document_name: {
      type: String,
      required: true
    },
    page_number: {
      type: Number,
      required: true,
      min: 1
    },
    excerpt: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

messageSchema.index({ user_id: 1, document_id: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;

import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
  document_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  text_content: {
    type: String,
    required: true
  },
  // Đây là nơi chứa dãy số (Vector) của Gemini trả về
  embedding: {
    type: [Number], 
    required: true
  },
  chunk_index: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Chunk = mongoose.model('Chunk', chunkSchema);
export default Chunk;
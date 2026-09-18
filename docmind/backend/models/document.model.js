import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  original_name: { type: String, required: true },
  display_name: { type: String, required: true },
  file_url: { type: String, required: true },
  mime_type: { type: String, required: true, default: 'application/pdf' },
  size: { type: Number, required: true },
  total_pages: { type: Number, default: 0 },
  status: { type: String, enum: ['PROCESSING', 'READY', 'FAILED'], default: 'PROCESSING' },
  error_message: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('Document', documentSchema);

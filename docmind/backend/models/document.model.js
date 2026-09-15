import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  original_name: { type: String, required: true },
  display_name: { type: String },
  file_url: { type: String },
  mime_type: { type: String, default: 'application/pdf' },
  size: { type: Number },
  total_pages: { type: Number },
  status: { type: String, enum: ['PROCESSING', 'READY', 'FAILED'], default: 'PROCESSING' },
  error_message: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model('Document', documentSchema);
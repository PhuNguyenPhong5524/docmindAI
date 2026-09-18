import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'], default: 'INFO' },
  is_read: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ user_id: 1 });
notificationSchema.index({ user_id: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);

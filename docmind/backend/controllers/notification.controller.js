import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';

const getCurrentUserId = (req) => req.user?.userId;

export const getUserNotifications = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Khong xac dinh duoc nguoi dung.' });
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user_id: userId }).sort({ createdAt: -1 }),
      Notification.countDocuments({ user_id: userId, is_read: false })
    ]);

    return res.status(200).json({
      success: true,
      unread_count: unreadCount,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Khong xac dinh duoc nguoi dung.' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Khong tim thay thong bao.' });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: userId },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Khong tim thay thong bao.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Da danh dau thong bao la da doc.',
      data: notification
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Khong xac dinh duoc nguoi dung.' });
    }

    await Notification.updateMany(
      { user_id: userId, is_read: false },
      { is_read: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Da danh dau tat ca thong bao la da doc.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};

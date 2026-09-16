import Notification from '../models/notification.model.js';

// API 1: Lấy danh sách thông báo của User
export const getUserNotifications = async (req, res) => {
  try {
    // Trong MVP demo, giả sử cứng ID của user hiện tại (giống lúc upload)
    const userId = "66f1234567890abcdef12345"; 
    
    const notifications = await Notification.find({ user_id: userId }).sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ user_id: userId, is_read: false });

    res.status(200).json({ 
      success: true, 
      unread_count: unreadCount,
      data: notifications 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};

// API 2: Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo!' });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({ success: true, message: 'Đã đánh dấu đọc!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};
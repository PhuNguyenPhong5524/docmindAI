import User from '../models/user.model.js';
import Document from '../models/document.model.js';

// API 1: Lấy thống kê tổng quan cho Dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        total_users: totalUsers,
        total_documents: totalDocuments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};

// API 2: Lấy danh sách User
export const getAllUsers = async (req, res) => {
  try {
    // Không trả về field password để bảo mật
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};

// API 3: Khóa / Mở khóa User
export const toggleUserLock = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
    }

    // Đảo ngược trạng thái khóa (nếu đang khóa thì mở, đang mở thì khóa)
    // Giả sử trong model User có field status là 'ACTIVE' hoặc 'BLOCKED'
    user.status = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: `Đã ${user.status === 'BLOCKED' ? 'khóa' : 'mở khóa'} tài khoản thành công!`,
      status: user.status 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};
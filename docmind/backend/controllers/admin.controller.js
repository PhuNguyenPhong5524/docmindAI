import User from '../models/user.model.js';
import Document from '../models/document.model.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ created_at: -1 });
    const currentUserId = req.user?.userId || req.user?.id; // Lấy ID của người đang request từ Token

    const usersWithStats = await Promise.all(users.map(async (userDoc) => {
      const user = userDoc.toObject();
      let docsCount = 0;
      let totalStorage = "0.00";

      try {
        const userDocs = await Document.find({ owner_id: user._id });
        docsCount = userDocs.length;
        const totalBytes = userDocs.reduce((sum, doc) => sum + (doc.size || 0), 0);
        totalStorage = (totalBytes / (1024 * 1024)).toFixed(2);
      } catch (err) {}

      // Format ngày sẵn từ Backend
      const rawDate = user.created_at || user.createdAt;
      const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('vi-VN') : 'Mới tham gia';

      return {
        ...user,
        id: user._id,
        docsCount,
        totalStorage,
        chatsCount: 0,
        // Xác định chính xác ai đang online bằng cách so ID
        isOnline: currentUserId && user._id.toString() === currentUserId.toString(),
        
        // Nhồi mọi biến ngày vào để Frontend của Phú bắt kiểu gì cũng trúng (tránh bị trống ở Table)
        date: rawDate,
        createdAt: rawDate,
        joinDate: formattedDate 
      };
    }));

    res.status(200).json(usersWithStats);
  } catch (error) {
    console.error("Lỗi get users:", error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách' });
  }
};

export const toggleUserLock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    user.status = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    await user.save();

    res.status(200).json({ success: true, status: user.status });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email này đã tồn tại!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      full_name: name, 
      email: email,
      password: hashedPassword,
      role: role || 'USER',
      status: 'ACTIVE'
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Tạo tài khoản thành công!', data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo người dùng!' });
  }
};
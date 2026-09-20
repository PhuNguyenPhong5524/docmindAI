import mongoose from 'mongoose';
import Document from '../models/document.model.js';
import Message from '../models/message.model.js';

const getUserObjectId = (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Vui long dang nhap lai.' });
    return null;
  }

  if (req.user?.role !== 'USER') {
    res.status(403).json({ success: false, message: 'Chi tai khoan USER moi duoc truy cap lich su nay.' });
    return null;
  }

  return new mongoose.Types.ObjectId(userId);
};

export const getUserHistory = async (req, res) => {
  try {
    const userId = getUserObjectId(req, res);
    if (!userId) return;

    const [sessions, totalMessages, queriedDocs] = await Promise.all([
      Message.aggregate([
        { $match: { user_id: userId } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$document_id',
            last_message_id: { $first: '$_id' },
            last_role: { $first: '$role' },
            last_content: { $first: '$content' },
            last_citations: { $first: '$citations' },
            last_active_at: { $first: '$createdAt' },
            first_active_at: { $last: '$createdAt' },
            message_count: { $sum: 1 },
            question_count: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } }
          }
        },
        { $sort: { last_active_at: -1 } },
        {
          $lookup: {
            from: 'documents',
            localField: '_id',
            foreignField: '_id',
            as: 'document'
          }
        },
        { $unwind: '$document' },
        { $match: { 'document.owner_id': userId } },
        {
          $project: {
            _id: 0,
            id: { $toString: '$_id' },
            document_id: '$_id',
            document_name: '$document.display_name',
            document_status: '$document.status',
            last_message_id: 1,
            last_role: 1,
            last_content: 1,
            citations_count: { $size: { $ifNull: ['$last_citations', []] } },
            last_active_at: 1,
            first_active_at: 1,
            message_count: 1,
            question_count: 1
          }
        }
      ]),
      Message.countDocuments({ user_id: userId }),
      Message.distinct('document_id', { user_id: userId })
    ]);

    const totalQuestions = sessions.reduce((sum, item) => sum + (item.question_count || 0), 0);
    const totalCitations = sessions.reduce((sum, item) => sum + (item.citations_count || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          total_sessions: sessions.length,
          queried_docs: queriedDocs.length,
          total_messages: totalMessages,
          total_questions: totalQuestions,
          citation_rate: totalQuestions > 0 ? Math.round((totalCitations / totalQuestions) * 100) : 0
        },
        sessions
      }
    });
  } catch (error) {
    console.error('Loi user history:', error);
    res.status(500).json({ success: false, message: 'Khong the tai lich su hoi thoai.' });
  }
};

export const deleteUserHistorySession = async (req, res) => {
  try {
    const userId = getUserObjectId(req, res);
    if (!userId) return;

    if (!mongoose.isValidObjectId(req.params.document_id)) {
      return res.status(404).json({ success: false, message: 'Khong tim thay phien hoi thoai.' });
    }

    const document = await Document.findOne({
      _id: req.params.document_id,
      owner_id: userId
    }).select('_id');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Khong tim thay tai lieu cua ban.' });
    }

    const result = await Message.deleteMany({
      user_id: userId,
      document_id: document._id
    });

    res.status(200).json({
      success: true,
      message: 'Da xoa lich su hoi thoai.',
      deleted_count: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};

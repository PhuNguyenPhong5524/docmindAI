import mongoose from 'mongoose';
import Document from '../models/document.model.js';
import Message from '../models/message.model.js';

const STORAGE_LIMIT_BYTES = 100 * 1024 * 1024;

const getUserObjectId = (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, message: 'Vui long dang nhap lai.' });
    return null;
  }

  if (req.user?.role !== 'USER') {
    res.status(403).json({ success: false, message: 'Chi tai khoan USER moi duoc truy cap dashboard nay.' });
    return null;
  }

  return new mongoose.Types.ObjectId(userId);
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = getUserObjectId(req, res);
    if (!userId) return;

    const [documentStats, totalQuestions, chatSessions, recentDocuments, recentChats] = await Promise.all([
      Document.aggregate([
        { $match: { owner_id: userId } },
        {
          $group: {
            _id: null,
            total_documents: { $sum: 1 },
            ready_documents: { $sum: { $cond: [{ $eq: ['$status', 'READY'] }, 1, 0] } },
            processing_documents: { $sum: { $cond: [{ $eq: ['$status', 'PROCESSING'] }, 1, 0] } },
            failed_documents: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
            total_storage_bytes: { $sum: { $ifNull: ['$size', 0] } },
            total_pages: { $sum: { $ifNull: ['$total_pages', 0] } }
          }
        }
      ]),
      Message.countDocuments({ user_id: userId, role: 'user' }),
      Message.distinct('document_id', { user_id: userId }),
      Document.find({ owner_id: userId })
        .sort({ created_at: -1 })
        .limit(5)
        .select('display_name original_name size total_pages status error_message created_at updated_at')
        .lean(),
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
            updated_at: { $first: '$createdAt' }
          }
        },
        { $sort: { updated_at: -1 } },
        { $limit: 5 },
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
            document_id: '$_id',
            last_message_id: 1,
            last_role: 1,
            last_content: 1,
            citations_count: { $size: { $ifNull: ['$last_citations', []] } },
            updated_at: 1,
            document_name: '$document.display_name'
          }
        }
      ])
    ]);

    const stats = documentStats[0] || {
      total_documents: 0,
      ready_documents: 0,
      processing_documents: 0,
      failed_documents: 0,
      total_storage_bytes: 0,
      total_pages: 0
    };

    res.status(200).json({
      success: true,
      data: {
        stats: {
          ...stats,
          chat_sessions: chatSessions.length,
          total_questions: totalQuestions,
          storage_limit_bytes: STORAGE_LIMIT_BYTES
        },
        recent_documents: recentDocuments,
        recent_chats: recentChats
      }
    });
  } catch (error) {
    console.error('Loi user dashboard:', error);
    res.status(500).json({ success: false, message: 'Khong the tai du lieu dashboard.' });
  }
};

import Notification from '../models/notification.model.js';

export const createAndEmitNotification = async ({ io, userId, documentId, title, message, type, event }) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      title,
      message,
      type
    });

    if (io) {
      const room = `user:${userId}`;
      io.to(room).emit(event, { document_id: documentId });
      io.to(room).emit('notification:new', notification);
    }

    return notification;
  } catch (error) {
    console.error('Loi tao notification:', error.message);
    return null;
  }
};

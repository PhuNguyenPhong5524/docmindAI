import api from "../lib/api";
import type { NotificationsResponse, UserHistoryResponse } from "../types/history";

export const getUserHistory = async (): Promise<UserHistoryResponse> => {
  const { data } = await api.get<UserHistoryResponse>("/api/history");
  return data;
};

export const deleteHistorySession = async (documentId: string): Promise<void> => {
  await api.delete(`/api/history/${documentId}`);
};

export const getNotifications = async (): Promise<NotificationsResponse> => {
  const { data } = await api.get<NotificationsResponse>("/api/notifications");
  return data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.patch("/api/notifications/read-all");
};

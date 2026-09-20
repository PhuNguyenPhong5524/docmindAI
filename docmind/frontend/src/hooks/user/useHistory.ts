import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteHistorySession,
  getNotifications,
  getUserHistory,
  markAllNotificationsRead,
} from "../../services/historyService";

export const userHistoryQueryKey = ["user-history"] as const;
export const userNotificationsQueryKey = ["user-notifications"] as const;

export const useUserHistory = () => {
  return useQuery({
    queryKey: userHistoryQueryKey,
    queryFn: getUserHistory,
  });
};

export const useUserNotifications = () => {
  return useQuery({
    queryKey: userNotificationsQueryKey,
    queryFn: getNotifications,
  });
};

export const useDeleteHistorySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHistorySession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userHistoryQueryKey });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userNotificationsQueryKey });
    },
  });
};

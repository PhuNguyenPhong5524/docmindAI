import api from "../lib/api";
import type { User } from "../types/adminUser";

export interface AdminUsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export interface ToggleLockResponse {
  success: boolean;
  message: string;
  status: string;
}

// Gọi API lấy danh sách User
export const getAllUsers = async (): Promise<AdminUsersResponse> => {
  const { data } = await api.get<AdminUsersResponse>("/api/admin/users");
  return data;
};

// Gọi API khóa/mở khóa
export const toggleLockUser = async (userId: string): Promise<ToggleLockResponse> => {
  const { data } = await api.patch<ToggleLockResponse>(`/api/admin/users/${userId}/toggle-lock`);
  return data;
};
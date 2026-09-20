import api from "../lib/api";
import type { UserDashboardResponse } from "../types/dashboard";

export const getUserDashboard = async (): Promise<UserDashboardResponse> => {
  const { data } = await api.get<UserDashboardResponse>("/api/user/dashboard");
  return data;
};

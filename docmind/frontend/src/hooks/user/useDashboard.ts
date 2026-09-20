import { useQuery } from "@tanstack/react-query";
import { getUserDashboard } from "../../services/dashboardService";

export const userDashboardQueryKey = ["user-dashboard"] as const;

export const useUserDashboard = () => {
  return useQuery({
    queryKey: userDashboardQueryKey,
    queryFn: getUserDashboard,
  });
};

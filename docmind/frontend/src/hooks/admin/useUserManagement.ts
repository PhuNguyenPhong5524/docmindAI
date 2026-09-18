import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, toggleLockUser } from "../../services/adminService";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsers,
  });
};

export const useToggleLockUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => toggleLockUser(userId),
    onSuccess: () => {
      // Ép hệ thống tải lại danh sách sau khi khóa/mở khóa thành công
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
};
import { useState, useMemo, useEffect } from "react";
import { message } from "antd";
import type { User, StatusFilterType, RoleFilterType } from "../../types/adminUser";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>("ALL");

  const [selectedUserForBlock, setSelectedUserForBlock] = useState<User | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  
  // State quản lý Modal thêm người dùng
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const getToken = () => localStorage.getItem("token") || localStorage.getItem("accessToken") || "";

  const fetchUsers = async () => {
    message.loading({ content: "Đang tải dữ liệu...", key: "fetchUsers" });
    try {
      const response = await fetch("http://localhost:8080/api/admin/users", {
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data && Array.isArray(data)) {
        const formattedUsers = data.map((u: any) => ({
          ...u,
          id: u._id || u.id,
          name: u.name || u.full_name || "Chưa cập nhật", 
          initials: (u.name || u.full_name || "U").substring(0, 2).toUpperCase(),
          avatarBg: "bg-primary text-on-primary", 
          docsCount: u.docsCount || 0,
          chatsCount: u.chatsCount || 0,
          status: u.status || "ACTIVE",
          role: u.role || "USER"
        }));
        setUsers(formattedUsers);
        message.success({ content: "Đã đồng bộ dữ liệu mới nhất!", key: "fetchUsers" });
      }
    } catch (error) {
      message.error({ content: "Lỗi kết nối Backend!", key: "fetchUsers" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "ALL" || user.status === statusFilter;
      const matchRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleRefresh = (): void => {
    fetchUsers();
  };

  const handleOpenBlockModal = (user: User): void => {
    setSelectedUserForBlock(user);
    setIsBlockModalOpen(true);
  };

  const toggleLockAPI = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/toggle-lock`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return await res.json();
    } catch (error) {
      return { success: false };
    }
  };

  const handleConfirmBlockUser = async (userId: string): Promise<void> => {
    const result = await toggleLockAPI(userId);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: result.status || "BLOCKED" } : u)));
      message.success("Đã thay đổi trạng thái tài khoản!");
    } else {
      message.error("Thao tác thất bại.");
    }
    setIsBlockModalOpen(false);
    setSelectedUserForBlock(null);
  };

  const handleUnblockUser = async (user: User): Promise<void> => {
    const result = await toggleLockAPI(user.id);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: result.status || "ACTIVE" } : u)));
      message.success("Đã thay đổi trạng thái tài khoản!");
    } else {
      message.error("Thao tác thất bại.");
    }
  };

  const handleOpenDrawer = (user: User): void => {
    setSelectedUserForDrawer(user);
    setIsDrawerOpen(true);
  };

  // API Thêm người dùng
  const handleAddUser = async (userData: any): Promise<boolean> => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(userData)
      });
      const result = await res.json();
      if (res.ok || result.success) {
        message.success("Đã thêm người dùng mới thành công!");
        fetchUsers(); // Tải lại danh sách
        setIsAddModalOpen(false);
        return true;
      } else {
        message.error(result.message || "Tạo tài khoản thất bại!");
        return false;
      }
    } catch (error) {
      message.error("Lỗi máy chủ!");
      return false;
    }
  };

  return {
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    isBlockModalOpen,
    setIsBlockModalOpen,
    selectedUserForBlock,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedUserForDrawer,
    isAddModalOpen,
    setIsAddModalOpen,
    handleRefresh,
    handleOpenBlockModal,
    handleConfirmBlockUser,
    handleUnblockUser,
    handleOpenDrawer,
    handleAddUser
  };
};
import { useState, useMemo } from "react";
import { message } from "antd";
import type { User, StatusFilterType, RoleFilterType } from "../../types/adminUser";

const INITIAL_USERS: User[] = [
  {
    id: "USR-9042",
    name: "Vũ Minh Quân",
    email: "quan.vu@vnu.edu.vn",
    role: "USER",
    status: "ACTIVE",
    joinedAt: "14/10/2023 09:14",
    docsCount: 14,
    chatsCount: 28,
    avatarBg: "bg-secondary-fixed text-on-secondary-fixed",
    initials: "VQ",
    isSystem: false,
    lastLogin: "28 phút trước",
    ip: "118.70.182.14",
    storageUsed: "68.4 MB",
    queriesCount: 45,
  },
  {
    id: "USR-0001",
    name: "Nguyễn Văn Quản Trị",
    email: "admin@docmind.ai",
    role: "ADMIN",
    status: "ACTIVE",
    joinedAt: "01/01/2023 00:00",
    docsCount: 248,
    chatsCount: 1200,
    avatarBg: "bg-primary text-on-primary",
    initials: "NV",
    isSystem: true,
    lastLogin: "Vừa xong",
    ip: "127.0.0.1",
    storageUsed: "1.2 GB",
    queriesCount: 1420,
  },
  {
    id: "USR-7019",
    name: "Lê Đăng Khoa",
    email: "khoa.le@fpt.com.vn",
    role: "USER",
    status: "BLOCKED",
    joinedAt: "02/09/2023 11:45",
    docsCount: 2,
    chatsCount: 5,
    avatarBg: "bg-error text-on-error",
    initials: "LĐ",
    isSystem: false,
    lastLogin: "15 ngày trước",
    ip: "113.161.4.12",
    storageUsed: "8.1 MB",
    queriesCount: 12,
  },
];

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>("ALL");

  const [selectedUserForBlock, setSelectedUserForBlock] = useState<User | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "ALL" || user.status === statusFilter;
      const matchRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleRefresh = (): void => {
    message.loading({ content: "Đang đồng bộ danh sách...", key: "refresh" });
    setTimeout(() => {
      message.success({ content: "Đã cập nhật mới nhất!", key: "refresh" });
    }, 500);
  };

  const handleOpenBlockModal = (user: User): void => {
    setSelectedUserForBlock(user);
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlockUser = (userId: string): void => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "BLOCKED" } : u))
    );
    setIsBlockModalOpen(false);
    setSelectedUserForBlock(null);
    message.success("Đã khóa tài khoản thành công!");
  };

  const handleUnblockUser = (user: User): void => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: "ACTIVE" } : u))
    );
    message.success("Đã mở khóa tài khoản!");
  };

  const handleOpenDrawer = (user: User): void => {
    setSelectedUserForDrawer(user);
    setIsDrawerOpen(true);
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
    handleRefresh,
    handleOpenBlockModal,
    handleConfirmBlockUser,
    handleUnblockUser,
    handleOpenDrawer,
  };
};
import React, { useState, useMemo, useEffect } from "react";
import { useUserManagement } from "../../../hooks/admin/useUserManagement";
import { UserHeader } from "./components/UserHeader";
import { UserStats } from "./components/UserStats";
import { UserFilterBar } from "./components/UserFilterBar";
import { UserTable } from "./components/UserTable";
import { UserBlockModal } from "./components/UserBlockModal";
import { UserDetailDrawer } from "./components/UserDetailDrawer";

export default function AdminUserPage(): React.ReactElement {
  const {
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
  } = useUserManagement();

  // State quản lý phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Tự động reset về trang 1 mỗi khi lọc dữ liệu hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter]);

  // Cắt danh sách filteredUsers theo trang hiện tại
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleRefreshAndResetPage = () => {
    setCurrentPage(1);
    handleRefresh();
  };

  return (
    <div className="w-full bg-background min-h-full flex flex-col">
      <UserHeader totalUsers={users.length} onRefresh={handleRefreshAndResetPage} />

      <UserStats users={users} />

      <UserFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        totalCount={users.length}
        activeCount={users.filter((u) => u.status === "ACTIVE").length}
        blockedCount={users.filter((u) => u.status === "BLOCKED").length}
      />

      <UserTable
        users={paginatedUsers}
        total={filteredUsers.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onOpenBlockModal={handleOpenBlockModal}
        onUnblockUser={handleUnblockUser}
        onOpenDrawer={handleOpenDrawer}
      />

      <UserBlockModal
        open={isBlockModalOpen}
        user={selectedUserForBlock}
        onConfirm={handleConfirmBlockUser}
        onCancel={() => setIsBlockModalOpen(false)}
      />

      <UserDetailDrawer
        open={isDrawerOpen}
        user={selectedUserForDrawer}
        onClose={() => setIsDrawerOpen(false)}
        onOpenBlockModal={handleOpenBlockModal}
      />
    </div>
  );
}
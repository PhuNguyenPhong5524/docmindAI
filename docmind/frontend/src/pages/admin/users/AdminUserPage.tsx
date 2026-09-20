import React, { useState, useMemo, useEffect } from "react";
import { message } from "antd";
import { useUserManagement } from "../../../hooks/admin/useUserManagement";
import { UserHeader } from "./components/UserHeader";
import { UserStats } from "./components/UserStats";
import { UserFilterBar } from "./components/UserFilterBar";
import { UserTable } from "./components/UserTable";
import { UserBlockModal } from "./components/UserBlockModal";
import { UserDetailDrawer } from "./components/UserDetailDrawer";
import { UserAddModal } from "./components/UserAddModal";

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
    isAddModalOpen,
    setIsAddModalOpen,
    handleRefresh,
    handleOpenBlockModal,
    handleConfirmBlockUser,
    handleUnblockUser,
    handleOpenDrawer,
    handleAddUser
  } = useUserManagement();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter]);

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

  const handleExportCSV = () => {
    if (!users || users.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }
    const headers = ["ID", "Tên người dùng", "Email", "Vai trò", "Trạng thái"];
    const csvData = users.map(u => [
      u.id,
      `"${u.name || u.full_name || 'Chưa cập nhật'}"`,
      `"${u.email || 'Chưa cập nhật'}"`,
      u.role || 'USER',
      u.status || 'ACTIVE'
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Danh_sach_nguoi_dung_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Đã tải file Excel/CSV thành công xuống máy!");
  };

  return (
    <div className="w-full bg-background min-h-full flex flex-col">
      <UserHeader 
        totalUsers={users.length} 
        onRefresh={handleRefreshAndResetPage}
        onExportCSV={handleExportCSV} 
        onAddUser={() => setIsAddModalOpen(true)}
      />

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

      <UserAddModal 
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSuccess={handleAddUser}
      />
    </div>
  );
}
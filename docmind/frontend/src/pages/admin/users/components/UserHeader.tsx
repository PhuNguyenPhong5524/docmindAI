import React from 'react';
import { ReloadOutlined, DownloadOutlined, UserAddOutlined } from '@ant-design/icons';
import { message } from 'antd';

interface UserHeaderProps {
  totalUsers: number;
  onRefresh: () => void;
  onExportCSV?: () => void;
  onAddUser?: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ totalUsers, onRefresh, onExportCSV, onAddUser }) => {
  const handleExportClick = () => {
    if (onExportCSV) {
      onExportCSV();
    } else {
      message.info("Tính năng xuất CSV đang tải...");
    }
  };

  return (
    <div className="px-6 py-5 border-b border-surface-container-low bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold text-on-surface">Quản lý người dùng</h1>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">
            {totalUsers} tài khoản tổng
          </span>
        </div>
        <p className="text-sm text-on-surface-variant">
          Theo dõi, phân quyền vai trò và quản lý quyền truy cập không gian tài liệu trí tuệ nhân tạo DOCMIND AI.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors text-sm font-semibold shadow-sm cursor-pointer"
        >
          <ReloadOutlined /> Làm mới
        </button>
        <button
          onClick={handleExportClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors text-sm font-semibold shadow-sm cursor-pointer"
        >
          <DownloadOutlined /> Xuất CSV
        </button>
        <button
          onClick={onAddUser}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:opacity-90 transition-opacity text-sm font-semibold shadow-sm cursor-pointer"
        >
          <UserAddOutlined /> Thêm người dùng
        </button>
      </div>
    </div>
  );
};
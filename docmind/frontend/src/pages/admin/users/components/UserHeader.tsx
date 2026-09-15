import React from "react";
import { Button, message } from "antd";
import { ReloadOutlined, DownloadOutlined, UserAddOutlined } from "@ant-design/icons";

interface UserHeaderProps {
  totalUsers: number;
  onRefresh: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ totalUsers, onRefresh }) => {
  return (
    <div className="px-6 pt-6 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-widest font-medium">
          <span>KHO HỆ THỐNG</span>
          <span>/</span>
          <span>XÁC THỰC & TRUY CẬP</span>
        </div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Quản lý người dùng
          </h1>
          <span className="text-xs px-3 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium">
            {totalUsers} tài khoản tổng
          </span>
        </div>
        <p className="text-sm text-on-surface-variant max-w-2xl mt-1">
          Theo dõi, phân quyền vai trò và quản lý quyền truy cập không gian tài liệu trí tuệ nhân tạo DOCMIND AI.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Làm mới
        </Button>
        <Button icon={<DownloadOutlined />} onClick={() => message.success("Đã xuất danh sách CSV thành công!")}>
          Xuất CSV
        </Button>
        <Button type="primary" icon={<UserAddOutlined />}>
          Thêm người dùng
        </Button>
      </div>
    </div>
  );
};
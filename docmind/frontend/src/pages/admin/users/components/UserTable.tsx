import React from "react";
import { Tag, Button, Pagination } from "antd";
import { 
  LockOutlined, 
  UnlockOutlined, 
  EyeOutlined, 
  SafetyCertificateOutlined, 
  FileTextOutlined, 
  MessageOutlined 
} from "@ant-design/icons";
import type { User } from "../../../../types/adminUser";

interface UserTableProps {
  users: User[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onOpenBlockModal: (user: User) => void;
  onUnblockUser: (user: User) => void;
  onOpenDrawer: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onOpenBlockModal,
  onUnblockUser,
  onOpenDrawer,
}) => {
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="px-6 pb-8 flex-1">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-low shadow-sm flex flex-col">
        {/* Sub Header Counter Bar */}
        <div className="px-6 py-2.5 bg-surface-container-low/60 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-1 font-mono">
            <span>Hiển thị</span>
            <span className="font-bold text-on-surface">{startItem} - {endItem}</span>
            <span>trên</span>
            <span className="font-bold text-on-surface">{total}</span>
            <span>người dùng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>Hệ thống đồng bộ trực tuyến</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[880px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                <th className="py-3 px-6 w-72">Người dùng</th>
                <th className="py-3 px-4 w-32">Vai trò</th>
                <th className="py-3 px-4 w-36">Trạng thái</th>
                <th className="py-3 px-4 w-44">Ngày đăng ký</th>
                <th className="py-3 px-4 w-52">Thống kê nhanh</th>
                <th className="py-3 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                    Không có dữ liệu người dùng.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${user.avatarBg}`}>
                          {user.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="font-bold text-on-surface flex items-center gap-1">
                            {user.name}
                            {user.isSystem && <SafetyCertificateOutlined className="text-primary text-xs" title="Tài khoản hệ thống" />}
                          </div>
                          <span className="font-mono text-xs text-on-surface-variant">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Tag color={user.role === "ADMIN" ? "purple" : "blue"}>{user.role}</Tag>
                    </td>
                    <td className="py-3.5 px-4">
                      {user.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ecfdf5] text-[#047857]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-container text-on-error-container">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-on-surface-variant">
                      {user.joinedAt}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-on-surface font-medium" title="Số tài liệu">
                          <FileTextOutlined className="text-tertiary" />
                          {user.docsCount ?? 14} docs
                        </span>
                        <span className="text-on-surface-variant">·</span>
                        <span className="inline-flex items-center gap-1 text-on-surface font-medium" title="Số phiên hội thoại RAG">
                          <MessageOutlined className="text-secondary" />
                          {user.chatsCount ?? 28} chats
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {user.isSystem ? (
                          <span className="px-2 py-1 text-xs text-on-surface-variant opacity-50 cursor-not-allowed">
                            Không thể khóa
                          </span>
                        ) : user.status === "BLOCKED" ? (
                          <Button type="text" icon={<UnlockOutlined />} onClick={() => onUnblockUser(user)} className="text-[#10b981] font-bold">
                            Mở khóa
                          </Button>
                        ) : (
                          <Button type="text" danger icon={<LockOutlined />} onClick={() => onOpenBlockModal(user)}>
                            Khóa tài khoản
                          </Button>
                        )}
                        <Button type="text" icon={<EyeOutlined />} onClick={() => onOpenDrawer(user)} className="text-primary">
                          Chi tiết
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls */}
        <div className="p-4 bg-surface-container-low/30 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-surface-container-low">
          <span className="text-xs text-on-surface-variant">
            Tổng cộng <span className="font-semibold text-on-surface">{total}</span> kết quả
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            locale={{ items_per_page: "/ trang" }}
          />
        </div>
      </div>
    </div>
  );
};
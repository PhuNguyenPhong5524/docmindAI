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

  // Hàm tự động tạo chữ cái viết tắt từ tên thật
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="px-6 pb-8 flex-1">
      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
        {/* Sub Header Counter Bar */}
        <div className="px-6 py-2.5 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 font-mono">
            <span>Hiển thị</span>
            <span className="font-bold text-slate-700">{startItem} - {endItem}</span>
            <span>trên</span>
            <span className="font-bold text-slate-700">{total}</span>
            <span>người dùng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hệ thống đồng bộ trực tuyến</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[880px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-y border-slate-200">
                <th className="py-3 px-6 w-72 font-semibold">Người dùng</th>
                <th className="py-3 px-4 w-32 font-semibold">Vai trò</th>
                <th className="py-3 px-4 w-36 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 w-44 font-semibold">Ngày đăng ký</th>
                <th className="py-3 px-4 w-52 font-semibold">Thống kê nhanh</th>
                <th className="py-3 px-6 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Không có dữ liệu người dùng.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  // Đảm bảo bắt được tên bằng mọi giá (fix lỗi tàng hình)
                  const displayName = user.name || (user as any).full_name || (user as any).fullName || "Người dùng ẩn";
                  
                  return (
                    <tr key={user.id || (user as any)._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          {/* Avatar chữ */}
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                            {user.initials || getInitials(displayName)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            {/* ĐÃ FIX: Dùng text-slate-900 để tên luôn hiện màu đen, tránh bị chìm vào nền */}
                            <div className="font-bold text-slate-900 flex items-center gap-1 text-sm">
                              {displayName}
                              {user.isSystem && <SafetyCertificateOutlined className="text-indigo-500 text-xs" title="Tài khoản hệ thống" />}
                            </div>
                            <span className="font-mono text-xs text-slate-500 truncate">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Tag color={user.role === "ADMIN" ? "purple" : "blue"} className="font-semibold">{user.role}</Tag>
                      </td>
                      <td className="py-3.5 px-4">
                        {user.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Đã khóa
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        {(user as any).joinDate || (user as any).joinedAt || "Mới tham gia"}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium" title="Số tài liệu">
                            <FileTextOutlined className="text-slate-400" />
                            {(user as any).docsCount ?? 0} docs
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium" title="Số phiên hội thoại RAG">
                            <MessageOutlined className="text-indigo-400" />
                            {(user as any).chatsCount ?? 0} chats
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user.isSystem ? (
                            <span className="px-2 py-1 text-xs text-slate-400 cursor-not-allowed">
                              Không thể khóa
                            </span>
                          ) : user.status === "BLOCKED" ? (
                            <Button type="text" icon={<UnlockOutlined />} onClick={() => onUnblockUser(user)} className="text-emerald-600 font-semibold hover:bg-emerald-50">
                              Mở khóa
                            </Button>
                          ) : (
                            <Button type="text" danger icon={<LockOutlined />} onClick={() => onOpenBlockModal(user)} className="font-semibold hover:bg-red-50">
                              Khóa
                            </Button>
                          )}
                          <Button type="text" icon={<EyeOutlined />} onClick={() => onOpenDrawer(user)} className="text-indigo-600 font-semibold hover:bg-indigo-50">
                            Chi tiết
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls */}
        <div className="p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            Tổng cộng <span className="font-semibold text-slate-700">{total}</span> kết quả
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
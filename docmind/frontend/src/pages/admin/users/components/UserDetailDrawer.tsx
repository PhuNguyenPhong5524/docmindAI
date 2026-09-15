import React from "react";
import { Drawer, Button, Tag, Progress } from "antd";
import { 
  LockOutlined, 
  SafetyCertificateOutlined, 
  FolderOpenOutlined, 
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import type { User } from "../../../../types/adminUser";

interface UserDetailDrawerProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onOpenBlockModal: (user: User) => void;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({ open, user, onClose, onOpenBlockModal }) => {
  if (!user) return null;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <span className="font-bold text-base">Thông tin người dùng</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
            {user.id}
          </span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={420}
      footer={
        <div className="flex items-center justify-between">
          <Button onClick={onClose}>Đóng</Button>
          {!user.isSystem && user.status === "ACTIVE" && (
            <Button
              danger
              type="primary"
              icon={<LockOutlined />}
              onClick={() => {
                onClose();
                onOpenBlockModal(user);
              }}
            >
              Khóa tài khoản
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-5 text-sm">
        {/* User Hero Card */}
        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col items-center text-center gap-2">
          <div className={`w-20 h-20 rounded-full text-2xl font-bold flex items-center justify-center shadow-sm ${user.avatarBg}`}>
            {user.initials}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-base text-on-surface">{user.name}</h2>
            <span className="font-mono text-xs text-on-surface-variant">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Tag color="purple">{user.role}</Tag>
            {user.status === "ACTIVE" ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#047857]">
                ● Hoạt động
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error-container text-on-error-container">
                ● Đã khóa
              </span>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-2.5 rounded-lg bg-surface-container-high/60 flex items-center gap-2 text-xs text-on-surface-variant">
          <SafetyCertificateOutlined className="text-tertiary text-base" />
          <span>Dữ liệu nhạy cảm (mật khẩu băm, JWT token, khóa bí mật) được bảo vệ và ẩn hoàn toàn khỏi console.</span>
        </div>

        {/* System Activity Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
            THÔNG TIN HOẠT ĐỘNG HỆ THỐNG
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-surface-container-low flex flex-col">
              <span className="text-xs text-on-surface-variant">Ngày tham gia</span>
              <span className="font-mono font-bold text-on-surface mt-1">{user.joinedAt}</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low flex flex-col">
              <span className="text-xs text-on-surface-variant">Lần đăng nhập cuối</span>
              <span className="font-mono font-bold text-[#10b981] mt-1">{user.lastLogin ?? "28 phút trước"}</span>
              <span className="font-mono text-[10px] text-on-surface-variant">IP: {user.ip ?? "118.70.182.14"}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2">
            <span className="text-xs text-on-surface-variant font-medium">Khối lượng sử dụng tài nguyên AI</span>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-on-surface">
                <FolderOpenOutlined className="text-tertiary" /> Tài liệu đã tải lên
              </span>
              <span className="font-mono font-bold">{user.docsCount ?? 12} tài liệu ({user.storageUsed ?? "68.4 MB"})</span>
            </div>
            <Progress percent={34} showInfo={false} strokeColor="#006693" size="small" />
            <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-container-low">
              <span className="flex items-center gap-1.5 text-on-surface">
                <ThunderboltOutlined className="text-primary" /> Câu hỏi RAG Embeddings
              </span>
              <span className="font-mono font-bold text-primary">{user.queriesCount ?? 45} truy vấn</span>
            </div>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
            PHÂN QUYỀN CHI TIẾT
          </span>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
              <span>Truy cập API Vector Ingestion</span>
              <CheckCircleOutlined className="text-[#10b981]" />
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
              <span>Chia sẻ tài liệu công khai</span>
              <CheckCircleOutlined className="text-[#10b981]" />
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
              <span>Quyền quản trị viên Tenant</span>
              {user.role === "ADMIN" ? (
                <CheckCircleOutlined className="text-[#10b981]" />
              ) : (
                <CloseCircleOutlined className="text-error" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
import React from "react";
import { Modal, Button, Tag } from "antd";
import { ExclamationCircleOutlined, LockOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { User } from "../../../../types/adminUser";

interface UserBlockModalProps {
  open: boolean;
  user: User | null;
  onConfirm: (userId: string) => void;
  onCancel: () => void;
}

export const UserBlockModal: React.FC<UserBlockModalProps> = ({ open, user, onConfirm, onCancel }) => {
  if (!user) return null;

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={480} destroyOnClose>
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center shrink-0 text-2xl">
            <ExclamationCircleOutlined />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg text-on-surface">Khóa tài khoản người dùng?</h3>
            <p className="text-xs text-on-surface-variant">
              Người dùng sẽ không thể đăng nhập, tải tài liệu hoặc sử dụng các tính năng AI cho đến khi tài khoản được mở khóa.
            </p>
          </div>
        </div>

        {/* Selected User Summary Card */}
        <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm ${user.avatarBg}`}>
              {user.initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-on-surface">{user.name}</span>
              <span className="font-mono text-xs text-on-surface-variant">{user.email}</span>
            </div>
          </div>
          <Tag color="blue">{user.role}</Tag>
        </div>

        {/* Warning Callout */}
        <div className="px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant text-xs flex items-center gap-2">
          <InfoCircleOutlined className="text-tertiary text-sm" />
          <span>Các tiến trình RAG đang truy vấn của người dùng này sẽ lập tức bị hủy bỏ.</span>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-surface-container-low">
          <Button onClick={onCancel}>Hủy bỏ</Button>
          <Button type="primary" danger icon={<LockOutlined />} onClick={() => onConfirm(user.id)}>
            Khóa tài khoản
          </Button>
        </div>
      </div>
    </Modal>
  );
};
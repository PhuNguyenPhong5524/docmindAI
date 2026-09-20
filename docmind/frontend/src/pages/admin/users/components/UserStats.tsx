import React, { useMemo } from "react";
import { UserOutlined, CheckCircleOutlined, LockOutlined, MessageOutlined } from "@ant-design/icons";
import type { User } from "../../../../types/adminUser";

interface UserStatsProps {
  users: User[];
}

export const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const activeCount = useMemo(() => users.filter((u) => u.status === "ACTIVE").length, [users]);
  const blockedCount = useMemo(() => users.filter((u) => u.status === "BLOCKED").length, [users]);
  const activePercent = users.length > 0 ? ((activeCount / users.length) * 100).toFixed(1) : "0";

  const totalInteractions = useMemo(() => users.reduce((sum, u) => sum + (u.chatsCount || 0), 0), [users]);
  const interactionsPerHour = Math.round(totalInteractions / 24);

  return (
    <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-low shadow-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant">Tổng tài khoản</span>
          <span className="text-2xl font-bold">{users.length}</span>
          <span className="font-mono text-xs text-primary">Cập nhật liên tục</span>
        </div>
        <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary text-xl">
          <UserOutlined />
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-low shadow-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant">Đang hoạt động (Active)</span>
          <span className="text-2xl font-bold">{activeCount}</span>
          <span className="font-mono text-xs text-[#10b981]">{activePercent}% khả dụng</span>
        </div>
        <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-[#10b981] text-xl">
          <CheckCircleOutlined />
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-low shadow-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant">Đang bị khóa (Blocked)</span>
          <span className="text-2xl font-bold text-error">{String(blockedCount).padStart(2, "0")}</span>
          <span className="font-mono text-xs text-on-surface-variant">Cần xem xét an toàn</span>
        </div>
        <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-error text-xl">
          <LockOutlined />
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-low shadow-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant">Tổng tương tác RAG</span>
          <span className="text-2xl font-bold">{totalInteractions.toLocaleString()}</span>
          <span className="font-mono text-xs text-tertiary">~{interactionsPerHour} câu hỏi AI/giờ</span>
        </div>
        <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary text-xl">
          <MessageOutlined />
        </div>
      </div>
    </div>
  );
};
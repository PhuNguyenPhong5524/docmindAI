import React from "react";
import { Input, Select, Segmented, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import type { StatusFilterType, RoleFilterType } from "../../../../types/adminUser";

interface UserFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: StatusFilterType;
  setStatusFilter: (value: StatusFilterType) => void;
  roleFilter: RoleFilterType;
  setRoleFilter: (value: RoleFilterType) => void;
  totalCount: number;
  activeCount: number;
  blockedCount: number;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  totalCount,
  activeCount,
  blockedCount,
}) => {
  return (
    <div className="px-6 mb-4">
      <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col lg:flex-row items-center justify-between gap-4 border border-surface-container-low">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          className="max-w-md"
        />

        <div className="flex items-center gap-3">
          <Segmented
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as StatusFilterType)}
            options={[
              { label: `Tất cả (${totalCount})`, value: "ALL" },
              { label: `Hoạt động (${activeCount})`, value: "ACTIVE" },
              { label: `Đã khóa (${blockedCount})`, value: "BLOCKED" },
            ]}
          />

          <Select<RoleFilterType>
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            className="w-44"
            options={[
              { value: "ALL", label: "Vai trò: Tất cả" },
              { value: "USER", label: "USER" },
              { value: "ADMIN", label: "ADMIN" },
            ]}
          />
          <Button icon={<FilterOutlined />} />
        </div>
      </div>
    </div>
  );
};
export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface User {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  joinDate?: string;
  created_at?: string;
  docsCount: number;
  chatsCount: number;
  totalStorage?: string;
  isOnline?: boolean;
  avatarBg: string;
  initials: string;
  isSystem: boolean;
  lastLogin: string;
  ip: string;
  storageUsed: string;
  queriesCount: number;
}

export type StatusFilterType = "ALL" | UserStatus;
export type RoleFilterType = "ALL" | UserRole;

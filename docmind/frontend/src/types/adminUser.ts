export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  docsCount: number;
  chatsCount: number;
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
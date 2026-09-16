// =========================
// Enum Types
// =========================

export type UserRole = "USER" | "ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED";

// =========================
// User Types
// =========================

export interface IUser {
  _id: string;
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  refreshToken: string | null;
  created_at: string;
  updated_at: string;
}

// =========================
// Auth User
// =========================

export interface AuthUser {
  _id: string;
  email: string;
  role: UserRole;
}

// =========================
// Login
// =========================

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

// =========================
// Register
// =========================

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// =========================
// Refresh Token
// =========================

export interface RefreshTokenResponse {
  accessToken: string;
  user?: AuthUser;
}

// =========================
// Auth Store
// =========================

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}
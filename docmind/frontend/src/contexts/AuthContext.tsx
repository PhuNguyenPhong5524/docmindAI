/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser, UserRole } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;

  setUser: (user: AuthUser | null) => void;
  logout: () => void;

  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
    
  const [user, setUser] =
    useState<AuthUser | null>(() => {
      const token =
        localStorage.getItem("accessToken");

      const storedUser =
        localStorage.getItem("user");

      if (!token || !storedUser) {
        return null;
      }

      return JSON.parse(storedUser) as AuthUser;
    });

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setUser(null);
  };

  const hasAnyRole = (
    roles: UserRole[]
  ): boolean => {
    return !!user && roles.includes(user.role);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      setUser,
      logout,
      hasAnyRole,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
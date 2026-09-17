import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthLayout } from "./layouts/AuthLayout";
import { UserLayout } from "./layouts/user/UserLayout";
import AdminLayout from "./layouts/admin/AdminLayout";

import { LoginPage } from "./pages/auth/login/LoginPage";
import { RegisterPage } from "./pages/auth/register/RegisterPage";

import UserDashboardPage from "./pages/user/dashboard/UserDashboardPage";
import { UserDocumentPage } from "./pages/user/documents/UserDocumentPage";
import UserChat from "./pages/user/chatRag/UserChatPage";
import DocumentComparePage from "./pages/user/documentCompare/DocumentComparePage";
import HistoryPage from "./pages/user/history/HistoryPage";

import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";
import AdminUserPage from "./pages/admin/users/AdminUserPage";
import AdminDocumentPage from "./pages/admin/documents/AdminDocumentPage";

const queryClient = new QueryClient();

const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} replace />;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
              <Route element={<UserLayout />}>
                <Route path="/dashboard" element={<UserDashboardPage />} />
                <Route path="/documents" element={<UserDocumentPage />} />
                <Route path="/chat" element={<UserChat />} />
                <Route path="/compare" element={<DocumentComparePage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUserPage />} />
                <Route path="/admin/documents" element={<AdminDocumentPage />} />
              </Route>
            </Route>

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
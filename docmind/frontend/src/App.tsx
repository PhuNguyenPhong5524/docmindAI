import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { UserLayout } from './layouts/user/UserLayout';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { UserDocumentPage } from './pages/user/documents/UserDocumentPage';
import UserChat from './pages/user/chatRag/UserChatPage';
import UserDashboardPage from './pages/user/dashboard/UserDashboardPage';
import DocumentComparePage from './pages/user/documentCompare/DocumentComparePage';
import HistoryPage from './pages/user/history/HistoryPage';
import AdminLayout from './layouts/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/dashboard/AdminDashboardPage';
import AdminUserPage from './pages/admin/users/AdminUserPage';
import AdminDocumentPage from './pages/admin/documents/AdminDocumentPage';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* ==================== PUBLIC AUTH ROUTES ==================== */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ==================== USER ROUTES (TRUY CẬP TRỰC TIẾP) ==================== */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/documents" element={<UserDocumentPage />} />
            <Route path="/chat" element={<UserChat />} />
            {/* <Route path="/summary" element={<Placeholder title="Trang Tóm tắt Tài liệu" />} /> */}
            <Route path="/compare" element={<DocumentComparePage/>} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* ==================== ADMIN ROUTES (TẠM ẨN) ==================== */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUserPage />} />
            <Route path="/admin/documents" element={<AdminDocumentPage/>} />
          </Route>

          {/* ==================== FALLBACK ROUTE ==================== */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
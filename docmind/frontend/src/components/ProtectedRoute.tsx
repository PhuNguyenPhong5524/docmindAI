// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// // import { useAuth } from '../contexts/AuthContext';

// interface ProtectedRouteProps {
//   children?: React.ReactNode;
//   roles?: string[];
//   redirectTo?: string;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   roles,
//   redirectTo,
// }) => {
//   const { user, loading } = ;

//   // Hiển thị Spinner Loading thay vì trả về null 
//   if (loading) {
//     return (
//       <div className="flex min-h-screen w-full items-center justify-center bg-surface">
//         <div className="flex flex-col items-center gap-3">
//           <span className="material-symbols-outlined animate-spin text-4xl text-primary">
//             progress_activity
//           </span>
//           <span className="font-label-md text-label-md text-on-surface-variant font-medium">
//             Đang kiểm tra quyền truy cập...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   // Chưa đăng nhập -> Chuyển hướng về Login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Đã đăng nhập nhưng không đủ quyền -> Chuyển hướng theo Role 
//   if (roles && !roles.includes(user.role)) {
//     console.warn(`[ProtectedRoute] User role '${user.role}' không có quyền truy cập. Yêu cầu:`, roles);

//     const fallbackPath = redirectTo || (user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
//     return <Navigate to={fallbackPath} replace />;
//   }

//   // Cho phép render: Ưu tiên children, nếu không có thì render <Outlet /> cho Layout Routes
//   return children ? <>{children}</> : <Outlet />;
// };

// export default ProtectedRoute;
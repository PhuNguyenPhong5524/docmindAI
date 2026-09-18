import { createBrowserRouter } from "react-router-dom";
import UserManagementPage from "../pages/admin/UserManagementPage";

// Tạo bộ điều hướng (Router) cho toàn bộ Website
const router = createBrowserRouter([
  {
    path: "/admin/users", // Đường dẫn trên trình duyệt
    element: <UserManagementPage />, // Giao diện sẽ hiển thị
  },
  
]);

export default router;
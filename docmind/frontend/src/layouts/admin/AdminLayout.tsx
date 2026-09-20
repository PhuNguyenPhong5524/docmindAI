import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Tooltip, message, Tag, Modal } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BellOutlined,
  UserOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Logo from "../../components/Logo";
import { useAuth } from "../../contexts/AuthContext";

const { Header, Sider, Content } = Layout;

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(2);

  const displayName = user?.full_name || user?.email || "Admin";
  const displayEmail = user?.email || "admin@docmind.ai";
  const displayRole = user?.role || "ADMIN";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "AD";

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản quản trị không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        await logout();
        message.success("Đã đăng xuất");
        navigate("/login", { replace: true });
      },
    });
  };

  const menuItems = [
    { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/admin/users", icon: <TeamOutlined />, label: "Người dùng" },
    { key: "/admin/documents", icon: <FileTextOutlined />, label: "Tài liệu" },
  ];

  const adminMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin tài khoản",
      onClick: () => navigate("/admin/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt hệ thống",
    },
    { type: "divider" as const },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        width={260}
        theme="light"
        className="fixed left-0 top-0 bottom-0 h-screen z-50 border-r border-slate-200/80 shadow-sm"
        style={{ position: "fixed", left: 0, top: 0, bottom: 0 }}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-100">
              <Logo className="w-9 h-9" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-indigo-700 tracking-tight leading-none text-base">DOCMIND AI</span>
                  <Tag color="purple" className="m-0 text-[10px] font-bold px-1 py-0 leading-tight">
                    ADMIN
                  </Tag>
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">Admin Console</span>
              </div>
            </div>

            <div className="px-4 pt-4 pb-1">
              <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">Điều hướng chính</span>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={menuItems}
              className="border-r-0 px-2 mt-1 font-medium text-slate-700"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl m-3 border border-slate-200/60">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="bg-indigo-600 font-bold shrink-0" size="default">
                    {initials}
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 truncate">{displayName}</span>
                      <span className="text-[9px] px-1 rounded bg-purple-100 text-purple-700 font-bold">
                        {displayRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 truncate">{displayEmail}</span>
                  </div>
                </div>
                <Tooltip title="Đăng xuất">
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                  />
                </Tooltip>
              </div>
            ) : (
              <Button block type="link" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 260 }}>
        <Header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40 h-16 leading-[64px] shadow-none">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer font-medium">DOCMIND</span>
            <RightOutlined className="text-[10px] text-slate-400" />
            <span className="text-[#ffffff] font-semibold">Khu vực Quản trị</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/60 px-3 py-1 rounded-full text-emerald-700 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">System: Healthy &amp; Synced</span>
            </div>

            <Tooltip title="Thông báo">
              <Badge count={notificationsCount} offset={[-2, 4]} size="small">
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined className="text-2xl !text-[#ffffff]" />}
                  className="!bg-[#4f46e5]"
                  onClick={() => {
                    setNotificationsCount(0);
                    message.info("Đã đánh dấu tất cả thông báo là đã đọc");
                  }}
                />
              </Badge>
            </Tooltip>

            <Dropdown menu={{ items: adminMenuItems }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer border-l border-slate-200 pl-3">
                <Avatar size="small" icon={!user ? <UserOutlined /> : undefined} className="bg-indigo-600">
                  {user ? initials : null}
                </Avatar>
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-[#ffffff] truncate max-w-[180px]">{displayName}</span>
                  <span className="text-[10px] text-slate-300 font-mono">{displayRole}</span>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="bg-[#f8f9ff] min-h-[calc(100vh-64px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

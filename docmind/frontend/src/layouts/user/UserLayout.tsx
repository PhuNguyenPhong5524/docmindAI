import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Tooltip, message, Modal } from "antd";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  DashboardOutlined,
  FolderOpenOutlined,
  MessageOutlined,
  SwapOutlined,
  HistoryOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  UserOutlined,
  RightOutlined,
  LoginOutlined,
} from "@ant-design/icons";

import Logo from "../../components/Logo";
import { useAuth } from "../../contexts/AuthContext";

const { Header, Sider, Content } = Layout;

export const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const [notificationsCount, setNotificationsCount] = useState(3);

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Tổng quan" },
    { key: "/documents", icon: <FolderOpenOutlined />, label: "Tài liệu" },
    { key: "/chat", icon: <MessageOutlined />, label: "Trò chuyện AI" },
    { key: "/compare", icon: <SwapOutlined />, label: "So sánh tài liệu" },
    { key: "/history", icon: <HistoryOutlined />, label: "Lịch sử" },
  ];

  const handleLogout = () => {
  Modal.confirm({
    title: "Xác nhận đăng xuất",
    content: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?",
    okText: "Đăng xuất",
    cancelText: "Hủy",
    okButtonProps: { danger: true },

    onOk: () => {
      logout();
      message.success("Đã đăng xuất");
      navigate("/login", { replace: true });
    },
  });
};

const userMenuItems = [
  {
    key: "profile",
    label: "Hồ sơ cá nhân",
    onClick: () => navigate("/profile"),
  },
  {
    key: "settings",
    label: "Cài đặt tài khoản",
    onClick: () => navigate("/settings"),
  },
  { type: "divider" as const },
  {
    key: "logout",
    label: "Đăng xuất",
    danger: true,
    icon: <LogoutOutlined />,
    onClick: handleLogout,
  },
];

  return (
    <Layout className="min-h-screen">
      <Sider
        width={250}
        theme="light"
        className="fixed left-0 top-0 bottom-0 h-screen z-50 border-r border-gray-100 shadow-sm"
        style={{ position: "fixed", left: 0, top: 0, bottom: 0 }}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="h-16 px-4 flex items-center gap-3 border-b border-gray-50">
              <Logo className="w-10 h-10" />

              <div className="flex flex-col">
                <span className="font-bold text-indigo-700 tracking-tight leading-none text-base">
                  DOCMIND AI
                </span>

                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1 font-semibold uppercase tracking-wider w-fit">
                  RAG Assistant
                </span>
              </div>
            </div>

            <div className="px-4 pt-4 pb-1">
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
                Khám phá &amp; Phân tích
              </span>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={menuItems}
              className="border-r-0 px-2 mt-2 font-medium"
            />
          </div>

          {/* Sidebar user */}
          <div className="p-3 bg-gray-50 rounded-xl m-3 border border-gray-100">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    className="bg-indigo-600 shrink-0"
                  />

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-gray-800 truncate">
                        {user.full_name || user.email}
                      </span>

                      <span className="text-[9px] px-1 rounded bg-indigo-100 text-indigo-700 font-bold">
                        {user.role}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-500 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                <Tooltip title="Đăng xuất">
                  <Button
                    type="text"
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                  />
                </Tooltip>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <LoginOutlined />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 250 }}>
        <Header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 h-16 leading-[64px] shadow-none">
          <div className="flex items-center gap-2 text-sm text-[#ffffff]">
            <span className="hover:!text-gray-800 cursor-pointer">DOCMIND</span>
            <RightOutlined className="text-[10px]" />
            <span className="text-[#ffffff] font-semibold">Không gian làm việc</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/60 px-3 py-1 rounded-full text-gray-700 text-xs font-mono leading-normal">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Socket: Connected</span>
            </div>

            <Link
              to="/help"
              className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <QuestionCircleOutlined />
              <span>Trợ giúp</span>
            </Link>

            {isAuthenticated && user ? (
              <>
                <Tooltip title="Thông báo">
                  <Badge count={notificationsCount} offset={[-2, 4]} size="small">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<BellOutlined className="text-xl !text-white" />}
                      className="!bg-[#4f46e5]"
                      onClick={() => {
                        setNotificationsCount(0);
                        message.info("Đã đánh dấu tất cả thông báo là đã đọc");
                      }}
                    />
                  </Badge>
                </Tooltip>

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <div className="flex items-center gap-2 cursor-pointer border-l pl-3">
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      className="!bg-indigo-600"
                    />

                    <span className="text-sm font-medium text-[#ffffff] hidden sm:inline-block">
                      {user.full_name || user.email}
                    </span>
                  </div>
                </Dropdown>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <LoginOutlined />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </Header>

        <Content className="bg-[#f8f9ff] min-h-[calc(100vh-64px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
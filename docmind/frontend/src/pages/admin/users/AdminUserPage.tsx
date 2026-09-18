import React, { useState, useMemo } from "react";
import { Table, Button, Tag, message, Typography, Card, Input, Space, Select, Row, Col } from "antd";
import { useGetUsers, useToggleLockUser } from "../../../hooks/admin/useUserManagement";

const { Title } = Typography;
const { Search } = Input;

const AdminUserPage: React.FC = () => {
  const { data, isLoading, isError } = useGetUsers();
  const { mutate: toggleLock, isPending } = useToggleLockUser();

  // State cho tính năng Flex: Lọc & Tìm kiếm
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Fix lỗi undefined ID bằng cách ưu tiên lấy _id từ Backend
  const handleToggleLock = (userId: string) => {
    if (!userId) {
      message.error("Lỗi: Không lấy được ID tài khoản!");
      return;
    }
    toggleLock(userId, {
      onSuccess: (res: any) => {
        message.success(res.message || "Cập nhật trạng thái thành công!");
      },
      onError: () => {
        message.error("Có lỗi xảy ra từ máy chủ, vui lòng thử lại!");
      }
    });
  };

  // Tính toán dữ liệu hiển thị (Lọc và Tìm kiếm Real-time)
  const filteredData = useMemo(() => {
    let users = data?.data || [];
    
    // Xử lý tìm kiếm
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      users = users.filter((u: any) =>
        (u.email || "").toLowerCase().includes(lowerSearch) ||
        (u.name || u.full_name || "").toLowerCase().includes(lowerSearch)
      );
    }
    
    // Xử lý bộ lọc
    if (roleFilter !== "ALL") {
      users = users.filter((u: any) => u.role === roleFilter);
    }
    return users;
  }, [data, searchText, roleFilter]);

  const columns = [
    {
      title: "Họ và tên",
      key: "name",
      // Fix lỗi trống tên: Lấy full_name của Backend nếu name của Frontend không có
      render: (_: any, record: any) => <strong>{record.name || record.full_name || "Chưa cập nhật"}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "magenta" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "success" : "error"}>
          {status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type={record.status === "ACTIVE" ? "primary" : "default"}
          danger={record.status === "ACTIVE"}
          loading={isPending}
          onClick={() => handleToggleLock(record._id || record.id)} // Truyền đúng ID
          disabled={record.role === "ADMIN"}
        >
          {record.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
        </Button>
      ),
    },
  ];

  if (isError) return <div style={{ padding: 24 }}>Lỗi tải dữ liệu từ Server...</div>;

  return (
    <Card bordered={false} style={{ margin: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Khu vực Flex: Header xịn xò */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Quản lý Người dùng</Title>
          <div style={{ color: "gray", marginTop: 4 }}>
            Tổng hệ thống: <strong>{data?.data?.length || 0}</strong> tài khoản
          </div>
        </Col>
        
        <Col>
          <Space size="middle">
            <Select
              defaultValue="ALL"
              style={{ width: 140 }}
              onChange={(value) => setRoleFilter(value)}
              options={[
                { value: 'ALL', label: 'Tất cả vai trò' },
                { value: 'ADMIN', label: 'Quản trị viên' },
                { value: 'USER', label: 'Người dùng' },
              ]}
            />
            <Search
              placeholder="Tìm tên hoặc email..."
              allowClear
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record: any) => record._id || record.id} // Fix lỗi missing key
        loading={isLoading}
        pagination={{ 
          pageSize: 7, 
          showTotal: (total) => `Hiển thị ${total} kết quả` 
        }}
      />
    </Card>
  );
};

export default AdminUserPage;
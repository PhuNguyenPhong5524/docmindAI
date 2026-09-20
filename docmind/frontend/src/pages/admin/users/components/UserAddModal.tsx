import React, { useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: (data: any) => Promise<boolean>;
}

export const UserAddModal: React.FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const isSuccess = await onSuccess(values);
      if (isSuccess) {
        form.resetFields();
      }
    } catch (error) {
      console.log('Validate Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm người dùng mới"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Tạo tài khoản"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
          <Input placeholder="Nhập địa chỉ email" />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item name="role" label="Vai trò" initialValue="USER">
          <Select>
            <Select.Option value="USER">Người dùng (USER)</Select.Option>
            <Select.Option value="ADMIN">Quản trị viên (ADMIN)</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
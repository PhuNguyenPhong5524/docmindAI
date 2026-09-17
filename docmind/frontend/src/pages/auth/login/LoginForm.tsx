import { Form, Input, Button, Checkbox } from "antd";
import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import type { LoginPayload } from "../../../types/auth";

export interface LoginFormValues extends LoginPayload {
  remember?: boolean;
}

interface LoginFormProps {
  loading?: boolean;
  onSubmit: (
    values: LoginFormValues
  ) => void | Promise<void>;

  onValuesChange?: () => void;
}

const LoginForm = ({
  loading = false,
  onSubmit,
  onValuesChange,
}: LoginFormProps) => {
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      onValuesChange={onValuesChange}
      requiredMark="optional"
      initialValues={{
        remember: true,
      }}
    >
      {/* Email */}
      <Form.Item
        label={
          <span className="font-medium text-xs text-[#0b1c30]">
            Email
          </span>
        }
        name="email"
        className="!mb-3.5"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập email",
          },
          {
            type: "email",
            message: "Vui lòng nhập email đúng định dạng",
          },
        ]}
      >
        <Input
          prefix={
            <MailOutlined className="text-gray-400 mr-1.5" />
          }
          placeholder="Nhập địa chỉ email"
          autoComplete="email"
          disabled={loading}
          className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm transition-all"
        />
      </Form.Item>

      {/* Password */}
      <Form.Item
        label={
          <span className="font-medium text-xs text-[#0b1c30]">
            Mật khẩu
          </span>
        }
        name="password"
        className="!mb-2.5"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu",
          },
        ]}
      >
        <Input.Password
          prefix={
            <LockOutlined className="text-gray-400 mr-1.5" />
          }
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          disabled={loading}
          className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm transition-all"
        />
      </Form.Item>

      {/* Remember + Forgot password */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <Form.Item
          name="remember"
          valuePropName="checked"
          noStyle
        >
          <Checkbox
            disabled={loading}
            className="text-xs text-[#464555]"
          >
            Ghi nhớ đăng nhập
          </Checkbox>
        </Form.Item>

        <a
          href="#forgot"
          className="text-xs font-medium text-[#4f46e5] hover:underline"
        >
          Quên mật khẩu?
        </a>
      </div>

      {/* Submit */}
      <Form.Item className="!mb-0">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
          block
          className="h-10 font-medium bg-[#4f46e5] hover:!bg-[#3525cd] border-none shadow-sm text-sm rounded-lg"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
import {
  Button,
  Form,
  Input,
} from "antd";

import {
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";


export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}


interface RegisterFormProps {
  loading?: boolean;

  onSubmit: (
    values: RegisterFormValues
  ) => void | Promise<void>;

  onValuesChange?: () => void;
}


const RegisterForm = ({
  loading = false,
  onSubmit,
  onValuesChange,
}: RegisterFormProps) => {

  const [form] =
    Form.useForm<RegisterFormValues>();


  return (
    <Form<RegisterFormValues>
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      onValuesChange={onValuesChange}
      requiredMark="optional"
    >

      {/* FULL NAME */}

      <Form.Item
        label={
          <span className="font-medium text-xs text-[#0b1c30]">
            Họ và tên{" "}
            <span className="text-red-500">
              *
            </span>
          </span>
        }
        name="fullName"
        rules={[
          {
            required: true,
            message:
              "Vui lòng nhập họ và tên",
          },
        ]}
        className="!mb-2.5"
      >
        <Input
          prefix={
            <UserOutlined className="text-gray-400 mr-1" />
          }
          placeholder="Nhập họ và tên"
          disabled={loading}
          autoComplete="name"
          className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm"
        />
      </Form.Item>


      {/* EMAIL */}

      <Form.Item
        label={
          <span className="font-medium text-xs text-[#0b1c30]">
            Email{" "}
            <span className="text-red-500">
              *
            </span>
          </span>
        }
        name="email"
        rules={[
          {
            required: true,
            message:
              "Vui lòng nhập địa chỉ email",
          },
          {
            type: "email",
            message:
              "Vui lòng nhập email đúng định dạng",
          },
        ]}
        className="!mb-2.5"
      >
        <Input
          prefix={
            <MailOutlined className="text-gray-400 mr-1" />
          }
          placeholder="Nhập địa chỉ email"
          disabled={loading}
          autoComplete="email"
          className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm"
        />
      </Form.Item>


      {/* PASSWORD */}

      <Form.Item
        label={
          <span className="font-medium text-xs text-[#0b1c30]">
            Mật khẩu{" "}
            <span className="text-red-500">
              *
            </span>
          </span>
        }
        name="password"
        rules={[
          {
            required: true,
            message:
              "Vui lòng nhập mật khẩu",
          },
          {
            min: 8,
            message:
              "Mật khẩu phải có ít nhất 8 ký tự",
          },
        ]}
        className="!mb-2.5"
      >
        <Input.Password
          prefix={
            <LockOutlined className="text-gray-400 mr-1" />
          }
          placeholder="Tạo mật khẩu"
          disabled={loading}
          autoComplete="new-password"
          className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm"
        />
      </Form.Item>


      {/* CONFIRM PASSWORD */}

      <Form.Item
        label={
          <span className="font-medium text-xs text-[#0b1c30]">
            Xác nhận mật khẩu{" "}
            <span className="text-red-500">
              *
            </span>
          </span>
        }
        name="confirmPassword"
        dependencies={[
          "password",
        ]}
        rules={[
          {
            required: true,
            message:
              "Vui lòng xác nhận mật khẩu",
          },

          ({
            getFieldValue,
          }) => ({
            validator(_, value) {

              if (
                !value ||
                getFieldValue(
                  "password"
                ) === value
              ) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error(
                  "Mật khẩu xác nhận không khớp"
                )
              );
            },
          }),
        ]}
        className="!mb-3"
      >
        <Input.Password
          prefix={
            <LockOutlined className="text-gray-400 mr-1" />
          }
          placeholder="Nhập lại mật khẩu"
          disabled={loading}
          autoComplete="new-password"
          className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm"
        />
      </Form.Item>


      {/* SYSTEM NOTICE */}

      <div className="p-2 bg-[#eff4ff] rounded-lg flex items-center gap-2 mb-3">

        <span className="material-symbols-outlined text-base text-[#4f46e5]">
          shield
        </span>

        <span className="text-[11px] text-[#464555]">

          Quyền truy cập cá nhân:{" "}

          <strong className="text-[#0b1c30]">
            ROLE_USER
          </strong>

          {" • "}

          Trạng thái:{" "}

          <strong className="text-[#0b1c30]">
            ACTIVE
          </strong>

        </span>

      </div>


      {/* =========================
          SUBMIT
      ========================== */}

      <Form.Item className="!mb-0">

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
          block
          className="h-10 font-medium bg-[#4f46e5] hover:!bg-[#3525cd] border-none shadow-md flex items-center justify-center gap-2"
        >

          <span>
            {loading
              ? "Đang tạo tài khoản..."
              : "Tạo tài khoản"}
          </span>

          {!loading && (
            <ArrowRightOutlined />
          )}

        </Button>

      </Form.Item>

    </Form>
  );
};


export default RegisterForm;
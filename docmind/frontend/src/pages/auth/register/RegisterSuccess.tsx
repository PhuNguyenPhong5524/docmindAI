import {
  Button,
} from "antd";

import {
  LoginOutlined,
} from "@ant-design/icons";

import type {
  RegisterUser,
} from "../../../types/auth";


interface RegisterSuccessProps {
  user: RegisterUser;

  onLogin: () => void;

  onCreateAnother: () => void;
}


const RegisterSuccess = ({
  user,
  onLogin,
  onCreateAnother,
}: RegisterSuccessProps) => {

  return (
    <div className="py-2 flex flex-col items-center text-center gap-3">

      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#3525cd] shadow-sm">

        <span className="material-symbols-outlined text-3xl font-bold">
          check_circle
        </span>

      </div>


      {/* Title */}
      <div className="space-y-1 max-w-sm">

        <h3 className="text-lg font-bold text-[#0b1c30]">
          Đăng ký tài khoản thành công
        </h3>

        <p className="text-xs text-[#464555] leading-relaxed">
          Tài khoản của bạn đã được tạo.
          Bạn có thể đăng nhập để bắt đầu
          sử dụng DOCMIND AI.
        </p>

      </div>


      {/* User Data */}
      <div className="w-full p-3 bg-[#eff4ff] rounded-xl text-left space-y-1.5">

        <div className="flex justify-between items-center text-xs">

          <span className="text-[#464555]">
            Người dùng:
          </span>

          <span className="text-[#0b1c30] font-semibold">
            {user.full_name}
          </span>

        </div>


        <div className="flex justify-between items-center text-xs">

          <span className="text-[#464555]">
            Email:
          </span>

          <span className="text-[#0b1c30] font-mono">
            {user.email}
          </span>

        </div>


        <div className="flex justify-between items-center text-xs">

          <span className="text-[#464555]">
            Cấp quyền:
          </span>

          <span className="px-2 py-0.5 rounded-full bg-[#e1e0ff] text-[#07006c] font-mono text-[11px] font-medium">

            ROLE_{user.role}

          </span>

        </div>


        <div className="flex justify-between items-center text-xs">

          <span className="text-[#464555]">
            Trạng thái:
          </span>

          <span className="text-green-600 font-semibold">
            {user.isActive
              ? "ACTIVE"
              : "INACTIVE"}
          </span>

        </div>

      </div>


      {/* Actions */}
      <div className="w-full flex flex-col gap-2 pt-1">

        <Button
          type="primary"
          block
          onClick={onLogin}
          className="h-10 font-medium bg-[#4f46e5] hover:!bg-[#3525cd] border-none shadow-md flex items-center justify-center gap-2"
        >
          <span>
            Đăng nhập ngay
          </span>

          <LoginOutlined />
        </Button>


        <Button
          type="default"
          block
          onClick={onCreateAnother}
          className="h-9 bg-[#dce9ff] hover:bg-[#d3e4fe] text-[#0b1c30] border-none font-medium text-xs"
        >
          Tạo thêm tài khoản khác
        </Button>

      </div>

    </div>
  );
};


export default RegisterSuccess;
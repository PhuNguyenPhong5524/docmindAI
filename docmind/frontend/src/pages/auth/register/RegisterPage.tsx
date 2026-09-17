import React, { useState } from "react";
import { Alert, ConfigProvider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import RegisterForm, { type RegisterFormValues } from "./RegisterForm";
import RegisterSuccess from "./RegisterSuccess";
import BoxLeftContent from "./boxLeftContent/BoxLeftContent";

import useRegister from "../../../hooks/auth/useRegister";
import type { RegisterUser } from "../../../types/auth";

type RegisterState = "default" | "error" | "success";

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

const MIN_LOADING_TIME = 800;

const waitMinimumLoading = async (startTime: number) => {
  const remainingTime = MIN_LOADING_TIME - (Date.now() - startTime);

  if (remainingTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, remainingTime));
  }
};

const getRegisterErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
  }

  if (!error.response) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại.";
  }

  const { status, data } = error.response;
  const responseMessage = data?.message;

  const message = Array.isArray(responseMessage)
    ? responseMessage.join(", ")
    : responseMessage || data?.error || "";

  if (status === 400) {
    return message || "Thông tin đăng ký không hợp lệ.";
  }

  if (status >= 500) {
    return "Không thể tạo tài khoản lúc này. Vui lòng thử lại sau.";
  }

  return message || "Đăng ký tài khoản thất bại. Vui lòng thử lại.";
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [currentState, setCurrentState] = useState<RegisterState>("default");
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredUser, setRegisteredUser] = useState<RegisterUser | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleValuesChange = () => {
    if (currentState !== "error") return;

    setCurrentState("default");
    setErrorMessage("");
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setCurrentState("default");
    setErrorMessage("");
    setIsRegistering(true);

    const startTime = Date.now();

    try {
      const data = await registerMutation.mutateAsync({
        full_name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      await waitMinimumLoading(startTime);

      setRegisteredUser(data.user);
      setCurrentState("success");
    } catch (error) {
      await waitMinimumLoading(startTime);

      setErrorMessage(getRegisterErrorMessage(error));
      setCurrentState("error");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCreateAnother = () => {
    setRegisteredUser(null);
    setErrorMessage("");
    setCurrentState("default");
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4f46e5",
          borderRadius: 8,
          controlHeight: 44,
        },
      }}
    >
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white relative">
        <BoxLeftContent />

        <section className="lg:w-[45%] w-full bg-white p-6 sm:p-10 lg:py-6 lg:px-12 lg:sticky lg:top-0 lg:min-h-screen flex flex-col justify-center items-center">
          <div className="max-w-[440px] w-full flex flex-col gap-4 my-auto">
            <div className="w-full bg-white rounded-2xl p-5 border border-gray-100 shadow-md">
              {currentState === "success" && registeredUser ? (
                <RegisterSuccess
                  user={registeredUser}
                  onLogin={() => navigate("/login")}
                  onCreateAnother={handleCreateAnother}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">
                      Tạo tài khoản DOCMIND AI
                    </h2>

                    <p className="text-xs text-[#464555] mt-0.5">
                      Bắt đầu khám phá tài liệu của bạn cùng trợ lý AI
                    </p>
                  </div>

                  {isRegistering && (
                    <Alert
                      title="Đang tạo tài khoản..."
                      description="Hệ thống đang kiểm tra thông tin và tạo tài khoản của bạn."
                      type="info"
                      icon={<LoadingOutlined />}
                      showIcon
                      className="rounded-lg"
                    />
                  )}

                  {currentState === "error" && !isRegistering && (
                    <Alert
                      title="Không thể đăng ký"
                      description={errorMessage}
                      type="error"
                      showIcon
                      className="rounded-lg"
                    />
                  )}

                  <RegisterForm
                    loading={isRegistering}
                    onSubmit={handleRegister}
                    onValuesChange={handleValuesChange}
                  />

                  <div className="text-center pt-0.5">
                    <span className="text-xs text-[#464555]">Đã có tài khoản? </span>

                    <Link
                      to="/login"
                      className="text-xs font-semibold text-[#3525cd] hover:underline"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <p className="text-center text-xs text-[#464555]">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <a href="#" className="text-[#3525cd] underline hover:text-[#4648d4]">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="#" className="text-[#3525cd] underline hover:text-[#4648d4]">
                Chính sách bảo mật
              </a>{" "}
              của DOCMIND AI.
            </p>
          </div>
        </section>
      </div>
    </ConfigProvider>
  );
};
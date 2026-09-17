import React, {useState,} from "react";
import {Alert,ConfigProvider,} from "antd";
import {LoadingOutlined,} from "@ant-design/icons";
import axios from "axios";
import {Link,useNavigate,} from "react-router-dom";
import LoginForm, { type LoginFormValues,} from "./LoginForm";
import useLogin from "../../../hooks/auth/useLogin";
import { useAuth } from "../../../contexts/AuthContext";
import BoxLeftContent from "./boxLeftContent/BoxLeftContent";

type StateType =
  | "default"
  | "validation"
  | "loading"
  | "error";

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}


const getErrorMessage = (
  error: unknown
): {
  state: Exclude<StateType, "default" | "loading">;
  message: string;
} => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return {
      state: "error",
      message:
        "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
    };
  }

  // Không kết nối được backend
  if (!error.response) {
    return {
      state: "error",
      message:
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại.",
    };
  }

  const status = error.response.status;

  const responseMessage =
    error.response.data?.message;

  const message = Array.isArray(responseMessage)
    ? responseMessage.join(", ")
    : responseMessage ||
      error.response.data?.error ||
      "";

  const normalizedMessage =
    message.toLowerCase();


  // WRONG EMAIL / PASSWORD
  const isInvalidCredential =
    normalizedMessage.includes(
      "invalid credential"
    ) ||
    normalizedMessage.includes(
      "invalid email"
    ) ||
    normalizedMessage.includes(
      "incorrect password"
    ) ||
    normalizedMessage.includes(
      "email or password"
    ) ||
    normalizedMessage.includes(
      "email hoặc mật khẩu"
    ) ||
    normalizedMessage.includes(
      "không chính xác"
    ) ||
    normalizedMessage.includes(
      "không tồn tại"
    ) 
  if (
    isInvalidCredential ||
    status === 401 ||
    status === 404
  ) {
    return {
      state: "validation",
      message:
        "Email hoặc mật khẩu không chính xác.",
    };
  }

  // OTHER BACKEND ERRORS

  return {
    state: "error",
    message:
      message ||
      "Đăng nhập thất bại. Vui lòng thử lại.",
  };
};

const MIN_LOADING_TIME = 800;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const { setUser } = useAuth();


  const [authState, setAuthState] =
    useState<
      Exclude<StateType, "loading">
    >("default");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Loading lấy trực tiếp từ React Query
  const currentState: StateType =
  isLoggingIn
    ? "loading"
    : authState;

  // CLEAR SERVER ERROR
  // Khi user nhập lại dữ liệu

  const handleValuesChange = () => {
    if (authState !== "default") {
      setAuthState("default");
      setErrorMessage("");
    }
  };


 const handleLogin = async (
  values: LoginFormValues
) => {
  setAuthState("default");
  setErrorMessage("");
  setIsLoggingIn(true);

  const startTime = Date.now();

  try {
    const payload = {
      email: values.email.trim(),
      password: values.password,
    };

    // Gọi API thật
    const data =
      await loginMutation.mutateAsync(payload);

    // Đảm bảo loading hiển thị ít nhất 800ms
    const elapsedTime =
      Date.now() - startTime;

    const remainingTime =
      MIN_LOADING_TIME - elapsedTime;

    if (remainingTime > 0) {
      await delay(remainingTime);
    }

    // Lưu dữ liệu thật
    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    // Redirect theo role
    if (data.user.role === "ADMIN") {
      navigate("/admin", {
        replace: true,
      });

      return;
    }

    navigate("/", {
      replace: true,
    });

  } catch (error) {

    const elapsedTime =
      Date.now() - startTime;

    const remainingTime =
      MIN_LOADING_TIME - elapsedTime;

    if (remainingTime > 0) {
      await delay(remainingTime);
    }

    const result =
      getErrorMessage(error);

    setAuthState(result.state);

    setErrorMessage(
      result.message
    );

  } finally {
    setIsLoggingIn(false);
  }
};

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary:
            "#4f46e5",

          borderRadius: 8,

          controlHeight: 40,
        },
      }}
    >
      <div className="w-full h-auto flex flex-col lg:flex-row bg-white relative">

        {/* LEFT COLUMN */}
        <BoxLeftContent />

        {/* RIGHT COLUMN */}
        <section className="lg:w-[45%] w-full bg-white p-6 sm:p-10 lg:py-5 lg:px-12 lg:sticky lg:top-0 lg:h-auto flex flex-col justify-center items-center">

          <div
            className={`max-w-[420px] w-full flex flex-col my-auto transition-all duration-300 ease-out delay-50`}
          >

            {/* Title */}
            <div className="mb-5">

              <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">
                Chào mừng trở lại
              </h2>

              <p className="text-xs text-[#464555] mt-1">
                Đăng nhập để tiếp tục sử dụng DOCMIND AI
              </p>

            </div>

            {/* INVALID CREDENTIALS */}

            {currentState ===
              "validation" && (
              <Alert
                message="Đăng nhập không thành công"
                description={
                  errorMessage ||
                  "Email hoặc mật khẩu không chính xác."
                }
                type="error"
                showIcon
                className="!mb-4 rounded-lg"
              />
            )}

            {/* LOADING */}

            {currentState ===
              "loading" && (
              <Alert
                title="Đang xác thực tài khoản..."
                description="Hệ thống đang kiểm tra thông tin đăng nhập và phân quyền người dùng."
                type="info"
                icon={
                  <LoadingOutlined />
                }
                showIcon
                className="!mb-4 rounded-lg"
              />
            )}

            {/* OTHER ERROR */}

            {currentState ===
              "error" && (
              <Alert
                title="Không thể đăng nhập"
                description={
                  errorMessage ||
                  "Đã xảy ra lỗi. Vui lòng thử lại."
                }
                type="error"
                showIcon
                className="!mb-4 rounded-lg"
              />
            )}

            {/* LOGIN FORM */}

            <LoginForm
              loading={isLoggingIn}
              onSubmit={
                handleLogin
              }
              onValuesChange={
                handleValuesChange
              }
            />
            {/* Register */}
            <div className="text-center mt-4 pt-2 border-t border-gray-100">
              <p className="text-xs text-[#464555]">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#4f46e5] hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </ConfigProvider>
  );
};
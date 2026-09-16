import { useMutation } from "@tanstack/react-query";

import { login } from "../../services/authService";

import type {
  LoginPayload,
  LoginResponse,
} from "../../types/auth";

const useLogin = () => {
  return useMutation<
    LoginResponse,
    Error,
    LoginPayload
  >({
    mutationFn: login,
  });
};

export default useLogin;
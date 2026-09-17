import api from "../lib/api";

import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../types/auth";

export const login = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(
    "/api/auth/login",
    payload
  );

  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

export const register = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>(
    "/api/auth/register",
    payload
  );
  return data;
};


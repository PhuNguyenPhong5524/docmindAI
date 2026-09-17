import { useMutation } from "@tanstack/react-query";

import { register } from "../../services/authService";

import type {
  RegisterPayload,
  RegisterResponse,
} from "../../types/auth";


const useRegister = () => {
  return useMutation<
    RegisterResponse,
    Error,
    RegisterPayload
  >({
    mutationFn: register,
  });
};


export default useRegister;
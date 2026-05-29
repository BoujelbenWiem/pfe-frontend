import api from "@/lib/api";

import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  User,
} from "@/types/auth";

export const login = async (
  payload: LoginPayload
): Promise<LoginResponse> => {

  const response = await api.post(
    "/auth/login",
    payload
  );

  return response.data;
};

export const logout = async () => {

  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};

export const register = async (
  payload: RegisterPayload
): Promise<User> => {

  const response = await api.post(
    "/auth/register",
    payload
  );

  return response.data;
};

export const getCurrentUser = async () => {

  const response = await api.get(
    "/users/me"
  );

  return response.data;
};

export const setupPassword = async (
  token: string,
  new_password: string
): Promise<{ message: string }> => {

  const response = await api.post(
    "/auth/setup-password",
    { token, new_password }
  );

  return response.data;
};
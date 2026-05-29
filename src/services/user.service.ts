import api from "@/lib/api";
import { User, UserRole } from "@/types/auth";

export interface AdminCreateUserRequest {
  username: string;
  email: string;
  role: UserRole;
  store_id?: string;
  department?: string;
}

export interface AdminCreateUserResponse {
  user: User;
  message: string;
  reset_link_sent: boolean;
}

export const createUserAsAdmin = async (
  payload: AdminCreateUserRequest
): Promise<AdminCreateUserResponse> => {
  const response = await api.post("users/admin/create", payload);
  return response.data;
};

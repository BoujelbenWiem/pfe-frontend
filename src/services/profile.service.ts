import api from "@/lib/api";
import { User } from "@/types/auth";

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get("/users/me");
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.put("/users/me", payload);
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
  const { data } = await api.post("/users/me/change-password", payload);
  return data;
}

export async function deleteAccount(): Promise<{ message: string; deleted_id: number; success: boolean }> {
  const { data } = await api.delete("/users/me");
  return data;
}

import api from "@/lib/api";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  store_id?: number;
  department?: string;
  created_at: string;
}

export interface UsersListResponse {
  total: number;
  page: number;
  per_page: number;
  users: AdminUser[];
}

export interface UserStatsResponse {
  total: number;
  ADMIN: number;
  STORE_MANAGER: number;
  MARKETING: number;
  CRM: number;
  ACHATS: number;
}

export interface UsersListParams {
  page?: number;
  per_page?: number;
  role?: string;
  is_active?: boolean;
}

export async function getUserStats(): Promise<UserStatsResponse> {
  const { data } = await api.get("/users/stats/count");
  return data;
}

export async function getUsers(params: UsersListParams = {}): Promise<UsersListResponse> {
  const { data } = await api.get("/users/", { params });
  return data;
}

export async function getUser(userId: number): Promise<AdminUser> {
  const { data } = await api.get(`/users/${userId}`);
  return data;
}

export async function updateUser(userId: number, updateData: Partial<AdminUser>): Promise<AdminUser> {
  const { data } = await api.put(`/users/${userId}`, updateData);
  return data;
}

export async function deleteUser(userId: number): Promise<{ message: string; deleted_id: number; success: boolean }> {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
}

export async function activateUser(userId: number): Promise<AdminUser> {
  const { data } = await api.post(`/users/${userId}/activate`);
  return data;
}

export async function deactivateUser(userId: number): Promise<AdminUser> {
  const { data } = await api.post(`/users/${userId}/deactivate`);
  return data;
}

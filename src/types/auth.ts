export interface LoginPayload {
  email: string;
  password: string;
}

export type UserRole = "ADMIN" | "STORE_MANAGER" | "MARKETING" | "CRM" | "ACHATS";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  store_id?: string;
  department?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}
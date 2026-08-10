import { api } from "@/lib/api";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth.types";

export async function login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", request);

  return response.data;
}

export async function register(request: RegisterRequest): Promise<ApiResponse<unknown>> {
  const response = await api.post<ApiResponse<unknown>>("/auth/register", request);

  return response.data;
}

export async function refresh(): Promise<ApiResponse<LoginResponse>> {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/refresh");

  return response.data;
}

export async function logout(): Promise<ApiResponse<unknown>> {
  const response = await api.post<ApiResponse<unknown>>("/auth/logout");

  return response.data;
}

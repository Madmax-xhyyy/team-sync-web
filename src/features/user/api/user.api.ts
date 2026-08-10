import { api } from "@/lib/api";

import type { ApiResponse } from "@/features/auth/types/auth.types";
import type { UserProfile } from "../types/user.types";

export async function getCurrentUser(): Promise<ApiResponse<UserProfile>> {
  const response = await api.get<ApiResponse<UserProfile>>("/users/me");

  return response.data;
}

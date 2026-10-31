import { api } from "@/lib/api";

import type { ApiResponse } from "@/features/auth/types/auth.types";
import type { UpdateProfileRequest, UserProfile } from "../types/user.types";

export async function getCurrentUser(): Promise<ApiResponse<UserProfile>> {
  const response = await api.get<ApiResponse<UserProfile>>("/users/me");

  return response.data;
}

export async function updateCurrentUser(
  request: UpdateProfileRequest,
): Promise<ApiResponse<UserProfile>> {
  const response = await api.put<ApiResponse<UserProfile>>("/users/me", request);

  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to update your profile. Please try again.");
  }

  return response.data;
}

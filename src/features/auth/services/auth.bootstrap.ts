import { refresh } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export async function bootstrapAuth(): Promise<void> {
  try {
    const response = await refresh();

    useAuthStore.getState().setAccessToken(response.data.accessToken);
  } catch {
    useAuthStore.getState().clearAuth();
  } finally {
    useAuthStore.getState().setInitializing(false);
  }
}

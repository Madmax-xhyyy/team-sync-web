import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setAccessToken: (accessToken: string) => void;
  setInitializing: (isInitializing: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setAccessToken: (accessToken) =>
    set({
      accessToken,
      isAuthenticated: true,
    }),

  setInitializing: (isInitializing) =>
    set({
      isInitializing,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
    }),
}));

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const request = originalRequest as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      request.url?.includes("/auth/refresh") ||
      request._retry
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((token) => {
        request.headers.Authorization = `Bearer ${token}`;

        return api(request);
      });
    }

    isRefreshing = true;

    try {
      const response = await api.post("/auth/refresh");

      const newAccessToken = response.data.data.accessToken;

      useAuthStore.getState().setAccessToken(newAccessToken);

      processQueue(null, newAccessToken);

      request.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(request);
    } catch (refreshError) {
      processQueue(refreshError, null);

      useAuthStore.getState().clearAuth();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

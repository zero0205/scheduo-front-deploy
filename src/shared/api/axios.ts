import axios, { type AxiosError, type AxiosResponse } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/stores";
import { TOKEN_ERROR_STATUS } from "./consts";
import type { ErrorResponse, SuccessResponse } from "./types";

const DEFAULT_API_TIMEOUT = 10000;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: DEFAULT_API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const errorHandler = async (error: AxiosError<ErrorResponse>) => {
  const errorData = error.response?.data;

  if (errorData?.code === 401) {
    const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();

    switch (errorData.status) {
      case TOKEN_ERROR_STATUS.NO_TOKEN:
      case TOKEN_ERROR_STATUS.INVALID_TOKEN:
      case TOKEN_ERROR_STATUS.AUTH_FAILED:
        if (refreshToken) {
          try {
            const response = await axios.post<SuccessResponse<{ accessToken: string; refreshToken: string }>>(
              `${import.meta.env.VITE_API_BASE_URL}/auth/token`,
              { refreshToken },
            );
            setAuth(response.data.data.accessToken, response.data.data.refreshToken);

            if (error.config?.headers) {
              error.config.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
            }
            if (error.config) {
              return axiosInstance(error.config);
            }
            return Promise.reject(error);
          } catch {
            clearAuth();
            window.location.href = "/login";
            return Promise.reject(error);
          }
        } else {
          clearAuth();
          window.location.href = "/login";
          return Promise.reject(error);
        }

      case TOKEN_ERROR_STATUS.INVALID_REFRESH_TOKEN:
      case TOKEN_ERROR_STATUS.UNAUTHORIZED:
      case TOKEN_ERROR_STATUS.EXPIRED_REFRESH_TOKEN:
      case TOKEN_ERROR_STATUS.OUTDATED_REFRESH_TOKEN:
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);

      default:
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);
    }
  }

  if (errorData?.code && errorData.code >= 400) {
    toast.error(errorData.message || "오류가 발생했습니다.");
  }

  if (!error.response) {
    toast.error("네트워크 오류가 발생했습니다.");
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  <T = unknown>(response: AxiosResponse<SuccessResponse<T>>) => response,
  async (error: AxiosError<ErrorResponse>) => errorHandler(error),
);

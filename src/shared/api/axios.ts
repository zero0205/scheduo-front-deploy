import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/stores";
import { TOKEN_ERROR_STATUS } from "./consts";
import type { ErrorResponse, SuccessResponse } from "./types";

// AxiosRequestConfig 타입 확장
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const errorHandler = async (error: AxiosError<ErrorResponse>) => {
  const errorData = error.response?.data;
  const originalRequest = error.config as CustomAxiosRequestConfig;

  if (errorData?.code === 401 && originalRequest && !originalRequest._retry) {
    const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();

    switch (errorData.status) {
      case TOKEN_ERROR_STATUS.NO_TOKEN:
      case TOKEN_ERROR_STATUS.INVALID_TOKEN:
      case TOKEN_ERROR_STATUS.AUTH_FAILED:
        if (refreshToken) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const response = await axios.post<SuccessResponse<{ accessToken: string; refreshToken: string }>>(
              `${import.meta.env.VITE_API_BASE_URL}/auth/token`,
              { refreshToken },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
            setAuth(newAccessToken, newRefreshToken);

            processQueue(null, newAccessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            clearAuth();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
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

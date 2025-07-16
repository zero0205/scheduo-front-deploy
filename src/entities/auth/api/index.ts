import { axiosInstance } from "@/shared/api";
import { devLogger } from "@/shared/lib";
import { useAuthStore } from "@/shared/stores";

export const requestLogIn = (provider: "google" | "kakao") => {
  const redirectUri = window.location.origin;
  const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/${provider}`);
  url.searchParams.set("redirect_uri", redirectUri);
  window.location.href = url.href;
};

export const requestLogOut = () => {
  const { refreshToken, clearAuth } = useAuthStore.getState();

  axiosInstance
    .post("/auth/logout", {
      refreshToken,
    })
    .catch((error) => devLogger.error(error.message));
  clearAuth();
};

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { memberApi } from "@/entities/member/api";
import { axiosInstance } from "@/shared/api";
import { devLogger } from "@/shared/lib";
import { useAuthStore } from "@/shared/stores";

/**
 * 소셜 로그인 리다이렉션을 처리하는 페이지입니다.
 * URL 파라미터에서 토큰을 추출하여 스토어에 저장하고,
 * 사용자 정보를 조회하여 함께 저장합니다.
 */
export const OAuthRedirectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth, setUser } = useAuthStore(
    useShallow((state) => ({
      setAuth: state.setAuth,
      setUser: state.setUser,
    })),
  );

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (!accessToken || !refreshToken) {
          toast.error("소셜 로그인 실패");
          navigate("/login", { replace: true });
          return;
        }

        setAuth(accessToken, refreshToken);

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        const user = await memberApi.getMyProfile();
        setUser(user);

        navigate("/", { replace: true });
      } catch (error) {
        devLogger.error("OAuth 콜백 처리 실패:", error);
        toast.error("로그인 처리 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    processOAuthCallback();
  }, [searchParams, setAuth, setUser, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p>로그인 처리 중...</p>
      </div>
    </div>
  );
};

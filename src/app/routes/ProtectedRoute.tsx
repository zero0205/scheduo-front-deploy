import { useAuthStore } from "@/shared/stores";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * 인증 상태에 따라 라우트 접근을 제어하는 레이아웃 컴포넌트입니다.
 * React Router의 Outlet을 사용하여 중첩된 라우트를 렌더링합니다.
 */
export const ProtectedRoute = ({ requireAuth = true, redirectTo = "/login" }: ProtectedRouteProps) => {
  const { accessToken } = useAuthStore();
  const isAuthenticated = Boolean(accessToken);

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

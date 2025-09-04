import { Route, Routes } from "react-router";
import { LogIn } from "@/pages/login";
import { Main } from "@/pages/main";
import { OAuthRedirectPage } from "@/pages/oauth-redirect";
import { ProtectedRoute } from "./ProtectedRoute";

export const Router = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute requireAuth={true} />}>
        <Route path="/" element={<Main />} />
        <Route path="/calendar/:calendarId" element={<Main />} />
      </Route>

      <Route element={<ProtectedRoute requireAuth={false} />}>
        <Route path="/login" element={<LogIn />} />
      </Route>

      <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />
    </Routes>
  );
};

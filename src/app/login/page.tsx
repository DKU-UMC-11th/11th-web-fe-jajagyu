import type { Metadata } from "next";
import { RequireGuest } from "../../components/auth/auth-guards";
import { LoginPage } from "../../views/auth/login-page";

export const metadata: Metadata = { title: "로그인" };

export default function Page() {
  return (
    <RequireGuest>
      <LoginPage />
    </RequireGuest>
  );
}

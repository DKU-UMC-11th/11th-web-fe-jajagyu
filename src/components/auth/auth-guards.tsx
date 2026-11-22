"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../stores/auth-store";

// 토큰이 localStorage에 있어서 서버는 로그인 여부를 알 수 없다. 그래서 TanStack Router의 beforeLoad 대신
// 브라우저에서 토큰을 불러온(hasHydrated) 뒤에 검사하고, 맞지 않으면 이동시킨다.
function useAuthState() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  return { hasHydrated, isLoggedIn: Boolean(accessToken) };
}

// 로그인한 사용자만 볼 수 있는 화면을 감싼다.
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hasHydrated, isLoggedIn } = useAuthState();

  useEffect(() => {
    if (hasHydrated && !isLoggedIn) router.replace("/login");
  }, [hasHydrated, isLoggedIn, router]);

  if (!hasHydrated || !isLoggedIn) return null;
  return children;
}

// 로그인하지 않은 사용자만 볼 화면(로그인 페이지)을 감싼다. 이미 로그인했다면 홈으로 보낸다.
export function RequireGuest({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hasHydrated, isLoggedIn } = useAuthState();

  useEffect(() => {
    if (hasHydrated && isLoggedIn) router.replace("/");
  }, [hasHydrated, isLoggedIn, router]);

  if (!hasHydrated || isLoggedIn) return null;
  return children;
}

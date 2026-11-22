"use client";

import { useQuery } from "@tanstack/react-query";
import { memberQueries } from "../../api/members/member-queries";
import { useLogout } from "../../hooks/use-logout";
import { useAuthStore } from "../../stores/auth-store";
import { NavLink } from "./nav-link";

const navLinkClass = "text-sm font-medium text-zinc-400 hover:text-white";
const loadingBox = <span className="h-5 w-24 animate-pulse rounded bg-zinc-800" />;

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useLogout();

  // 토큰이 있을 때만 조회한다. 토큰이 유효한지는 이 API가 확인하고, 401이면 토큰이 비워져 로그인 링크로 바뀐다.
  const meQuery = useQuery({ ...memberQueries.me(), enabled: Boolean(accessToken) });

  return (
    <header className="flex items-center gap-6 px-10 py-6">
      <h1 className="text-lg font-bold text-red-500">UMCine</h1>
      <nav className="flex gap-4">
        <NavLink href="/" exact>
          영화
        </NavLink>
        <NavLink href="/search">
          검색
        </NavLink>
        <NavLink href="/members">
          회원
        </NavLink>
      </nav>
      <nav className="ml-auto flex items-center gap-4">
        {!hasHydrated ? (
          // 서버 렌더링 HTML에는 저장된 토큰이 없으므로, 브라우저에서 불러오기 전에는 로그인 여부를 단정하지 않는다.
          loadingBox
        ) : !accessToken ? (
          <>
            <NavLink href="/login">
              로그인
            </NavLink>
            <NavLink href="/signup">
              회원가입
            </NavLink>
          </>
        ) : meQuery.isLoading ? (
          // enabled가 꺼진 조회는 isPending이 참이라, 실제 첫 요청 중인지는 isLoading으로 구분한다.
          loadingBox
        ) : (
          <>
            <NavLink href="/my">
              마이페이지
            </NavLink>
            <button type="button" onClick={logout} className={navLinkClass}>
              로그아웃
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

import { Link } from "@tanstack/react-router";

const navLinkClass = "text-sm font-medium text-zinc-400 hover:text-white";
const activeNavLinkClass = { className: "text-white" };

export function Header() {
  return (
    <header className="flex items-center gap-6 px-10 py-6">
      <h1 className="text-lg font-bold text-red-500">UMCine</h1>
      <nav className="flex gap-4">
        <Link
          to="/"
          className={navLinkClass}
          activeOptions={{ exact: true }}
          activeProps={activeNavLinkClass}
        >
          영화
        </Link>
        <Link to="/search" className={navLinkClass} activeProps={activeNavLinkClass}>
          검색
        </Link>
        <Link to="/members" className={navLinkClass} activeProps={activeNavLinkClass}>
          회원
        </Link>
      </nav>
      <nav className="ml-auto flex gap-4">
        <Link to="/login" className={navLinkClass} activeProps={activeNavLinkClass}>
          로그인
        </Link>
        <Link to="/signup" className={navLinkClass} activeProps={activeNavLinkClass}>
          회원가입
        </Link>
        <Link to="/my" className={navLinkClass} activeProps={activeNavLinkClass}>
          내 정보
        </Link>
      </nav>
    </header>
  );
}

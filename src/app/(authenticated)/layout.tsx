import { RequireAuth } from "../../components/auth/auth-guards";

// 로그인한 뒤에만 볼 수 있는 페이지를 묶는 공통 Layout.
// (authenticated) 폴더는 Route Group이라 주소에는 나타나지 않는다.
// 이 폴더 아래에 page.tsx 를 추가하면 로그인 검사가 자동으로 적용된다.
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}

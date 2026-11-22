import { Link } from "@tanstack/react-router";
import { AuthCard } from "../../components/auth/auth-card";
import { MY_INFO_PLACEHOLDER } from "./my-info-placeholder";

export function MyInfoPage() {
  return (
    <AuthCard title="내 정보">
      <dl className="mb-8 flex flex-col gap-5">
        <div>
          <dt className="mb-1 text-sm text-zinc-400">이메일</dt>
          <dd className="m-0">{MY_INFO_PLACEHOLDER.email}</dd>
        </div>
        <div>
          <dt className="mb-1 text-sm text-zinc-400">닉네임</dt>
          <dd className="m-0">{MY_INFO_PLACEHOLDER.nickname}</dd>
        </div>
      </dl>
      <Link
        to="/my/edit"
        className="block w-full rounded-lg bg-red-500 px-4 py-3 text-center font-medium text-white"
      >
        내 정보 수정
      </Link>
    </AuthCard>
  );
}

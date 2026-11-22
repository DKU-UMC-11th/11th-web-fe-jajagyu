import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  children: ReactNode;
}

// 회원가입, 로그인, 내 정보 화면이 함께 쓰는 가운데 정렬 카드
export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <main className="flex justify-center px-6 pb-16">
      <section className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="mb-6 text-xl font-semibold">{title}</h2>
        {children}
      </section>
    </main>
  );
}

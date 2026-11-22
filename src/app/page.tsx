import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieListPage } from "../views/movies/movie-list-page";

export const metadata: Metadata = { title: "인기 영화" };

export default function HomePage() {
  // 주소의 ?page= 는 요청을 받아야 알 수 있는 값이라, 이를 읽는 Client Component를 Suspense로 감싼다.
  return (
    <Suspense fallback={<main className="px-10">불러오는 중이에요.</main>}>
      <MovieListPage />
    </Suspense>
  );
}

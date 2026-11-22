import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../views/movies/search-page";

export const metadata: Metadata = {
  title: "영화 검색",
  description: "TMDB에서 영화를 검색해요.",
};

export default function Page() {
  return (
    <Suspense fallback={<main className="px-10">불러오는 중이에요.</main>}>
      <SearchPage />
    </Suspense>
  );
}

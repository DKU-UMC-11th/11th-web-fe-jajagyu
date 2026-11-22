"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { ReactNode } from "react";
import { movieQueries } from "../../api/movies/movie-queries";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { PosterImage } from "./poster-image";

interface MovieSummaryProps {
  movieId: number;
  children?: ReactNode;
}

// 서버(즐겨찾기, 평점)는 영화 ID만 저장하므로, 제목과 포스터는 TMDB 상세 조회로 채운다.
// 같은 영화는 query 캐시를 같이 쓰기 때문에 상세 화면을 본 영화는 다시 요청하지 않는다.
export function MovieSummary({ movieId, children }: MovieSummaryProps) {
  const movieQuery = useQuery(movieQueries.detail(movieId));
  const movie = movieQuery.data;

  return (
    <div className="flex gap-4">
      <Link href={`/movies/${movieId}`} className="shrink-0">
        <PosterImage
          src={getTmdbPosterUrl(movie?.poster_path ?? null)}
          alt={`${movie?.title ?? `영화 ${movieId}`} 포스터`}
          sizes="64px"
          className="aspect-2/3 w-16 rounded-lg object-cover"
        />
      </Link>
      <div className="flex flex-col gap-1">
        <Link
          href={`/movies/${movieId}`}
          className="font-medium text-white"
        >
          {movie?.title ?? (movieQuery.isLoading ? "불러오는 중" : `영화 ${movieId}`)}
        </Link>
        {children}
      </div>
    </div>
  );
}

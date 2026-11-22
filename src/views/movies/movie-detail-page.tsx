"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { movieQueries } from "../../api/movies/movie-queries";
import { RequestState } from "../../components/common/request-state";
import { FavoriteButton } from "../../components/movies/favorite-button";
import { PosterImage } from "../../components/movies/poster-image";
import { MovieRatingSection } from "../../components/ratings/movie-rating-section";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

// 주소의 movieId는 서버 컴포넌트(page.tsx)가 params에서 읽어 prop으로 넘겨 준다.
export function MovieDetailPage({ movieId: movieIdParam }: { movieId: string }) {
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery(movieQueries.detail(movieId));

  if (!isValidMovieId) {
    return <main className="px-10 pb-10">올바르지 않은 영화 번호예요.</main>;
  }

  return (
    <main className="pb-10">
      <RequestState
        isLoading={movieDetailQuery.isPending}
        errorMessage={
          movieDetailQuery.isError
            ? getMovieDetailErrorMessage(movieDetailQuery.error)
            : null
        }
        isEmpty={!movieDetailQuery.data}
        loadingMessage="영화 정보를 불러오는 중이에요."
        emptyMessage="영화를 찾을 수 없어요."
        onRetry={() => movieDetailQuery.refetch()}
      >
        {movieDetailQuery.data && (
          <MovieDetailContent movie={movieDetailQuery.data} />
        )}
      </RequestState>
    </main>
  );
}

function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <>
      {backdropUrl ? (
        <Image
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          width={1280}
          height={720}
          sizes="100vw"
          priority
          className="h-72 w-full object-cover"
        />
      ) : (
        <div className="flex h-72 w-full items-center justify-center bg-zinc-800 text-zinc-500">
          이미지 없음
        </div>
      )}
      <div className="px-10">
        <Link href="/" className="mb-4 inline-block text-sm text-zinc-400">
          영화 목록
        </Link>
        <div className="-mt-20 flex gap-6">
          <PosterImage
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
            sizes="192px"
            className="aspect-2/3 w-48 rounded-lg object-cover"
          />
          <div className="flex flex-col gap-2 pt-20">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{movie.title}</h1>
              <FavoriteButton movieId={movie.id} />
            </div>
            <p className="m-0 text-zinc-400">{movie.original_title}</p>
            <p className="m-0 text-zinc-400">{movie.release_date}</p>
            <p className="m-0 text-zinc-400">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p className="m-0 text-zinc-400">{formatRuntime(movie.runtime)}</p>
            {movie.tagline && (
              <h2 className="mt-4 text-lg font-medium">{movie.tagline}</h2>
            )}
            <p className="max-w-2xl text-zinc-300">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
          </div>
        </div>
        <div className="mt-10">
          <MovieRatingSection movieId={movie.id} />
        </div>
      </div>
    </>
  );
}

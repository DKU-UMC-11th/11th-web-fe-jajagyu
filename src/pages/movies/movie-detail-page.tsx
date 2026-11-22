import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { movieQueries } from "../../api/movies/movie-queries";
import { RequestState } from "../../components/common/request-state";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { PosterImage } from "../../components/movies/poster-image";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
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
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="h-72 w-full object-cover"
        />
      ) : (
        <div className="flex h-72 w-full items-center justify-center bg-zinc-800 text-zinc-500">
          이미지 없음
        </div>
      )}
      <div className="px-10">
        <Link to="/" className="mb-4 inline-block text-sm text-zinc-400">
          영화 목록
        </Link>
        <div className="-mt-20 flex gap-6">
          <PosterImage
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
            className="aspect-2/3 w-48 rounded-lg object-cover"
          />
          <div className="flex flex-col gap-2 pt-20">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{movie.title}</h1>
              <BookmarkButton movieId={movie.id} />
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
      </div>
    </>
  );
}

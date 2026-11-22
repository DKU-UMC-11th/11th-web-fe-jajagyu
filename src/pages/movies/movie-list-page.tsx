import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { movieQueries } from "../../api/movies/movie-queries";
import { RequestState } from "../../components/common/request-state";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import {
  useViewSettingsStore,
  type CardSize,
} from "../../stores/view-settings-store";
import { cn } from "../../utils/cn";
import { toMovieCard } from "../../utils/movies/to-movie-card";

// TMDB는 인기 영화를 최대 500페이지까지만 제공한다.
const MAX_TMDB_PAGES = 500;

const CARD_SIZE_OPTIONS: { value: CardSize; label: string }[] = [
  { value: "small", label: "작게" },
  { value: "large", label: "크게" },
];

const GRID_CLASS_BY_SIZE: Record<CardSize, string> = {
  small: "",
  large: "lg:grid-cols-2 xl:grid-cols-3",
};

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const cardSize = useViewSettingsStore((state) => state.cardSize);
  const setCardSize = useViewSettingsStore((state) => state.setCardSize);

  const moviesQuery = useQuery(movieQueries.list({ page }));

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(
    moviesQuery.data?.total_pages ?? 0,
    MAX_TMDB_PAGES,
  );

  return (
    <main className="px-10 pb-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">인기 영화</h2>
        <div className="flex gap-2">
          {CARD_SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={cardSize === option.value}
              onClick={() => setCardSize(option.value)}
              className={cn(
                "rounded-lg border border-zinc-700 px-3 py-1 text-sm text-zinc-400",
                cardSize === option.value && "border-red-500 bg-red-500 text-white",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <RequestState
        isLoading={moviesQuery.isPending}
        errorMessage={
          moviesQuery.isError ? "영화 목록을 불러오지 못했어요." : null
        }
        isEmpty={movies.length === 0}
        loadingMessage="영화 목록을 불러오는 중이에요."
        emptyMessage="조건에 맞는 영화가 없어요."
        onRetry={() => moviesQuery.refetch()}
      >
        <MovieGrid
          movies={movies.map(toMovieCard)}
          className={GRID_CLASS_BY_SIZE[cardSize]}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onSelectPage={(nextPage) => navigate({ search: { page: nextPage } })}
        />
      </RequestState>
    </main>
  );
}

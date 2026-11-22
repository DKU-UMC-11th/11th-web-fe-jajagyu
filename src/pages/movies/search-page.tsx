import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { movieQueries } from "../../api/movies/movie-queries";
import { RequestState } from "../../components/common/request-state";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import Pagination from "../../components/movies/pagination";
import { PosterImage } from "../../components/movies/poster-image";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const MAX_TMDB_PAGES = 500;

interface SearchFormProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

function SearchForm({ initialQuery, onSearch }: SearchFormProps) {
  const [searchText, setSearchText] = useState(initialQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(searchText.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        aria-label="검색어"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="w-full max-w-sm rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-white"
      />
      <button
        type="submit"
        className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white"
      >
        검색
      </button>
    </form>
  );
}

export function SearchPage() {
  const { query, page = 1 } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery(
    movieQueries.search({ query: normalizedQuery, page }),
  );

  const searchResults = searchQuery.data?.results ?? [];
  const totalPages = Math.min(
    searchQuery.data?.total_pages ?? 0,
    MAX_TMDB_PAGES,
  );

  return (
    <main className="px-10 pb-10">
      <h1 className="mb-5 text-xl font-semibold">영화 검색</h1>
      {/* 주소의 검색어가 바뀌면(뒤로 가기 등) key로 입력창을 새로 만든다. */}
      <SearchForm
        key={normalizedQuery}
        initialQuery={normalizedQuery}
        onSearch={(nextQuery) =>
          navigate({ search: nextQuery ? { query: nextQuery } : {} })
        }
      />

      {!normalizedQuery ? (
        <p className="text-zinc-400">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <h2 className="mb-1 text-lg font-medium">
            '{normalizedQuery}' 검색 결과
          </h2>
          <RequestState
            isLoading={searchQuery.isLoading}
            errorMessage={
              searchQuery.isError ? "검색 결과를 불러오지 못했어요." : null
            }
            isEmpty={searchResults.length === 0}
            loadingMessage="검색 결과를 불러오는 중이에요."
            emptyMessage="검색 결과가 없어요."
            onRetry={() => searchQuery.refetch()}
          >
            <p className="mb-5 text-zinc-400">
              이번 페이지 영화 {searchResults.length}편
            </p>
            <ul className="mb-8 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((movie) => (
                <li key={movie.id} className="flex flex-col gap-2">
                  <div className="relative">
                    <PosterImage
                      src={getTmdbPosterUrl(movie.poster_path)}
                      alt={`${movie.title} 포스터`}
                      className="aspect-2/3 w-full rounded-lg object-cover"
                    />
                    <BookmarkButton
                      movieId={movie.id}
                      className="absolute top-2 right-2"
                    />
                  </div>
                  <h3 className="text-base font-medium">{movie.title}</h3>
                  <p className="m-0 text-sm text-zinc-400">{movie.original_title}</p>
                  <p className="m-0 text-sm text-zinc-400">{movie.release_date}</p>
                  <p className="m-0 line-clamp-4 text-sm text-zinc-300">
                    {movie.overview || "줄거리 정보가 없어요."}
                  </p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="text-sm font-medium text-red-500"
                  >
                    상세 보기
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onSelectPage={(nextPage) =>
                navigate({ search: { query: normalizedQuery, page: nextPage } })
              }
            />
          </RequestState>
        </>
      )}
    </main>
  );
}

import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "./get-movie-detail";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

// 목록, 검색, 상세는 응답이 달라서 query key의 두 번째 값부터 구분한다.
// query function의 결과에 영향을 주는 값(page, query, movieId)은 key에도 넣는다.
export const movieQueries = {
  list: ({ page }: { page: number }) =>
    queryOptions({
      queryKey: ["movies", "list", { page }] as const,
      queryFn: () => getMovies({ page }),
    }),

  search: ({ query, page }: { query: string; page: number }) =>
    queryOptions({
      queryKey: ["movies", "search", { query, page }] as const,
      queryFn: () => searchMovies({ query, page }),
      enabled: query.length > 0,
    }),

  detail: (movieId: number) =>
    queryOptions({
      queryKey: ["movies", "detail", movieId] as const,
      queryFn: () => getMovieDetail(movieId),
      enabled: Number.isInteger(movieId) && movieId > 0,
      // 미니 실습: 상세 조회는 전역 기본값(1분) 대신 30초 동안만 최신으로 본다.
      staleTime: 30 * 1000,
    }),
};

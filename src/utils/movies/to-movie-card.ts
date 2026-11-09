import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "./tmdb-image";

export interface MovieCardData {
  id: number;
  title: string;
  releaseDate: string;
  posterUrl: string | null;
}

// 선택 미션: TMDB 응답(snake_case)을 카드 UI 타입으로 바꾸는 adapter
export function toMovieCard(movie: TmdbMovieListItem): MovieCardData {
  return {
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date || "개봉일 미정",
    posterUrl: getTmdbPosterUrl(movie.poster_path),
  };
}

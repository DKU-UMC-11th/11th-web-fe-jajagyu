import type { MovieCardData } from "../../utils/movies/to-movie-card";
import { cn } from "../../utils/cn";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: MovieCardData[];
  className?: string;
}

export default function MovieGrid({ movies, className }: MovieGridProps) {
  return (
    <ul
      className={cn(
        "mb-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        className,
      )}
    >
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}

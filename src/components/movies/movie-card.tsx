import { Link } from "@tanstack/react-router";
import type { MovieCardData } from "../../utils/movies/to-movie-card";
import { BookmarkButton } from "./bookmark-button";
import { PosterImage } from "./poster-image";

interface MovieCardProps {
  movie: MovieCardData;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <PosterImage
            src={movie.posterUrl}
            alt={`${movie.title} 포스터`}
            className="aspect-2/3 w-full rounded-lg object-cover"
          />
        </Link>
        <BookmarkButton
          movieId={movie.id}
          className="absolute top-2 right-2"
        />
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="text-base font-medium">{movie.title}</h2>
      </Link>
      <p className="m-0 text-sm text-zinc-400">{movie.releaseDate}</p>
    </article>
  );
}

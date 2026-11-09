import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
}

export function BookmarkButton({ movieId, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full",
        isBookmarked ? "bg-blue-600" : "bg-black/60",
        className,
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt={isBookmarked ? "북마크 해제" : "북마크 추가"}
      />
    </button>
  );
}

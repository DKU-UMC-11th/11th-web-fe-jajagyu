"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { favoriteQueries } from "../../api/favorites/favorite-queries";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../hooks/use-favorite-mutations";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
}

// 서버에 저장되는 즐겨찾기 버튼. (카드의 북마크는 이 브라우저에만 저장되는 4주차 기능이다.)
export function FavoriteButton({ movieId }: FavoriteButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const statusQuery = useQuery({
    ...favoriteQueries.status(movieId),
    enabled: Boolean(accessToken),
  });
  const addMutation = useAddFavoriteMutation();
  const removeMutation = useRemoveFavoriteMutation();

  const isFavorite = statusQuery.data?.isFavorite ?? false;
  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleClick = () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    if (isPending || statusQuery.isLoading) return;

    if (isFavorite) {
      removeMutation.mutate(movieId);
    } else {
      addMutation.mutate(movieId);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1 text-sm disabled:opacity-50",
        isFavorite ? "bg-blue-600 text-white" : "border border-zinc-600 text-zinc-200",
      )}
    >
      <Image
        width={16}
        height={16}
        unoptimized
        src={
          isFavorite
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        className="h-4 w-4"
      />
      {isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
    </button>
  );
}

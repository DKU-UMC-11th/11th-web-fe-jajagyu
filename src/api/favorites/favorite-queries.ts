import { queryOptions } from "@tanstack/react-query";
import { getFavorites, getFavoriteStatus } from "./favorites";

export const favoriteQueries = {
  list: () =>
    queryOptions({
      queryKey: ["favorites", "list"] as const,
      queryFn: getFavorites,
    }),

  status: (movieId: number) =>
    queryOptions({
      queryKey: ["favorites", "status", movieId] as const,
      queryFn: () => getFavoriteStatus(movieId),
    }),
};

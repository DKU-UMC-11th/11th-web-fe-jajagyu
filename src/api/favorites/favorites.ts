import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

export async function getFavorites() {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}

export async function getFavoriteStatus(movieId: number) {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
  return response.result;
}

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}

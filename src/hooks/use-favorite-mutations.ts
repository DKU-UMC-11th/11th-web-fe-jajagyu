import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteQueries } from "../api/favorites/favorite-queries";
import { addFavorite, removeFavorite } from "../api/favorites/favorites";
import { getApiErrorMessage } from "../utils/get-api-error-message";

// 상세 화면의 여부는 setQueryData로 바로 바꾸고(추가 요청 없음),
// 마이페이지의 목록은 어떤 영화가 늘고 줄었는지 서버 기준으로 다시 가져오도록 invalidateQueries를 쓴다.
function useFavoriteCache() {
  const queryClient = useQueryClient();

  return (movieId: number, isFavorite: boolean) => {
    queryClient.setQueryData(favoriteQueries.status(movieId).queryKey, { isFavorite });
    queryClient.invalidateQueries({ queryKey: favoriteQueries.list().queryKey });
  };
}

export function useAddFavoriteMutation() {
  const updateCache = useFavoriteCache();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (_response, movieId) => updateCache(movieId, true),
    onError: (error) => alert(getApiErrorMessage(error, "즐겨찾기 등록에 실패했어요.")),
  });
}

export function useRemoveFavoriteMutation() {
  const updateCache = useFavoriteCache();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_response, movieId) => updateCache(movieId, false),
    onError: (error) => alert(getApiErrorMessage(error, "즐겨찾기 해제에 실패했어요.")),
  });
}

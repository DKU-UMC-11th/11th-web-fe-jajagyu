import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  updateRating,
  type UpdateRatingRequest,
} from "../api/ratings/ratings";
import { getApiErrorMessage } from "../utils/get-api-error-message";

// 평점이 바뀌면 상세 화면과 마이페이지의 평점 목록이 같이 달라지므로 ["ratings"] 전체를 무효화한다.
function useInvalidateRatings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["ratings"] });
}

export function useCreateRatingMutation() {
  const invalidateRatings = useInvalidateRatings();

  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      invalidateRatings();
      alert("평점을 등록했어요.");
    },
    onError: (error) => alert(getApiErrorMessage(error, "평점 등록에 실패했어요.")),
  });
}

export function useUpdateRatingMutation() {
  const invalidateRatings = useInvalidateRatings();

  return useMutation({
    mutationFn: ({ ratingId, ...body }: UpdateRatingRequest & { ratingId: number }) =>
      updateRating(ratingId, body),
    onSuccess: () => {
      invalidateRatings();
      alert("평점을 수정했어요.");
    },
    onError: (error) => alert(getApiErrorMessage(error, "평점 수정에 실패했어요.")),
  });
}

export function useDeleteRatingMutation() {
  const invalidateRatings = useInvalidateRatings();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      invalidateRatings();
      alert("평점을 삭제했어요.");
    },
    onError: (error) => alert(getApiErrorMessage(error, "평점 삭제에 실패했어요.")),
  });
}

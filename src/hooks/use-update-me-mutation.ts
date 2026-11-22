import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberQueries } from "../api/members/member-queries";
import { updateMe } from "../api/members/update-me";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답(result)이 내 정보 조회와 같은 형태라서 캐시를 직접 바꾼다. 다시 조회할 필요가 없다.
      queryClient.setQueryData(memberQueries.me().queryKey, response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "내 정보 수정에 실패했어요. 다시 시도해 주세요."));
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      // 로그인으로 "내 정보"가 달라졌으니 캐시를 무효화해 다시 조회하게 한다.
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      router.push("/");
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
    },
  });
}

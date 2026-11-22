import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/members/signup";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    // 7주차 try 안의 성공 처리는 onSuccess로, catch 안의 실패 처리는 onError로 옮겼다.
    onSuccess: (response) => {
      alert(response.message);
      router.push("/login");
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
    },
  });
}

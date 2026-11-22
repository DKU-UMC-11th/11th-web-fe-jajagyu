import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return () => {
    setAccessToken(null);
    // 로그인한 사용자의 데이터가 다음 사용자에게 보이지 않도록 캐시를 지운다.
    queryClient.removeQueries({ queryKey: ["members", "me"] });
    queryClient.removeQueries({ queryKey: ["favorites"] });
    queryClient.removeQueries({ queryKey: ["ratings"] });
    router.push("/");
  };
}

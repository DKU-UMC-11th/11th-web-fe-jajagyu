import { queryOptions } from "@tanstack/react-query";
import { getMe } from "./me";

export const memberQueries = {
  // 내 정보는 자주 바뀌지 않으므로 5분 동안 최신으로 본다.
  // 인증 실패(401) 뒤에 같은 조회를 자동으로 다시 보내지 않도록 retry를 끈다.
  me: () =>
    queryOptions({
      queryKey: ["members", "me"] as const,
      queryFn: getMe,
      staleTime: 5 * 60 * 1000,
      retry: false,
    }),
};

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";
import { useViewSettingsStore } from "../stores/view-settings-store";
import { shouldRetryQuery } from "../utils/should-retry-query";

const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: ReactNode }) {
  // 요청마다(서버) / 브라우저마다 하나씩만 만들도록 state에 보관한다. (모듈 최상단에 만들면 서버에서 사용자끼리 캐시가 섞인다)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE, retry: shouldRetryQuery } },
      }),
  );

  // localStorage는 브라우저에서만 읽을 수 있으므로, 마운트된 뒤(useEffect)에 저장된 값을 store로 불러온다.
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useBookmarkStore.persist.rehydrate();
    useViewSettingsStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

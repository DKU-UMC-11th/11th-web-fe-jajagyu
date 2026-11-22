import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  // localStorage에서 토큰을 읽어 오는 일이 끝났는지. (서버/첫 렌더에서는 항상 false)
  hasHydrated: boolean;
  setAccessToken: (accessToken: string | null) => void;
}

// 토큰은 클라이언트 상태라서 Zustand로 저장한다. (회원 정보는 서버 상태라 query 캐시가 맡는다)
// Next.js는 서버에서도 이 코드를 한 번 실행하므로, localStorage는 브라우저에서 rehydrate()를 부를 때만 읽는다.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      skipHydration: true,
      onRehydrateStorage: () => () => useAuthStore.setState({ hasHydrated: true }),
    },
  ),
);

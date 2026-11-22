import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardSize = "small" | "large";

interface ViewSettingsStore {
  cardSize: CardSize;
  setCardSize: (cardSize: CardSize) => void;
}

export const useViewSettingsStore = create<ViewSettingsStore>()(
  persist(
    (set) => ({
      cardSize: "small",
      setCardSize: (cardSize) => set({ cardSize }),
    }),
    {
      name: "umcine-view-settings",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // 서버 렌더링 결과와 맞추기 위해 브라우저에서 rehydrate()를 직접 부른다.
      partialize: (state) => ({ cardSize: state.cardSize }),
    },
  ),
);

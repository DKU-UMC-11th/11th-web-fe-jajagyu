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
      partialize: (state) => ({ cardSize: state.cardSize }),
    },
  ),
);

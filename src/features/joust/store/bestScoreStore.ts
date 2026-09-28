import {create} from 'zustand';
import {createJSONStorage, persist, type StateStorage} from 'zustand/middleware';

type BestScoreState = {
  best: number;
  record: (score: number) => void;
};

const attempt = <T>(action: () => T, fallback: T) => {
  try {
    return action();
  } catch {
    return fallback;
  }
};

const safeLocalStorage: StateStorage = {
  getItem: (name) => attempt(() => localStorage.getItem(name), null),
  setItem: (name, value) => attempt(() => localStorage.setItem(name, value), undefined),
  removeItem: (name) => attempt(() => localStorage.removeItem(name), undefined),
};

export const useBestScoreStore = create<BestScoreState>()(
  persist(
    (set) => ({
      best: 0,
      record: (score) => set(({best}) => ({best: Math.max(best, score)})),
    }),
    {name: 'joust', storage: createJSONStorage(() => safeLocalStorage), skipHydration: true},
  ),
);

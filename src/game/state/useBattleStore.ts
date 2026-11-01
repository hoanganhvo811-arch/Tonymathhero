import { create } from 'zustand';
import type { BattleState } from '@/types';

interface BattleStoreState {
  currentBattle: BattleState | null;
  isInBattle: boolean;
  setBattle: (battle: BattleState | null) => void;
  endBattle: () => void;
}

export const useBattleStore = create<BattleStoreState>((set) => ({
  currentBattle: null,
  isInBattle: false,
  setBattle: (battle) => set({ currentBattle: battle, isInBattle: battle !== null }),
  endBattle: () => set({ currentBattle: null, isInBattle: false }),
}));

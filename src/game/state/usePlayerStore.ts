import { create } from 'zustand';
import type { Player, PlayerStats } from '@/types';
import { createDefaultPlayer, persistenceService } from '../../services/persistence/persistenceService';

interface PlayerState {
  player: Player | null;
  isLoading: boolean;
  initPlayer: () => Promise<Player>;
  updatePlayerName: (name: string) => Promise<void>;
  updateStats: (statUpdates: Partial<PlayerStats>) => Promise<void>;
  setPlayer: (player: Player) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: null,
  isLoading: true,

  initPlayer: async () => {
    set({ isLoading: true });
    try {
      const allPlayers = await persistenceService.getAllPlayers();
      let activePlayer: Player;

      if (allPlayers.length > 0) {
        activePlayer = allPlayers[0];
      } else {
        activePlayer = createDefaultPlayer();
        await persistenceService.savePlayer(activePlayer);
      }

      set({ player: activePlayer, isLoading: false });
      return activePlayer;
    } catch (error) {
      console.error('Failed to init player:', error);
      const fallback = createDefaultPlayer();
      set({ player: fallback, isLoading: false });
      return fallback;
    }
  },

  updatePlayerName: async (name: string) => {
    const { player } = get();
    if (!player) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    const updated: Player = {
      ...player,
      name: trimmed,
      updatedAt: new Date().toISOString(),
    };

    set({ player: updated });
    await persistenceService.savePlayer(updated);
  },

  updateStats: async (statUpdates: Partial<PlayerStats>) => {
    const { player } = get();
    if (!player) return;

    const updated: Player = {
      ...player,
      stats: {
        ...player.stats,
        ...statUpdates,
      },
      updatedAt: new Date().toISOString(),
    };

    set({ player: updated });
    await persistenceService.savePlayer(updated);
  },

  setPlayer: (player: Player) => {
    set({ player });
  },
}));

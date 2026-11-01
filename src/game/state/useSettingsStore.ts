import { create } from 'zustand';
import type { GameSettings, GraphicsQuality } from '../../types';
import { createDefaultSettings, persistenceService } from '../../services/persistence/persistenceService';

interface SettingsState {
  settings: GameSettings;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<GameSettings>) => Promise<void>;
  setVolume: (type: 'master' | 'bgm' | 'sfx', value: number) => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleBgm: () => Promise<void>;
  toggleSfx: () => Promise<void>;
  setLanguage: (lang: 'vi' | 'en') => Promise<void>;
  setGraphicsQuality: (quality: GraphicsQuality) => Promise<void>;
  toggleParticles: () => Promise<void>;
  toggleSoundtrack: () => Promise<void>;
  toggleReducedMotion: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: createDefaultSettings(),
  isLoading: true,

  loadSettings: async () => {
    try {
      const saved = await persistenceService.getSettings();
      if (saved) {
        set({ settings: { ...createDefaultSettings(), ...saved }, isLoading: false });
      } else {
        const defaults = createDefaultSettings();
        await persistenceService.saveSettings(defaults);
        set({ settings: defaults, isLoading: false });
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
      set({ isLoading: false });
    }
  },

  updateSettings: async (partial: Partial<GameSettings>) => {
    const { settings } = get();
    const updated = { ...settings, ...partial };
    set({ settings: updated });
    await persistenceService.saveSettings(updated);
  },

  setVolume: async (type: 'master' | 'bgm' | 'sfx', value: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    const field = type === 'master' ? 'masterVolume' : type === 'bgm' ? 'bgmVolume' : 'sfxVolume';
    await get().updateSettings({ [field]: clamped });
  },

  toggleMute: async () => {
    const { settings, updateSettings } = get();
    await updateSettings({ isMuted: !settings.isMuted });
  },

  toggleBgm: async () => {
    const { settings, updateSettings } = get();
    await updateSettings({ bgmEnabled: !settings.bgmEnabled });
  },

  toggleSfx: async () => {
    const { settings, updateSettings } = get();
    await updateSettings({ sfxEnabled: !settings.sfxEnabled });
  },

  setLanguage: async (lang: 'vi' | 'en') => {
    await get().updateSettings({ language: lang });
  },

  setGraphicsQuality: async (quality: GraphicsQuality) => {
    await get().updateSettings({ graphicsQuality: quality });
  },

  toggleParticles: async () => {
    const { settings, updateSettings } = get();
    await updateSettings({ particlesEnabled: !settings.particlesEnabled });
  },

  toggleSoundtrack: async () => {
    const { settings, updateSettings } = get();
    await updateSettings({ soundtrackEnabled: !settings.soundtrackEnabled });
  },

  toggleReducedMotion: async () => {
    const { settings, updateSettings } = get();
    await updateSettings({ reducedMotion: !settings.reducedMotion });
  },
}));

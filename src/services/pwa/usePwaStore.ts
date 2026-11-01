import { create } from 'zustand';
import { pwaService } from './pwaService';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIos: boolean;
  isAndroid: boolean;
  isSafari: boolean;
}

export function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isIos: false,
      isAndroid: false,
      isSafari: false,
    };
  }

  const ua = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(ua);
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua);
  const isMobile = (isIos || isAndroid || /mobile/.test(ua)) && !isTablet;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isIos,
    isAndroid,
    isSafari,
  };
}

interface PwaState {
  isOnline: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  isUpdateAvailable: boolean;
  isInstallModalOpen: boolean;
  isOfflineModalOpen: boolean;
  deviceInfo: DeviceInfo;

  // Actions
  initPwaListeners: () => () => void;
  setInstallModalOpen: (open: boolean) => void;
  setOfflineModalOpen: (open: boolean) => void;
  promptInstall: () => Promise<boolean>;
  applyUpdate: () => void;
}

export const usePwaStore = create<PwaState>((set, get) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  canInstall: false,
  isInstalled: typeof window !== 'undefined' ? pwaService.isInstalled() : false,
  isUpdateAvailable: false,
  isInstallModalOpen: false,
  isOfflineModalOpen: false,
  deviceInfo: detectDevice(),

  initPwaListeners: () => {
    if (typeof window === 'undefined') return () => {};

    // 1. Online / Offline events
    const handleOnline = () => set({ isOnline: true });
    const handleOffline = () => set({ isOnline: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Installable status changes
    const unsubInstall = pwaService.onInstallChange((canInstall) => {
      set({ canInstall, isInstalled: pwaService.isInstalled() });
    });

    // 3. Service worker update available
    const unsubUpdate = pwaService.onUpdateAvailable(() => {
      set({ isUpdateAvailable: true });
    });

    // Initial state check
    set({
      isOnline: navigator.onLine,
      canInstall: pwaService.canInstall(),
      isInstalled: pwaService.isInstalled(),
      deviceInfo: detectDevice(),
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubInstall();
      unsubUpdate();
    };
  },

  setInstallModalOpen: (open: boolean) => set({ isInstallModalOpen: open }),
  setOfflineModalOpen: (open: boolean) => set({ isOfflineModalOpen: open }),

  promptInstall: async () => {
    const res = await pwaService.promptInstall();
    const accepted = res.outcome === 'accepted';
    if (accepted) {
      set({ isInstalled: true, canInstall: false, isInstallModalOpen: false });
    }
    return accepted;
  },

  applyUpdate: () => {
    pwaService.applyUpdate();
  },
}));

export type GraphicsQuality = 'cinematic' | 'high' | 'medium' | 'low';

export interface GameSettings {
  masterVolume: number; // 0 to 100
  bgmVolume: number; // 0 to 100
  sfxVolume: number; // 0 to 100
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  isMuted: boolean;
  graphicsQuality: GraphicsQuality;
  particlesEnabled: boolean;
  soundtrackEnabled: boolean;
  reducedMotion?: boolean;
  language: 'vi' | 'en';
}

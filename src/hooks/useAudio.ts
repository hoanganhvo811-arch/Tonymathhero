import { useCallback } from 'react';
import { audioEngine, type BgmTrack } from '@/game/engine/AudioEngine';

export function useAudio() {
  const playHover = useCallback(() => audioEngine.playHover(), []);
  const playClick = useCallback(() => audioEngine.playClick(), []);
  const playSelect = useCallback(() => audioEngine.playSelect(), []);

  // Educational feedback
  const playCorrectAnswer = useCallback(() => audioEngine.playCorrectAnswer(), []);
  const playWrongAnswer = useCallback(() => audioEngine.playWrongAnswer(), []);
  const playRewardCollect = useCallback(() => audioEngine.playRewardCollect(), []);
  const playLevelUp = useCallback(() => audioEngine.playLevelUp(), []);
  const playKingdomUnlock = useCallback(() => audioEngine.playKingdomUnlock(), []);
  const playCrystalUnlock = useCallback(() => audioEngine.playCrystalUnlock(), []);

  // Combat SFX
  const playSwordSlash = useCallback(() => audioEngine.playSwordSlash(), []);
  const playMagicCast = useCallback(() => audioEngine.playMagicCast(), []);
  const playShieldBlock = useCallback(() => audioEngine.playShieldBlock(), []);
  const playHeal = useCallback(() => audioEngine.playHeal(), []);
  const playMonsterHit = useCallback(() => audioEngine.playMonsterHit(), []);
  const playBossRoar = useCallback(() => audioEngine.playBossRoar(), []);
  const playBossPhaseShift = useCallback(() => audioEngine.playBossPhaseShift(), []);

  // Dynamic BGM
  const playBgm = useCallback((track: BgmTrack) => audioEngine.playBgm(track), []);
  const stopBgm = useCallback(() => audioEngine.stopBgm(), []);
  const startBgm = useCallback(() => audioEngine.startAmbientBgm(), []);
  const stopAmbientBgm = useCallback(() => audioEngine.stopAmbientBgm(), []);

  return {
    playHover,
    playClick,
    playSelect,
    playCorrectAnswer,
    playWrongAnswer,
    playRewardCollect,
    playLevelUp,
    playKingdomUnlock,
    playCrystalUnlock,
    playSwordSlash,
    playMagicCast,
    playShieldBlock,
    playHeal,
    playMonsterHit,
    playBossRoar,
    playBossPhaseShift,
    playBgm,
    stopBgm,
    startBgm,
    stopAmbientBgm,
  };
}

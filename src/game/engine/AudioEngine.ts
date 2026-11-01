import { useSettingsStore } from '../state/useSettingsStore';

export type BgmTrack =
  | 'main_menu'
  | 'kingdom_emerald'
  | 'kingdom_desert'
  | 'kingdom_ocean'
  | 'kingdom_frozen'
  | 'kingdom_stone'
  | 'kingdom_sweet'
  | 'kingdom_dark'
  | 'battle_normal'
  | 'battle_boss'
  | 'victory'
  | 'defeat';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private bgmNodes: (OscillatorNode | AudioNode)[] = [];
  private bgmTimer: number | null = null;
  private currentBgmTrack: BgmTrack | null = null;
  private isBgmPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getMasterVolume(): number {
    const { settings } = useSettingsStore.getState();
    if (settings.isMuted || settings.sfxEnabled === false) return 0;
    return (settings.masterVolume / 100) * (settings.sfxVolume / 100);
  }

  private getBgmVolume(): number {
    const { settings } = useSettingsStore.getState();
    if (settings.isMuted || !settings.soundtrackEnabled || settings.bgmEnabled === false) return 0;
    return (settings.masterVolume / 100) * (settings.bgmVolume / 100) * 0.18;
  }

  // ==========================================
  // UI & GENERAL SOUND EFFECTS
  // ==========================================

  playHover(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(vol * 0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  playClick(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(vol * 0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  }

  playSelect(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(vol * 0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch (_) {}
  }

  // ==========================================
  // EDUCATIONAL & FEEDBACK AUDIO
  // ==========================================

  playCorrectAnswer(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Joyful chime: C5, E5, G5, C6 with sparkle
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(vol * 0.22, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });

      // Shimmer sparkle overlay
      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(1318.51, now + 0.25); // E6
      sparkleOsc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.45); // G6

      sparkleGain.gain.setValueAtTime(vol * 0.12, now + 0.25);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);

      sparkleOsc.start(now + 0.25);
      sparkleOsc.stop(now + 0.5);
    } catch (_) {}
  }

  playWrongAnswer(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Gentle, encouraging, warm two-tone chime (F4 -> D4) - never harsh or buzzy
      const now = ctx.currentTime;
      const notes = [349.23, 293.66]; // F4, D4 (warm soft interval)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(vol * 0.16, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.3);
      });
    } catch (_) {}
  }

  playRewardCollect(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Rapid coin jingling cascade (5 ascending high harmonics)
      const coinFreqs = [987.77, 1174.66, 1318.51, 1567.98, 1760.0];
      coinFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(vol * 0.14, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.18);
      });
    } catch (_) {}
  }

  playLevelUp(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(vol * 0.25, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.4);
      });
    } catch (_) {}
  }

  playKingdomUnlock(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Majestic low boom with sparkling resonance
      const oscLow = ctx.createOscillator();
      const gainLow = ctx.createGain();
      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(120, now);
      oscLow.frequency.exponentialRampToValueAtTime(55, now + 0.6);

      gainLow.gain.setValueAtTime(vol * 0.35, now);
      gainLow.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      oscLow.connect(gainLow);
      gainLow.connect(ctx.destination);

      oscLow.start(now);
      oscLow.stop(now + 0.6);

      // Shimmer arpeggio
      [880, 1174.66, 1318.51, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.15 + i * 0.08);

        gain.gain.setValueAtTime(vol * 0.18, now + 0.15 + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15 + i * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + 0.15 + i * 0.08);
        osc.stop(now + 0.15 + i * 0.08 + 0.45);
      });
    } catch (_) {}
  }

  playCrystalUnlock(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Sacred ethereal choral chord
      const freqs = [440, 554.37, 659.25, 880, 1108.73]; // A major ethereal chord
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(vol * 0.16, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.8);
      });
    } catch (_) {}
  }

  // ==========================================
  // COMBAT & RPG ACTION SOUNDS
  // ==========================================

  playSwordSlash(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Sharp metallic whoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);

      gain.gain.setValueAtTime(vol * 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_) {}
  }

  playMagicCast(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Mystical ascending sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1280, now + 0.25);

      gain.gain.setValueAtTime(vol * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (_) {}
  }

  playShieldBlock(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Resonant metallic ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(310, now + 0.2);

      gain.gain.setValueAtTime(vol * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (_) {}
  }

  playHeal(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Warm health restore chord
      [440, 554.37, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(vol * 0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (_) {}
  }

  playMonsterHit(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Punchy heavy low thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);

      gain.gain.setValueAtTime(vol * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (_) {}
  }

  playBossRoar(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Deep resonant growl
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.55);

      gain.gain.setValueAtTime(vol * 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch (_) {}
  }

  playBossPhaseShift(): void {
    const vol = this.getMasterVolume();
    if (vol <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Dramatic cosmic frequency sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.45);

      gain.gain.setValueAtTime(vol * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (_) {}
  }

  // ==========================================
  // PROCEDURAL DYNAMIC BGM SYSTEM
  // ==========================================

  playBgm(track: BgmTrack): void {
    if (this.currentBgmTrack === track && this.isBgmPlaying) return;
    this.stopBgm();

    const ctx = this.getContext();
    if (!ctx) return;

    const vol = this.getBgmVolume();
    if (vol <= 0) {
      this.currentBgmTrack = track;
      this.isBgmPlaying = true;
      return;
    }

    try {
      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.bgmGain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.8);
      this.bgmGain.connect(ctx.destination);

      this.currentBgmTrack = track;
      this.isBgmPlaying = true;

      // Select musical progression based on track
      let chordPads: number[] = [];
      let melodySequence: { note: number; dur: number }[] = [];
      let tempoIntervalMs = 2400;

      switch (track) {
        case 'main_menu':
          // C Major / G Major gentle adventure pads
          chordPads = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
          tempoIntervalMs = 2600;
          break;
        case 'kingdom_emerald':
          // D Dorian / Green forest woodwind pads
          chordPads = [146.83, 220.0, 261.63, 329.63]; // D3, A3, C4, E4
          tempoIntervalMs = 2800;
          break;
        case 'kingdom_desert':
          // E Phrygian / Desert sands exotic pads
          chordPads = [164.81, 207.65, 246.94, 329.63]; // E3, G#3, B3, E4
          tempoIntervalMs = 2400;
          break;
        case 'kingdom_ocean':
          // F Major / Aquatic swell pads
          chordPads = [174.61, 220.0, 261.63, 349.23]; // F3, A3, C4, F4
          tempoIntervalMs = 3000;
          break;
        case 'kingdom_frozen':
          // A Minor / Ice bell pads
          chordPads = [220.0, 261.63, 329.63, 440.0]; // A3, C4, E4, A4
          tempoIntervalMs = 2900;
          break;
        case 'kingdom_stone':
          // G Minor / Subterranean forge pads
          chordPads = [196.0, 246.94, 293.66, 392.0]; // G3, B3, D4, G4
          tempoIntervalMs = 2000;
          break;
        case 'kingdom_sweet':
          // A Major / Whimsical cheerful pads
          chordPads = [220.0, 277.18, 329.63, 440.0]; // A3, C#4, E4, A4
          tempoIntervalMs = 1800;
          break;
        case 'kingdom_dark':
          // B Minor / Ominous low drone
          chordPads = [123.47, 185.0, 220.0, 246.94]; // B2, F#3, A3, B3
          tempoIntervalMs = 3200;
          break;
        case 'battle_normal':
          // Driving heroic battle chords
          chordPads = [146.83, 220.0, 293.66, 440.0]; // D3, A3, D4, A4
          tempoIntervalMs = 1400;
          break;
        case 'battle_boss':
          // Dramatic intense boss chords
          chordPads = [110.0, 164.81, 220.0, 329.63]; // A2, E3, A3, E4
          tempoIntervalMs = 1100;
          break;
        case 'victory':
          // Triumphant royal celebration chords
          chordPads = [261.63, 329.63, 392.0, 523.25, 659.25]; // C major
          tempoIntervalMs = 1600;
          break;
        case 'defeat':
          // Comforting, gentle acoustic chords
          chordPads = [174.61, 220.0, 261.63, 329.63]; // Fmaj7
          tempoIntervalMs = 2800;
          break;
      }

      // Create ambient sustained chord oscillators
      this.bgmNodes = chordPads.map((freq, index) => {
        const osc = ctx.createOscillator();
        const padGain = ctx.createGain();

        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle LFO-like breathing modulation
        const baseGain = 0.22 / chordPads.length;
        padGain.gain.setValueAtTime(baseGain, ctx.currentTime);

        osc.connect(padGain);
        padGain.connect(this.bgmGain!);

        osc.start();
        return osc;
      });

      // Procedural soft melodic motif loop
      let stepIndex = 0;
      this.bgmTimer = window.setInterval(() => {
        if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
        const curVol = this.getBgmVolume();
        if (curVol <= 0) return;

        try {
          const melodyFreq = chordPads[stepIndex % chordPads.length] * 1.5;
          stepIndex++;

          const noteOsc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          noteOsc.type = 'sine';
          noteOsc.frequency.setValueAtTime(melodyFreq, this.ctx.currentTime);

          noteGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(curVol * 0.12, this.ctx.currentTime + 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + (tempoIntervalMs / 1000) * 0.85);

          noteOsc.connect(noteGain);
          noteGain.connect(this.ctx.destination);

          noteOsc.start();
          noteOsc.stop(this.ctx.currentTime + (tempoIntervalMs / 1000) * 0.85);
        } catch (_) {}
      }, tempoIntervalMs);

    } catch (e) {
      console.warn('AudioEngine playBgm exception:', e);
    }
  }

  stopBgm(): void {
    if (this.bgmTimer) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }

    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.2);
      } catch (_) {}
    }

    setTimeout(() => {
      this.bgmNodes.forEach((node) => {
        try {
          if ('stop' in node) (node as OscillatorNode).stop();
          node.disconnect();
        } catch (_) {}
      });
      this.bgmNodes = [];
      this.isBgmPlaying = false;
      this.currentBgmTrack = null;
    }, 250);
  }

  startAmbientBgm(): void {
    this.playBgm('main_menu');
  }

  stopAmbientBgm(): void {
    this.stopBgm();
  }

  updateBgmVolume(): void {
    if (this.bgmGain && this.ctx) {
      const vol = this.getBgmVolume();
      this.bgmGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  getCurrentTrack(): BgmTrack | null {
    return this.currentBgmTrack;
  }
}

export const audioEngine = new AudioEngine();

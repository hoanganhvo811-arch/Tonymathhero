import type { CampaignId, GameSettings, GraphicsQuality, Player, PlayerProgress, DivisionKingdomProgress, MultiplicationKingdomProgress, WordProblemAdventureProgress, GeometryMeasurementKingdomProgress, NumberSenseKingdomProgress, FractionKingdomProgress, TimeKingdomProgress } from '@/types';
import { getDatabase } from '../storage/indexedDbClient';

const LS_PREFIX = 'tmh_';
const memoryFallbackStorage: Record<string, string> = {};

function safeSetItem(key: string, value: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  } else {
    memoryFallbackStorage[key] = value;
  }
}

function safeGetItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memoryFallbackStorage[key] || null;
}

export function createDefaultPlayer(): Player {
  return {
    id: 'player_tony_hero',
    name: 'Tony',
    title: 'Hiệp Sĩ Tân Binh',
    avatarId: 'tony_classic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      mathAccuracy: 100,
      totalQuestionsAnswered: 0,
      totalQuestionsCorrect: 0,
      battlesWon: 0,
      gemsCollected: 0,
      playTimeMinutes: 0,
    },
  };
}

export function createDefaultProgress(playerId: string, campaignId: CampaignId): PlayerProgress {
  const isG2 = campaignId === 'grade-2';
  return {
    id: `${playerId}_${campaignId}`,
    playerId,
    campaignId,
    heroLevel: 1,
    currentExp: 0,
    nextLevelExp: isG2 ? 100 : 150,
    currentKingdomId: isG2 ? 'g2-k1-arithmia' : 'g3-k1-valoria',
    unlockedKingdomIds: isG2 ? ['g2-k1-arithmia'] : ['g3-k1-valoria'],
    rescuedKingdomIds: [],
    completedQuestIds: [],
    collectedGemIds: [],
    totalStars: 0,
    goldCoins: 100,
    achievements: [
      {
        id: `ach-first-step-${campaignId}`,
        code: 'FIRST_STEP',
        title: isG2 ? 'Bình Minh Hiệp Sĩ Nhí' : 'Chiến Thần Tái Xuất',
        description: isG2
          ? 'Bắt đầu hành trình giải cứu 7 vương quốc Lớp 2'
          : 'Bắt đầu hành trình thống nhất 7 vương quốc Lớp 3',
        iconName: 'Shield',
        unlockedAt: new Date().toISOString(),
      },
    ],
    playTimeMinutes: 0,
    lastPlayedAt: new Date().toISOString(),
  };
}

export function createDefaultSettings(): GameSettings {
  // Mobile-adaptive graphics preset: prevents thermal throttling on phones
  let defaultQuality: GraphicsQuality = 'cinematic';
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|android.*mobile|mobile/i.test(ua);
    const isTablet = /ipad|tablet|(android(?!.*mobile))/i.test(ua);
    if (isMobile) {
      defaultQuality = 'medium';
    } else if (isTablet) {
      defaultQuality = 'high';
    }
  }

  return {
    masterVolume: 80,
    bgmVolume: 70,
    sfxVolume: 85,
    bgmEnabled: true,
    sfxEnabled: true,
    isMuted: false,
    graphicsQuality: defaultQuality,
    particlesEnabled: true,
    soundtrackEnabled: true,
    language: 'vi',
  };
}

class PersistenceService {
  // PLAYER
  async savePlayer(player: Player): Promise<void> {
    try {
      const db = await getDatabase();
      if (db) {
        await db.put('players', player);
      } else {
        safeSetItem(`${LS_PREFIX}player_${player.id}`, JSON.stringify(player));
      }
    } catch (e) {
      console.warn('Persistence savePlayer fallback to LocalStorage:', e);
      safeSetItem(`${LS_PREFIX}player_${player.id}`, JSON.stringify(player));
    }
  }

  async getPlayer(playerId: string): Promise<Player | null> {
    try {
      const db = await getDatabase();
      if (db) {
        const p = await db.get('players', playerId);
        if (p) return p;
      }
      const raw = localStorage.getItem(`${LS_PREFIX}player_${playerId}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Persistence getPlayer fallback:', e);
      const raw = localStorage.getItem(`${LS_PREFIX}player_${playerId}`);
      return raw ? JSON.parse(raw) : null;
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    try {
      const db = await getDatabase();
      if (db) {
        const players = await db.getAll('players');
        if (players && players.length > 0) return players;
      }
      // Check localStorage
      const results: Player[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${LS_PREFIX}player_`)) {
          const item = localStorage.getItem(key);
          if (item) results.push(JSON.parse(item));
        }
      }
      return results;
    } catch (e) {
      console.warn('Persistence getAllPlayers fallback:', e);
      return [];
    }
  }

  // CAMPAIGN PROGRESS
  async saveCampaignProgress(progress: PlayerProgress): Promise<void> {
    try {
      progress.lastPlayedAt = new Date().toISOString();
      const db = await getDatabase();
      if (db) {
        await db.put('campaign_progress', progress);
      } else {
        safeSetItem(`${LS_PREFIX}progress_${progress.id}`, JSON.stringify(progress));
      }
    } catch (e) {
      safeSetItem(`${LS_PREFIX}progress_${progress.id}`, JSON.stringify(progress));
    }
  }

  async getCampaignProgress(playerId: string, campaignId: CampaignId): Promise<PlayerProgress | null> {
    const key = `${playerId}_${campaignId}`;
    try {
      const db = await getDatabase();
      if (db) {
        const prog = await db.get('campaign_progress', key);
        if (prog) return prog;
      }
      const raw = safeGetItem(`${LS_PREFIX}progress_${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      const raw = safeGetItem(`${LS_PREFIX}progress_${key}`);
      return raw ? JSON.parse(raw) : null;
    }
  }

  // ACTIVE SESSION (PlayerId & ActiveCampaignId)
  async saveActiveSession(session: { playerId: string; activeCampaignId: CampaignId }): Promise<void> {
    try {
      const db = await getDatabase();
      if (db) {
        await db.put('active_session', { id: 'current_session', ...session });
      } else {
        localStorage.setItem(`${LS_PREFIX}active_session`, JSON.stringify(session));
      }
    } catch (e) {
      console.warn('Persistence saveActiveSession fallback:', e);
      localStorage.setItem(`${LS_PREFIX}active_session`, JSON.stringify(session));
    }
  }

  async getActiveSession(): Promise<{ playerId: string; activeCampaignId: CampaignId } | null> {
    try {
      const db = await getDatabase();
      if (db) {
        const sess = await db.get('active_session', 'current_session');
        if (sess) return { playerId: sess.playerId, activeCampaignId: sess.activeCampaignId };
      }
      const raw = localStorage.getItem(`${LS_PREFIX}active_session`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Persistence getActiveSession fallback:', e);
      const raw = localStorage.getItem(`${LS_PREFIX}active_session`);
      return raw ? JSON.parse(raw) : null;
    }
  }

  // SETTINGS
  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      const db = await getDatabase();
      if (db) {
        await db.put('settings', { id: 'global_settings', ...settings });
      } else {
        localStorage.setItem(`${LS_PREFIX}settings`, JSON.stringify(settings));
      }
    } catch (e) {
      console.warn('Persistence saveSettings fallback:', e);
      localStorage.setItem(`${LS_PREFIX}settings`, JSON.stringify(settings));
    }
  }

  async getSettings(): Promise<GameSettings | null> {
    try {
      const db = await getDatabase();
      if (db) {
        const s = await db.get('settings', 'global_settings');
        if (s) {
          const { id: _, ...settings } = s;
          return settings as GameSettings;
        }
      }
      const raw = localStorage.getItem(`${LS_PREFIX}settings`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Persistence getSettings fallback:', e);
      const raw = localStorage.getItem(`${LS_PREFIX}settings`);
      return raw ? JSON.parse(raw) : null;
    }
  }

  // DIVISION KINGDOM PROGRESS
  async saveDivisionProgress(progress: DivisionKingdomProgress): Promise<void> {
    const key = `${LS_PREFIX}division_progress_${progress.playerId}_${progress.campaignId}`;
    safeSetItem(key, JSON.stringify(progress));
  }

  async getDivisionProgress(playerId: string, campaignId: CampaignId): Promise<DivisionKingdomProgress | null> {
    const key = `${LS_PREFIX}division_progress_${playerId}_${campaignId}`;
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  // MULTIPLICATION KINGDOM PROGRESS
  async saveMultiplicationProgress(progress: MultiplicationKingdomProgress): Promise<void> {
    const key = `${LS_PREFIX}multiplication_progress_${progress.playerId}_${progress.campaignId}`;
    safeSetItem(key, JSON.stringify(progress));
  }

  async getMultiplicationProgress(playerId: string, campaignId: CampaignId): Promise<MultiplicationKingdomProgress | null> {
    const key = `${LS_PREFIX}multiplication_progress_${playerId}_${campaignId}`;
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  // WORD PROBLEM ADVENTURE PROGRESS
  async saveWordProblemProgress(progress: WordProblemAdventureProgress): Promise<void> {
    const key = `${LS_PREFIX}word_problem_progress_${progress.playerId}_${progress.campaignId}`;
    safeSetItem(key, JSON.stringify(progress));
  }

  async getWordProblemProgress(playerId: string, campaignId: CampaignId): Promise<WordProblemAdventureProgress | null> {
    const key = `${LS_PREFIX}word_problem_progress_${playerId}_${campaignId}`;
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  // GEOMETRY & MEASUREMENT KINGDOM PROGRESS
  async saveGeometryMeasurementProgress(progress: GeometryMeasurementKingdomProgress): Promise<void> {
    const key = `${LS_PREFIX}geometry_progress_${progress.playerId}_${progress.campaignId}`;
    safeSetItem(key, JSON.stringify(progress));
  }

  async getGeometryMeasurementProgress(playerId: string, campaignId: CampaignId): Promise<GeometryMeasurementKingdomProgress | null> {
    const key = `${LS_PREFIX}geometry_progress_${playerId}_${campaignId}`;
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  // NUMBER SENSE & MENTAL MATH KINGDOM PROGRESS
  async saveNumberSenseProgress(progress: NumberSenseKingdomProgress): Promise<void> {
    const key = `${LS_PREFIX}number_sense_progress_${progress.playerId}_${progress.campaignId}`;
    safeSetItem(key, JSON.stringify(progress));
  }

  async getNumberSenseProgress(playerId: string, campaignId: CampaignId): Promise<NumberSenseKingdomProgress | null> {
    const key = `${LS_PREFIX}number_sense_progress_${playerId}_${campaignId}`;
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  // FRACTIONS KINGDOM PROGRESS
  async saveFractionProgress(progress: FractionKingdomProgress): Promise<void> {
    const key = `${LS_PREFIX}fraction_progress_${progress.campaignId}`;
    safeSetItem(key, JSON.stringify(progress));
  }

  async getFractionProgress(campaignId: CampaignId): Promise<FractionKingdomProgress | null> {
    const key = `${LS_PREFIX}fraction_progress_${campaignId}`;
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  // TIME & CALENDAR KINGDOM PROGRESS
  async saveTimeProgress(progress: TimeKingdomProgress): Promise<void> {
    const key = `${LS_PREFIX}time_progress_${progress.campaignId}`;
    safeSetItem(key, JSON.stringify(progress));
  }

  async getTimeProgress(campaignId: CampaignId): Promise<TimeKingdomProgress | null> {
    const key = `${LS_PREFIX}time_progress_${campaignId}`;
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  // GENERIC CUSTOM DATA PERSISTENCE (Used by Money & Shopping, Time, etc.)
  async saveCustomData<T>(key: string, data: T): Promise<void> {
    const fullKey = `${LS_PREFIX}${key}`;
    safeSetItem(fullKey, JSON.stringify(data));
  }

  async getCustomData<T>(key: string): Promise<T | null> {
    const fullKey = `${LS_PREFIX}${key}`;
    const raw = safeGetItem(fullKey);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  // RESET PROGRESS FOR A CAMPAIGN
  async resetCampaignProgress(playerId: string, campaignId: CampaignId): Promise<PlayerProgress> {
    const newProgress = createDefaultProgress(playerId, campaignId);
    await this.saveCampaignProgress(newProgress);
    return newProgress;
  }

  // EXPORT / BACKUP ALL USER DATA (Phase 22 Polish)
  exportBackupData(): string {
    const backupObj: Record<string, string> = {};
    if (typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LS_PREFIX)) {
          const val = localStorage.getItem(key);
          if (val) backupObj[key] = val;
        }
      }
    } else {
      for (const [k, v] of Object.entries(memoryFallbackStorage)) {
        if (k.startsWith(LS_PREFIX)) {
          backupObj[k] = v;
        }
      }
    }
    const payload = {
      schemaVersion: '22.0.0',
      appName: 'TONY_MATH_HERO',
      exportedAt: new Date().toISOString(),
      keysCount: Object.keys(backupObj).length,
      data: backupObj,
    };
    return JSON.stringify(payload, null, 2);
  }

  // IMPORT / RESTORE BACKUP DATA (Phase 22 Polish)
  importBackupData(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.data || typeof parsed.data !== 'object') {
        return { success: false, message: 'Tệp sao lưu không đúng định dạng JSON chuẩn của Tony Math Hero.' };
      }
      let restoredCount = 0;
      for (const [k, v] of Object.entries(parsed.data)) {
        if (typeof k === 'string' && typeof v === 'string' && k.startsWith(LS_PREFIX)) {
          safeSetItem(k, v);
          restoredCount++;
        }
      }
      return {
        success: true,
        message: `Khôi phục thành công ${restoredCount} mục dữ liệu (Phiên bản ${parsed.schemaVersion || '22.0.0'})!`,
      };
    } catch (e: any) {
      return { success: false, message: `Lỗi đọc tệp sao lưu: ${e?.message || 'Dữ liệu bị hỏng'}` };
    }
  }

  // DOWNLOAD BACKUP FILE
  triggerDownloadBackupFile(): void {
    if (typeof window === 'undefined') return;
    const jsonStr = this.exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.href = url;
    link.download = `tony-math-hero-backup-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // CLEAR ALL DATA
  async clearAllData(): Promise<void> {
    try {
      const db = await getDatabase();
      if (db) {
        await db.clear('players');
        await db.clear('campaign_progress');
        await db.clear('settings');
        await db.clear('active_session');
      }
    } catch (e) {
      console.warn('Clear IndexedDB failed:', e);
    }
    // Clear LS
    if (typeof window !== 'undefined' && window.localStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LS_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } else {
      for (const k of Object.keys(memoryFallbackStorage)) {
        if (k.startsWith(LS_PREFIX)) {
          delete memoryFallbackStorage[k];
        }
      }
    }
  }
}

export const persistenceService = new PersistenceService();

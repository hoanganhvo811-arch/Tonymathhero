import { create } from 'zustand';
import type {
  GeometryMeasurementKingdomProgress,
  GeometryAchievement,
  GeometryAttemptRecord,
  GeometryErrorType,
  ShapePropertyInfo,
  MeasurementToolTask,
} from '../../types/geometryMeasurement';
import type { CampaignGrade } from '../../types/campaign';
import { SHAPES_CATALOG } from './data/shapesCatalog';
import { MEASUREMENT_TASKS, SPATIAL_MAZE_TASKS } from './data/measurementToolsCatalog';
import { INITIAL_GEOMETRY_ACHIEVEMENTS } from './data/geometryAchievementsCatalog';
import { GEOMETRY_PUZZLES_CATALOG, type GeometryPuzzle } from './data/geometryPuzzlesCatalog';
import { REAL_LIFE_GEOMETRY_QUESTS, type RealLifeGeometryQuest } from './data/geometryQuestsCatalog';
import { GeometryAdaptiveEngine } from './services/geometryAdaptiveEngine';
import { persistenceService } from '../../services/persistence/persistenceService';

export type GeometryKingdomZone = 'castle' | 'garden' | 'lab' | 'tower' | 'space' | 'arena';

interface GeometryMeasurementState {
  // Navigation & Grade
  activeZone: GeometryKingdomZone;
  campaignId: CampaignGrade;
  playerId: string;
  setActiveZone: (zone: GeometryKingdomZone) => void;
  setCampaignId: (grade: CampaignGrade) => void;

  // Shapes & 3D Viewer
  selectedShape: ShapePropertyInfo;
  exploredShapeIds: string[];
  selectShape: (shapeId: string) => void;
  markShapeExplored: (shapeId: string) => void;
  speakShapeIntro: (text: string) => void;

  // Measurement Lab State
  activeMeasurementTask: MeasurementToolTask;
  rulerUserValue: number;
  rulerOffset: number;
  scalePlacedWeights: { weight: number; label: string }[];
  beakerVolumeMl: number;
  clockHour: number;
  clockMinute: number;
  toolFeedback: { message: string; isSuccess?: boolean } | null;

  setRulerUserValue: (val: number) => void;
  setRulerOffset: (val: number) => void;
  addScaleWeight: (weight: number, label: string) => void;
  removeScaleWeight: (index: number) => void;
  resetScale: () => void;
  pourBeaker: (amountMl: number) => void;
  resetBeaker: () => void;
  setClockTime: (hour: number, minute: number) => void;
  selectMeasurementTask: (taskId: string) => void;
  submitMeasurementCheck: () => boolean;

  // Spatial Maze State
  activeMazeIndex: number;
  mazePlayerPos: { x: number; y: number };
  mazeCommands: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[];
  mazeFeedback: string | null;
  moveMaze: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  resetMaze: () => void;

  // Real-life Quests State
  activeQuest: RealLifeGeometryQuest | null;
  questStep: number;
  solvedQuestIds: string[];
  startQuest: (questId: string) => void;
  answerQuestStep: (answer: string | number) => boolean;

  // Puzzles
  solvedPuzzleIds: string[];
  currentPuzzle: GeometryPuzzle;
  nextAdaptivePuzzle: () => void;
  submitPuzzleAnswer: (answer: string) => boolean;

  // Arena Battle vs Giga Geometricus
  bossHp: number;
  bossMaxHp: number;
  tonyHp: number;
  tonyMaxHp: number;
  battleLog: string[];
  isBattleVictory: boolean;
  attackBoss: (isSuccess: boolean, moveNameVi: string) => void;
  resetBattle: () => void;

  // Analytics & History
  attempts: GeometryAttemptRecord[];
  achievements: GeometryAchievement[];
  totalExp: number;
  totalGold: number;

  // Progress Loading & Saving
  loadProgress: (playerId: string, campaignId: CampaignGrade) => Promise<void>;
  saveProgress: () => Promise<void>;
}

export const useGeometryMeasurementStore = create<GeometryMeasurementState>((set, get) => ({
  activeZone: 'castle',
  campaignId: 'grade-2',
  playerId: 'student_tony_hero',

  setActiveZone: (zone) => {
    set({ activeZone: zone, toolFeedback: null });
    get().saveProgress();
  },

  setCampaignId: (grade) => {
    set({ campaignId: grade });
    get().loadProgress(get().playerId, grade);
  },

  // Shapes Viewer
  selectedShape: SHAPES_CATALOG[0],
  exploredShapeIds: ['shape_square'],

  selectShape: (shapeId) => {
    const found = SHAPES_CATALOG.find((s) => s.id === shapeId);
    if (found) {
      set((state) => ({
        selectedShape: found,
        exploredShapeIds: state.exploredShapeIds.includes(shapeId)
          ? state.exploredShapeIds
          : [...state.exploredShapeIds, shapeId],
      }));
      get().saveProgress();
    }
  },

  markShapeExplored: (shapeId) => {
    set((state) => {
      const updated = state.exploredShapeIds.includes(shapeId)
        ? state.exploredShapeIds
        : [...state.exploredShapeIds, shapeId];
      // Check shape master achievement
      const ach = state.achievements.map((a) => {
        if (a.id === 'geo_shape_master') {
          const prog = updated.length;
          return { ...a, progress: prog, unlocked: prog >= a.maxProgress };
        }
        return a;
      });
      return { exploredShapeIds: updated, achievements: ach };
    });
    get().saveProgress();
  },

  speakShapeIntro: (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  },

  // Measurement Lab
  activeMeasurementTask: MEASUREMENT_TASKS[0],
  rulerUserValue: 0,
  rulerOffset: 0,
  scalePlacedWeights: [],
  beakerVolumeMl: 0,
  clockHour: 12,
  clockMinute: 0,
  toolFeedback: null,

  setRulerUserValue: (val) => set({ rulerUserValue: val }),
  setRulerOffset: (val) => set({ rulerOffset: val }),
  addScaleWeight: (weight, label) =>
    set((state) => ({
      scalePlacedWeights: [...state.scalePlacedWeights, { weight, label }],
    })),
  removeScaleWeight: (index) =>
    set((state) => ({
      scalePlacedWeights: state.scalePlacedWeights.filter((_, i) => i !== index),
    })),
  resetScale: () => set({ scalePlacedWeights: [], toolFeedback: null }),
  pourBeaker: (amountMl) =>
    set((state) => {
      const max = state.activeMeasurementTask.beakerConfig?.maxCapacityMl || 6000;
      const nextVol = Math.min(max, state.beakerVolumeMl + amountMl);
      return { beakerVolumeMl: nextVol };
    }),
  resetBeaker: () => set({ beakerVolumeMl: 0, toolFeedback: null }),
  setClockTime: (hour, minute) => set({ clockHour: hour, clockMinute: minute }),

  selectMeasurementTask: (taskId) => {
    const task = MEASUREMENT_TASKS.find((t) => t.id === taskId) || MEASUREMENT_TASKS[0];
    set({
      activeMeasurementTask: task,
      rulerUserValue: 0,
      rulerOffset: task.rulerConfig?.startOffsetCm || 0,
      scalePlacedWeights: [],
      beakerVolumeMl: 0,
      clockHour: 12,
      clockMinute: 0,
      toolFeedback: null,
    });
  },

  submitMeasurementCheck: () => {
    const state = get();
    const task = state.activeMeasurementTask;
    let isSuccess = false;
    let errorType: GeometryErrorType = 'NONE';
    let feedback = '';

    if (task.type === 'length' && task.rulerConfig) {
      const diag = GeometryAdaptiveEngine.diagnoseRulerAttempt(
        task.rulerConfig.itemLengthCm,
        state.rulerOffset,
        state.rulerUserValue
      );
      isSuccess = diag.isSuccess;
      errorType = diag.errorType;
      feedback = diag.feedbackVi;
    } else if (task.type === 'mass' && task.scaleConfig) {
      const totalWeight = state.scalePlacedWeights.reduce((sum, w) => sum + w.weight, 0);
      const diag = GeometryAdaptiveEngine.diagnoseScaleAttempt(
        task.scaleConfig.itemWeightGrams,
        totalWeight
      );
      isSuccess = diag.isSuccess;
      errorType = diag.errorType;
      feedback = diag.feedbackVi;
    } else if (task.type === 'capacity' && task.beakerConfig) {
      const diag = GeometryAdaptiveEngine.diagnoseBeakerAttempt(
        task.beakerConfig.targetCapacityMl,
        state.beakerVolumeMl
      );
      isSuccess = diag.isSuccess;
      errorType = diag.errorType;
      feedback = diag.feedbackVi;
    } else if (task.type === 'time' && task.clockConfig) {
      const diag = GeometryAdaptiveEngine.diagnoseClockAttempt(
        task.clockConfig.targetHour,
        task.clockConfig.targetMinute,
        state.clockHour,
        state.clockMinute
      );
      isSuccess = diag.isSuccess;
      errorType = diag.errorType;
      feedback = diag.feedbackVi;
    }

    const record: GeometryAttemptRecord = {
      id: `att_${Date.now()}`,
      taskId: task.id,
      category: 'measurement',
      timestamp: new Date().toISOString(),
      gradeLevel: state.campaignId === 'grade-3' ? 'grade-3' : 'grade-2',
      isSuccess,
      errorType,
      timeSpentSeconds: 15,
      details: feedback,
    };

    set((s) => {
      const newAttempts = [...s.attempts, record];
      const newExp = isSuccess ? s.totalExp + 40 : s.totalExp;
      const newGold = isSuccess ? s.totalGold + 20 : s.totalGold;
      // Update achievements
      const ach = s.achievements.map((a) => {
        if (isSuccess && a.id === 'geo_precision_ruler' && task.type === 'length') {
          const p = Math.min(a.maxProgress, a.progress + 1);
          return { ...a, progress: p, unlocked: p >= a.maxProgress };
        }
        if (isSuccess && a.id === 'geo_balance_expert' && task.type === 'mass') {
          const p = Math.min(a.maxProgress, a.progress + 1);
          return { ...a, progress: p, unlocked: p >= a.maxProgress };
        }
        if (isSuccess && a.id === 'geo_time_keeper' && task.type === 'time') {
          const p = Math.min(a.maxProgress, a.progress + 1);
          return { ...a, progress: p, unlocked: p >= a.maxProgress };
        }
        return a;
      });

      return {
        attempts: newAttempts,
        totalExp: newExp,
        totalGold: newGold,
        achievements: ach,
        toolFeedback: { message: feedback, isSuccess },
      };
    });

    get().saveProgress();
    return isSuccess;
  },

  // Spatial Maze
  activeMazeIndex: 0,
  mazePlayerPos: { x: 0, y: 0 },
  mazeCommands: [],
  mazeFeedback: null,

  moveMaze: (dir) => {
    const state = get();
    const task = SPATIAL_MAZE_TASKS[state.activeMazeIndex];
    let nextX = state.mazePlayerPos.x;
    let nextY = state.mazePlayerPos.y;

    if (dir === 'UP') nextY--;
    else if (dir === 'DOWN') nextY++;
    else if (dir === 'LEFT') nextX--;
    else if (dir === 'RIGHT') nextX++;

    // Check bounds
    if (nextX < 0 || nextX >= task.gridSize.cols || nextY < 0 || nextY >= task.gridSize.rows) {
      set({ mazeFeedback: 'Không thể đi ra ngoài tường thành!' });
      return;
    }

    // Check obstacle
    const hitObstacle = task.obstacles.some((o) => o.x === nextX && o.y === nextY);
    if (hitObstacle) {
      set({ mazeFeedback: 'Cẩn thận! Đụng phải cạm bẫy đá gai! Hãy đổi hướng khác.' });
      return;
    }

    const nextPos = { x: nextX, y: nextY };
    const nextCommands = [...state.mazeCommands, dir];
    const isTarget = nextX === task.targetPos.x && nextY === task.targetPos.y;

    if (isTarget) {
      set((s) => ({
        mazePlayerPos: nextPos,
        mazeCommands: nextCommands,
        mazeFeedback: '🎉 CHÚC MỪNG! Tony đã tìm thấy kho báu ma thuật!',
        totalExp: s.totalExp + 60,
        totalGold: s.totalGold + 30,
        achievements: s.achievements.map((a) => {
          if (a.id === 'geo_maze_navigator') {
            const p = Math.min(a.maxProgress, a.progress + 1);
            return { ...a, progress: p, unlocked: p >= a.maxProgress };
          }
          return a;
        }),
      }));
      get().saveProgress();
    } else {
      set({
        mazePlayerPos: nextPos,
        mazeCommands: nextCommands,
        mazeFeedback: `Đã di chuyển về hướng ${dir}!`,
      });
    }
  },

  resetMaze: () => {
    const task = SPATIAL_MAZE_TASKS[get().activeMazeIndex];
    set({
      mazePlayerPos: { ...task.startPos },
      mazeCommands: [],
      mazeFeedback: null,
    });
  },

  // Real-life Quests
  activeQuest: REAL_LIFE_GEOMETRY_QUESTS[0],
  questStep: 0,
  solvedQuestIds: [],

  startQuest: (questId) => {
    const q = REAL_LIFE_GEOMETRY_QUESTS.find((item) => item.id === questId);
    if (q) {
      set({ activeQuest: q, questStep: 0 });
    }
  },

  answerQuestStep: (answer) => {
    const state = get();
    if (!state.activeQuest) return false;
    const currentStepObj = state.activeQuest.taskSteps[state.questStep];
    const isCorrect = String(answer).trim() === String(currentStepObj.correctAnswer).trim();

    if (isCorrect) {
      if (state.questStep + 1 < state.activeQuest.taskSteps.length) {
        set({ questStep: state.questStep + 1 });
      } else {
        // Quest finished!
        const questId = state.activeQuest.id;
        set((s) => ({
          solvedQuestIds: s.solvedQuestIds.includes(questId)
            ? s.solvedQuestIds
            : [...s.solvedQuestIds, questId],
          totalExp: s.totalExp + (s.activeQuest?.rewardXp || 100),
          totalGold: s.totalGold + (s.activeQuest?.rewardGold || 50),
        }));
        get().saveProgress();
      }
    }
    return isCorrect;
  },

  // Puzzles
  solvedPuzzleIds: [],
  currentPuzzle: GEOMETRY_PUZZLES_CATALOG[0],

  nextAdaptivePuzzle: () => {
    const state = get();
    const grade = state.campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
    const nextP = GeometryAdaptiveEngine.selectAdaptivePuzzle(
      GEOMETRY_PUZZLES_CATALOG,
      state.solvedPuzzleIds,
      grade
    );
    set({ currentPuzzle: nextP });
  },

  submitPuzzleAnswer: (answer) => {
    const state = get();
    const p = state.currentPuzzle;
    const isCorrect = answer === p.correctAnswer;

    const record: GeometryAttemptRecord = {
      id: `puzzle_att_${Date.now()}`,
      taskId: p.id,
      category: 'puzzle',
      timestamp: new Date().toISOString(),
      gradeLevel: p.gradeLevel,
      isSuccess: isCorrect,
      errorType: isCorrect ? 'NONE' : 'WRONG_SHAPE_IDENTIFIED',
      timeSpentSeconds: 20,
      details: isCorrect ? 'Đúng' : `Chọn sai: ${answer}`,
    };

    set((s) => {
      const newAttempts = [...s.attempts, record];
      const newSolved = isCorrect && !s.solvedPuzzleIds.includes(p.id)
        ? [...s.solvedPuzzleIds, p.id]
        : s.solvedPuzzleIds;
      return {
        attempts: newAttempts,
        solvedPuzzleIds: newSolved,
        totalExp: isCorrect ? s.totalExp + 25 : s.totalExp,
        totalGold: isCorrect ? s.totalGold + 15 : s.totalGold,
      };
    });

    get().saveProgress();
    return isCorrect;
  },

  // Arena Battle vs Giga Geometricus
  bossHp: 300,
  bossMaxHp: 300,
  tonyHp: 100,
  tonyMaxHp: 100,
  battleLog: ['⚔️ Ma Vương Hình Khối Giga Geometricus xuất hiện với giáp đá đa diện!'],
  isBattleVictory: false,

  attackBoss: (isSuccess, moveNameVi) => {
    set((state) => {
      if (isSuccess) {
        const damage = 75;
        const newBossHp = Math.max(0, state.bossHp - damage);
        const victory = newBossHp === 0;
        const logs = [
          ...state.battleLog,
          `✨ Tony tung tuyệt chiêu [${moveNameVi}] chính xác! Gây ${damage} sát thương lên Boss!`,
        ];

        let achievements = state.achievements;
        if (victory) {
          logs.push('🏆 CHIẾN THẮNG VANG DỘI! Ma Vương Hình Khối đã bị khuất phục hoàn toàn!');
          achievements = achievements.map((a) =>
            a.id === 'geo_arena_champion' ? { ...a, progress: 1, unlocked: true } : a
          );
        }

        return {
          bossHp: newBossHp,
          isBattleVictory: victory,
          battleLog: logs,
          totalExp: victory ? state.totalExp + 250 : state.totalExp,
          totalGold: victory ? state.totalGold + 120 : state.totalGold,
          achievements,
        };
      } else {
        const bossDmg = 15;
        const newTonyHp = Math.max(10, state.tonyHp - bossDmg);
        return {
          tonyHp: newTonyHp,
          battleLog: [
            ...state.battleLog,
            `⚠️ Phép đo chưa chuẩn! Giga Geometricus phản đòn gây ${bossDmg} sát thương! Hãy cố lên Tony!`,
          ],
        };
      }
    });

    get().saveProgress();
  },

  resetBattle: () => {
    set({
      bossHp: 300,
      tonyHp: 100,
      battleLog: ['⚔️ Thử thách Đấu trường Hình học & Đo lường khởi động lại!'],
      isBattleVictory: false,
    });
  },

  // Analytics & History
  attempts: [],
  achievements: INITIAL_GEOMETRY_ACHIEVEMENTS,
  totalExp: 0,
  totalGold: 0,

  // Load and save progress
  loadProgress: async (playerId, campaignId) => {
    try {
      const saved = await persistenceService.getGeometryMeasurementProgress(
        playerId,
        campaignId === 'grade-3' ? 'grade-3' : 'grade-2'
      );
      if (saved) {
        set({
          activeZone: saved.currentZone || 'castle',
          exploredShapeIds: saved.exploredShapes || ['shape_square'],
          solvedPuzzleIds: saved.solvedPuzzleIds || [],
          solvedQuestIds: saved.solvedTasks || [],
          attempts: saved.attempts || [],
          achievements: saved.achievements && saved.achievements.length > 0 ? saved.achievements : INITIAL_GEOMETRY_ACHIEVEMENTS,
          totalExp: saved.totalExpEarned || 0,
          totalGold: saved.totalGoldEarned || 0,
        });
      }
    } catch (e) {
      console.warn('Failed to load Geometry & Measurement progress:', e);
    }
  },

  saveProgress: async () => {
    const state = get();
    const progressData: GeometryMeasurementKingdomProgress = {
      playerId: state.playerId,
      campaignId: state.campaignId === 'grade-3' ? 'grade-3' : 'grade-2',
      currentZone: state.activeZone,
      exploredShapes: state.exploredShapeIds,
      solvedTasks: state.solvedQuestIds,
      solvedPuzzleIds: state.solvedPuzzleIds,
      defeatedBosses: state.isBattleVictory ? ['giga_geometricus'] : [],
      attempts: state.attempts,
      achievements: state.achievements,
      totalExpEarned: state.totalExp,
      totalGoldEarned: state.totalGold,
      lastUpdated: new Date().toISOString(),
    };
    try {
      await persistenceService.saveGeometryMeasurementProgress(progressData);
    } catch (e) {
      console.warn('Failed to save Geometry & Measurement progress:', e);
    }
  },
}));

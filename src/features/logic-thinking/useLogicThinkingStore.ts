import { create } from 'zustand';
import {
  LogicZone,
  LogicSkillId,
  LogicAttemptRecord,
  LogicKingdomProgress,
  PatternTask,
  NumberLogicTask,
  ShapeLogicTask,
  MazeLevel,
  DeductiveMysteryTask,
  NumberCodeLevel,
  LogicGuardianPhase,
  LogicGuardianSpellQuestion,
  LogicAchievement,
} from '../../types';
import { PATTERN_TASKS_CATALOG } from './data/patternTasksCatalog';
import { NUMBER_LOGIC_CATALOG } from './data/numberLogicCatalog';
import { SHAPE_LOGIC_CATALOG } from './data/shapeLogicCatalog';
import { MAZE_LEVELS_CATALOG } from './data/mazeLevelsCatalog';
import { DEDUCTIVE_MYSTERY_CATALOG } from './data/deductiveMysteryCatalog';
import { NUMBER_CODE_CATALOG } from './data/numberCodeCatalog';
import { LOGIC_GUARDIAN_PHASES, LOGIC_GUARDIAN_SPELLS } from './data/logicGuardianCatalog';
import { LOGIC_ACHIEVEMENTS_CATALOG } from './data/logicAchievementsCatalog';
import { LogicAdaptiveEngine } from './services/logicAdaptiveEngine';
import { persistenceService } from '../../services/persistence/persistenceService';

const PERSISTENCE_KEY = 'logic_kingdom_progress_v1';
const ATTEMPTS_KEY = 'logic_kingdom_attempts_v1';

export interface LogicThinkingState {
  currentGrade: 'grade-2' | 'grade-3';
  activeZone: LogicZone;
  setGrade: (grade: 'grade-2' | 'grade-3') => void;
  setActiveZone: (zone: LogicZone) => void;

  // Question Indices
  patternIndex: number;
  numberLogicIndex: number;
  shapeLogicIndex: number;
  deductiveIndex: number;
  taskFeedback: {
    isCorrect?: boolean;
    message: string;
    explanation?: string;
  } | null;

  // Task Actions
  nextPatternTask: () => void;
  nextNumberLogicTask: () => void;
  nextShapeLogicTask: () => void;
  nextDeductiveTask: () => void;
  answerTask: (
    category: 'pattern' | 'number_logic' | 'shape_logic' | 'deductive',
    selectedIdx: number
  ) => boolean;

  // Maze State
  currentMazeIndex: number;
  mazePlayerPos: { row: number; col: number };
  mazeKeysCollected: number;
  mazeDoorUnlocked: boolean;
  mazeSteps: number;
  mazeStatus: 'playing' | 'won' | 'blocked';
  moveMazePlayer: (dir: 'up' | 'down' | 'left' | 'right') => void;
  resetMaze: () => void;
  nextMaze: () => void;

  // Number Code State
  currentCodeIndex: number;
  codeEnteredDigits: string[];
  codeGuessFeedback: {
    isCorrect?: boolean;
    message: string;
    wellPlaced?: number;
    wrongPlace?: number;
  } | null;
  setCodeDigit: (index: number, digit: string) => void;
  verifyCodeGuess: () => boolean;
  selectCodeDirectOption: (optionIdx: number) => boolean;
  nextCodeLevel: () => void;

  // Boss Battle State
  bossPhaseIndex: number;
  bossCurrentHp: number;
  bossMaxHp: number;
  bossSpellIndex: number;
  bossBattleStatus: 'in_progress' | 'phase_won' | 'victory';
  bossFeedback: {
    isCorrect?: boolean;
    message: string;
    damageDealt?: number;
  } | null;
  answerBossSpell: (optionIndex: number) => boolean;
  nextBossPhase: () => void;
  resetBossBattle: () => void;

  // Progression & Attempts
  progress: LogicKingdomProgress;
  attempts: LogicAttemptRecord[];
  unlockAchievement: (id: string) => void;
  saveProgress: () => void;
}

const initialProgress: LogicKingdomProgress = {
  completedTasks: [],
  clearedMazeLevels: [],
  crackedCodes: [],
  bossDefeatedPhases: [],
  unlockedAchievements: [],
  totalPuzzlesSolved: 0,
  totalMazesSolved: 0,
};

export const useLogicThinkingStore = create<LogicThinkingState>((set, get) => {
  // Load initial saved data synchronously if available
  let loadedProg = initialProgress;
  let loadedAttempts: LogicAttemptRecord[] = [];
  try {
    if (typeof window !== 'undefined') {
      const rawP = localStorage.getItem(`tmh_${PERSISTENCE_KEY}`);
      if (rawP) loadedProg = { ...initialProgress, ...JSON.parse(rawP) };
      const rawA = localStorage.getItem(`tmh_${ATTEMPTS_KEY}`);
      if (rawA) loadedAttempts = JSON.parse(rawA);
    }
  } catch {
    // ignore
  }

  const initialMaze = MAZE_LEVELS_CATALOG[0];

  return {
    currentGrade: 'grade-2',
    activeZone: 'pattern',
    progress: loadedProg,
    attempts: loadedAttempts,
    setGrade: (grade) => {
      set({
        currentGrade: grade,
        patternIndex: 0,
        numberLogicIndex: 0,
        shapeLogicIndex: 0,
        deductiveIndex: 0,
        currentMazeIndex: 0,
        currentCodeIndex: 0,
        taskFeedback: null,
      });
      get().resetMaze();
    },
    setActiveZone: (zone) => set({ activeZone: zone, taskFeedback: null }),

    // Indices
    patternIndex: 0,
    numberLogicIndex: 0,
    shapeLogicIndex: 0,
    deductiveIndex: 0,
    taskFeedback: null,

    // Task Actions
    nextPatternTask: () => {
      const grade = get().currentGrade;
      const tasks = PATTERN_TASKS_CATALOG.filter((t) => t.gradeLevel === grade);
      set((state) => ({
        patternIndex: (state.patternIndex + 1) % tasks.length,
        taskFeedback: null,
      }));
    },

    nextNumberLogicTask: () => {
      const grade = get().currentGrade;
      const tasks = NUMBER_LOGIC_CATALOG.filter((t) => t.gradeLevel === grade);
      set((state) => ({
        numberLogicIndex: (state.numberLogicIndex + 1) % tasks.length,
        taskFeedback: null,
      }));
    },

    nextShapeLogicTask: () => {
      const grade = get().currentGrade;
      const tasks = SHAPE_LOGIC_CATALOG.filter((t) => t.gradeLevel === grade);
      set((state) => ({
        shapeLogicIndex: (state.shapeLogicIndex + 1) % tasks.length,
        taskFeedback: null,
      }));
    },

    nextDeductiveTask: () => {
      const grade = get().currentGrade;
      const tasks = DEDUCTIVE_MYSTERY_CATALOG.filter((t) => t.gradeLevel === grade);
      set((state) => ({
        deductiveIndex: (state.deductiveIndex + 1) % tasks.length,
        taskFeedback: null,
      }));
    },

    answerTask: (category, selectedIdx) => {
      const {
        currentGrade,
        patternIndex,
        numberLogicIndex,
        shapeLogicIndex,
        deductiveIndex,
        progress,
        attempts,
      } = get();

      let task: PatternTask | NumberLogicTask | ShapeLogicTask | DeductiveMysteryTask;
      let targetSkill: LogicSkillId;

      if (category === 'pattern') {
        const list = PATTERN_TASKS_CATALOG.filter((t) => t.gradeLevel === currentGrade);
        task = list[patternIndex % list.length];
        targetSkill = task.targetSkill;
      } else if (category === 'number_logic') {
        const list = NUMBER_LOGIC_CATALOG.filter((t) => t.gradeLevel === currentGrade);
        task = list[numberLogicIndex % list.length];
        targetSkill = task.targetSkill;
      } else if (category === 'shape_logic') {
        const list = SHAPE_LOGIC_CATALOG.filter((t) => t.gradeLevel === currentGrade);
        task = list[shapeLogicIndex % list.length];
        targetSkill = task.targetSkill;
      } else {
        const list = DEDUCTIVE_MYSTERY_CATALOG.filter((t) => t.gradeLevel === currentGrade);
        task = list[deductiveIndex % list.length];
        targetSkill = task.targetSkill;
      }

      const isSuccess = selectedIdx === task.correctIndex;
      const selectedAnswer = task.options[selectedIdx] || '';
      const correctAnswer = task.options[task.correctIndex];

      const errorType = LogicAdaptiveEngine.diagnoseError(
        category,
        targetSkill,
        selectedAnswer,
        correctAnswer
      );

      const record: LogicAttemptRecord = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        taskId: task.id,
        category,
        targetSkill,
        isSuccess,
        selectedAnswer,
        correctAnswer,
        errorType,
        timestamp: Date.now(),
      };

      const newAttempts = [...attempts, record];
      const newCompleted = isSuccess && !progress.completedTasks.includes(task.id)
        ? [...progress.completedTasks, task.id]
        : progress.completedTasks;

      const newProg: LogicKingdomProgress = {
        ...progress,
        completedTasks: newCompleted,
        totalPuzzlesSolved: isSuccess ? progress.totalPuzzlesSolved + 1 : progress.totalPuzzlesSolved,
      };

      // Check achievements
      if (newProg.totalPuzzlesSolved >= 3 && !newProg.unlockedAchievements.includes('ach-logic-pattern')) {
        newProg.unlockedAchievements.push('ach-logic-pattern');
      }
      if (category === 'number_logic' && isSuccess && !newProg.unlockedAchievements.includes('ach-logic-matrix')) {
        newProg.unlockedAchievements.push('ach-logic-matrix');
      }
      if (category === 'deductive' && isSuccess && !newProg.unlockedAchievements.includes('ach-logic-detective')) {
        newProg.unlockedAchievements.push('ach-logic-detective');
      }

      set({
        attempts: newAttempts,
        progress: newProg,
        taskFeedback: {
          isCorrect: isSuccess,
          message: isSuccess
            ? '🎉 Xuất sắc! Tony đã suy luận hoàn toàn chính xác!'
            : '💡 Chưa đúng rồi! Tony hãy xem kỹ lời giải thích và thử lại nhé!',
          explanation: task.explanationVi,
        },
      });

      get().saveProgress();
      return isSuccess;
    },

    // Maze Implementation
    currentMazeIndex: 0,
    mazePlayerPos: { row: initialMaze.playerStart.row, col: initialMaze.playerStart.col },
    mazeKeysCollected: 0,
    mazeDoorUnlocked: false,
    mazeSteps: 0,
    mazeStatus: 'playing',

    resetMaze: () => {
      const grade = get().currentGrade;
      const list = MAZE_LEVELS_CATALOG.filter((m) => m.gradeLevel === grade);
      const active = list[get().currentMazeIndex % list.length] || MAZE_LEVELS_CATALOG[0];

      set({
        mazePlayerPos: { row: active.playerStart.row, col: active.playerStart.col },
        mazeKeysCollected: 0,
        mazeDoorUnlocked: false,
        mazeSteps: 0,
        mazeStatus: 'playing',
      });
    },

    nextMaze: () => {
      const grade = get().currentGrade;
      const list = MAZE_LEVELS_CATALOG.filter((m) => m.gradeLevel === grade);
      set((state) => ({
        currentMazeIndex: (state.currentMazeIndex + 1) % list.length,
      }));
      get().resetMaze();
    },

    moveMazePlayer: (dir) => {
      const {
        currentGrade,
        currentMazeIndex,
        mazePlayerPos,
        mazeKeysCollected,
        mazeDoorUnlocked,
        mazeSteps,
        mazeStatus,
        progress,
        attempts,
      } = get();

      if (mazeStatus === 'won') return;

      const list = MAZE_LEVELS_CATALOG.filter((m) => m.gradeLevel === currentGrade);
      const activeMaze = list[currentMazeIndex % list.length];
      if (!activeMaze) return;

      let dRow = 0;
      let dCol = 0;
      if (dir === 'up') dRow = -1;
      if (dir === 'down') dRow = 1;
      if (dir === 'left') dCol = -1;
      if (dir === 'right') dCol = 1;

      const targetRow = mazePlayerPos.row + dRow;
      const targetCol = mazePlayerPos.col + dCol;

      // Check grid bounds
      if (
        targetRow < 0 ||
        targetRow >= activeMaze.gridSize.rows ||
        targetCol < 0 ||
        targetCol >= activeMaze.gridSize.cols
      ) {
        return;
      }

      const rowStr = activeMaze.layout[targetRow];
      const targetCell = rowStr ? rowStr[targetCol] : 'W';

      // Wall hit
      if (targetCell === 'W') {
        return;
      }

      let newKeys = mazeKeysCollected;
      let newDoorUnlocked = mazeDoorUnlocked;

      // Door
      if (targetCell === 'D') {
        if (newDoorUnlocked || newKeys >= activeMaze.requiredKeys) {
          newDoorUnlocked = true;
        } else {
          // Locked! cannot enter
          return;
        }
      }

      // Key
      if (targetCell === 'K') {
        newKeys += 1;
      }

      // Exit reached!
      if (targetCell === 'E') {
        const newProg = { ...progress };
        if (!newProg.clearedMazeLevels.includes(activeMaze.id)) {
          newProg.clearedMazeLevels.push(activeMaze.id);
          newProg.totalMazesSolved += 1;
        }
        if (!newProg.unlockedAchievements.includes('ach-logic-maze')) {
          newProg.unlockedAchievements.push('ach-logic-maze');
        }

        const record: LogicAttemptRecord = {
          id: `maze_${Date.now()}`,
          taskId: activeMaze.id,
          category: 'maze',
          targetSkill: 'spatial_reasoning',
          isSuccess: true,
          selectedAnswer: `Steps: ${mazeSteps + 1}`,
          correctAnswer: `Optimal: ${activeMaze.optimalSteps}`,
          timestamp: Date.now(),
        };

        set({
          mazePlayerPos: { row: targetRow, col: targetCol },
          mazeKeysCollected: newKeys,
          mazeDoorUnlocked: newDoorUnlocked,
          mazeSteps: mazeSteps + 1,
          mazeStatus: 'won',
          progress: newProg,
          attempts: [...attempts, record],
        });
        get().saveProgress();
        return;
      }

      set({
        mazePlayerPos: { row: targetRow, col: targetCol },
        mazeKeysCollected: newKeys,
        mazeDoorUnlocked: newDoorUnlocked,
        mazeSteps: mazeSteps + 1,
      });
    },

    // Number Code
    currentCodeIndex: 0,
    codeEnteredDigits: ['0', '0'],
    codeGuessFeedback: null,

    setCodeDigit: (idx, digit) => {
      set((state) => {
        const next = [...state.codeEnteredDigits];
        next[idx] = digit;
        return { codeEnteredDigits: next, codeGuessFeedback: null };
      });
    },

    verifyCodeGuess: () => {
      const { currentGrade, currentCodeIndex, codeEnteredDigits, progress, attempts } = get();
      const list = NUMBER_CODE_CATALOG.filter((c) => c.gradeLevel === currentGrade);
      const active = list[currentCodeIndex % list.length];
      if (!active) return false;

      const guessStr = codeEnteredDigits.join('');
      const secret = active.secretCode;
      const isSuccess = guessStr === secret;

      let wellPlaced = 0;
      let wrongPlace = 0;
      for (let i = 0; i < guessStr.length; i++) {
        if (guessStr[i] === secret[i]) {
          wellPlaced++;
        } else if (secret.includes(guessStr[i])) {
          wrongPlace++;
        }
      }

      const record: LogicAttemptRecord = {
        id: `code_${Date.now()}`,
        taskId: active.id,
        category: 'number_code',
        targetSkill: 'multi_step_problem_solving',
        isSuccess,
        selectedAnswer: guessStr,
        correctAnswer: secret,
        errorType: isSuccess ? 'NONE' : 'INVALID_DEDUCTION',
        timestamp: Date.now(),
      };

      const newProg = { ...progress };
      if (isSuccess && !newProg.crackedCodes.includes(active.id)) {
        newProg.crackedCodes.push(active.id);
        newProg.totalPuzzlesSolved += 1;
      }
      if (isSuccess && !newProg.unlockedAchievements.includes('ach-logic-codebreaker')) {
        newProg.unlockedAchievements.push('ach-logic-codebreaker');
      }

      set({
        progress: newProg,
        attempts: [...attempts, record],
        codeGuessFeedback: {
          isCorrect: isSuccess,
          wellPlaced,
          wrongPlace,
          message: isSuccess
            ? `🔓 Tuyệt đỉnh! Mật mã ${secret} đã được bẻ khóa thành công!`
            : `🔒 Chưa chính xác! Gợi ý: Có ${wellPlaced} số đúng vị trí, ${wrongPlace} số đúng nhưng sai vị trí.`,
        },
      });

      get().saveProgress();
      return isSuccess;
    },

    selectCodeDirectOption: (optionIdx) => {
      const { currentGrade, currentCodeIndex, progress, attempts } = get();
      const list = NUMBER_CODE_CATALOG.filter((c) => c.gradeLevel === currentGrade);
      const active = list[currentCodeIndex % list.length];
      if (!active) return false;

      const isSuccess = optionIdx === active.correctIndex;
      const selected = active.options[optionIdx];

      const record: LogicAttemptRecord = {
        id: `code_opt_${Date.now()}`,
        taskId: active.id,
        category: 'number_code',
        targetSkill: 'multi_step_problem_solving',
        isSuccess,
        selectedAnswer: selected,
        correctAnswer: active.secretCode,
        errorType: isSuccess ? 'NONE' : 'INVALID_DEDUCTION',
        timestamp: Date.now(),
      };

      const newProg = { ...progress };
      if (isSuccess && !newProg.crackedCodes.includes(active.id)) {
        newProg.crackedCodes.push(active.id);
        newProg.totalPuzzlesSolved += 1;
      }
      if (isSuccess && !newProg.unlockedAchievements.includes('ach-logic-codebreaker')) {
        newProg.unlockedAchievements.push('ach-logic-codebreaker');
      }

      set({
        progress: newProg,
        attempts: [...attempts, record],
        codeGuessFeedback: {
          isCorrect: isSuccess,
          message: isSuccess
            ? `🔓 Tuyệt vời! Mật mã ${active.secretCode} chính xác!`
            : `🔒 Chưa đúng! Lời giải: ${active.explanationVi}`,
        },
      });

      get().saveProgress();
      return isSuccess;
    },

    nextCodeLevel: () => {
      const grade = get().currentGrade;
      const list = NUMBER_CODE_CATALOG.filter((c) => c.gradeLevel === grade);
      const nextIdx = (get().currentCodeIndex + 1) % list.length;
      const nextLevel = list[nextIdx];
      set({
        currentCodeIndex: nextIdx,
        codeEnteredDigits: Array(nextLevel ? nextLevel.digitCount : 2).fill('0'),
        codeGuessFeedback: null,
      });
    },

    // Boss Battle
    bossPhaseIndex: 1,
    bossCurrentHp: LOGIC_GUARDIAN_PHASES[0].maxHp,
    bossMaxHp: LOGIC_GUARDIAN_PHASES[0].maxHp,
    bossSpellIndex: 0,
    bossBattleStatus: 'in_progress',
    bossFeedback: null,

    answerBossSpell: (optionIndex) => {
      const {
        bossPhaseIndex,
        bossCurrentHp,
        bossMaxHp,
        bossSpellIndex,
        currentGrade,
        progress,
        attempts,
      } = get();

      const phaseSpells = LOGIC_GUARDIAN_SPELLS.filter(
        (s) => s.phaseIndex === bossPhaseIndex && s.gradeLevel === currentGrade
      );
      // Fallback if none found for specific grade
      const spells = phaseSpells.length > 0
        ? phaseSpells
        : LOGIC_GUARDIAN_SPELLS.filter((s) => s.phaseIndex === bossPhaseIndex);

      const spell = spells[bossSpellIndex % spells.length];
      if (!spell) return false;

      const isSuccess = optionIndex === spell.correctIndex;
      const selectedAnswer = spell.options[optionIndex];
      const correctAnswer = spell.options[spell.correctIndex];

      const record: LogicAttemptRecord = {
        id: `boss_${Date.now()}`,
        taskId: spell.id,
        category: 'boss',
        targetSkill: spell.targetSkill,
        isSuccess,
        selectedAnswer,
        correctAnswer,
        errorType: isSuccess ? 'NONE' : 'INVALID_DEDUCTION',
        timestamp: Date.now(),
      };

      const newHp = isSuccess ? Math.max(0, bossCurrentHp - spell.damage) : bossCurrentHp;
      const isPhaseDefeated = newHp <= 0;

      const newProg = { ...progress };
      let newBattleStatus: 'in_progress' | 'phase_won' | 'victory' = 'in_progress';

      if (isPhaseDefeated) {
        if (!newProg.bossDefeatedPhases.includes(bossPhaseIndex)) {
          newProg.bossDefeatedPhases.push(bossPhaseIndex);
        }
        if (bossPhaseIndex >= 3) {
          newBattleStatus = 'victory';
          if (!newProg.unlockedAchievements.includes('ach-logic-conqueror')) {
            newProg.unlockedAchievements.push('ach-logic-conqueror');
          }
        } else {
          newBattleStatus = 'phase_won';
        }
      }

      set({
        bossCurrentHp: newHp,
        bossBattleStatus: newBattleStatus,
        bossSpellIndex: bossSpellIndex + 1,
        progress: newProg,
        attempts: [...attempts, record],
        bossFeedback: {
          isCorrect: isSuccess,
          damageDealt: isSuccess ? spell.damage : 0,
          message: isSuccess
            ? `💥 Đòn Trí Tuệ chính xác! Gây ${spell.damage} sát thương lên Malakor!`
            : `🛡️ Malakor đã đỡ được đòn! ${spell.explanationVi}`,
        },
      });

      get().saveProgress();
      return isSuccess;
    },

    nextBossPhase: () => {
      const nextPhaseIdx = Math.min(3, get().bossPhaseIndex + 1);
      const phaseConfig = LOGIC_GUARDIAN_PHASES[nextPhaseIdx - 1] || LOGIC_GUARDIAN_PHASES[0];

      set({
        bossPhaseIndex: nextPhaseIdx,
        bossCurrentHp: phaseConfig.maxHp,
        bossMaxHp: phaseConfig.maxHp,
        bossSpellIndex: 0,
        bossBattleStatus: 'in_progress',
        bossFeedback: null,
      });
    },

    resetBossBattle: () => {
      const p1 = LOGIC_GUARDIAN_PHASES[0];
      set({
        bossPhaseIndex: 1,
        bossCurrentHp: p1.maxHp,
        bossMaxHp: p1.maxHp,
        bossSpellIndex: 0,
        bossBattleStatus: 'in_progress',
        bossFeedback: null,
      });
    },

    unlockAchievement: (id) => {
      const { progress } = get();
      if (!progress.unlockedAchievements.includes(id)) {
        const newProg = {
          ...progress,
          unlockedAchievements: [...progress.unlockedAchievements, id],
        };
        set({ progress: newProg });
        get().saveProgress();
      }
    },

    saveProgress: () => {
      const { progress, attempts } = get();
      try {
        persistenceService.saveCustomData(PERSISTENCE_KEY, progress);
        persistenceService.saveCustomData(ATTEMPTS_KEY, attempts.slice(-100)); // keep last 100
      } catch {
        // ignore
      }
    },
  };
});

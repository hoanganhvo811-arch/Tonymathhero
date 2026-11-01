import { create } from 'zustand';
import type {
  ArenaZone,
  ArenaQuestion,
  ArenaAttemptRecord,
  ArenaProgress,
  TowerFloorConfig,
  GrandBossSpellQuestion,
  MarathonCheckpoint,
} from '@/types/advancedArena';
import type { CampaignId } from '@/types/campaign';
import { ARENA_QUESTIONS_CATALOG } from './data/arenaQuestionsCatalog';
import { MULTI_STEP_QUESTIONS_CATALOG } from './data/multiStepQuestionsCatalog';
import { STRATEGY_QUESTIONS_CATALOG } from './data/strategyQuestionsCatalog';
import { CHALLENGE_TOWER_FLOORS } from './data/towerCatalog';
import { MARATHON_CHECKPOINTS } from './data/marathonCatalog';
import { GRAND_BOSS_PHASES, GRAND_BOSS_SPELLS } from './data/grandBossCatalog';
import { ARENA_ACHIEVEMENTS } from './data/arenaAchievementsCatalog';
import {
  ArenaAdaptiveEngine,
  type AdaptiveChallengeMode,
  type ArenaDiagnosticResult,
} from './services/arenaAdaptiveEngine';
import { persistenceService } from '@/services/persistence/persistenceService';

export interface AdvancedArenaState {
  activeZone: ArenaZone | 'hub';
  campaignId: CampaignId;
  setActiveZone: (zone: ArenaZone | 'hub') => void;
  setCampaignId: (campaignId: CampaignId) => void;

  // Adaptive Mode Selector
  adaptiveMode: AdaptiveChallengeMode;
  setAdaptiveMode: (mode: AdaptiveChallengeMode) => void;

  // 1. Mixed Challenge Session
  mixedLength: 10 | 20 | 30;
  isTimed: boolean;
  timeRemainingSeconds: number;
  mixedQuestions: ArenaQuestion[];
  mixedCurrentIndex: number;
  mixedScore: number;
  mixedFeedback: { isCorrect?: boolean; message: string; diagnostic?: ArenaDiagnosticResult } | null;
  mixedSessionFinished: boolean;
  startMixedSession: (length: 10 | 20 | 30, isTimed: boolean) => void;
  answerMixedQuestion: (selectedIdx: number) => boolean;
  nextMixedQuestion: () => void;
  tickTimer: () => void;

  // 2. Multi-step Problem Session
  multiStepIndex: number;
  activeMultiStepQuestion: ArenaQuestion;
  currentStepNumber: number;
  multiStepFeedback: { isCorrect?: boolean; message: string; diagnostic?: ArenaDiagnosticResult } | null;
  answerMultiStep: (selectedIdx: number) => boolean;
  nextMultiStepQuestion: () => void;

  // 3. Strategy Challenge Session
  strategyIndex: number;
  activeStrategyQuestion: ArenaQuestion;
  strategyFeedback: { isCorrect?: boolean; message: string; diagnostic?: ArenaDiagnosticResult } | null;
  answerStrategy: (selectedIdx: number) => boolean;
  nextStrategyQuestion: () => void;

  // 4. Math Marathon Session
  marathonQuestions: ArenaQuestion[];
  marathonCurrentIndex: number;
  marathonStreak: number;
  marathonMaxStreak: number;
  marathonCheckpointsReached: number[];
  marathonFinished: boolean;
  marathonFeedback: { isCorrect?: boolean; message: string; checkpointAwarded?: string } | null;
  startMarathon: () => void;
  answerMarathonQuestion: (selectedIdx: number) => boolean;
  nextMarathonQuestion: () => void;

  // 5. Challenge Tower
  activeFloorNumber: number;
  floorQuestions: ArenaQuestion[];
  floorQuestionIndex: number;
  floorCorrectCount: number;
  floorCompleted: boolean;
  towerFeedback: { isCorrect?: boolean; message: string } | null;
  selectFloor: (floorNumber: number) => void;
  answerTowerQuestion: (selectedIdx: number) => boolean;
  nextTowerQuestion: () => void;

  // 6. Grand Boss Battle (Archmage Nexus)
  currentPhaseIndex: number;
  bossHp: number;
  bossMaxHp: number;
  tonyHp: number;
  tonyMaxHp: number;
  activeBossSpell: GrandBossSpellQuestion;
  bossSpellIndex: number;
  comboStreak: number;
  shieldActive: boolean;
  bossBattleFinished: boolean;
  bossVictory: boolean;
  bossFeedback: { isCorrect?: boolean; message: string } | null;
  answerGrandBossSpell: (selectedIdx: number) => boolean;
  restartGrandBossBattle: () => void;

  // 7. Persistence & Analytics
  attempts: ArenaAttemptRecord[];
  progress: ArenaProgress;
  recordAttempt: (record: Omit<ArenaAttemptRecord, 'id' | 'timestamp'>) => void;
  unlockAchievement: (id: string) => void;
  loadInitialState: () => Promise<void>;
}

export const useAdvancedArenaStore = create<AdvancedArenaState>((set, get) => {
  const defaultGrade: 'grade-2' | 'grade-3' = 'grade-2';

  const filterByGrade = <T extends { gradeLevel: 'grade-2' | 'grade-3' }>(
    catalog: T[],
    grade: 'grade-2' | 'grade-3'
  ) => catalog.filter((q) => q.gradeLevel === grade);

  const initialMixedPool = filterByGrade(ARENA_QUESTIONS_CATALOG, defaultGrade);
  const initialMultiSteps = filterByGrade(MULTI_STEP_QUESTIONS_CATALOG, defaultGrade);
  const initialStrategies = filterByGrade(STRATEGY_QUESTIONS_CATALOG, defaultGrade);
  const initialSpells = filterByGrade(
    GRAND_BOSS_SPELLS.filter((s) => s.phaseIndex === 1),
    defaultGrade
  );

  return {
    activeZone: 'hub',
    campaignId: 'grade-2',
    setActiveZone: (zone) => set({ activeZone: zone }),

    setCampaignId: (campaignId) => {
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const mixed = filterByGrade(ARENA_QUESTIONS_CATALOG, g);
      const multi = filterByGrade(MULTI_STEP_QUESTIONS_CATALOG, g);
      const strat = filterByGrade(STRATEGY_QUESTIONS_CATALOG, g);
      const spells = filterByGrade(
        GRAND_BOSS_SPELLS.filter((s) => s.phaseIndex === 1),
        g
      );

      set({
        campaignId,
        mixedQuestions: mixed.slice(0, 10),
        mixedCurrentIndex: 0,
        mixedScore: 0,
        mixedFeedback: null,
        mixedSessionFinished: false,
        multiStepIndex: 0,
        activeMultiStepQuestion: multi[0] || MULTI_STEP_QUESTIONS_CATALOG[0],
        multiStepFeedback: null,
        strategyIndex: 0,
        activeStrategyQuestion: strat[0] || STRATEGY_QUESTIONS_CATALOG[0],
        strategyFeedback: null,
        marathonQuestions: [...mixed].sort(() => 0.5 - Math.random()),
        marathonCurrentIndex: 0,
        marathonStreak: 0,
        marathonFinished: false,
        marathonFeedback: null,
        activeFloorNumber: 1,
        floorQuestionIndex: 0,
        floorCorrectCount: 0,
        floorCompleted: false,
        floorQuestions: mixed.slice(0, CHALLENGE_TOWER_FLOORS[0].requiredQuestions),
        towerFeedback: null,
        currentPhaseIndex: 1,
        bossHp: GRAND_BOSS_PHASES[0].maxHp,
        bossMaxHp: GRAND_BOSS_PHASES[0].maxHp,
        tonyHp: 100,
        bossSpellIndex: 0,
        activeBossSpell: spells[0] || GRAND_BOSS_SPELLS[0],
        comboStreak: 0,
        shieldActive: false,
        bossBattleFinished: false,
        bossVictory: false,
        bossFeedback: null,
      });
    },

    adaptiveMode: 'recommended',
    setAdaptiveMode: (mode) => set({ adaptiveMode: mode }),

    // 1. Mixed Challenge Session
    mixedLength: 10,
    isTimed: false,
    timeRemainingSeconds: 300,
    mixedQuestions: initialMixedPool.slice(0, 10),
    mixedCurrentIndex: 0,
    mixedScore: 0,
    mixedFeedback: null,
    mixedSessionFinished: false,

    startMixedSession: (length, isTimed) => {
      const { campaignId, adaptiveMode, attempts } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const pool = ArenaAdaptiveEngine.getAdaptiveQuestionPool(
        g,
        adaptiveMode,
        ARENA_QUESTIONS_CATALOG,
        attempts
      );

      const questions = pool.slice(0, length);
      set({
        mixedLength: length,
        isTimed,
        timeRemainingSeconds: length * 30, // 30s per question if timed
        mixedQuestions: questions,
        mixedCurrentIndex: 0,
        mixedScore: 0,
        mixedFeedback: null,
        mixedSessionFinished: false,
      });
    },

    answerMixedQuestion: (selectedIdx) => {
      const { mixedQuestions, mixedCurrentIndex, mixedScore, recordAttempt, unlockAchievement } = get();
      const currentQuestion = mixedQuestions[mixedCurrentIndex];
      if (!currentQuestion) return false;

      const isCorrect = selectedIdx === currentQuestion.correctIndex;
      const selectedOption = currentQuestion.options[selectedIdx];
      const correctOption = currentQuestion.options[currentQuestion.correctIndex];

      const diagnostic = isCorrect
        ? undefined
        : ArenaAdaptiveEngine.diagnoseError(selectedOption, correctOption, currentQuestion);

      recordAttempt({
        questionId: currentQuestion.id,
        topicId: currentQuestion.topicId,
        difficulty: currentQuestion.difficulty,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
        errorType: diagnostic?.errorType || 'NONE',
      });

      unlockAchievement('arena_challenger');

      set({
        mixedScore: isCorrect ? mixedScore + 10 : mixedScore,
        mixedFeedback: {
          isCorrect,
          message: isCorrect
            ? 'Chính xác! Tony đã giải quyết câu hỏi tổng hợp rất xuất sắc!'
            : `Chưa đúng! ${currentQuestion.explanationVi}`,
          diagnostic,
        },
      });

      return isCorrect;
    },

    nextMixedQuestion: () => {
      const { mixedCurrentIndex, mixedQuestions } = get();
      if (mixedCurrentIndex + 1 >= mixedQuestions.length) {
        set({ mixedSessionFinished: true, mixedFeedback: null });
      } else {
        set({
          mixedCurrentIndex: mixedCurrentIndex + 1,
          mixedFeedback: null,
        });
      }
    },

    tickTimer: () => {
      const { isTimed, timeRemainingSeconds, mixedSessionFinished } = get();
      if (!isTimed || mixedSessionFinished) return;
      if (timeRemainingSeconds <= 1) {
        set({ timeRemainingSeconds: 0, mixedSessionFinished: true });
      } else {
        set({ timeRemainingSeconds: timeRemainingSeconds - 1 });
      }
    },

    // 2. Multi-step Problem Session
    multiStepIndex: 0,
    activeMultiStepQuestion: initialMultiSteps[0] || MULTI_STEP_QUESTIONS_CATALOG[0],
    currentStepNumber: 1,
    multiStepFeedback: null,

    answerMultiStep: (selectedIdx) => {
      const { activeMultiStepQuestion, recordAttempt, unlockAchievement } = get();
      const isCorrect = selectedIdx === activeMultiStepQuestion.correctIndex;
      const selectedOption = activeMultiStepQuestion.options[selectedIdx];
      const correctOption = activeMultiStepQuestion.options[activeMultiStepQuestion.correctIndex];

      const diagnostic = isCorrect
        ? undefined
        : ArenaAdaptiveEngine.diagnoseError(selectedOption, correctOption, activeMultiStepQuestion);

      recordAttempt({
        questionId: activeMultiStepQuestion.id,
        topicId: activeMultiStepQuestion.topicId,
        difficulty: activeMultiStepQuestion.difficulty,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
        errorType: diagnostic?.errorType || 'NONE',
      });

      if (isCorrect) {
        unlockAchievement('multi_step_master');
      }

      set({
        multiStepFeedback: {
          isCorrect,
          message: isCorrect
            ? 'Rất xuất sắc! Tony đã hoàn thành trọn vẹn tất cả các bước của bài toán!'
            : `Chưa chính xác! ${activeMultiStepQuestion.explanationVi}`,
          diagnostic,
        },
      });

      return isCorrect;
    },

    nextMultiStepQuestion: () => {
      const { campaignId, multiStepIndex } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const questions = filterByGrade(MULTI_STEP_QUESTIONS_CATALOG, g);
      const nextIdx = (multiStepIndex + 1) % questions.length;
      set({
        multiStepIndex: nextIdx,
        activeMultiStepQuestion: questions[nextIdx],
        currentStepNumber: 1,
        multiStepFeedback: null,
      });
    },

    // 3. Strategy Challenge Session
    strategyIndex: 0,
    activeStrategyQuestion: initialStrategies[0] || STRATEGY_QUESTIONS_CATALOG[0],
    strategyFeedback: null,

    answerStrategy: (selectedIdx) => {
      const { activeStrategyQuestion, recordAttempt, unlockAchievement } = get();
      const isCorrect = selectedIdx === activeStrategyQuestion.correctIndex;
      const selectedOption = activeStrategyQuestion.options[selectedIdx];
      const correctOption = activeStrategyQuestion.options[activeStrategyQuestion.correctIndex];

      const diagnostic = isCorrect
        ? undefined
        : ArenaAdaptiveEngine.diagnoseError(selectedOption, correctOption, activeStrategyQuestion);

      recordAttempt({
        questionId: activeStrategyQuestion.id,
        topicId: activeStrategyQuestion.topicId,
        difficulty: activeStrategyQuestion.difficulty,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
        errorType: diagnostic?.errorType || 'NONE',
      });

      if (isCorrect) {
        unlockAchievement('strategy_guru');
      }

      set({
        strategyFeedback: {
          isCorrect,
          message: isCorrect
            ? 'Đỉnh cao tư duy chiến lược! Tony đã nắm bắt phương pháp giải toán rất linh hoạt!'
            : `Chưa đúng! ${activeStrategyQuestion.explanationVi}`,
          diagnostic,
        },
      });

      return isCorrect;
    },

    nextStrategyQuestion: () => {
      const { campaignId, strategyIndex } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const questions = filterByGrade(STRATEGY_QUESTIONS_CATALOG, g);
      const nextIdx = (strategyIndex + 1) % questions.length;
      set({
        strategyIndex: nextIdx,
        activeStrategyQuestion: questions[nextIdx],
        strategyFeedback: null,
      });
    },

    // 4. Math Marathon Session
    marathonQuestions: [...initialMixedPool].sort(() => 0.5 - Math.random()),
    marathonCurrentIndex: 0,
    marathonStreak: 0,
    marathonMaxStreak: 0,
    marathonCheckpointsReached: [],
    marathonFinished: false,
    marathonFeedback: null,

    startMarathon: () => {
      const { campaignId } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const pool = filterByGrade(ARENA_QUESTIONS_CATALOG, g);
      set({
        marathonQuestions: [...pool].sort(() => 0.5 - Math.random()),
        marathonCurrentIndex: 0,
        marathonStreak: 0,
        marathonFinished: false,
        marathonFeedback: null,
      });
    },

    answerMarathonQuestion: (selectedIdx) => {
      const {
        marathonQuestions,
        marathonCurrentIndex,
        marathonStreak,
        marathonMaxStreak,
        marathonCheckpointsReached,
        recordAttempt,
        unlockAchievement,
        progress,
      } = get();

      const question = marathonQuestions[marathonCurrentIndex];
      if (!question) return false;

      const isCorrect = selectedIdx === question.correctIndex;
      const selectedOption = question.options[selectedIdx];
      const correctOption = question.options[question.correctIndex];

      recordAttempt({
        questionId: question.id,
        topicId: question.topicId,
        difficulty: question.difficulty,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
      });

      if (isCorrect) {
        const newStreak = marathonStreak + 1;
        const newMaxStreak = Math.max(marathonMaxStreak, newStreak);

        // Check if hit a checkpoint
        const reachedCp = MARATHON_CHECKPOINTS.find(
          (cp) => cp.questionThreshold === newStreak && !marathonCheckpointsReached.includes(cp.checkpointIndex)
        );

        let cpAwardedMsg: string | undefined = undefined;
        let updatedCps = marathonCheckpointsReached;

        if (reachedCp) {
          updatedCps = [...marathonCheckpointsReached, reachedCp.checkpointIndex];
          cpAwardedMsg = `CHÚC MỪNG! Tony đã cán mốc ${reachedCp.titleVi}! (+${reachedCp.rewardGold} Vàng, +${reachedCp.rewardXp} XP)`;
          if (reachedCp.checkpointIndex >= 3) {
            unlockAchievement('marathon_champion');
          }
        }

        const updatedProgress = {
          ...progress,
          marathonMaxStreak: Math.max(progress.marathonMaxStreak, newMaxStreak),
          marathonHighCheckpoint: Math.max(progress.marathonHighCheckpoint, updatedCps.length),
        };
        persistenceService.saveCustomData('arena_progress', updatedProgress);

        set({
          marathonStreak: newStreak,
          marathonMaxStreak: newMaxStreak,
          marathonCheckpointsReached: updatedCps,
          progress: updatedProgress,
          marathonFeedback: {
            isCorrect: true,
            message: `Tiến lên một bước! Chuỗi đúng hiện tại: ${newStreak}`,
            checkpointAwarded: cpAwardedMsg,
          },
        });

        return true;
      } else {
        set({
          marathonStreak: 0,
          marathonFeedback: {
            isCorrect: false,
            message: `Chưa đúng! ${question.explanationVi}. Hãy giữ vững phong độ và thử lại từ vị trí hiện tại!`,
          },
        });
        return false;
      }
    },

    nextMarathonQuestion: () => {
      const { marathonCurrentIndex, marathonQuestions } = get();
      if (marathonCurrentIndex + 1 >= marathonQuestions.length) {
        set({ marathonFinished: true, marathonFeedback: null });
      } else {
        set({
          marathonCurrentIndex: marathonCurrentIndex + 1,
          marathonFeedback: null,
        });
      }
    },

    // 5. Challenge Tower
    activeFloorNumber: 1,
    floorQuestions: initialMixedPool.slice(0, CHALLENGE_TOWER_FLOORS[0].requiredQuestions),
    floorQuestionIndex: 0,
    floorCorrectCount: 0,
    floorCompleted: false,
    towerFeedback: null,

    selectFloor: (floorNumber) => {
      const { campaignId } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const floorConfig = CHALLENGE_TOWER_FLOORS.find((f) => f.floorNumber === floorNumber) || CHALLENGE_TOWER_FLOORS[0];
      const pool = filterByGrade(ARENA_QUESTIONS_CATALOG, g).filter((q) =>
        floorConfig.focusTopics.includes(q.topicId)
      );

      set({
        activeFloorNumber: floorNumber,
        floorQuestionIndex: 0,
        floorCorrectCount: 0,
        floorCompleted: false,
        floorQuestions: pool.slice(0, floorConfig.requiredQuestions),
        towerFeedback: null,
      });
    },

    answerTowerQuestion: (selectedIdx) => {
      const {
        floorQuestions,
        floorQuestionIndex,
        floorCorrectCount,
        activeFloorNumber,
        progress,
        recordAttempt,
        unlockAchievement,
      } = get();

      const question = floorQuestions[floorQuestionIndex];
      if (!question) return false;

      const isCorrect = selectedIdx === question.correctIndex;
      const selectedOption = question.options[selectedIdx];
      const correctOption = question.options[question.correctIndex];

      recordAttempt({
        questionId: question.id,
        topicId: question.topicId,
        difficulty: question.difficulty,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
      });

      const newCorrect = isCorrect ? floorCorrectCount + 1 : floorCorrectCount;
      const floorConfig = CHALLENGE_TOWER_FLOORS.find((f) => f.floorNumber === activeFloorNumber)!;
      const isFinished = floorQuestionIndex + 1 >= floorQuestions.length;
      const isFloorCleared = isFinished && newCorrect >= Math.ceil(floorConfig.requiredQuestions * 0.75);

      if (isFloorCleared) {
        const newHighest = Math.max(progress.highestTowerFloorCleared, activeFloorNumber);
        const updatedProgress = { ...progress, highestTowerFloorCleared: newHighest };
        persistenceService.saveCustomData('arena_progress', updatedProgress);

        if (activeFloorNumber >= 5) {
          unlockAchievement('tower_climber');
        }

        set({
          floorCorrectCount: newCorrect,
          floorCompleted: true,
          progress: updatedProgress,
          towerFeedback: {
            isCorrect: true,
            message: `XUẤT SẮC! Đã vượt qua ${floorConfig.nameVi}! Nhận +${floorConfig.rewardGold} Vàng & +${floorConfig.rewardXp} XP!`,
          },
        });
      } else {
        set({
          floorCorrectCount: newCorrect,
          towerFeedback: {
            isCorrect,
            message: isCorrect
              ? 'Chính xác! Năng lượng tháp đang sáng rực!'
              : `Chưa đúng! ${question.explanationVi}`,
          },
        });
      }

      return isCorrect;
    },

    nextTowerQuestion: () => {
      const { floorQuestionIndex, floorQuestions, floorCompleted } = get();
      if (floorCompleted || floorQuestionIndex + 1 >= floorQuestions.length) {
        // Floor finished
      } else {
        set({
          floorQuestionIndex: floorQuestionIndex + 1,
          towerFeedback: null,
        });
      }
    },

    // 6. Grand Boss Battle (Archmage Nexus)
    currentPhaseIndex: 1,
    bossHp: GRAND_BOSS_PHASES[0].maxHp,
    bossMaxHp: GRAND_BOSS_PHASES[0].maxHp,
    tonyHp: 100,
    tonyMaxHp: 100,
    activeBossSpell: initialSpells[0] || GRAND_BOSS_SPELLS[0],
    bossSpellIndex: 0,
    comboStreak: 0,
    shieldActive: false,
    bossBattleFinished: false,
    bossVictory: false,
    bossFeedback: null,

    answerGrandBossSpell: (selectedIdx) => {
      const {
        activeBossSpell,
        bossHp,
        tonyHp,
        currentPhaseIndex,
        comboStreak,
        shieldActive,
        campaignId,
        bossSpellIndex,
        recordAttempt,
        progress,
        unlockAchievement,
      } = get();

      const isCorrect = selectedIdx === activeBossSpell.correctIndex;
      const selectedOption = activeBossSpell.options[selectedIdx];
      const correctOption = activeBossSpell.options[activeBossSpell.correctIndex];

      recordAttempt({
        questionId: activeBossSpell.id,
        topicId: activeBossSpell.topicId,
        difficulty: 'advanced',
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
      });

      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';

      if (isCorrect) {
        const bonusDamage = comboStreak * 20;
        const totalDamage = activeBossSpell.damage + bonusDamage;
        const newBossHp = Math.max(0, bossHp - totalDamage);
        const newCombo = comboStreak + 1;
        const newShield = newCombo >= 3;

        if (newBossHp === 0) {
          // Phase defeated
          if (currentPhaseIndex < 3) {
            const nextPhase = currentPhaseIndex + 1;
            const nextConfig = GRAND_BOSS_PHASES[nextPhase - 1];
            const nextSpells = filterByGrade(
              GRAND_BOSS_SPELLS.filter((s) => s.phaseIndex === nextPhase),
              g
            );

            set({
              currentPhaseIndex: nextPhase,
              bossHp: nextConfig.maxHp,
              bossMaxHp: nextConfig.maxHp,
              tonyHp: 100,
              bossSpellIndex: 0,
              activeBossSpell: nextSpells[0] || GRAND_BOSS_SPELLS[0],
              comboStreak: newCombo,
              shieldActive: newShield,
              bossFeedback: {
                isCorrect: true,
                message: `CỰC KỲ ẤN TƯỢNG! Đã đánh bại ${GRAND_BOSS_PHASES[currentPhaseIndex - 1].phaseNameVi}! Bước vào ${nextConfig.phaseNameVi}!`,
              },
            });
          } else {
            // All 3 phases defeated! Grand Victory!
            unlockAchievement('archmage_slayer');
            const updatedPhases = Array.from(new Set([...progress.bossDefeatedPhases, 1, 2, 3]));
            const updatedProgress = { ...progress, bossDefeatedPhases: updatedPhases };
            persistenceService.saveCustomData('arena_progress', updatedProgress);

            set({
              bossHp: 0,
              bossBattleFinished: true,
              bossVictory: true,
              progress: updatedProgress,
              bossFeedback: {
                isCorrect: true,
                message: 'CHIẾN THẮNG HUY HOÀNG VĨ ĐẠI! Tony đã khắc chế toàn bộ ma thuật của Archmage Nexus và trở thành Bậc Thầy Toán Học Tối Thượng!',
              },
            });
          }
        } else {
          // Next spell in current phase
          const phaseSpells = filterByGrade(
            GRAND_BOSS_SPELLS.filter((s) => s.phaseIndex === currentPhaseIndex),
            g
          );
          const nextIdx = (bossSpellIndex + 1) % phaseSpells.length;

          set({
            bossHp: newBossHp,
            comboStreak: newCombo,
            shieldActive: newShield,
            bossSpellIndex: nextIdx,
            activeBossSpell: phaseSpells[nextIdx],
            bossFeedback: {
              isCorrect: true,
              message: `Đòn đánh chuẩn xác! Gây ${totalDamage} sát thương lên Archmage Nexus! (Combo x${newCombo})`,
            },
          });
        }
        return true;
      } else {
        const damageTaken = shieldActive ? 0 : 25;
        const newTonyHp = Math.max(0, tonyHp - damageTaken);

        if (newTonyHp === 0) {
          set({
            tonyHp: 0,
            comboStreak: 0,
            shieldActive: false,
            bossBattleFinished: true,
            bossVictory: false,
            bossFeedback: {
              isCorrect: false,
              message: 'Tony đã kiệt sức trước cơn bão ma thuật của Archmage Nexus! Hãy bấm nút Thử Lại để hồi phục!',
            },
          });
        } else {
          set({
            tonyHp: newTonyHp,
            comboStreak: 0,
            shieldActive: false,
            bossFeedback: {
              isCorrect: false,
              message: shieldActive
                ? 'Khiên phép thuật đỡ trọn đòn tấn công của Boss! Mau tính toán lại câu kế tiếp!'
                : `Tony trúng chiêu mất 25 HP! ${activeBossSpell.explanationVi}`,
            },
          });
        }
        return false;
      }
    },

    restartGrandBossBattle: () => {
      const { campaignId } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const initialPhaseSpells = filterByGrade(
        GRAND_BOSS_SPELLS.filter((s) => s.phaseIndex === 1),
        g
      );

      set({
        currentPhaseIndex: 1,
        bossHp: GRAND_BOSS_PHASES[0].maxHp,
        bossMaxHp: GRAND_BOSS_PHASES[0].maxHp,
        tonyHp: 100,
        bossSpellIndex: 0,
        activeBossSpell: initialPhaseSpells[0] || GRAND_BOSS_SPELLS[0],
        comboStreak: 0,
        shieldActive: false,
        bossBattleFinished: false,
        bossVictory: false,
        bossFeedback: null,
      });
    },

    // 7. Persistence & Analytics
    attempts: [],
    progress: {
      completedChallengesCount: 0,
      highestTowerFloorCleared: 0,
      marathonHighCheckpoint: 0,
      marathonMaxStreak: 0,
      bossDefeatedPhases: [],
      unlockedAchievements: [],
      topicMasteryMap: {
        arithmetic_place_value: { attempts: 0, correct: 0 },
        addition_subtraction: { attempts: 0, correct: 0 },
        multiplication_division: { attempts: 0, correct: 0 },
        mental_math: { attempts: 0, correct: 0 },
        word_problems: { attempts: 0, correct: 0 },
        geometry_measurement: { attempts: 0, correct: 0 },
        time_calendar: { attempts: 0, correct: 0 },
        money_shopping: { attempts: 0, correct: 0 },
        fractions: { attempts: 0, correct: 0 },
      },
    },

    recordAttempt: (record) => {
      const fullRecord: ArenaAttemptRecord = {
        ...record,
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
      };

      set((state) => {
        const updatedAttempts = [...state.attempts, fullRecord];
        persistenceService.saveCustomData('arena_attempts', updatedAttempts);

        const currentTopic = state.progress.topicMasteryMap[record.topicId] || { attempts: 0, correct: 0 };
        const updatedTopic = {
          attempts: currentTopic.attempts + 1,
          correct: record.isSuccess ? currentTopic.correct + 1 : currentTopic.correct,
        };

        const updatedProgress: ArenaProgress = {
          ...state.progress,
          completedChallengesCount: state.progress.completedChallengesCount + 1,
          topicMasteryMap: {
            ...state.progress.topicMasteryMap,
            [record.topicId]: updatedTopic,
          },
        };

        persistenceService.saveCustomData('arena_progress', updatedProgress);

        return {
          attempts: updatedAttempts,
          progress: updatedProgress,
        };
      });
    },

    unlockAchievement: (id) => {
      set((state) => {
        if (state.progress.unlockedAchievements.includes(id)) return state;
        const updated: ArenaProgress = {
          ...state.progress,
          unlockedAchievements: [...state.progress.unlockedAchievements, id],
        };
        persistenceService.saveCustomData('arena_progress', updated);
        return { progress: updated };
      });
    },

    loadInitialState: async () => {
      try {
        const savedProgress = await persistenceService.getCustomData<ArenaProgress>('arena_progress');
        const savedAttempts = await persistenceService.getCustomData<ArenaAttemptRecord[]>('arena_attempts');

        if (savedProgress) set({ progress: savedProgress });
        if (savedAttempts && Array.isArray(savedAttempts)) set({ attempts: savedAttempts });
      } catch (e) {
        console.warn('Failed to load initial arena state:', e);
      }
    },
  };
});

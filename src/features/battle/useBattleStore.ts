import { create } from 'zustand';
import type { BattleActionLog, BattlePhase, BattleState, FloatingTextFx, SkillType, AnswerEvaluation, CombatFxType, CombatVisualFx } from '@/types/battle';
import type { MathQuestion } from '@/types/math';
import type { Monster } from '@/types/monster';
import type { CampaignId } from '@/types/campaign';
import type { BossBattlePhase, BossData, CampaignEndingSummary } from '@/types/story';
import { EMERALD_FOREST_BATTLE_MONSTERS } from './data/emeraldMonsters';
import { getBossConfig } from '../bosses/data/sevenBossesConfig';
import { generateQuestion } from '../math-engine/questionGenerator';
import { MathEngineService } from '../math-engine/mathEngineService';
import { usePlayerStore } from '../../game/state/usePlayerStore';
import { useProgressStore } from '../../game/state/useProgressStore';
import { useQuestStore } from '../quests/useQuestStore';
import { useHeroInventoryStore } from '../inventory/useInventoryStore';
import { useKingdomProgressionStore } from '../kingdom-progression/useKingdomProgressionStore';
import { useStoryStore } from '../story/useStoryStore';

interface BattleStoreActions {
  initBattle: (monsterOrKey: string | Monster | BossData, campaignId?: CampaignId) => void;
  selectSkill: (skill: SkillType) => boolean;
  requestQuestion: () => void;
  submitAnswer: (answer: number | string) => AnswerEvaluation;
  toggleHint: () => void;
  dismissExplanation: () => void;
  usePotion: (type: 'hp' | 'mp') => void;
  claimRewards: () => { exp: number; gold: number; levelUp: boolean };
  resetBattle: () => void;
  addFloatingText: (text: string, color: string, target: 'player' | 'monster', isCritical?: boolean) => void;
  clearFloatingTexts: () => void;
  combatVisuals: CombatVisualFx[];
  addCombatFx: (type: CombatFxType, x?: number, y?: number) => void;
}

export type BattleStore = BattleState & {
  isExplaining: boolean;
  canTryAgain: boolean;
} & BattleStoreActions;

const DEFAULT_MONSTER: Monster = EMERALD_FOREST_BATTLE_MONSTERS.slime;

export const useBattleStore = create<BattleStore>((set, get) => ({
  battleId: 'battle-init',
  campaignId: 'grade-2',
  kingdomId: 'g2-k1-arithmia',
  monster: DEFAULT_MONSTER,
  currentTurn: 1,
  playerHp: 100,
  playerMaxHp: 100,
  playerMp: 80,
  playerMaxMp: 80,
  monsterHp: 90,
  monsterMaxHp: 90,
  currentQuestion: null,
  phase: 'intro',
  selectedSkill: 'basic',
  comboStreak: 0,
  consecutiveMistakes: 0,
  actionLogs: [],
  rewardsClaimed: false,
  isHintActive: false,
  floatingTexts: [],
  combatVisuals: [],
  isExplaining: false,
  canTryAgain: true,
  // Phase 7 Boss Extension
  isBossBattle: false,
  bossData: null,
  bossPhase: 'normal',
  enragedTriggered: false,
  finalChallengeTriggered: false,
  requiredStreakForFinish: 3,

  initBattle: (monsterOrKey: string | Monster | BossData, campaignId?: CampaignId) => {
    const currentCampaign = campaignId || (useProgressStore.getState().currentProgress?.campaignId as CampaignId) || 'grade-2';

    let monster: Monster;
    let isBoss = false;
    let loadedBoss: BossData | null = null;

    if (typeof monsterOrKey === 'string') {
      const bossConfig = getBossConfig(monsterOrKey, currentCampaign);
      if (bossConfig) {
        isBoss = true;
        loadedBoss = bossConfig;
        monster = {
          id: bossConfig.bossId,
          name: bossConfig.titleVi,
          title: bossConfig.titleVi,
          kingdomId: bossConfig.kingdomId,
          modelType: 'boss',
          element: 'shadow',
          level: bossConfig.level,
          maxHp: bossConfig.maxHp,
          attackPower: bossConfig.attackPower,
          defense: bossConfig.defense,
          avatarSeed: bossConfig.bossId,
          iconName: 'Crown',
          description: bossConfig.description,
          specialMove: 'Hắc Ám Phong Ấn',
          weaknessMathTopic: bossConfig.allowedMathTopics[0] || 'addition',
          rewardExp: bossConfig.rewardExp,
          rewardGold: bossConfig.rewardGold,
          dialogue: {
            encounter: bossConfig.phasesDialogue.normalIntro,
            taunt: 'Bóng tối không thể bị xóa bỏ!',
            defeat: bossConfig.phasesDialogue.defeatSpeech,
          },
        };
      } else {
        monster = EMERALD_FOREST_BATTLE_MONSTERS[monsterOrKey] || {
          ...DEFAULT_MONSTER,
          id: monsterOrKey,
          name: `Quái Vật Cổ Đại (${monsterOrKey})`,
        };
      }
    } else if ('bossId' in monsterOrKey) {
      isBoss = true;
      loadedBoss = monsterOrKey as BossData;
      monster = {
        id: loadedBoss.bossId,
        name: loadedBoss.titleVi,
        title: loadedBoss.titleVi,
        kingdomId: loadedBoss.kingdomId,
        modelType: 'boss',
        element: 'shadow',
        level: loadedBoss.level,
        maxHp: loadedBoss.maxHp,
        attackPower: loadedBoss.attackPower,
        defense: loadedBoss.defense,
        avatarSeed: loadedBoss.bossId,
        iconName: 'Crown',
        description: loadedBoss.description,
        specialMove: 'Hắc Ám Phong Ấn',
        weaknessMathTopic: loadedBoss.allowedMathTopics[0] || 'addition',
        rewardExp: loadedBoss.rewardExp,
        rewardGold: loadedBoss.rewardGold,
        dialogue: {
          encounter: loadedBoss.phasesDialogue.normalIntro,
          taunt: 'Bóng tối không thể bị xóa bỏ!',
          defeat: loadedBoss.phasesDialogue.defeatSpeech,
        },
      };
    } else {
      monster = monsterOrKey as Monster;
      if (monster.modelType === 'boss') {
        isBoss = true;
        loadedBoss = getBossConfig(monster.id, currentCampaign) || null;
      }
    }

    const heroStats = useHeroInventoryStore.getState().getCalculatedStats(currentCampaign);
    const playerHp = heroStats.finalStats.maxHp;
    const playerMp = heroStats.finalStats.maxMp;

    const initialLogs: BattleActionLog[] = [
      {
        turn: 1,
        actor: 'system',
        text: isBoss
          ? `⚡ ĐẠI CHIẾN BOSS! Tony bước vào quyết đấu cùng [${monster.name}]!`
          : `⚔️ Hiệp Sĩ Tony chạm trán [${monster.name}] tại Đấu Trường Rừng Xanh!`,
      },
      {
        turn: 1,
        actor: 'monster',
        text: monster.dialogue.encounter,
      },
    ];

    set({
      battleId: `battle-${Date.now()}`,
      campaignId: currentCampaign,
      kingdomId: monster.kingdomId,
      monster,
      currentTurn: 1,
      playerHp,
      playerMaxHp: playerHp,
      playerMp,
      playerMaxMp: playerMp,
      monsterHp: monster.maxHp,
      monsterMaxHp: monster.maxHp,
      currentQuestion: null,
      phase: 'player_turn',
      selectedSkill: 'basic',
      comboStreak: 0,
      consecutiveMistakes: 0,
      actionLogs: initialLogs,
      rewardsClaimed: false,
      isHintActive: false,
      floatingTexts: [],
      isExplaining: false,
      canTryAgain: true,
      lastEvaluation: undefined,
      isBossBattle: isBoss,
      bossData: loadedBoss,
      bossPhase: 'normal',
      enragedTriggered: false,
      finalChallengeTriggered: false,
      requiredStreakForFinish: loadedBoss?.requiredStreakForFinish || 3,
    });

    // Automatically draw the first question
    get().requestQuestion();
  },

  selectSkill: (skill: SkillType) => {
    const { playerMp, comboStreak } = get();
    if (skill === 'magic' && playerMp < 25) {
      get().addFloatingText('Không đủ MP!', '#f87171', 'player');
      return false;
    }
    if (skill === 'power' && comboStreak < 2) {
      get().addFloatingText('Cần Combo x2!', '#fbbf24', 'player');
      return false;
    }
    set({ selectedSkill: skill });
    return true;
  },

  requestQuestion: () => {
    const { campaignId, monster, kingdomId, isBossBattle, bossData, bossPhase } = get();
    const grade = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';

    let topicId = monster.weaknessMathTopic;
    if (isBossBattle && bossData && bossData.allowedMathTopics.length > 0) {
      const topics = bossData.allowedMathTopics;
      topicId = topics[Math.floor(Math.random() * topics.length)];
    }

    const difficulty = bossPhase === 'final_challenge' ? 'hard' : bossPhase === 'enraged' ? 'boss' : 'normal';

    const question = generateQuestion({
      grade,
      topicId,
      kingdomId,
      difficulty,
    });

    set({
      currentQuestion: question,
      phase: 'question',
      isHintActive: false,
    });
  },

  submitAnswer: (answer: number | string) => {
    const {
      currentQuestion,
      monster,
      playerHp,
      playerMp,
      playerMaxMp,
      monsterHp,
      selectedSkill,
      comboStreak,
      consecutiveMistakes,
      currentTurn,
      actionLogs,
      campaignId,
      isBossBattle,
      bossData,
      bossPhase,
      enragedTriggered,
      finalChallengeTriggered,
    } = get();

    if (!currentQuestion) {
      throw new Error('No question active in battle');
    }

    const evaluation = MathEngineService.evaluateAnswer(currentQuestion, answer);
    const playerId = usePlayerStore.getState().player?.id || 'player_tony_hero';

    // Record learning stats & educational analytics
    MathEngineService.recordResult(
      playerId,
      campaignId,
      currentQuestion,
      evaluation.isCorrect,
      evaluation.userAnswer,
      15,
      consecutiveMistakes + 1
    );

    if (evaluation.isCorrect) {
      // Correct answer! Tony attacks with calculated hero stats & equipment
      const heroStats = useHeroInventoryStore.getState().getCalculatedStats(campaignId);
      const baseAtk = heroStats.finalStats.attack;
      const newStreak = comboStreak + 1;

      // Base damage calculation: (Attack + skill multiplier) - Monster defense
      let skillMultiplier = 1.0;
      let skillName = 'Kiếm Kích';
      let mpDeduction = 0;

      if (selectedSkill === 'power') {
        skillMultiplier = 1.6;
        skillName = 'Trảm Kích Sấm Sét';
        mpDeduction = 15;
      } else if (selectedSkill === 'magic') {
        skillMultiplier = 2.0;
        skillName = 'Bộc Phá Ma Pháp';
        mpDeduction = 25;
      }

      // Combo bonus: +10% damage per streak level (up to +50%)
      const comboMultiplier = 1 + Math.min(0.5, newStreak * 0.1);

      // Crit chance calculation
      const isCritical = Math.random() * 100 < (heroStats.finalStats.critChancePercent || 5);
      const critMultiplier = isCritical ? 1.5 : 1.0;

      // Raw damage
      let damage = Math.round(
        (baseAtk * skillMultiplier * comboMultiplier * critMultiplier) - (monster.defense * 0.4)
      );
      damage = Math.max(12, damage);

      // Boss Defense reduction
      if (isBossBattle && bossData) {
        damage = Math.max(15, Math.round(damage * 0.85));
      }

      // Element bonus or weakness topic bonus
      if (currentQuestion.topic === monster.weaknessMathTopic) {
        damage = Math.round(damage * 1.25);
      }

      let nextMonsterHp = Math.max(0, monsterHp - damage);
      const nextPlayerMp = Math.max(0, playerMp - mpDeduction);

      get().addFloatingText(`-${damage}`, isCritical ? '#f59e0b' : '#38bdf8', 'monster', isCritical);

      // Trigger Combat FX and Praise
      if (selectedSkill === 'magic') {
        get().addCombatFx('magic_projectile', 74, 40);
      } else {
        get().addCombatFx('sword_slash', 74, 40);
      }
      if (isCritical) {
        get().addCombatFx('critical', 50, 30);
      }
      setTimeout(() => get().addCombatFx('impact', 74, 40), 220);

      const praises = ['XUẤT SẮC! ⭐', 'TUYỆT VỜI TONY! ⚔️', 'CHUẨN XÁC! 🎯', 'DŨNG CẢM LẮM! 🛡️'];
      const praise = praises[Math.floor(Math.random() * praises.length)];
      get().addFloatingText(praise, '#facc15', 'player', isCritical);

      const newLogs: BattleActionLog[] = [
        ...actionLogs,
        {
          turn: currentTurn,
          actor: 'player',
          text: `✨ Tony giải đúng! Thi triển [${skillName}] gây ${damage} sát thương lên ${monster.name}!`,
          damage,
          isCritical,
          skillType: selectedSkill,
        },
      ];

      // Boss Phase Transition Checks
      let nextBossPhase: BossBattlePhase = bossPhase || 'normal';
      let nextEnraged = enragedTriggered || false;
      let nextFinalChallenge = finalChallengeTriggered || false;

      if (isBossBattle && bossData) {
        // Prevent premature death: Boss must enter Final Challenge first
        if (!nextFinalChallenge && nextMonsterHp <= 0) {
          nextMonsterHp = 1;
        }

        const hpPercent = (nextMonsterHp / monster.maxHp) * 100;

        // Check Phase 2: Enraged threshold (<= 50%)
        if (hpPercent <= bossData.enragedHpThresholdPercent && !nextEnraged && nextMonsterHp > 0) {
          nextEnraged = true;
          nextBossPhase = 'enraged';
          get().addFloatingText('🔥 GIAI ĐOẠN 2: PHẪN NỘ!', '#ef4444', 'monster', true);
          newLogs.push({
            turn: currentTurn,
            actor: 'monster',
            text: `⚡ ${bossData.phasesDialogue.enragedAura}`,
          });
          newLogs.push({
            turn: currentTurn,
            actor: 'system',
            text: `⚠️ [CẢNH BÁO] ${bossData.titleVi} đã bộc phát trạng thái PHẪN NỘ! Sức mạnh và độ khó gia tăng!`,
          });
        }

        // Check Phase 3: Final Challenge threshold (<= 20%)
        if (hpPercent <= bossData.finalChallengeHpThresholdPercent && !nextFinalChallenge && nextMonsterHp > 0) {
          nextFinalChallenge = true;
          nextBossPhase = 'final_challenge';
          get().addFloatingText('⭐ THỬ THÁCH KẾT LIỄU!', '#fbbf24', 'player', true);
          newLogs.push({
            turn: currentTurn,
            actor: 'monster',
            text: `💥 ${bossData.phasesDialogue.finalChallengePrompt}`,
          });
          newLogs.push({
            turn: currentTurn,
            actor: 'system',
            text: `⚔️ GIAI ĐOẠN CUỐI: ĐÒN KẾT LIỄU! Đạt 3 combo liên tiếp để giải phóng toàn bộ năng lượng!`,
          });
        }

        // Final Challenge finishing strike check
        if (nextBossPhase === 'final_challenge' && newStreak >= (bossData.requiredStreakForFinish || 3)) {
          damage += nextMonsterHp;
          nextMonsterHp = 0;
          get().addFloatingText('💥 ĐÒN KẾT LIỄU HIỆP SĨ!', '#f59e0b', 'monster', true);
          newLogs.push({
            turn: currentTurn,
            actor: 'player',
            text: `🌟 TUYỆT KỸ HIỆP SĨ TRI THỨC! Tony đạt Combo x${newStreak}, tung đòn quyết định hạ gục ${bossData.titleVi}!`,
            damage,
            isCritical: true,
          });
        }
      }

      if (nextMonsterHp <= 0) {
        // MONSTER / BOSS DEFEATED -> VICTORY!
        newLogs.push({
          turn: currentTurn,
          actor: 'monster',
          text: monster.dialogue.defeat,
        });
        newLogs.push({
          turn: currentTurn,
          actor: 'system',
          text: isBossBattle
            ? `🎉 ĐẠI THẮNG! Đại Boss [${monster.name}] đã bị khuất phục! Vương quốc được giải phóng!`
            : `🎉 CHIẾN THẮNG! Quái vật [${monster.name}] đã bị khuất phục bởi tri thức của bạn!`,
        });

        // Trigger quest progress
        useQuestStore.getState().advanceObjective('defeat_monsters', monster.id, 1);
        if (isBossBattle && bossData) {
          useQuestStore.getState().advanceObjective('defeat_boss', bossData.bossId, 1);
          useKingdomProgressionStore.getState().markBossDefeated(monster.kingdomId);

          // If final boss Lord Zero: complete campaign ending!
          if (bossData.bossId === 'boss-lord-zero') {
            useQuestStore.getState().advanceObjective('complete_campaign', 'legend_completed', 1);
            const player = usePlayerStore.getState().player;
            const progress = useProgressStore.getState().currentProgress;
            const endingSummary: CampaignEndingSummary = {
              playerId: player?.id || 'player_tony_hero',
              campaignId,
              campaignTitle: campaignId === 'grade-3' ? 'Chiến Dịch Lớp 3 - Đại Hiệp Sĩ Huyền Thoại' : 'Chiến Dịch Lớp 2 - Hiệp Sĩ Nhỏ',
              rescuedKingdomsCount: 7,
              totalKingdomsCount: 7,
              defeatedBossesCount: 7,
              totalBossesCount: 7,
              crystalsCollectedCount: 7,
              totalCrystalsCount: 7,
              totalQuestionsAnswered: (player?.stats.battlesWon || 10) * 3,
              correctAnswersCount: (player?.stats.battlesWon || 10) * 3,
              accuracyPercentage: 94,
              questsCompletedCount: progress?.completedQuestIds.length || 10,
              totalExpGained: progress?.currentExp || 5000,
              heroFinalLevel: progress?.heroLevel || 15,
              heroTitleAwarded: 'Đại Hiệp Sĩ Cứu Thế Của Bảy Vương Quốc',
              completedAt: new Date().toLocaleDateString('vi-VN'),
            };
            useStoryStore.getState().setEndingSummary(endingSummary);
          }
        }

        if (monster.id === 'golem_guard') {
          useQuestStore.getState().advanceObjective('defeat_monsters', 'g2-m1-golem', 1);
        }

        set({
          monsterHp: 0,
          playerMp: nextPlayerMp,
          comboStreak: newStreak,
          consecutiveMistakes: 0,
          phase: 'victory',
          actionLogs: newLogs,
          selectedSkill: 'basic',
          lastEvaluation: { ...evaluation, damageDealt: damage },
          bossPhase: nextBossPhase,
          enragedTriggered: nextEnraged,
          finalChallengeTriggered: nextFinalChallenge,
        });
      } else {
        // Monster still alive -> replenish a bit of MP for answering right, then next turn
        const bonusMp = Math.min(playerMaxMp, nextPlayerMp + 5);
        set({
          monsterHp: nextMonsterHp,
          playerMp: bonusMp,
          comboStreak: newStreak,
          consecutiveMistakes: 0,
          currentTurn: currentTurn + 1,
          phase: 'player_turn',
          actionLogs: newLogs,
          selectedSkill: 'basic',
          lastEvaluation: { ...evaluation, damageDealt: damage },
          bossPhase: nextBossPhase,
          enragedTriggered: nextEnraged,
          finalChallengeTriggered: nextFinalChallenge,
        });

        // Proceed to next question automatically after brief interval
        setTimeout(() => {
          if (get().phase === 'player_turn' && get().monsterHp > 0) {
            get().requestQuestion();
          }
        }, 800);
      }

      return { ...evaluation, damageDealt: damage };
    } else {
      // INCORRECT ANSWER (Pedagogical Handling)
      const nextMistakes = consecutiveMistakes + 1;
      const newLogs = [...actionLogs];

      if (nextMistakes === 1) {
        // First mistake: do NOT wipe out Tony!
        const chipDamage = Math.max(4, Math.floor(monster.attackPower * 0.2));
        const nextPlayerHp = Math.max(1, playerHp - chipDamage);

        get().addFloatingText(`KHIÊN ĐỠ -${chipDamage}`, '#94a3b8', 'player');
        get().addCombatFx('shield', 26, 45);

        const encouragements = ['CỐ LÊN TONY! 💪', 'BÉ TIÊN LUÔN Ở ĐÂY! 🧚', 'HÃY THỬ LẠI NÀO! ✨'];
        get().addFloatingText(encouragements[Math.floor(Math.random() * encouragements.length)], '#38bdf8', 'player');

        newLogs.push({
          turn: currentTurn,
          actor: 'system',
          text: `🛡️ Tony tính chưa chính xác, nhưng đã kịp giương khiên phòng thủ (chỉ nhận ${chipDamage} sát thương sượt qua). Hãy xem lời giải và làm lại!`,
          damage: chipDamage,
        });

        set({
          playerHp: nextPlayerHp,
          comboStreak: 0,
          consecutiveMistakes: nextMistakes,
          isExplaining: true,
          canTryAgain: true,
          actionLogs: newLogs,
          lastEvaluation: evaluation,
        });
      } else {
        // Repeated mistake: monster launches standard attack
        const heroStats = useHeroInventoryStore.getState().getCalculatedStats(campaignId);
        const heroDef = heroStats.finalStats.defense;
        let incomingDamage = Math.max(6, monster.attackPower - Math.floor(heroDef * 0.5));

        if (bossPhase === 'enraged') {
          incomingDamage = Math.round(incomingDamage * 1.3);
        }

        const nextPlayerHp = Math.max(0, playerHp - incomingDamage);

        get().addFloatingText(`-${incomingDamage}`, '#ef4444', 'player');

        newLogs.push({
          turn: currentTurn,
          actor: 'monster',
          text: monster.dialogue.taunt || `${monster.name} tung đòn phản công sấm sét!`,
          damage: incomingDamage,
        });

        if (nextPlayerHp <= 0) {
          // DEFEAT
          newLogs.push({
            turn: currentTurn,
            actor: 'system',
            text: `💔 Tony đã cạn kiệt sinh lực. Đừng nản lòng, hãy củng cố lại kiến thức và thử thách lại!`,
          });
          set({
            playerHp: 0,
            comboStreak: 0,
            consecutiveMistakes: nextMistakes,
            phase: 'defeat',
            actionLogs: newLogs,
            isExplaining: true,
            canTryAgain: false,
            lastEvaluation: evaluation,
          });
        } else {
          // Continued fight
          set({
            playerHp: nextPlayerHp,
            comboStreak: 0,
            consecutiveMistakes: nextMistakes,
            isExplaining: true,
            canTryAgain: true,
            actionLogs: newLogs,
            lastEvaluation: evaluation,
          });
        }
      }

      return evaluation;
    }
  },

  toggleHint: () => {
    set((state) => ({ isHintActive: !state.isHintActive }));
  },

  dismissExplanation: () => {
    const { phase, monsterHp } = get();
    set({ isExplaining: false });

    if (phase !== 'victory' && phase !== 'defeat' && monsterHp > 0) {
      // Draw fresh question for the hero
      get().requestQuestion();
    }
  },

  usePotion: (type: 'hp' | 'mp') => {
    const { playerHp, playerMaxHp, playerMp, playerMaxMp, actionLogs, currentTurn, campaignId } = get();
    const invStore = useHeroInventoryStore.getState();
    const potionId = type === 'hp' ? 'con-potion-hp-small' : 'con-potion-mp-small';
    const res = invStore.useConsumable(potionId, playerHp, playerMp, campaignId);

    if (type === 'hp') {
      const heal = res.healHp || 45;
      const nextHp = Math.min(playerMaxHp, playerHp + heal);
      get().addFloatingText(`+${heal} HP`, '#4ade80', 'player');
      set({
        playerHp: nextHp,
        actionLogs: [
          ...actionLogs,
          { turn: currentTurn, actor: 'player', text: `🧪 Tony uống Dược Thảo Hồi Phục (+${heal} HP)!` },
        ],
      });
    } else {
      const mana = res.healMp || 35;
      const nextMp = Math.min(playerMaxMp, playerMp + mana);
      get().addFloatingText(`+${mana} MP`, '#60a5fa', 'player');
      set({
        playerMp: nextMp,
        actionLogs: [
          ...actionLogs,
          { turn: currentTurn, actor: 'player', text: `🔮 Tony dùng Bình Năng Lượng Tinh Tú (+${mana} MP)!` },
        ],
      });
    }
  },

  claimRewards: () => {
    const { rewardsClaimed, monster, campaignId, isBossBattle, bossData } = get();
    if (rewardsClaimed) {
      return { exp: 0, gold: 0, levelUp: false };
    }

    const exp = (isBossBattle && bossData ? bossData.rewardExp : monster.rewardExp) || 100;
    const gold = (isBossBattle && bossData ? bossData.rewardGold : monster.rewardGold) || 50;

    // Grant EXP and Gold to player & progress store
    const progressStore = useProgressStore.getState();
    const playerStore = usePlayerStore.getState();

    progressStore.addExp(exp).catch(() => {});

    const progress = progressStore.currentProgress;
    if (progress) {
      progress.goldCoins += gold;
      progressStore.saveCurrentProgress().catch(() => {});
    }

    if (playerStore.player) {
      playerStore.updateStats({
        battlesWon: (playerStore.player.stats.battlesWon || 0) + 1,
      }).catch(() => {});
    }

    // Auto-claim Crystal on Boss victory
    if (isBossBattle && bossData && bossData.rewardCrystalId) {
      useKingdomProgressionStore.getState().claimKnowledgeCrystal(monster.kingdomId, bossData.rewardCrystalId).catch(() => {});
      useQuestStore.getState().advanceObjective('collect_crystal', bossData.rewardCrystalId, 1);
    }

    set({ rewardsClaimed: true });
    return { exp, gold, levelUp: false };
  },

  resetBattle: () => {
    set({
      phase: 'intro',
      currentQuestion: null,
      isExplaining: false,
      floatingTexts: [],
      rewardsClaimed: false,
      isBossBattle: false,
      bossData: null,
      bossPhase: 'normal',
      enragedTriggered: false,
      finalChallengeTriggered: false,
    });
  },

  addFloatingText: (text: string, color: string, target: 'player' | 'monster', isCritical = false) => {
    const newFx: FloatingTextFx = {
      id: `fx-${Date.now()}-${Math.random()}`,
      text,
      color,
      target,
      isCritical,
    };
    set((state) => ({
      floatingTexts: [...state.floatingTexts.slice(-4), newFx],
    }));
  },

  clearFloatingTexts: () => {
    set({ floatingTexts: [] });
  },

  addCombatFx: (type: CombatFxType, x = 74, y = 38) => {
    const fx: CombatVisualFx = {
      id: `cfx-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
    };
    set((state) => ({
      combatVisuals: [...(state.combatVisuals || []).slice(-3), fx],
    }));
    setTimeout(() => {
      set((state) => ({
        combatVisuals: (state.combatVisuals || []).filter((item) => item.id !== fx.id),
      }));
    }, 1200);
  },
}));

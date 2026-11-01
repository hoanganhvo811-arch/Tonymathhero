import type { CampaignId } from './campaign';
import type { MathQuestion } from './math';
import type { Monster } from './monster';
import type { BossBattlePhase, BossData } from './story';

export type BattlePhase =
  | 'intro'
  | 'player_turn'
  | 'question'
  | 'evaluating'
  | 'player_attack'
  | 'monster_turn'
  | 'monster_attack'
  | 'victory'
  | 'defeat';

export type SkillType = 'basic' | 'power' | 'magic';

export type CombatFxType =
  | 'sword_slash'
  | 'magic_projectile'
  | 'impact'
  | 'shield'
  | 'heal'
  | 'critical'
  | 'phase_transition'
  | 'victory_explosion';

export interface CombatVisualFx {
  id: string;
  type: CombatFxType;
  x: number; // percentage or viewport position
  y: number;
  color?: string;
  intensity?: number;
  durationMs?: number;
}

export interface FloatingTextFx {
  id: string;
  text: string;
  color: string;
  target: 'player' | 'monster';
  isCritical?: boolean;
}

export interface BattleActionLog {
  turn: number;
  actor: 'player' | 'monster' | 'system';
  text: string;
  damage?: number;
  isCritical?: boolean;
  skillType?: SkillType;
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  steps?: string[];
  damageDealt?: number;
}

export interface BattleState {
  battleId: string;
  campaignId: CampaignId;
  kingdomId: string;
  monster: Monster;
  currentTurn: number;
  playerHp: number;
  playerMaxHp: number;
  playerMp: number;
  playerMaxMp: number;
  monsterHp: number;
  monsterMaxHp: number;
  currentQuestion: MathQuestion | null;
  phase: BattlePhase;
  selectedSkill: SkillType;
  comboStreak: number;
  consecutiveMistakes: number;
  actionLogs: BattleActionLog[];
  rewardsClaimed: boolean;
  isHintActive: boolean;
  floatingTexts: FloatingTextFx[];
  lastEvaluation?: AnswerEvaluation;
  // Phase 7 Boss Extension
  isBossBattle?: boolean;
  bossData?: BossData | null;
  bossPhase?: BossBattlePhase;
  enragedTriggered?: boolean;
  finalChallengeTriggered?: boolean;
  requiredStreakForFinish?: number;
}

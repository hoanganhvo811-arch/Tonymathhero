import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { CampaignGrade } from '@/types/campaign';
import { useBattleStore } from './useBattleStore';
import { BattleArenaCanvas } from './components/BattleArenaCanvas';
import { BattleTopHud } from './components/BattleTopHud';
import { BattleQuestionBox } from './components/BattleQuestionBox';
import { BattleFxLayer } from './components/BattleFxLayer';
import { BattleExplanationModal } from './components/BattleExplanationModal';
import { BattleVictoryModal } from './components/BattleVictoryModal';
import { BattleDefeatModal } from './components/BattleDefeatModal';
import { StoryCutsceneModal } from '../story/components/StoryCutsceneModal';
import { CampaignEndingModal } from '../story/components/CampaignEndingModal';
import { useProgressStore } from '../../game/state/useProgressStore';
import { useAudio } from '../../hooks/useAudio';

export const BattleScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const monsterKey = searchParams.get('monster') || 'slime';
  const {
    playLevelUp,
    playClick,
    playSelect,
    playCorrectAnswer,
    playWrongAnswer,
    playSwordSlash,
    playMagicCast,
    playShieldBlock,
    playHeal,
    playMonsterHit,
    playBossRoar,
    playBossPhaseShift,
    playBgm,
    stopBgm,
  } = useAudio();

  const {
    monster,
    monsterHp,
    monsterMaxHp,
    playerHp,
    playerMaxHp,
    playerMp,
    playerMaxMp,
    comboStreak,
    phase,
    selectedSkill,
    currentQuestion,
    isHintActive,
    isExplaining,
    actionLogs,
    floatingTexts,
    combatVisuals,
    lastEvaluation,
    rewardsClaimed,
    isBossBattle,
    bossData,
    bossPhase,
    initBattle,
    selectSkill,
    submitAnswer,
    toggleHint,
    dismissExplanation,
    usePotion,
    claimRewards,
  } = useBattleStore();

  const currentProgress = useProgressStore((state) => state.currentProgress);
  const grade: CampaignGrade = currentProgress?.campaignId === 'grade-3' ? 'grade-3' : 'grade-2';

  // Track previous boss phase for roar / sound trigger
  const prevBossPhase = useRef(bossPhase);

  // Initialize battle on mount or when monster param changes
  useEffect(() => {
    initBattle(monsterKey);
  }, [monsterKey, initBattle]);

  // Manage Dynamic Battle BGM
  useEffect(() => {
    if (phase === 'victory') {
      playBgm('victory');
    } else if (phase === 'defeat') {
      playBgm('defeat');
    } else if (isBossBattle) {
      playBgm('battle_boss');
    } else {
      playBgm('battle_normal');
    }

    return () => {
      stopBgm();
    };
  }, [phase, isBossBattle, playBgm, stopBgm]);

  // Audio cues on victory / defeat & Boss Phase transitions
  useEffect(() => {
    if (phase === 'victory') {
      playLevelUp();
      if (!rewardsClaimed) {
        claimRewards();
      }
    } else if (phase === 'defeat') {
      playClick();
    }
  }, [phase, rewardsClaimed, playLevelUp, playClick, claimRewards]);

  // Boss Phase Transition Sound
  useEffect(() => {
    if (bossPhase && prevBossPhase.current !== bossPhase) {
      if (bossPhase === 'enraged' || bossPhase === 'final_challenge') {
        playBossPhaseShift();
        setTimeout(() => playBossRoar(), 200);
      }
      prevBossPhase.current = bossPhase;
    }
  }, [bossPhase, playBossPhaseShift, playBossRoar]);

  const latestLog = actionLogs.length > 0 ? actionLogs[actionLogs.length - 1].text : undefined;

  const handleSelectSkill = (skill: any) => {
    playSelect();
    selectSkill(skill);
  };

  const handleSubmitAnswer = (chosenAnswer: number | string) => {
    const evaluation = submitAnswer(chosenAnswer);
    if (evaluation.isCorrect) {
      playCorrectAnswer();
      if (selectedSkill === 'magic') {
        playMagicCast();
      } else {
        playSwordSlash();
      }
      setTimeout(() => playMonsterHit(), 200);
    } else {
      playWrongAnswer();
      playShieldBlock();
    }
  };

  const handleUsePotion = (type: 'hp' | 'mp') => {
    playHeal();
    usePotion(type);
  };

  const handleContinueExploration = () => {
    navigate('/explore');
  };

  const handleReturnMap = () => {
    navigate('/map');
  };

  const handleRetry = () => {
    initBattle(monsterKey);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#021b10',
        userSelect: 'none',
      }}
    >
      {/* 3D Battle Arena Viewport */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <BattleArenaCanvas
          grade={grade}
          phase={phase}
          monster={monster}
          monsterHp={monsterHp}
          selectedSkill={selectedSkill}
        />
      </div>

      {/* Floating Combat Text & Dynamic VFX Layer */}
      <BattleFxLayer
        floatingTexts={floatingTexts}
        combatVisuals={combatVisuals}
        isScreenShaking={floatingTexts.some((f) => f.isCritical)}
      />

      {/* Top HUD: Combatants HP/MP and Ticker */}
      <BattleTopHud
        playerHp={playerHp}
        playerMaxHp={playerMaxHp}
        playerMp={playerMp}
        playerMaxMp={playerMaxMp}
        comboStreak={comboStreak}
        monster={monster}
        monsterHp={monsterHp}
        monsterMaxHp={monsterMaxHp}
        latestLog={latestLog}
        onUsePotion={handleUsePotion}
        onFlee={() => navigate('/explore')}
      />

      {/* Boss Phase Indicator Banner */}
      {isBossBattle && bossData && phase !== 'victory' && phase !== 'defeat' && (
        <div
          style={{
            position: 'absolute',
            top: '78px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            padding: '4px 16px',
            borderRadius: '20px',
            background:
              bossPhase === 'final_challenge'
                ? 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)'
                : bossPhase === 'enraged'
                ? 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)'
                : 'rgba(15, 23, 42, 0.85)',
            border:
              bossPhase === 'final_challenge'
                ? '1px solid #fbbf24'
                : bossPhase === 'enraged'
                ? '1px solid #f87171'
                : '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            animation: bossPhase !== 'normal' ? 'pulse 1.5s infinite' : 'none',
          }}
        >
          <span>
            {bossPhase === 'final_challenge'
              ? '⭐ GIAI ĐOẠN 3: ĐÒN KẾT LIỄU QUANG NĂNG'
              : bossPhase === 'enraged'
              ? '🔥 GIAI ĐOẠN 2: PHẪN NỘ HẮC ÁM (+SÁT THƯƠNG)'
              : '⚔️ GIAI ĐOẠN 1: TIẾP CẬN ĐẠI BOSS'}
          </span>
        </div>
      )}

      {/* Bottom Math Question Card & Skill Buttons */}
      <BattleQuestionBox
        question={currentQuestion}
        selectedSkill={selectedSkill}
        comboStreak={comboStreak}
        playerMp={playerMp}
        isHintActive={isHintActive}
        onSelectSkill={handleSelectSkill}
        onSubmitAnswer={handleSubmitAnswer}
        onToggleHint={toggleHint}
      />

      {/* Educational Pedagogical Modal when Mistake happens */}
      <BattleExplanationModal
        isOpen={isExplaining}
        evaluation={lastEvaluation}
        question={currentQuestion}
        onDismiss={dismissExplanation}
      />

      {/* Victory Celebration Modal */}
      <BattleVictoryModal
        isOpen={phase === 'victory'}
        monster={monster}
        expGained={monster.rewardExp || 100}
        goldGained={monster.rewardGold || 50}
        consecutiveMistakes={0}
        onContinueExploration={handleContinueExploration}
        onReturnMap={handleReturnMap}
      />

      {/* Defeat Resilience Modal */}
      <BattleDefeatModal
        isOpen={phase === 'defeat'}
        monster={monster}
        onRetry={handleRetry}
        onReturnVillage={handleReturnMap}
      />

      {/* Story Cutscene Modal */}
      <StoryCutsceneModal />

      {/* Final Campaign Ending Modal (if Lord Zero defeated) */}
      <CampaignEndingModal />
    </div>
  );
};

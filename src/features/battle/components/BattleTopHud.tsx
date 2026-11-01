import React from 'react';
import type { Monster } from '@/types/monster';
import { useProgressStore } from '../../../game/state/useProgressStore';

interface BattleTopHudProps {
  playerHp: number;
  playerMaxHp: number;
  playerMp: number;
  playerMaxMp: number;
  comboStreak: number;
  monster: Monster;
  monsterHp: number;
  monsterMaxHp: number;
  latestLog?: string;
  onUsePotion: (type: 'hp' | 'mp') => void;
  onFlee: () => void;
}

export const BattleTopHud: React.FC<BattleTopHudProps> = ({
  playerHp,
  playerMaxHp,
  playerMp,
  playerMaxMp,
  comboStreak,
  monster,
  monsterHp,
  monsterMaxHp,
  latestLog,
  onUsePotion,
  onFlee,
}) => {
  const currentProgress = useProgressStore((state) => state.currentProgress);
  const heroLevel = currentProgress?.heroLevel || 1;

  const playerHpPercent = Math.max(0, Math.min(100, Math.round((playerHp / playerMaxHp) * 100)));
  const playerMpPercent = Math.max(0, Math.min(100, Math.round((playerMp / playerMaxMp) * 100)));
  const monsterHpPercent = Math.max(0, Math.min(100, Math.round((monsterHp / monsterMaxHp) * 100)));

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 15,
        pointerEvents: 'auto',
      }}
    >
      {/* Top Combatants Status Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {/* TONY HERO STATUS CARD (LEFT) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.92) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.6)',
            borderRadius: '16px',
            padding: '14px 20px',
            minWidth: '280px',
            maxWidth: '360px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🛡️</span>
              <div>
                <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                  HIỆP SĨ TONY
                </div>
                <div style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600 }}>Cấp độ {heroLevel}</div>
              </div>
            </div>

            {/* Combo Streak Badge */}
            {comboStreak > 1 && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  boxShadow: '0 0 12px rgba(245, 158, 11, 0.8)',
                  animation: 'pulse 1s infinite alternate',
                }}
              >
                ⚡ COMBO x{comboStreak}
              </div>
            )}
          </div>

          {/* Tony HP Bar */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '3px' }}>
              <span style={{ fontWeight: 700, color: '#4ade80' }}>HP (Sinh lực)</span>
              <span>{playerHp} / {playerMaxHp}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(0, 0, 0, 0.6)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div
                style={{
                  width: `${playerHpPercent}%`,
                  height: '100%',
                  background: playerHpPercent > 30 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 'linear-gradient(90deg, #dc2626, #ef4444)',
                  transition: 'width 0.4s ease',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          {/* Tony MP Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '3px' }}>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>MP (Năng lượng tri thức)</span>
              <span>{playerMp} / {playerMaxMp}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(0, 0, 0, 0.6)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div
                style={{
                  width: `${playerMpPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                  transition: 'width 0.4s ease',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>

          {/* Quick Item Hotbar */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button
              onClick={() => onUsePotion('hp')}
              title="Dùng Bình Máu (+45 HP)"
              style={{
                flex: 1,
                background: 'rgba(22, 101, 52, 0.5)',
                border: '1px solid #22c55e',
                color: '#86efac',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              🧪 +45 HP
            </button>
            <button
              onClick={() => onUsePotion('mp')}
              title="Dùng Bình Năng Lượng (+35 MP)"
              style={{
                flex: 1,
                background: 'rgba(3, 105, 161, 0.5)',
                border: '1px solid #38bdf8',
                color: '#bae6fd',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              🔮 +35 MP
            </button>
          </div>
        </div>

        {/* Center Arena Controls / Flee */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onFlee}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              color: '#fca5a5',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🏃 Rút lui
          </button>
        </div>

        {/* MONSTER STATUS CARD (RIGHT) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.92) 0%, rgba(15, 23, 42, 0.92) 100%)',
            border: '2px solid rgba(239, 68, 68, 0.6)',
            borderRadius: '16px',
            padding: '14px 20px',
            minWidth: '280px',
            maxWidth: '360px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>👾</span>
              <div>
                <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                  {monster.name}
                </div>
                <div style={{ color: '#fca5a5', fontSize: '0.78rem', fontWeight: 600 }}>
                  {monster.title} • Cấp {monster.level}
                </div>
              </div>
            </div>

            {/* Element Tag */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.25)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                textTransform: 'uppercase',
              }}
            >
              {monster.element}
            </div>
          </div>

          {/* Monster HP Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '3px' }}>
              <span style={{ fontWeight: 700, color: '#f87171' }}>HP Quái Vật</span>
              <span>{monsterHp} / {monsterMaxHp}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(0, 0, 0, 0.6)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div
                style={{
                  width: `${monsterHpPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #dc2626, #f87171)',
                  transition: 'width 0.4s ease',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          {/* Monster Math Weakness */}
          <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#94a3b8' }}>
            Điểm yếu: <span style={{ color: '#fcd34d', fontWeight: 600 }}>{monster.weaknessMathTopic}</span>
          </div>
        </div>
      </div>

      {/* Action Log Ticker in the center */}
      {latestLog && (
        <div
          style={{
            alignSelf: 'center',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '6px 20px',
            color: '#f1f5f9',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            maxWidth: '650px',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {latestLog}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useTimeCalendarStore } from '../useTimeCalendarStore';
import { TIME_BOSS_PHASES } from '../data/timeBossCatalog';

export const TimeBossArenaView: React.FC = () => {
  const {
    currentPhaseIndex,
    bossHp,
    bossMaxHp,
    tonyHp,
    tonyMaxHp,
    battleStreak,
    currentBossSpell,
    battleLogs,
    isBossDefeated,
    answerBossSpell,
    resetBossArena,
  } = useTimeCalendarStore();

  const currentPhaseConfig = TIME_BOSS_PHASES[currentPhaseIndex - 1];

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #0b1324 0%, #1e1b4b 50%, #030712 100%)',
        border: '2px solid rgba(250, 204, 21, 0.4)',
        borderRadius: '24px',
        padding: '24px',
        maxWidth: '780px',
        margin: '0 auto',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Top Phase Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span
            style={{
              background: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid #facc15',
              color: '#facc15',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            ĐẤU TRƯỜNG THỜI KHÔNG • GIAI ĐOẠN {currentPhaseIndex}/3
          </span>
          <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 900, marginTop: '6px' }}>
            {currentPhaseConfig.phaseNameVi}
          </h3>
        </div>
        {battleStreak >= 2 && (
          <div
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 900,
              fontSize: '0.85rem',
              boxShadow: '0 0 14px rgba(245, 158, 11, 0.6)',
            }}
          >
            🔥 COMBO x{battleStreak}!
          </div>
        )}
      </div>

      {/* Duel Health Status */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '16px',
          borderRadius: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Tony Health */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800 }}>
            <span>🛡️ Hiệp Sĩ Tony</span>
            <span>{tonyHp}/{tonyMaxHp} HP</span>
          </div>
          <div style={{ height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden', marginTop: '6px' }}>
            <div
              style={{
                height: '100%',
                width: `${(tonyHp / tonyMaxHp) * 100}%`,
                background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Boss Health */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#facc15', fontWeight: 800 }}>
            <span>⏳ Chronos Watcher</span>
            <span>{bossHp}/{bossMaxHp} HP</span>
          </div>
          <div style={{ height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden', marginTop: '6px' }}>
            <div
              style={{
                height: '100%',
                width: `${(bossHp / bossMaxHp) * 100}%`,
                background: 'linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Boss Interaction Stage */}
      {isBossDefeated ? (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '2px solid #10b981',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '8px' }}>🏆</div>
          <h2 style={{ color: '#34d399', fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
            CHIẾN THẮNG VANG DỘI!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '20px' }}>
            Tony đã đánh bại hoàn toàn Chronos Watcher! Dòng thời gian của Vương quốc đã quay trở lại quỹ đạo êm đềm, Chrono Knowledge Crystal đã được giải thoát!
          </p>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid #facc15',
              color: '#facc15',
              padding: '10px 24px',
              borderRadius: '16px',
              fontSize: '1.1rem',
              fontWeight: 800,
              marginBottom: '20px',
            }}
          >
            🔮 ĐÃ THU THẬP: CHRONO KNOWLEDGE CRYSTAL &nbsp;|&nbsp; +350 EXP
          </div>
          <div>
            <button
              onClick={resetBossArena}
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              🔄 Thách Đấu Lại Boss
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Boss Spell Box */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.85)',
              border: '2px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '18px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ color: '#facc15', fontSize: '0.85rem', fontWeight: 800, marginBottom: '4px' }}>
              ⚡ THỬ THÁCH THỜI KHÔNG: {currentBossSpell.spellNameVi}
            </div>
            <div style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '14px' }}>
              &quot;{currentBossSpell.bossDialogueVi}&quot;
            </div>
            <div style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
              {currentBossSpell.questionTextVi}
            </div>
          </div>

          {/* Spell Answer Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {currentBossSpell.options.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => answerBossSpell(opt)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: '2px solid rgba(250, 204, 21, 0.3)',
                  color: '#f8fafc',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Battle Logs */}
          <div
            style={{
              marginTop: '20px',
              background: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '14px',
              padding: '14px 18px',
              maxHeight: '120px',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px' }}>
              📜 NHẬT KÝ ĐẤU TRƯỜNG THỜI KHÔNG:
            </div>
            {battleLogs.slice(0, 4).map((log, i) => (
              <div key={i} style={{ color: '#e2e8f0', fontSize: '0.82rem', marginBottom: '4px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

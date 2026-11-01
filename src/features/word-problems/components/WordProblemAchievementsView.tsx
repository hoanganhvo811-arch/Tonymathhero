import React from 'react';
import { useWordProblemStore } from '../useWordProblemStore';

export const WordProblemAchievementsView: React.FC = () => {
  const { progress } = useWordProblemStore();
  const achievements = progress?.achievements || [];

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', color: '#f8fafc' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
            fontSize: '1.6rem',
            color: '#facc15',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>🎖️</span>
          <span>DANH HIỆU THẾ GIỚI TOÁN CÓ LỜI VĂN</span>
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
          Vinh danh khả năng tư duy đọc hiểu, phát hiện dữ kiện và trình bày giải pháp logic của Tony!
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
        }}
      >
        {achievements.map((ach) => {
          const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              style={{
                background: ach.unlocked
                  ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
                border: ach.unlocked ? '2px solid #facc15' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '20px',
                position: 'relative',
                boxShadow: ach.unlocked ? '0 0 20px rgba(250, 204, 21, 0.25)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: ach.unlocked ? 'rgba(250, 204, 21, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    border: ach.unlocked ? '1px solid #facc15' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {ach.icon}
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: ach.unlocked ? '#facc15' : '#cbd5e1',
                    }}
                  >
                    {ach.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: ach.unlocked ? '#4ade80' : '#94a3b8' }}>
                    {ach.unlocked ? '✦ ĐÃ ĐẠT ĐƯỢC' : '🔒 ĐANG THỬ THÁCH'}
                  </div>
                </div>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '14px', minHeight: '38px' }}>
                {ach.description}
              </p>

              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                  <span>Tiến độ:</span>
                  <span>{ach.progress} / {ach.maxProgress}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: ach.unlocked ? '#facc15' : '#38bdf8',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#fef08a',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <span>⭐ +{ach.rewardXp} EXP</span>
                <span>🪙 +{ach.rewardGold} Vàng</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

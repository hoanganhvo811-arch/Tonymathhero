import React, { useState } from 'react';
import { useWordProblemStore } from '../useWordProblemStore';
import { WORD_PROBLEMS_CATALOG } from '../data/wordProblemsCatalog';

export const VisualMathStoryView: React.FC = () => {
  const { selectedProblemId } = useWordProblemStore();
  const problem = WORD_PROBLEMS_CATALOG.find((p) => p.id === selectedProblemId) || WORD_PROBLEMS_CATALOG[0];
  const { visualContext } = problem;

  const [clickedItemCount, setClickedItemCount] = useState<number>(0);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', color: '#f8fafc' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '2rem' }}>🎨</span>
          <h2
            style={{
              fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
              fontSize: '1.6rem',
              color: '#38bdf8',
            }}
          >
            MÔ HÌNH HÌNH ẢNH TRỰC QUAN: {problem.title}
          </h2>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
          {visualContext.description}
        </p>
      </div>

      {/* Interactive Visual Canvas */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '24px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        }}
      >
        {/* If Group Model (Multiplication / Division) */}
        {visualContext.groups && visualContext.itemsPerGroup ? (
          <div>
            <div style={{ fontSize: '0.9rem', color: '#facc15', fontWeight: 800, marginBottom: '20px' }}>
              📦 Có {visualContext.groups} nhóm, mỗi nhóm có {visualContext.itemsPerGroup} {visualContext.itemEmoji}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              {Array.from({ length: visualContext.groups }).map((_, groupIdx) => (
                <div
                  key={groupIdx}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '16px',
                    padding: '16px',
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
                    {visualContext.containerEmoji || '📦'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
                    Nhóm {groupIdx + 1}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', fontSize: '1.4rem' }}>
                    {Array.from({ length: visualContext.itemsPerGroup! }).map((_, itemIdx) => (
                      <span
                        key={itemIdx}
                        onClick={() => setClickedItemCount((c) => c + 1)}
                        style={{ cursor: 'pointer', transition: 'transform 0.1s ease' }}
                        title="Bấm để đếm"
                      >
                        {visualContext.itemEmoji}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Added or Removed extra items if 2-step */}
            {visualContext.addedItems ? (
              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>➕ Thêm ngoài: {visualContext.addedItems} {visualContext.itemEmoji}</span>
              </div>
            ) : null}

            {visualContext.removedItems ? (
              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>➖ Bớt đi: {visualContext.removedItems} {visualContext.itemEmoji}</span>
              </div>
            ) : null}
          </div>
        ) : (
          /* General Addition/Subtraction Item Visual */
          <div>
            <div style={{ fontSize: '1.1rem', color: '#fef08a', fontWeight: 800, marginBottom: '20px' }}>
              Ban đầu: {visualContext.initialItems} {visualContext.itemEmoji}
              {visualContext.addedItems && `  ➔  Thêm: +${visualContext.addedItems} ${visualContext.itemEmoji}`}
              {visualContext.removedItems && `  ➔  Bớt đi: -${visualContext.removedItems} ${visualContext.itemEmoji}`}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '2rem',
                maxWidth: '680px',
                margin: '0 auto 24px',
              }}
            >
              {Array.from({ length: Math.min(50, visualContext.initialItems || 10) }).map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setClickedItemCount((c) => c + 1)}
                  style={{ cursor: 'pointer' }}
                  title="Bấm để đếm"
                >
                  {visualContext.itemEmoji}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Click-to-count Interaction Ticker */}
        <div style={{ marginTop: '24px', fontSize: '0.9rem', color: '#94a3b8' }}>
          💡 Tony có thể bấm trực tiếp vào các hình {visualContext.itemEmoji} trên màn hình để tập đếm!
          {clickedItemCount > 0 && (
            <span style={{ color: '#4ade80', marginLeft: '8px', fontWeight: 800 }}>
              (Đã bấm đếm: {clickedItemCount} lần)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useDivisionStore } from '../useDivisionStore';
import { DIVISION_PUZZLES } from '../data/divisionCatalog';

export const VisualDivisionPuzzlesView: React.FC = () => {
  const {
    selectedPuzzleId,
    selectPuzzle,
    puzzlePlacedItems,
    puzzleUnassigned,
    puzzleCompleted,
    puzzleFeedback,
    addItemToGroup,
    removeItemFromGroup,
    resetCurrentPuzzle,
    checkPuzzleSolution,
  } = useDivisionStore();

  const currentPuzzle = DIVISION_PUZZLES.find((p) => p.id === selectedPuzzleId) || DIVISION_PUZZLES[0];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Puzzle Selector Ribbon */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px',
        }}
      >
        {DIVISION_PUZZLES.map((puzzle, idx) => (
          <button
            key={puzzle.id}
            onClick={() => selectPuzzle(puzzle.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              background:
                selectedPuzzleId === puzzle.id
                  ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                  : 'rgba(30, 41, 59, 0.7)',
              border: selectedPuzzleId === puzzle.id ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{puzzle.itemIcon}</span>
            <span>Câu {idx + 1}: {puzzle.title}</span>
          </button>
        ))}
      </div>

      {/* Main Puzzle Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#38bdf8',
                marginBottom: '4px',
              }}
            >
              {currentPuzzle.title}
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{currentPuzzle.description}</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Phần thưởng:</span>
            <div style={{ color: '#facc15', fontWeight: 800, fontSize: '0.95rem' }}>
              ⭐ +{currentPuzzle.rewardExp} EXP &nbsp;|&nbsp; 🪙 +{currentPuzzle.rewardGold} Vàng
            </div>
          </div>
        </div>

        {/* Unassigned Pool Banner */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Vật phẩm đang có:</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fef08a' }}>
              {currentPuzzle.totalItems} {currentPuzzle.itemIcon}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Chưa chia vào nhóm:</span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                background: puzzleUnassigned > 0 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: puzzleUnassigned > 0 ? '#facc15' : '#34d399',
                fontWeight: 900,
                fontSize: '1.2rem',
              }}
            >
              {puzzleUnassigned}
            </span>
          </div>

          <button
            onClick={resetCurrentPuzzle}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'transparent',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            🔄 Xếp lại từ đầu
          </button>
        </div>

        {/* Target Containers Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {puzzlePlacedItems.map((count, idx) => (
            <div
              key={idx}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: count === currentPuzzle.itemsPerGroup ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                boxShadow: count === currentPuzzle.itemsPerGroup ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
                {currentPuzzle.containerIcon}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
                {currentPuzzle.containerName} {idx + 1}
              </div>

              {/* Items in container */}
              <div
                style={{
                  minHeight: '60px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '1.4rem',
                  marginBottom: '12px',
                }}
              >
                {Array.from({ length: count }).map((_, itemIdx) => (
                  <span key={itemIdx}>{currentPuzzle.itemIcon}</span>
                ))}
                {count === 0 && <span style={{ color: '#475569', fontSize: '0.85rem' }}>(Trống)</span>}
              </div>

              {/* Stepper Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button
                  disabled={count <= 0}
                  onClick={() => removeItemFromGroup(idx)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    color: '#f87171',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    cursor: count <= 0 ? 'not-allowed' : 'pointer',
                    opacity: count <= 0 ? 0.3 : 1,
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', minWidth: '24px', lineHeight: '32px' }}>
                  {count}
                </span>
                <button
                  disabled={puzzleUnassigned <= 0}
                  onClick={() => addItemToGroup(idx)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    cursor: puzzleUnassigned <= 0 ? 'not-allowed' : 'pointer',
                    opacity: puzzleUnassigned <= 0 ? 0.3 : 1,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Check Solution Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={checkPuzzleSolution}
            style={{
              padding: '14px 36px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.5)',
            }}
          >
            ✨ Kiểm Tra Kết Quả Chia Đều
          </button>
        </div>

        {/* Feedback Alert */}
        {puzzleFeedback && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px 20px',
              borderRadius: '14px',
              background: puzzleCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: puzzleCompleted ? '2px solid #10b981' : '1px solid #f59e0b',
              color: puzzleCompleted ? '#34d399' : '#fef08a',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.05rem',
            }}
          >
            {puzzleFeedback}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useWordProblemStore } from '../useWordProblemStore';
import { WORD_PROBLEMS_CATALOG } from '../data/wordProblemsCatalog';
import type { WordProblemCategory } from '../../../types/wordProblem';

export const WordProblemCatalogView: React.FC = () => {
  const { selectProblem, progress } = useWordProblemStore();
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Tất Cả Bài Toán' },
    { id: 'addition', label: 'Phép Cộng (+)' },
    { id: 'subtraction', label: 'Phép Trừ (-)' },
    { id: 'multiplication', label: 'Phép Nhân (×)' },
    { id: 'division', label: 'Phép Chia (:)' },
    { id: 'two_step_mixed', label: 'Toán 2 Bước (Lớp 3)' },
  ];

  const filtered = WORD_PROBLEMS_CATALOG.filter(
    (p) => selectedCat === 'all' || p.category === selectedCat
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background:
                selectedCat === cat.id
                  ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                  : 'rgba(30, 41, 59, 0.7)',
              border: selectedCat === cat.id ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Problems Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '18px',
        }}
      >
        {filtered.map((problem) => {
          const isSolved = progress?.solvedProblemIds.includes(problem.id);

          return (
            <div
              key={problem.id}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: isSolved ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isSolved ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{problem.visualContext.itemEmoji}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: problem.gradeLevel === 'grade-3' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: problem.gradeLevel === 'grade-3' ? '#facc15' : '#38bdf8',
                      }}
                    >
                      {problem.gradeLevel === 'grade-3' ? 'Lớp 3' : 'Lớp 2'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: isSolved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.15)',
                        color: isSolved ? '#34d399' : '#94a3b8',
                      }}
                    >
                      {isSolved ? '✓ Đã giải' : 'Chưa giải'}
                    </span>
                  </div>
                </div>

                <h4
                  style={{
                    fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  {problem.title}
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  {problem.prompt.length > 100 ? `${problem.prompt.slice(0, 100)}...` : problem.prompt}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#facc15', fontWeight: 700 }}>
                  {problem.steps.length === 1 ? '1 bước tính' : '⚡ 2 bước tính'}
                </span>
                <button
                  onClick={() => selectProblem(problem.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {isSolved ? 'Luyện Lại' : 'Bắt Đầu Giải'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

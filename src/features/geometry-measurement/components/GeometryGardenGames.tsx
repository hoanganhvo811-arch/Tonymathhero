import React, { useState } from 'react';
import { Sparkles, CheckCircle2, HelpCircle, ArrowRight, Brain } from 'lucide-react';
import type { GeometryPuzzle } from '../data/geometryPuzzlesCatalog';

interface GeometryGardenGamesProps {
  currentPuzzle: GeometryPuzzle;
  solvedCount: number;
  totalPuzzles: number;
  onSubmitAnswer: (answer: string) => boolean;
  onNextPuzzle: () => void;
}

export const GeometryGardenGames: React.FC<GeometryGardenGamesProps> = ({
  currentPuzzle,
  solvedCount,
  totalPuzzles,
  onSubmitAnswer,
  onNextPuzzle,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answeredState, setAnsweredState] = useState<{ isCorrect: boolean; submitted: boolean }>({
    isCorrect: false,
    submitted: false,
  });

  const handleSelect = (option: string) => {
    if (answeredState.submitted) return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || answeredState.submitted) return;
    const isCorrect = onSubmitAnswer(selectedOption);
    setAnsweredState({ isCorrect, submitted: true });
  };

  const handleNext = () => {
    setSelectedOption(null);
    setAnsweredState({ isCorrect: false, submitted: false });
    onNextPuzzle();
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #10b981',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(16, 185, 129, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header & Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 800 }}>
            <Brain size={22} />
            <span style={{ fontSize: '1.25rem' }}>Vườn Hình Dạng & Thử Thách Câu Đố</span>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Chuyên đề: {currentPuzzle.skill} ({currentPuzzle.gradeLevel === 'grade-3' ? 'Lớp 3' : 'Lớp 2'})
          </span>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '12px', padding: '6px 14px', color: '#34d399', fontWeight: 800, fontSize: '0.85rem' }}>
          Đã giải: {solvedCount} / {totalPuzzles} câu
        </div>
      </div>

      {/* Question Statement */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '20px',
        }}
      >
        <p style={{ color: '#f8fafc', fontSize: '1.15rem', fontWeight: 800, lineHeight: '1.6' }}>
          {currentPuzzle.questionText}
        </p>
      </div>

      {/* Multiple Choice Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {currentPuzzle.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === currentPuzzle.correctAnswer;
          let btnBg = 'rgba(30, 41, 59, 0.7)';
          let btnBorder = '1px solid rgba(255, 255, 255, 0.12)';
          let textColor = '#cbd5e1';

          if (answeredState.submitted) {
            if (isCorrect) {
              btnBg = 'rgba(16, 185, 129, 0.25)';
              btnBorder = '2px solid #10b981';
              textColor = '#34d399';
            } else if (isSelected && !isCorrect) {
              btnBg = 'rgba(239, 68, 68, 0.25)';
              btnBorder = '2px solid #ef4444';
              textColor = '#f87171';
            }
          } else if (isSelected) {
            btnBg = 'rgba(56, 189, 248, 0.25)';
            btnBorder = '2px solid #38bdf8';
            textColor = '#38bdf8';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              disabled={answeredState.submitted}
              style={{
                background: btnBg,
                border: btnBorder,
                borderRadius: '14px',
                padding: '16px 20px',
                color: textColor,
                fontSize: '1rem',
                fontWeight: 800,
                cursor: answeredState.submitted ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          );
        })}
      </div>

      {/* Action / Next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HelpCircle size={16} /> Gợi ý: {currentPuzzle.hintVi}
        </div>

        {!answeredState.submitted ? (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: selectedOption
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontWeight: 800,
              border: 'none',
              cursor: selectedOption ? 'pointer' : 'not-allowed',
              boxShadow: selectedOption ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none',
            }}
          >
            Trả Lời
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              color: '#fff',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Câu Tiếp Theo <ArrowRight size={18} />
          </button>
        )}
      </div>

      {/* Answer Explanation */}
      {answeredState.submitted && (
        <div
          style={{
            background: answeredState.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1.5px solid ${answeredState.isCorrect ? '#10b981' : '#ef4444'}`,
            borderRadius: '14px',
            padding: '16px',
            color: '#f8fafc',
            fontSize: '0.9rem',
            lineHeight: '1.6',
          }}
        >
          <div style={{ fontWeight: 800, color: answeredState.isCorrect ? '#34d399' : '#f87171', marginBottom: '4px' }}>
            {answeredState.isCorrect ? '🎉 Hoàn toàn chính xác!' : '⚠️ Chưa đúng rồi Tony ơi!'}
          </div>
          <div>{currentPuzzle.explanationVi}</div>
        </div>
      )}
    </div>
  );
};

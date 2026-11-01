import React, { useState } from 'react';
import { useDivisionStore } from '../useDivisionStore';
import { DIVISION_TABLES } from '../data/divisionCatalog';

export const DivisionPracticeCenterView: React.FC = () => {
  const {
    currentQuestion,
    isHintActive,
    isAnswered,
    isLastAnswerCorrect,
    selectedTable,
    setSelectedTable,
    submitPracticeAnswer,
    nextPracticeQuestion,
    toggleHint,
    progress,
  } = useDivisionStore();

  const [inputAnswer, setInputAnswer] = useState<string>('');

  if (!currentQuestion) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#cbd5e1' }}>
        Đang chuẩn bị câu hỏi luyện tập...
      </div>
    );
  }

  const handleSelectOption = (option: string | number) => {
    if (isAnswered) return;
    submitPracticeAnswer(option);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !inputAnswer.trim()) return;
    submitPracticeAnswer(inputAnswer.trim());
    setInputAnswer('');
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Top Bar with Table Filter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Bảng chia:</span>
          {DIVISION_TABLES.map((t) => {
            const isUnlocked = progress?.unlockedTables.includes(t) ?? true;
            return (
              <button
                key={t}
                onClick={() => isUnlocked && setSelectedTable(t)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: selectedTable === t ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                  background: selectedTable === t ? '#0284c7' : 'rgba(30, 41, 59, 0.7)',
                  color: isUnlocked ? '#ffffff' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <button
          onClick={toggleHint}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            border: isHintActive ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
            background: isHintActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(30, 41, 59, 0.8)',
            color: isHintActive ? '#fbbf24' : '#cbd5e1',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>💡</span>
          <span>{isHintActive ? 'Ẩn Gợi Ý' : 'Hiện Gợi Ý'}</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        {/* Question Type Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
            }}
          >
            {currentQuestion.type === 'MULTIPLE_CHOICE' && 'Trắc nghiệm'}
            {currentQuestion.type === 'FILL_QUOTIENT' && 'Điền kết quả'}
            {currentQuestion.type === 'FILL_MISSING' && 'Tìm số còn thiếu'}
            {currentQuestion.type === 'FIND_EQUATION' && 'Tìm phép tính đúng'}
            {currentQuestion.type === 'INVERSE_MULTIPLICATION' && 'Quan hệ Nhân - Chia'}
            {currentQuestion.type === 'WORD_PROBLEM' && 'Toán có lời văn'}
            {currentQuestion.type === 'REAL_WORLD' && 'Toán thực tế'}
          </span>

          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Bảng chia {selectedTable}
          </span>
        </div>

        {/* Prompt Header */}
        <h3
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
            fontSize: '1.45rem',
            color: '#ffffff',
            lineHeight: 1.5,
            marginBottom: '20px',
          }}
        >
          {currentQuestion.prompt}
        </h3>

        {/* Formula Display Banner */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#fef08a',
            marginBottom: '24px',
            letterSpacing: '0.04em',
          }}
        >
          {currentQuestion.formulaDisplay}
        </div>

        {/* Hint Box */}
        {isHintActive && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fef3c7',
              fontSize: '0.9rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>💡</span>
            <span>{currentQuestion.hint}</span>
          </div>
        )}

        {/* Answer Selection: Multiple Choice or Fill-in */}
        {currentQuestion.options ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: currentQuestion.options.length > 2 ? 'repeat(2, 1fr)' : '1fr',
              gap: '14px',
            }}
          >
            {currentQuestion.options.map((opt, idx) => {
              const isCorrectOpt = String(opt) === String(currentQuestion.correctAnswer);
              const isSelected = isAnswered;

              let btnBorder = '1px solid rgba(255, 255, 255, 0.15)';
              let btnBg = 'rgba(30, 41, 59, 0.8)';
              let btnColor = '#ffffff';

              if (isAnswered) {
                if (isCorrectOpt) {
                  btnBorder = '2px solid #10b981';
                  btnBg = 'rgba(16, 185, 129, 0.3)';
                  btnColor = '#34d399';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: btnBorder,
                    background: btnBg,
                    color: btnColor,
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    cursor: isAnswered ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'center',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleInputSubmit} style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <input
              type="text"
              disabled={isAnswered}
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              placeholder="Nhập kết quả..."
              style={{
                width: '180px',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '2px solid #38bdf8',
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: 900,
                textAlign: 'center',
              }}
            />
            <button
              type="submit"
              disabled={isAnswered || !inputAnswer.trim()}
              style={{
                padding: '12px 28px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.05rem',
                border: 'none',
                cursor: isAnswered ? 'default' : 'pointer',
              }}
            >
              Xác Nhận
            </button>
          </form>
        )}

        {/* Feedback on Answer */}
        {isAnswered && (
          <div
            style={{
              marginTop: '24px',
              padding: '18px 20px',
              borderRadius: '16px',
              background: isLastAnswerCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: isLastAnswerCorrect ? '2px solid #10b981' : '2px solid #ef4444',
            }}
          >
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 900,
                color: isLastAnswerCorrect ? '#34d399' : '#f87171',
                marginBottom: '6px',
              }}
            >
              {isLastAnswerCorrect ? '🎉 CHÍNH XÁC! TUYỆT VỜI LẮM TONY!' : '❌ CHƯA CHÍNH XÁC!'}
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '14px' }}>
              {currentQuestion.explanation}
            </p>

            <button
              onClick={nextPracticeQuestion}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              }}
            >
              Câu Tiếp Theo ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

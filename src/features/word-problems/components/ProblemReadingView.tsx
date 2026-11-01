import React from 'react';
import { useWordProblemStore } from '../useWordProblemStore';
import { WORD_PROBLEMS_CATALOG } from '../data/wordProblemsCatalog';

export const ProblemReadingView: React.FC = () => {
  const {
    selectedProblemId,
    solvingStage,
    selectedGivenIds,
    isQuestionIdentified,
    toggleGiven,
    identifyQuestion,
    proceedToAnalyzing,
    proceedToStepSolving,
    speakText,
    feedbackMessage,
    feedbackType,
  } = useWordProblemStore();

  const problem = WORD_PROBLEMS_CATALOG.find((p) => p.id === selectedProblemId) || WORD_PROBLEMS_CATALOG[0];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', color: '#f8fafc' }}>
      {/* 3-Step Wizard Navigation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: solvingStage === 'reading' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            border: solvingStage === 'reading' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '14px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: solvingStage === 'reading' ? '#38bdf8' : '#94a3b8', fontWeight: 800 }}>
            BƯỚC 1
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
            📖 Đọc Đề & Dữ Kiện
          </div>
        </div>

        <div
          style={{
            background: solvingStage === 'analyzing' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            border: solvingStage === 'analyzing' ? '2px solid #facc15' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '14px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: solvingStage === 'analyzing' ? '#facc15' : '#94a3b8', fontWeight: 800 }}>
            BƯỚC 2
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
            🔍 Phân Tích Câu Hỏi
          </div>
        </div>

        <div
          style={{
            background: solvingStage === 'step_by_step' || solvingStage === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.6)',
            border: solvingStage === 'step_by_step' || solvingStage === 'completed' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '14px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: solvingStage === 'step_by_step' ? '#10b981' : '#94a3b8', fontWeight: 800 }}>
            BƯỚC 3
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
            ⚡ Chọn Phép Tính & Giải
          </div>
        </div>
      </div>

      {/* Main Problem Reading Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          marginBottom: '24px',
          position: 'relative',
        }}
      >
        {/* Title & Speech */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>{problem.visualContext.itemEmoji}</span>
            <h3
              style={{
                fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#38bdf8',
              }}
            >
              {problem.title}
            </h3>
          </div>

          <button
            onClick={() => speakText(problem.prompt)}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔊</span>
            <span>Nghe Đọc Đề Bài</span>
          </button>
        </div>

        {/* Prompt Content */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: '#f8fafc',
            marginBottom: '24px',
          }}
        >
          {problem.prompt}
        </div>

        {/* STAGE 1: ĐỀ BÀI CHO BIẾT GÌ? */}
        {solvingStage === 'reading' && (
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#facc15', marginBottom: '12px' }}>
              📍 1. ĐỀ BÀI CHO BIẾT GÌ? (Tony hãy bấm chọn các dữ kiện quan trọng):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {problem.givens.map((given) => {
                const isSelected = selectedGivenIds.includes(given.id);
                return (
                  <button
                    key={given.id}
                    onClick={() => toggleGiven(given.id)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '14px',
                      background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.7)',
                      border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                      color: isSelected ? '#38bdf8' : '#cbd5e1',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span>{isSelected ? '☑️' : '⬜'}</span>
                    <span>{given.text} ({given.value} {given.unit})</span>
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#facc15', marginBottom: '12px' }}>
              ❓ 2. BÀI TOÁN HỎI GÌ? (Bấm để xác nhận câu hỏi):
            </div>

            <button
              onClick={identifyQuestion}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '14px',
                background: isQuestionIdentified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.7)',
                border: isQuestionIdentified ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isQuestionIdentified ? '#34d399' : '#cbd5e1',
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <span>{isQuestionIdentified ? '🎯' : '⚪'}</span>
              <span>{problem.question}</span>
            </button>

            {/* Next Stage Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={proceedToAnalyzing}
                style={{
                  padding: '14px 36px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)',
                }}
              >
                Tiếp Tục Phân Tích ➔
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: PHÂN TÍCH QUAN HỆ & CHUẨN BỊ GIẢI */}
        {solvingStage === 'analyzing' && (
          <div>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <h4 style={{ color: '#facc15', fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>
                🧠 Phân Tích Tư Duy Toán Học
              </h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '14px' }}>
                {problem.steps.length === 1
                  ? 'Đây là bài toán 1 bước tính. Tony hãy suy nghĩ xem hành động của bài toán tương ứng với phép tính nào: Gộp lại (+) hay Bớt đi (-) hay Lặp lại nhiều nhóm (×) hay Chia đều (:)?'
                  : 'Đây là bài toán 2 bước tính! Để tìm được đáp án cuối cùng, Tony cần tìm một kết quả trung gian trước ở Bước 1.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {problem.steps.map((st, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#38bdf8',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    Bước {st.stepIndex}: {st.subGoal}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={proceedToStepSolving}
                style={{
                  padding: '14px 36px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                }}
              >
                Vào Giải Từng Bước ➔
              </button>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            style={{
              marginTop: '20px',
              padding: '14px 18px',
              borderRadius: '12px',
              background: feedbackType === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              border: feedbackType === 'error' ? '1px solid #ef4444' : '1px solid #10b981',
              color: feedbackType === 'error' ? '#fca5a5' : '#34d399',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            {feedbackMessage}
          </div>
        )}
      </div>
    </div>
  );
};

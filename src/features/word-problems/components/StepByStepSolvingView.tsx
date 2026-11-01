import React from 'react';
import { useWordProblemStore } from '../useWordProblemStore';
import { WORD_PROBLEMS_CATALOG } from '../data/wordProblemsCatalog';
import type { OperationType } from '../../../types/wordProblem';

export const StepByStepSolvingView: React.FC = () => {
  const {
    selectedProblemId,
    solvingStage,
    step1Operation,
    step1Value,
    step1Passed,
    step2Operation,
    step2Value,
    step2Passed,
    currentHintLevel,
    feedbackMessage,
    feedbackType,
    setStep1Operation,
    setStep1Value,
    verifyStep1,
    setStep2Operation,
    setStep2Value,
    verifyStep2,
    requestNextHint,
    selectProblem,
    setActiveTab,
  } = useWordProblemStore();

  const problem = WORD_PROBLEMS_CATALOG.find((p) => p.id === selectedProblemId) || WORD_PROBLEMS_CATALOG[0];

  const operations: { id: OperationType; label: string; icon: string }[] = [
    { id: 'addition', label: 'Cộng (+)', icon: '➕' },
    { id: 'subtraction', label: 'Trừ (-)', icon: '➖' },
    { id: 'multiplication', label: 'Nhân (×)', icon: '✖️' },
    { id: 'division', label: 'Chia (:)', icon: '➗' },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Problem Summary Bar */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '18px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Đang giải bài toán:</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8' }}>
            {problem.title}
          </div>
        </div>

        {/* 3-Tier Hint Trigger */}
        <button
          onClick={requestNextHint}
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            background: currentHintLevel > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(30, 41, 59, 0.8)',
            border: currentHintLevel > 0 ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
            color: currentHintLevel > 0 ? '#fbbf24' : '#cbd5e1',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>💡</span>
          <span>{currentHintLevel === 0 ? 'Cần Gợi Ý (Cấp 1)' : `Gợi Ý (Cấp ${currentHintLevel}/3)`}</span>
        </button>
      </div>

      {/* Progressive Hints Box */}
      {currentHintLevel > 0 && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid #f59e0b',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px',
            color: '#fef3c7',
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: '6px', color: '#fbbf24', fontSize: '0.95rem' }}>
            💡 HƯỚNG DẪN TỪNG BƯỚC:
          </div>
          {currentHintLevel >= 1 && (
            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
              • <strong>Gợi ý định hướng:</strong> {problem.hints.tier1_nudge}
            </div>
          )}
          {currentHintLevel >= 2 && (
            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
              • <strong>Phân tích quan hệ:</strong> {problem.hints.tier2_guidance}
            </div>
          )}
          {currentHintLevel >= 3 && (
            <div style={{ fontSize: '0.9rem' }}>
              • <strong>Chỉ dẫn chi tiết:</strong> {problem.hints.tier3_walkthrough}
            </div>
          )}
        </div>
      )}

      {/* Main Solving Box */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          marginBottom: '24px',
        }}
      >
        {/* STEP 1 SECTION */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step1Passed ? '#10b981' : '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.95rem',
              }}
            >
              {step1Passed ? '✓' : '1'}
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              Bước 1: {problem.steps[0].subGoal}
            </span>
          </div>

          {/* Operation Selector for Step 1 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
              Chọn phép tính thích hợp:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {operations.map((op) => (
                <button
                  key={op.id}
                  disabled={step1Passed}
                  onClick={() => setStep1Operation(op.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: step1Operation === op.id ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)',
                    background: step1Operation === op.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                    color: step1Operation === op.id ? '#38bdf8' : '#ffffff',
                    fontWeight: 800,
                    cursor: step1Passed ? 'default' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{op.icon}</span>
                  <span style={{ fontSize: '0.85rem' }}>{op.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Input for Step 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>Kết quả tính được:</span>
            <input
              type="number"
              disabled={step1Passed}
              value={step1Value}
              onChange={(e) => setStep1Value(e.target.value)}
              placeholder="Nhập số..."
              style={{
                width: '120px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '2px solid #38bdf8',
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#ffffff',
                fontSize: '1.2rem',
                fontWeight: 900,
                textAlign: 'center',
              }}
            />
            <span style={{ fontWeight: 700, color: '#facc15' }}>{problem.steps[0].unit}</span>

            {!step1Passed && (
              <button
                onClick={verifyStep1}
                disabled={!step1Operation || !step1Value.trim()}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  border: 'none',
                  cursor: !step1Operation || !step1Value.trim() ? 'not-allowed' : 'pointer',
                  opacity: !step1Operation || !step1Value.trim() ? 0.5 : 1,
                }}
              >
                Kiểm Tra Bước 1
              </button>
            )}
          </div>
        </div>

        {/* STEP 2 SECTION (If Two-Step Problem) */}
        {problem.steps.length > 1 && (
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              opacity: step1Passed ? 1 : 0.4,
              pointerEvents: step1Passed ? 'auto' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step2Passed ? '#10b981' : '#f59e0b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                }}
              >
                {step2Passed ? '✓' : '2'}
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                Bước 2: {problem.steps[1].subGoal}
              </span>
            </div>

            {/* Operation Selector for Step 2 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                Chọn phép tính cho bước 2 (kết hợp kết quả Bước 1):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {operations.map((op) => (
                  <button
                    key={op.id}
                    disabled={step2Passed}
                    onClick={() => setStep2Operation(op.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: step2Operation === op.id ? '2px solid #facc15' : '1px solid rgba(255,255,255,0.15)',
                      background: step2Operation === op.id ? 'rgba(250, 204, 21, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                      color: step2Operation === op.id ? '#facc15' : '#ffffff',
                      fontWeight: 800,
                      cursor: step2Passed ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{op.icon}</span>
                    <span style={{ fontSize: '0.85rem' }}>{op.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Input for Step 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>Đáp số cuối cùng:</span>
              <input
                type="number"
                disabled={step2Passed}
                value={step2Value}
                onChange={(e) => setStep2Value(e.target.value)}
                placeholder="Nhập số..."
                style={{
                  width: '120px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid #facc15',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  textAlign: 'center',
                }}
              />
              <span style={{ fontWeight: 700, color: '#facc15' }}>{problem.finalUnit}</span>

              {!step2Passed && (
                <button
                  onClick={verifyStep2}
                  disabled={!step2Operation || !step2Value.trim()}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: 'none',
                    cursor: !step2Operation || !step2Value.trim() ? 'not-allowed' : 'pointer',
                    opacity: !step2Operation || !step2Value.trim() ? 0.5 : 1,
                  }}
                >
                  Kiểm Tra Bước 2
                </button>
              )}
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

        {/* Completed Fanfare & Full Solution */}
        {solvingStage === 'completed' && (
          <div
            style={{
              marginTop: '24px',
              padding: '24px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '2px solid #10b981',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399', marginBottom: '6px' }}>
              CHÚC MỪNG TONY ĐÃ HOÀN THÀNH BÀI TOÁN!
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '16px' }}>
              Tony đã nắm vững tình huống và trình bày lời giải chính xác.
            </p>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'left',
                color: '#fef08a',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '20px',
                whiteSpace: 'pre-line',
              }}
            >
              {problem.fullSolutionMarkdown}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setActiveTab('catalog')}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Chọn Bài Toán Khác ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

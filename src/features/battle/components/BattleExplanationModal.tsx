import React, { useState } from 'react';
import type { AnswerEvaluation } from '@/types/battle';
import type { MathQuestion } from '@/types/math';
import { MistakeAnalysisService } from '@/features/adaptive/services/mistakeAnalysisService';

interface BattleExplanationModalProps {
  isOpen: boolean;
  evaluation?: AnswerEvaluation;
  question: MathQuestion | null;
  onDismiss: () => void;
}

export const BattleExplanationModal: React.FC<BattleExplanationModalProps> = ({
  isOpen,
  evaluation,
  question,
  onDismiss,
}) => {
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(1);

  if (!isOpen || !question || !evaluation) return null;

  // Diagnose mistake category and generate progressive 3-tier hints
  const diagnosis = MistakeAnalysisService.diagnoseMistake(question, evaluation.userAnswer);
  const hints = MistakeAnalysisService.generate3TierHint(question, diagnosis.category);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '2px solid #38bdf8',
          borderRadius: '24px',
          padding: '26px 30px',
          maxWidth: '580px',
          width: '100%',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.9), 0 0 24px rgba(56, 189, 248, 0.3)',
          animation: 'fadeInUp 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Header Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.2)',
              border: '2px solid #38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            💡
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', fontWeight: 800 }}>
              HỆ THỐNG GỢI Ý THÔNG MINH CÙNG BÉ TIÊN
            </h3>
            <div style={{ margin: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Dạng lỗi nhận diện:</span>
              <span
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                }}
              >
                {diagnosis.categoryVi}
              </span>
            </div>
          </div>
        </div>

        {/* Question Recap Box */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '6px', fontWeight: 600 }}>
            Đề bài: {question.questionText}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem' }}>
            <span style={{ color: '#f87171' }}>
              ❌ Bạn chọn: <strong>{evaluation.userAnswer}</strong>
            </span>
            <span style={{ color: '#4ade80' }}>
              ✔️ Đáp án đúng: <strong>{evaluation.correctAnswer}</strong>
            </span>
          </div>
        </div>

        {/* 3-Tier Progressive Hint Tabs */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              onClick={() => setActiveTier(1)}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTier === 1 ? '#0284c7' : 'rgba(30, 41, 59, 0.8)',
                color: activeTier === 1 ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              💡 Cấp 1: Gợi Ý Nhẹ
            </button>
            <button
              onClick={() => setActiveTier(2)}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTier === 2 ? '#0284c7' : 'rgba(30, 41, 59, 0.8)',
                color: activeTier === 2 ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              📖 Cấp 2: Hướng Dẫn
            </button>
            <button
              onClick={() => setActiveTier(3)}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTier === 3 ? '#0284c7' : 'rgba(30, 41, 59, 0.8)',
                color: activeTier === 3 ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              ⭐ Cấp 3: Lời Giải
            </button>
          </div>

          {/* Tier Content Box */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '12px',
              padding: '14px 18px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {activeTier === 1 && (
              <div>
                <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                  HƯỚNG TƯ DUY:
                </div>
                <div style={{ color: '#f1f5f9', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {hints.tier1Nudge}
                </div>
              </div>
            )}

            {activeTier === 2 && (
              <div>
                <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                  CÁC BƯỚC THỰC HIỆN:
                </div>
                <div style={{ color: '#f1f5f9', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {hints.tier2Guidance}
                </div>
              </div>
            )}

            {activeTier === 3 && (
              <div>
                <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                  GIẢI THÍCH CHI TIẾT & VÍ DỤ TƯƠNG TỰ:
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '8px' }}>
                  {hints.tier3Explanation}
                </div>
                {hints.analogousExample && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#a7f3d0',
                      fontSize: '0.82rem',
                    }}
                  >
                    {hints.analogousExample}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pedagogical Encouragement */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🛡️</span>
          <span style={{ color: '#fef3c7', fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.4 }}>
            Tony đã đỡ đòn thành công. Mỗi lần xem gợi ý là một lần nâng cấp khiên trí tuệ!
          </span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            border: '2px solid #38bdf8',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          ✨ Tôi Đã Hiểu! Tiếp Tục Chiến Đấu
        </button>
      </div>
    </div>
  );
};

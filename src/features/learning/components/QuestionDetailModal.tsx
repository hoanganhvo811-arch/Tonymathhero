import React from 'react';
import { X, CheckCircle2, XCircle, Clock, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import type { QuestionAttemptRecord } from '@/types';
import { SoundButton } from '@/components/common/SoundButton';

interface Props {
  attempt: QuestionAttemptRecord | null;
  onClose: () => void;
  isG2: boolean;
}

export const QuestionDetailModal: React.FC<Props> = ({ attempt, onClose, isG2 }) => {
  if (!attempt) return null;

  const dateFormatted = new Date(attempt.timestamp).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isCorrect = attempt.firstAttemptResult;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isCorrect ? (
              <CheckCircle2 size={24} color="#10b981" />
            ) : (
              <XCircle size={24} color="#f59e0b" />
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Chi Tiết Câu Hỏi Toán Học
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                {attempt.topicNameVi} • {dateFormatted}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Question Box */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
            ĐỀ BÀI:
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.5 }}>
            {attempt.questionText}
          </div>
        </div>

        {/* Answer comparison */}
        <div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
            LỰA CHỌN CỦA HỌC SINH:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              style={{
                background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Câu trả lời của bé:</div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: isCorrect ? '#34d399' : '#f87171',
                  marginTop: '4px',
                }}
              >
                {attempt.firstAnswer}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Đáp án chính xác:</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                {attempt.correctAnswer}
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogical Explanation & Step-by-step Solution */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#38bdf8',
              marginBottom: '10px',
            }}
          >
            <Lightbulb size={16} /> LỜI GIẢI SƯ PHẠM CHI TIẾT
          </div>

          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 12px 0' }}>
            {attempt.explanation}
          </p>

          {attempt.stepByStepSolution && attempt.stepByStepSolution.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                CÁC BƯỚC TƯ DUY:
              </div>
              {attempt.stepByStepSolution.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '0.82rem',
                    color: '#e2e8f0',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748b',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '12px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> Thời gian giải: {attempt.timeSpentSeconds} giây
          </span>
          <span>Độ khó: {attempt.difficulty}</span>
          <span>Mã câu: {attempt.questionId}</span>
        </div>

        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <SoundButton variant="secondary" size="md" onClick={onClose}>
            Đóng
          </SoundButton>
        </div>
      </div>
    </div>
  );
};

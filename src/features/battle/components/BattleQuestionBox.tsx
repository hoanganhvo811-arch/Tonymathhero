import React, { useState } from 'react';
import type { MathQuestion } from '@/types/math';
import type { SkillType } from '@/types/battle';

interface BattleQuestionBoxProps {
  question: MathQuestion | null;
  selectedSkill: SkillType;
  comboStreak: number;
  playerMp: number;
  isHintActive: boolean;
  onSelectSkill: (skill: SkillType) => void;
  onSubmitAnswer: (chosenAnswer: number | string) => void;
  onToggleHint: () => void;
}

export const BattleQuestionBox: React.FC<BattleQuestionBoxProps> = ({
  question,
  selectedSkill,
  comboStreak,
  playerMp,
  isHintActive,
  onSelectSkill,
  onSubmitAnswer,
  onToggleHint,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!question) {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 32px',
          borderRadius: '16px',
          color: '#94a3b8',
          fontSize: '1rem',
          zIndex: 15,
        }}
      >
        Đang triệu hồi câu hỏi toán học...
      </div>
    );
  }

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    onSubmitAnswer(index);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '820px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 15,
        pointerEvents: 'auto',
      }}
    >
      {/* Skill Selection Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        {/* 1. Basic Strike */}
        <button
          onClick={() => onSelectSkill('basic')}
          style={{
            background:
              selectedSkill === 'basic'
                ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                : 'rgba(15, 23, 42, 0.85)',
            border: selectedSkill === 'basic' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: selectedSkill === 'basic' ? '0 0 16px rgba(56, 189, 248, 0.5)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <span>⚔️</span>
          <span>Kiếm Cơ Bản</span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>(0 MP)</span>
        </button>

        {/* 2. Power Attack */}
        <button
          onClick={() => onSelectSkill('power')}
          disabled={comboStreak < 2}
          style={{
            background:
              selectedSkill === 'power'
                ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                : comboStreak >= 2
                ? 'rgba(15, 23, 42, 0.85)'
                : 'rgba(15, 23, 42, 0.5)',
            border:
              selectedSkill === 'power'
                ? '2px solid #fbbf24'
                : comboStreak >= 2
                ? '1px solid rgba(251, 191, 36, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.05)',
            color: comboStreak >= 2 ? '#fef3c7' : '#64748b',
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: comboStreak >= 2 ? 'pointer' : 'not-allowed',
            boxShadow: selectedSkill === 'power' ? '0 0 16px rgba(251, 191, 36, 0.5)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <span>⚡</span>
          <span>Trảm Sức Mạnh</span>
          <span style={{ fontSize: '0.7rem', color: comboStreak >= 2 ? '#fcd34d' : '#64748b' }}>
            {comboStreak >= 2 ? '(x1.6 Sát thương)' : '(Mở khi Combo x2)'}
          </span>
        </button>

        {/* 3. Magic Arcane Spell */}
        <button
          onClick={() => onSelectSkill('magic')}
          disabled={playerMp < 25}
          style={{
            background:
              selectedSkill === 'magic'
                ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
                : playerMp >= 25
                ? 'rgba(15, 23, 42, 0.85)'
                : 'rgba(15, 23, 42, 0.5)',
            border:
              selectedSkill === 'magic'
                ? '2px solid #c084fc'
                : playerMp >= 25
                ? '1px solid rgba(192, 132, 252, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.05)',
            color: playerMp >= 25 ? '#f3e8ff' : '#64748b',
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: playerMp >= 25 ? 'pointer' : 'not-allowed',
            boxShadow: selectedSkill === 'magic' ? '0 0 16px rgba(192, 132, 252, 0.5)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <span>🔮</span>
          <span>Phép Tinh Tú</span>
          <span style={{ fontSize: '0.7rem', color: playerMp >= 25 ? '#d8b4fe' : '#64748b' }}>(-25 MP)</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.5)',
          borderRadius: '20px',
          padding: '20px 24px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Topic Tag & Hint Button Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                color: '#bae6fd',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '8px',
                textTransform: 'uppercase',
              }}
            >
              {String(question.grade).includes('3') ? 'Lớp 3' : 'Lớp 2'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
              {question.topicNameVi || question.topic}
            </span>
          </div>

          <button
            onClick={onToggleHint}
            style={{
              background: isHintActive ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              border: isHintActive ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.2)',
              color: isHintActive ? '#fde047' : '#cbd5e1',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
            }}
          >
            <span>💡</span>
            <span>{isHintActive ? 'Đóng Gợi Ý' : 'Gợi Ý Trợ Thủ'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div
          style={{
            color: '#f8fafc',
            fontSize: '1.2rem',
            fontWeight: 700,
            lineHeight: 1.5,
            marginBottom: '14px',
            textAlign: 'center',
          }}
        >
          {question.questionText}
        </div>

        {/* Visual Prompt (ASCII Column, Diagram, etc.) */}
        {question.visualPrompt && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '10px 16px',
              margin: '0 auto 16px auto',
              maxWidth: '480px',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              color: '#38bdf8',
              whiteSpace: 'pre-wrap',
              textAlign: 'center',
            }}
          >
            {question.visualPrompt}
          </div>
        )}

        {/* Active Fairy Hint Box */}
        {isHintActive && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '12px',
              padding: '10px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>🧚</span>
            <div style={{ color: '#fef3c7', fontSize: '0.85rem', lineHeight: 1.4 }}>
              <strong>Bé Tiên Chỉ Lối:</strong> {question.hint}
            </div>
          </div>
        )}

        {/* 4 Answer Options (A, B, C, D) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                style={{
                  background: 'rgba(30, 41, 59, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '14px',
                  padding: '12px 18px',
                  color: '#f8fafc',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                  e.currentTarget.style.borderColor = '#38bdf8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.85)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8',
                    borderRadius: '8px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {letter}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Brain, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import type { MentalStrategyExample } from '../../../types/numberSense';
import { MENTAL_STRATEGIES_CATALOG } from '../data/mentalStrategiesCatalog';

interface MentalStrategyLabViewProps {
  activeStrategy: MentalStrategyExample;
  feedback: { message: string; isSuccess?: boolean } | null;
  onSelectStrategy: (stratId: string) => void;
  onSubmitPractice: (userAnswer: number) => boolean;
}

export const MentalStrategyLabView: React.FC<MentalStrategyLabViewProps> = ({
  activeStrategy,
  feedback,
  onSelectStrategy,
  onSubmitPractice,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelectOption = (opt: number) => {
    setSelectedOption(opt);
    onSubmitPractice(opt);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #8b5cf6',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(139, 92, 246, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', fontWeight: 800, marginBottom: '6px' }}>
          <Brain size={22} />
          <span style={{ fontSize: '1.25rem' }}>Viện Chiến Lược Tính Nhẩm – Tinh Hoa Toán Học</span>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
          Khám phá các bí quyết tính nhẩm thần tốc mà không cần đặt bút tính dọc!
        </p>
      </div>

      {/* Strategy Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {MENTAL_STRATEGIES_CATALOG.map((st) => {
          const isSelected = activeStrategy.id === st.id;
          return (
            <button
              key={st.id}
              onClick={() => {
                setSelectedOption(null);
                onSelectStrategy(st.id);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                background: isSelected ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'rgba(30, 41, 59, 0.8)',
                color: isSelected ? '#fff' : '#cbd5e1',
                border: isSelected ? '1.5px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {st.titleVi.split(':')[0]}
            </button>
          );
        })}
      </div>

      {/* Active Strategy Demonstration */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <h3 style={{ color: '#c084fc', fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>
            {activeStrategy.titleVi}
          </h3>
          <span style={{ color: '#facc15', fontSize: '1.2rem', fontWeight: 900 }}>
            Ví dụ mẫu: {activeStrategy.originalProblem} = {activeStrategy.finalAnswer}
          </span>
        </div>

        {/* 3 Step Decomposition Walkthrough */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {activeStrategy.steps.map((st) => (
            <div
              key={st.stepIndex}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1.5px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800 }}>
                BƯỚC {st.stepIndex}: {st.titleVi}
              </div>
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid #8b5cf6',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#facc15',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textAlign: 'center',
                }}
              >
                {st.expressionDisplay}
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                {st.explanationVi}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Practice Challenge */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1.5px solid #facc15',
          borderRadius: '18px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#facc15', fontWeight: 800 }}>
          <Lightbulb size={20} />
          <span>Thử Thách Vận Dụng Cho Tony:</span>
        </div>

        <p style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
          {activeStrategy.interactivePractice.promptVi}
        </p>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {activeStrategy.interactivePractice.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === activeStrategy.interactivePractice.correctAnswer;
            let bg = 'rgba(15, 23, 42, 0.8)';
            let border = '1px solid rgba(255,255,255,0.15)';
            let col = '#f8fafc';

            if (selectedOption !== null) {
              if (isCorrect) {
                bg = 'rgba(16, 185, 129, 0.3)';
                border = '2px solid #10b981';
                col = '#34d399';
              } else if (isSelected) {
                bg = 'rgba(239, 68, 68, 0.3)';
                border = '2px solid #ef4444';
                col = '#f87171';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                style={{
                  padding: '14px',
                  background: bg,
                  border,
                  borderRadius: '12px',
                  color: col,
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '14px',
            background: feedback.isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1.5px solid ${feedback.isSuccess ? '#10b981' : '#ef4444'}`,
            color: feedback.isSuccess ? '#34d399' : '#f87171',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          {feedback.isSuccess ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <div>{feedback.message}</div>
        </div>
      )}
    </div>
  );
};

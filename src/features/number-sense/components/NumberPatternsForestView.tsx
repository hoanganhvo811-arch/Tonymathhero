import React, { useState } from 'react';
import { Trees, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import type { NumberPatternItem } from '../../../types/numberSense';
import { NUMBER_PATTERNS_CATALOG } from '../data/numberPatternsCatalog';

interface NumberPatternsForestViewProps {
  activePattern: NumberPatternItem;
  feedback: { message: string; isSuccess?: boolean } | null;
  onSelectPattern: (patId: string) => void;
  onSubmitAnswer: (ans: number) => boolean;
}

export const NumberPatternsForestView: React.FC<NumberPatternsForestViewProps> = ({
  activePattern,
  feedback,
  onSelectPattern,
  onSubmitAnswer,
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    onSubmitAnswer(Number(inputValue));
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
        gap: '24px',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 800, marginBottom: '6px' }}>
          <Trees size={22} />
          <span style={{ fontSize: '1.25rem' }}>Khu Rừng Quy Luật Dãy Số (Number Pattern Forest)</span>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
          Tìm viên đá số học bị ẩn giấu bằng cách giải mã quy luật bước nhảy của dãy số!
        </p>
      </div>

      {/* Pattern Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {NUMBER_PATTERNS_CATALOG.map((p) => {
          const isSelected = activePattern.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setInputValue('');
                onSelectPattern(p.id);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                background: isSelected ? '#10b981' : 'rgba(30, 41, 59, 0.8)',
                color: '#fff',
                border: isSelected ? '1.5px solid #34d399' : '1px solid rgba(255, 255, 255, 0.1)',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {p.titleVi}
            </button>
          );
        })}
      </div>

      {/* Sequence Rune Stones Display */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '30px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
        }}
      >
        {activePattern.sequence.map((val, idx) => {
          const isMissing = val === null;
          return (
            <div
              key={idx}
              style={{
                width: '75px',
                height: '75px',
                borderRadius: '16px',
                background: isMissing
                  ? 'rgba(250, 204, 21, 0.15)'
                  : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: isMissing ? '2px dashed #facc15' : '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isMissing ? '#facc15' : '#f8fafc',
                fontSize: '1.6rem',
                fontWeight: 900,
                boxShadow: isMissing ? '0 0 16px rgba(250, 204, 21, 0.4)' : '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              {isMissing ? '?' : val}
            </div>
          );
        })}
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1rem' }}>
            Số cần điền vào dấu (?):
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập số..."
            style={{
              width: '130px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '2px solid #10b981',
              color: '#facc15',
              fontSize: '1.3rem',
              fontWeight: 900,
              textAlign: 'center',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            fontWeight: 900,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          }}
        >
          Kiểm Tra Dãy Số
        </button>
      </form>

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

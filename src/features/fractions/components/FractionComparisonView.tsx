import React from 'react';
import { useFractionStore } from '../useFractionStore';

export const FractionComparisonView: React.FC = () => {
  const {
    currentComparisonTask,
    comparisonFeedback,
    answerComparison,
    nextComparisonTask,
    comparisonIndex,
    campaignId,
  } = useFractionStore();

  const { leftFraction, rightFraction, shape } = currentComparisonTask;

  // Mini pie renderer
  const renderMiniPie = (numerator: number, denominator: number) => {
    const size = 130;
    const center = size / 2;
    const radius = size * 0.42;
    const slices = [];

    for (let i = 0; i < denominator; i++) {
      const startAngle = (i * 2 * Math.PI) / denominator - Math.PI / 2;
      const endAngle = ((i + 1) * 2 * Math.PI) / denominator - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const isShaded = i < numerator;
      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={i}
          d={pathData}
          fill={isShaded ? '#f59e0b' : '#334155'}
          stroke="#10b981"
          strokeWidth="2"
        />
      );
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius + 3} fill="#1e293b" stroke="#059669" strokeWidth="2" />
        {slices}
        <circle cx={center} cy={center} r="4" fill="#facc15" />
      </svg>
    );
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid rgba(250, 204, 21, 0.4)',
        borderRadius: '24px',
        padding: '24px 28px',
        maxWidth: '740px',
        margin: '0 auto',
      }}
    >
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span
            style={{
              background: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid #facc15',
              color: '#facc15',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {campaignId === 'grade-3' ? 'LỚP 3 • ĐẤU TRƯỜNG SO SÁNH' : 'LỚP 2 • SO SÁNH TRỰC QUAN'}
          </span>
          <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800, marginTop: '8px' }}>
            {currentComparisonTask.titleVi}
          </h3>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
          Thử thách {comparisonIndex + 1}
        </div>
      </div>

      {/* Side-by-Side Comparison Arena */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '24px 16px',
          borderRadius: '20px',
          margin: '20px 0',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderMiniPie(leftFraction.numerator, leftFraction.denominator)}
          <div
            style={{
              marginTop: '12px',
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#38bdf8',
              background: 'rgba(2, 132, 199, 0.2)',
              padding: '4px 16px',
              borderRadius: '12px',
              border: '1px solid #38bdf8',
            }}
          >
            {leftFraction.label}
          </div>
        </div>

        {/* Center: Sign Choice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => answerComparison('>')}
            disabled={comparisonFeedback !== null}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '1.4rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              border: '2px solid #38bdf8',
              cursor: comparisonFeedback ? 'default' : 'pointer',
            }}
          >
            &gt;
          </button>
          <button
            onClick={() => answerComparison('=')}
            disabled={comparisonFeedback !== null}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '1.4rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
              color: '#fff',
              border: '2px solid #94a3b8',
              cursor: comparisonFeedback ? 'default' : 'pointer',
            }}
          >
            =
          </button>
          <button
            onClick={() => answerComparison('<')}
            disabled={comparisonFeedback !== null}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '1.4rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff',
              border: '2px solid #34d399',
              cursor: comparisonFeedback ? 'default' : 'pointer',
            }}
          >
            &lt;
          </button>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderMiniPie(rightFraction.numerator, rightFraction.denominator)}
          <div
            style={{
              marginTop: '12px',
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#facc15',
              background: 'rgba(250, 204, 21, 0.2)',
              padding: '4px 16px',
              borderRadius: '12px',
              border: '1px solid #facc15',
            }}
          >
            {rightFraction.label}
          </div>
        </div>
      </div>

      {/* Prompt / Hint */}
      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
        💡 {currentComparisonTask.hintVi}
      </div>

      {/* Feedback & Next */}
      {comparisonFeedback && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '14px',
            background: comparisonFeedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `2px solid ${comparisonFeedback.isCorrect ? '#10b981' : '#ef4444'}`,
          }}
        >
          <div
            style={{
              color: comparisonFeedback.isCorrect ? '#34d399' : '#fca5a5',
              fontSize: '0.95rem',
              fontWeight: 700,
              marginBottom: '10px',
            }}
          >
            {comparisonFeedback.message}
          </div>
          <button
            onClick={nextComparisonTask}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ➡️ So Sánh Tiếp Theo
          </button>
        </div>
      )}
    </div>
  );
};

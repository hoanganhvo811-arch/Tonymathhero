import React from 'react';
import { useFractionStore } from '../useFractionStore';

export const FractionRecognitionView: React.FC = () => {
  const {
    currentRecognitionTask,
    recognitionFeedback,
    answerRecognition,
    nextRecognitionTask,
    recognitionIndex,
    campaignId,
  } = useFractionStore();

  // Render Visual Diagram for the Question
  const renderVisualDiagram = () => {
    const { shape, totalParts, shadedParts, isEqualDivision } = currentRecognitionTask;
    const size = 200;
    const center = size / 2;
    const radius = size * 0.42;

    if (shape === 'circle_pizza') {
      const slices = [];
      for (let i = 0; i < totalParts; i++) {
        // If not equal division, simulate varying angles
        let startAngle: number;
        let endAngle: number;
        if (!isEqualDivision) {
          const angles = [0, 0.4, 1.3, 2.0];
          startAngle = (angles[i % angles.length] * Math.PI) - Math.PI / 2;
          endAngle = (angles[(i + 1) % angles.length] * Math.PI) - Math.PI / 2;
        } else {
          startAngle = (i * 2 * Math.PI) / totalParts - Math.PI / 2;
          endAngle = ((i + 1) * 2 * Math.PI) / totalParts - Math.PI / 2;
        }

        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);

        const isShaded = i < shadedParts;
        const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

        slices.push(
          <path
            key={i}
            d={pathData}
            fill={isShaded ? '#f59e0b' : '#334155'}
            stroke="#10b981"
            strokeWidth="2.5"
          />
        );
      }

      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={radius + 4} fill="#1e293b" stroke="#059669" strokeWidth="2" />
          {slices}
          <circle cx={center} cy={center} r="5" fill="#facc15" />
        </svg>
      );
    }

    // Default bar or grid
    const width = 240;
    const height = 70;
    const itemWidth = width / totalParts;
    const bars = [];

    for (let i = 0; i < totalParts; i++) {
      const isShaded = i < shadedParts;
      // If unequal, vary width
      const barW = !isEqualDivision ? (i === 0 ? itemWidth * 1.5 : itemWidth * 0.75) : itemWidth;
      const barX = !isEqualDivision ? (i === 0 ? 0 : itemWidth * 1.5) : i * itemWidth;

      bars.push(
        <rect
          key={i}
          x={barX + 2}
          y={4}
          width={barW - 4}
          height={height - 8}
          rx={6}
          fill={isShaded ? '#10b981' : '#1e293b'}
          stroke="#475569"
          strokeWidth="2"
        />
      );
    }

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect x="0" y="0" width={width} height={height} rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        {bars}
      </svg>
    );
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '24px',
        padding: '24px 28px',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span
            style={{
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {campaignId === 'grade-3' ? 'LỚP 3 • ĐẠI HIỆP SĨ' : 'LỚP 2 • HIỆP SĨ NHÍ'}
          </span>
          <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800, marginTop: '8px' }}>
            {currentRecognitionTask.titleVi}
          </h3>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
          Câu số {recognitionIndex + 1}
        </div>
      </div>

      {/* Visual Stage */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {renderVisualDiagram()}
        <div style={{ marginTop: '14px', color: '#cbd5e1', fontSize: '0.95rem', textAlign: 'center', fontWeight: 600 }}>
          {currentRecognitionTask.questionTextVi}
        </div>
      </div>

      {/* Answer Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {currentRecognitionTask.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => answerRecognition(idx)}
            disabled={recognitionFeedback !== null}
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.25)',
              color: '#f8fafc',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: recognitionFeedback ? 'default' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback & Next Button */}
      {recognitionFeedback && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '14px',
            background: recognitionFeedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `2px solid ${recognitionFeedback.isCorrect ? '#10b981' : '#ef4444'}`,
          }}
        >
          <div
            style={{
              color: recognitionFeedback.isCorrect ? '#34d399' : '#fca5a5',
              fontSize: '0.95rem',
              fontWeight: 700,
              marginBottom: '10px',
            }}
          >
            {recognitionFeedback.message}
          </div>
          <button
            onClick={nextRecognitionTask}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ➡️ Câu Tiếp Theo
          </button>
        </div>
      )}
    </div>
  );
};

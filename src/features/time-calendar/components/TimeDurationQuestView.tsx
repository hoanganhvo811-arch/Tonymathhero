import React from 'react';
import { useTimeCalendarStore } from '../useTimeCalendarStore';

export const TimeDurationQuestView: React.FC = () => {
  const {
    activeDurationTask,
    durationIndex,
    durationFeedback,
    answerDurationTask,
    nextDurationTask,
    campaignId,
  } = useTimeCalendarStore();

  const { startTime, endTime, storyContextVi, options, titleVi } = activeDurationTask;

  // Mini clock renderer
  const renderMiniClock = (h: number, m: number, label: string, color: string) => {
    const size = 110;
    const center = size / 2;
    const radius = size * 0.4;
    const minuteAngle = m * 6;
    const hourAngle = (h % 12) * 30 + m * 0.5;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={radius + 6} fill="#0b1324" stroke={color} strokeWidth="3" />
          <circle cx={center} cy={center} r={radius} fill="#1e293b" />
          {/* Hour */}
          <line
            x1={center}
            y1={center}
            x2={center + radius * 0.55 * Math.sin((hourAngle * Math.PI) / 180)}
            y2={center - radius * 0.55 * Math.cos((hourAngle * Math.PI) / 180)}
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Minute */}
          <line
            x1={center}
            y1={center}
            x2={center + radius * 0.8 * Math.sin((minuteAngle * Math.PI) / 180)}
            y2={center - radius * 0.8 * Math.cos((minuteAngle * Math.PI) / 180)}
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={center} cy={center} r="4" fill="#facc15" />
        </svg>
        <span style={{ color, fontSize: '0.85rem', fontWeight: 800, marginTop: '6px' }}>
          {label}: {h}:{m === 0 ? '00' : m.toString().padStart(2, '0')}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid rgba(56, 189, 248, 0.4)',
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
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {campaignId === 'grade-3' ? 'LỚP 3 • TÍNH THỜI LƯỢNG NÂNG CAO' : 'LỚP 2 • KHOẢNG THỜI GIAN ĐƠN GIẢN'}
          </span>
          <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800, marginTop: '8px' }}>
            {titleVi}
          </h3>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
          Thử thách {durationIndex + 1}
        </div>
      </div>

      {/* Story Context */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          borderLeft: '4px solid #38bdf8',
        }}
      >
        <div style={{ color: '#f1f5f9', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {storyContextVi}
        </div>
      </div>

      {/* Visual Side-by-Side Clocks (Start vs End) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {renderMiniClock(startTime.hours, startTime.minutes, '🟢 Bắt Đầu', '#34d399')}
        <div style={{ fontSize: '2rem', color: '#facc15' }}>➔</div>
        {renderMiniClock(endTime.hours, endTime.minutes, '🔴 Kết Thúc', '#f87171')}
      </div>

      {/* Answer Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => answerDurationTask(idx)}
            disabled={durationFeedback !== null}
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid rgba(56, 189, 248, 0.3)',
              color: '#f8fafc',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: durationFeedback ? 'default' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Feedback & Next */}
      {durationFeedback && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '14px',
            background: durationFeedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `2px solid ${durationFeedback.isCorrect ? '#10b981' : '#ef4444'}`,
          }}
        >
          <div
            style={{
              color: durationFeedback.isCorrect ? '#34d399' : '#fca5a5',
              fontSize: '0.95rem',
              fontWeight: 700,
              marginBottom: '10px',
            }}
          >
            {durationFeedback.message}
          </div>
          <button
            onClick={nextDurationTask}
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
            ➡️ Thử Thách Tiếp Theo
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import type { MeasurementToolTask } from '../../../types/geometryMeasurement';

interface InteractiveClockLabProps {
  task: MeasurementToolTask;
  currentHour: number;
  currentMinute: number;
  onTimeChange: (hour: number, minute: number) => void;
  onSubmit: () => boolean;
  feedback: { message: string; isSuccess?: boolean } | null;
}

export const InteractiveClockLab: React.FC<InteractiveClockLabProps> = ({
  task,
  currentHour,
  currentMinute,
  onTimeChange,
  onSubmit,
  feedback,
}) => {
  // Target angles
  // Minute hand: 360 deg = 60 mins -> 6 deg per min
  const minuteAngle = currentMinute * 6;
  // Hour hand: 360 deg = 12 hours -> 30 deg per hour + (minute / 60) * 30 deg
  const hourAngle = (currentHour % 12) * 30 + (currentMinute / 60) * 30;

  const handleHourStep = (delta: number) => {
    let nextH = currentHour + delta;
    if (nextH > 12) nextH = 1;
    if (nextH < 1) nextH = 12;
    onTimeChange(nextH, currentMinute);
  };

  const handleMinuteStep = (delta: number) => {
    let nextM = currentMinute + delta;
    let nextH = currentHour;
    if (nextM >= 60) {
      nextM = nextM - 60;
      nextH = nextH === 12 ? 1 : nextH + 1;
    } else if (nextM < 0) {
      nextM = nextM + 60;
      nextH = nextH === 1 ? 12 : nextH - 1;
    }
    onTimeChange(nextH, nextM);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #a855f7',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(168, 85, 247, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 800, marginBottom: '6px' }}>
          <Clock size={22} />
          <span style={{ fontSize: '1.25rem' }}>{task.title}</span>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>{task.promptVi}</p>
      </div>

      {/* Clock Display & Controls */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        {/* Analog Clock Face SVG */}
        <div style={{ position: 'relative', width: '220px', height: '220px' }}>
          <svg width="220" height="220" viewBox="0 0 200 200">
            {/* Clock Rim */}
            <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#a855f7" strokeWidth="5" />
            <circle cx="100" cy="100" r="82" fill="#1e293b" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Numbers 1 to 12 */}
            {Array.from({ length: 12 }).map((_, i) => {
              const num = i + 1;
              const angle = num * 30 * (Math.PI / 180);
              const x = 100 + 68 * Math.sin(angle);
              const y = 100 - 68 * Math.cos(angle) + 5;
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="14"
                  fontWeight="900"
                >
                  {num}
                </text>
              );
            })}

            {/* Hour Hand (Short, Gold) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="55"
              stroke="#facc15"
              strokeWidth="5"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 100 100)`}
            />

            {/* Minute Hand (Long, Sky Blue) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="36"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 100 100)`}
            />

            {/* Center Pivot Pin */}
            <circle cx="100" cy="100" r="6" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Digital Adjusters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
            ⏰ ĐIỀU CHỈNH THỜI GIAN
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hour Adjuster */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => handleHourStep(1)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '4px', cursor: 'pointer' }}
              >
                <ChevronUp size={18} />
              </button>
              <div
                style={{
                  width: '54px',
                  height: '46px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '2px solid #facc15',
                  borderRadius: '10px',
                  color: '#facc15',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {currentHour}
              </div>
              <button
                onClick={() => handleHourStep(-1)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '4px', cursor: 'pointer' }}
              >
                <ChevronDown size={18} />
              </button>
              <span style={{ fontSize: '0.7rem', color: '#facc15', fontWeight: 700 }}>GIỜ</span>
            </div>

            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>:</span>

            {/* Minute Adjuster */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => handleMinuteStep(5)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '4px', cursor: 'pointer' }}
              >
                <ChevronUp size={18} />
              </button>
              <div
                style={{
                  width: '54px',
                  height: '46px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '2px solid #38bdf8',
                  borderRadius: '10px',
                  color: '#38bdf8',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {currentMinute.toString().padStart(2, '0')}
              </div>
              <button
                onClick={() => handleMinuteStep(-5)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '4px', cursor: 'pointer' }}
              >
                <ChevronDown size={18} />
              </button>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>PHÚT</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <button
              onClick={() => onTimeChange(8, 0)}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              8:00 đúng
            </button>
            <button
              onClick={() => onTimeChange(2, 30)}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              2:30 rưỡi
            </button>
            <button
              onClick={() => onTimeChange(8, 45)}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              9h kém 15
            </button>
          </div>
        </div>
      </div>

      {/* Check Button */}
      <button
        onClick={onSubmit}
        style={{
          padding: '12px 24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff',
          fontWeight: 900,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <CheckCircle2 size={18} /> Kiểm Tra Thời Gian
      </button>

      {/* Feedback Alert */}
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

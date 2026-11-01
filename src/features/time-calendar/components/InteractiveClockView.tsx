import React, { useRef } from 'react';
import { useTimeCalendarStore } from '../useTimeCalendarStore';

export const InteractiveClockView: React.FC = () => {
  const {
    clockTime,
    activeClockTask,
    clockIndex,
    clockFeedback,
    adjustTime,
    setTime,
    answerClockTask,
    checkClockSetting,
    nextClockTask,
    campaignId,
  } = useTimeCalendarStore();

  const svgRef = useRef<SVGSVGElement | null>(null);

  const size = 280;
  const center = size / 2;
  const radius = size * 0.42;

  // Angles for clock hands
  const minuteAngle = clockTime.minutes * 6; // 360 / 60 = 6 deg per min
  const hourAngle = (clockTime.hours % 12) * 30 + clockTime.minutes * 0.5; // 30 deg per hour + 0.5 deg per min

  // Format digital string
  const displayHours = clockTime.hours.toString().padStart(2, '0');
  const displayMinutes = clockTime.minutes.toString().padStart(2, '0');

  // Handle direct click/drag on clock face to rotate minute hand
  const handleClockClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;

    // Angle in degrees from 12 o'clock (top) clockwise
    let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    // Round to nearest 5 minutes for clean pedagogical interaction
    const mins = Math.round(angle / 30) * 5 % 60;
    setTime(clockTime.hours, mins);
  };

  // Render 12 Hour Numbers & 60 Tick Marks
  const renderNumbersAndTicks = () => {
    const elements = [];

    // 60 tick marks
    for (let i = 0; i < 60; i++) {
      const a = (i * 6 * Math.PI) / 180;
      const isHourTick = i % 5 === 0;
      const rInner = isHourTick ? radius - 12 : radius - 6;
      const x1 = center + radius * Math.sin(a);
      const y1 = center - radius * Math.cos(a);
      const x2 = center + rInner * Math.sin(a);
      const y2 = center - rInner * Math.cos(a);

      elements.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isHourTick ? '#facc15' : '#64748b'}
          strokeWidth={isHourTick ? 2.5 : 1}
        />
      );
    }

    // 12 Numbers
    for (let h = 1; h <= 12; h++) {
      const a = (h * 30 * Math.PI) / 180;
      const rNum = radius - 24;
      const x = center + rNum * Math.sin(a);
      const y = center - rNum * Math.cos(a) + 5;

      elements.push(
        <text
          key={`num-${h}`}
          x={x}
          y={y}
          fill="#f8fafc"
          fontSize="14"
          fontWeight="900"
          textAnchor="middle"
        >
          {h}
        </text>
      );
    }

    return elements;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ color: '#38bdf8', fontSize: '1.25rem', fontWeight: 800 }}>
              ⏰ ĐỒNG HỒ KIM & ĐIỆN TỬ TƯƠNG TÁC (VIRTUAL CHRONO CLOCK)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
              Nhấp trực tiếp lên mặt đồng hồ hoặc bấm các nút để xoay kim và quan sát thời gian đồng bộ!
            </p>
          </div>
          <span
            style={{
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            {campaignId === 'grade-3' ? 'LỚP 3 • ĐẾN 5 PHÚT & GIỜ KÉM' : 'LỚP 2 • GIỜ ĐÚNG & GIỜ RƯỠI'}
          </span>
        </div>
      </div>

      {/* Main Dual Stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Left: Interactive Analog Clock */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* SVG Clock */}
          <svg
            ref={svgRef}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            onClick={handleClockClick}
            style={{ cursor: 'pointer', filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.25))' }}
          >
            {/* Outer Bezel */}
            <circle cx={center} cy={center} r={radius + 18} fill="#0b1324" stroke="#facc15" strokeWidth="4" />
            <circle cx={center} cy={center} r={radius + 10} fill="#1e293b" stroke="#334155" strokeWidth="2" />

            {/* Ticks and Numbers */}
            {renderNumbersAndTicks()}

            {/* Hour Hand (Thick, Green, Short) */}
            <line
              x1={center}
              y1={center}
              x2={center + radius * 0.55 * Math.sin((hourAngle * Math.PI) / 180)}
              y2={center - radius * 0.55 * Math.cos((hourAngle * Math.PI) / 180)}
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              style={{ transition: 'all 0.2s ease-out' }}
            />

            {/* Minute Hand (Thinner, Blue, Long) */}
            <line
              x1={center}
              y1={center}
              x2={center + radius * 0.82 * Math.sin((minuteAngle * Math.PI) / 180)}
              y2={center - radius * 0.82 * Math.cos((minuteAngle * Math.PI) / 180)}
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ transition: 'all 0.2s ease-out' }}
            />

            {/* Center Pin Cap */}
            <circle cx={center} cy={center} r="7" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Hand Color Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '0.8rem', fontWeight: 700 }}>
            <span style={{ color: '#10b981' }}>🟢 Kim Ngắn: GIỜ</span>
            <span style={{ color: '#38bdf8' }}>🔵 Kim Dài: PHÚT</span>
          </div>

          {/* Quick Step Adjustment Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => adjustTime(-60)}
              style={{ padding: '6px 12px', borderRadius: '8px', background: '#334155', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              -1 Giờ
            </button>
            <button
              onClick={() => adjustTime(-15)}
              style={{ padding: '6px 12px', borderRadius: '8px', background: '#334155', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              -15 Phút
            </button>
            <button
              onClick={() => adjustTime(-5)}
              style={{ padding: '6px 12px', borderRadius: '8px', background: '#334155', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              -5 Phút
            </button>
            <button
              onClick={() => adjustTime(5)}
              style={{ padding: '6px 12px', borderRadius: '8px', background: '#0284c7', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              +5 Phút
            </button>
            <button
              onClick={() => adjustTime(15)}
              style={{ padding: '6px 12px', borderRadius: '8px', background: '#0284c7', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              +15 Phút
            </button>
            <button
              onClick={() => adjustTime(60)}
              style={{ padding: '6px 12px', borderRadius: '8px', background: '#0284c7', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              +1 Giờ
            </button>
          </div>
        </div>

        {/* Right: Synchronized Digital Display & Quiz Quest */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Digital Clock Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, #09131f 0%, #030712 100%)',
                border: '2px solid #38bdf8',
                borderRadius: '16px',
                padding: '16px 20px',
                textAlign: 'center',
                boxShadow: 'inset 0 0 16px rgba(56, 189, 248, 0.25)',
                marginBottom: '20px',
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                ĐỒNG HỒ ĐIỆN TỬ ĐỒNG BỘ
              </div>
              <div
                style={{
                  fontSize: '3.2rem',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  color: '#38bdf8',
                  letterSpacing: '0.08em',
                  textShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
                  margin: '4px 0',
                }}
              >
                {displayHours}:{displayMinutes}
              </div>
              <div style={{ color: '#facc15', fontSize: '1rem', fontWeight: 800 }}>
                {clockTime.hours} giờ {clockTime.minutes === 0 ? 'đúng' : clockTime.minutes === 30 ? '30 phút (giờ rưỡi)' : `${clockTime.minutes} phút`}
              </div>
            </div>

            {/* Current Quest Challenge */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                borderRadius: '14px',
                padding: '16px',
                borderLeft: '4px solid #facc15',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#facc15', fontSize: '0.85rem', fontWeight: 800 }}>
                  📜 THỬ THÁCH XEM GIỜ #{clockIndex + 1}:
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  Mục tiêu: {activeClockTask.verbalTimeVi}
                </span>
              </div>
              <div style={{ color: '#f8fafc', fontSize: '0.98rem', fontWeight: 700, marginTop: '6px' }}>
                {activeClockTask.promptVi}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
                💡 Gợi ý: {activeClockTask.hintVi}
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {activeClockTask.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => answerClockTask(idx)}
                  disabled={clockFeedback !== null}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: clockFeedback ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Feedback Alert */}
            {clockFeedback && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: clockFeedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${clockFeedback.isCorrect ? '#10b981' : '#ef4444'}`,
                  color: clockFeedback.isCorrect ? '#34d399' : '#fca5a5',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                {clockFeedback.message}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={checkClockSetting}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🎯 Kiểm Tra Kim Đã Chỉnh
            </button>
            <button
              onClick={nextClockTask}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
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
        </div>
      </div>
    </div>
  );
};

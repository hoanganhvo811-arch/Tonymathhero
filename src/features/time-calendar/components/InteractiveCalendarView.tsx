import React from 'react';
import { useTimeCalendarStore } from '../useTimeCalendarStore';

export const InteractiveCalendarView: React.FC = () => {
  const {
    calendarMonth,
    calendarYear,
    selectedCalendarDate,
    activeCalendarTask,
    calendarIndex,
    calendarFeedback,
    prevMonth,
    nextMonth,
    selectDate,
    answerCalendarTask,
    nextCalendarTask,
    campaignId,
  } = useTimeCalendarStore();

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const fullDaysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

  // Calculate days in month and starting offset
  const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth - 1, 1).getDay();
  // Adjust so Monday is 0 and Sunday is 6
  const offset = (firstDayIndex + 6) % 7;

  // Leap year check
  const isLeapYear = (calendarYear % 4 === 0 && calendarYear % 100 !== 0) || calendarYear % 400 === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(250, 204, 21, 0.4)',
          borderRadius: '16px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ color: '#facc15', fontSize: '1.25rem', fontWeight: 800 }}>
              📅 CUỐN LỊCH VẠN NIÊN PHÉP THUẬT (INTERACTIVE CALENDAR)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
              Tra cứu ngày, thứ, tháng, năm nhuận và giải cứu các mảnh vỡ thời gian!
            </p>
          </div>
          <span
            style={{
              background: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid #facc15',
              color: '#facc15',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            {campaignId === 'grade-3' ? 'LỚP 3 • NĂM NHUẬN & KHỚP TAY' : 'LỚP 2 • TUẦN LỄ & NGÀY THÁNG'}
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
        {/* Left: Interactive Calendar Grid */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Month / Year Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button
              onClick={prevMonth}
              style={{ padding: '6px 14px', borderRadius: '10px', background: '#334155', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
            >
              ◀ Tháng Trước
            </button>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: '#facc15', fontSize: '1.25rem', fontWeight: 900 }}>
                THÁNG {calendarMonth} / {calendarYear}
              </h4>
              <span style={{ fontSize: '0.75rem', color: isLeapYear ? '#34d399' : '#94a3b8' }}>
                {isLeapYear ? '✨ Năm Nhuận (366 ngày)' : 'Năm Thường (365 ngày)'} • {daysInMonth} ngày
              </span>
            </div>
            <button
              onClick={nextMonth}
              style={{ padding: '6px 14px', borderRadius: '10px', background: '#334155', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
            >
              Tháng Sau ▶
            </button>
          </div>

          {/* Days of Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
            {daysOfWeek.map((d, i) => (
              <div
                key={i}
                style={{
                  color: i === 6 ? '#ef4444' : i === 5 ? '#38bdf8' : '#cbd5e1',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '6px 0',
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date Cells Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {/* Empty Offset cells */}
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`offset-${i}`} style={{ height: '38px', opacity: 0.1 }} />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedCalendarDate === day;
              const dayOfWeekIdx = (offset + i) % 7;
              const isSunday = dayOfWeekIdx === 6;

              return (
                <button
                  key={day}
                  onClick={() => selectDate(day)}
                  style={{
                    height: '38px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #facc15' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                      : 'rgba(30, 41, 59, 0.6)',
                    color: isSelected ? '#ffffff' : isSunday ? '#f87171' : '#f8fafc',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Selected Date Inspector */}
          {selectedCalendarDate && (
            <div
              style={{
                marginTop: '16px',
                background: 'rgba(250, 204, 21, 0.15)',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                borderRadius: '12px',
                padding: '10px 14px',
                textAlign: 'center',
                color: '#facc15',
                fontSize: '0.88rem',
                fontWeight: 700,
              }}
            >
              📅 Đang chọn: {fullDaysOfWeek[(offset + selectedCalendarDate - 1) % 7]}, Ngày {selectedCalendarDate} Tháng {calendarMonth} Năm {calendarYear}
            </div>
          )}
        </div>

        {/* Right: Quest Challenge Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                borderRadius: '14px',
                padding: '16px',
                borderLeft: '4px solid #38bdf8',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 800 }}>
                  📜 CÂU ĐỐ LỊCH THỜI GIAN #{calendarIndex + 1}:
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  {activeCalendarTask.titleVi}
                </span>
              </div>
              <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}>
                {activeCalendarTask.promptVi}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
                💡 Gợi ý: {activeCalendarTask.hintVi}
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {activeCalendarTask.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => answerCalendarTask(idx)}
                  disabled={calendarFeedback !== null}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: '1px solid rgba(250, 204, 21, 0.3)',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: calendarFeedback ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Feedback Alert */}
            {calendarFeedback && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: calendarFeedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${calendarFeedback.isCorrect ? '#10b981' : '#ef4444'}`,
                  color: calendarFeedback.isCorrect ? '#34d399' : '#fca5a5',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                {calendarFeedback.message}
              </div>
            )}
          </div>

          <button
            onClick={nextCalendarTask}
            style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ➡️ Câu Hỏi Lịch Tiếp Theo
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTimeCalendarStore } from '../useTimeCalendarStore';

export const DailyRoutineTimelineView: React.FC = () => {
  const {
    routineItems,
    routineFeedback,
    reorderRoutineItem,
    checkRoutineOrder,
    resetRoutine,
    campaignId,
  } = useTimeCalendarStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '16px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ color: '#34d399', fontSize: '1.25rem', fontWeight: 800 }}>
              📋 DÒNG THỜI GIAN & LỊCH SINH HOẠT CỦA HIỆP SĨ (DAILY ROUTINE BUILDER)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
              Sắp xếp các hoạt động hằng ngày của Tony theo đúng trình tự thời gian từ sáng đến tối!
            </p>
          </div>
          <span
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#34d399',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            {campaignId === 'grade-3' ? 'LỚP 3 • QUẢN LÝ THỜI GIAN BIỂU' : 'LỚP 2 • SẮP XẾP SỰ KIỆN'}
          </span>
        </div>
      </div>

      {/* 24-Hour Visual Timeline Strip */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 800, marginBottom: '14px' }}>
          ⏳ TRỤC THỜI GIAN 24 GIỜ TRONG NGÀY:
        </div>
        <div
          style={{
            position: 'relative',
            height: '14px',
            background: 'linear-gradient(90deg, #1e1b4b 0%, #0284c7 25%, #f59e0b 50%, #ea580c 75%, #0f172a 100%)',
            borderRadius: '7px',
            margin: '20px 10px',
          }}
        >
          {routineItems.map((item) => {
            const pct = ((item.hours * 60 + item.minutes) / (24 * 60)) * 100;
            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `${pct}%`,
                  top: '-16px',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.3rem', cursor: 'pointer' }} title={`${item.titleVi} (${item.typicalTimeVi})`}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#cbd5e1', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {item.hours}:{item.minutes === 0 ? '00' : item.minutes}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine Cards Reordering Stage */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 800 }}>
            Hoạt Động Trong Ngày (Bấm nút ▲ ▼ để đổi thứ tự)
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={resetRoutine}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                background: '#334155',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🎲 Xáo Trộn
            </button>
            <button
              onClick={checkRoutineOrder}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
              }}
            >
              ✨ Kiểm Tra Thứ Tự
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {routineFeedback && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: routineFeedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${routineFeedback.isCorrect ? '#10b981' : '#ef4444'}`,
              color: routineFeedback.isCorrect ? '#34d399' : '#fca5a5',
              fontSize: '0.9rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            {routineFeedback.message}
          </div>
        )}

        {/* List of items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {routineItems.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(30, 41, 59, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.95rem' }}>
                    {idx + 1}. {item.titleVi}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    {item.descriptionVi}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {item.typicalTimeVi}
                </span>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    disabled={idx === 0}
                    onClick={() => reorderRoutineItem(idx, idx - 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: idx === 0 ? '#1e293b' : '#334155',
                      color: idx === 0 ? '#475569' : '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      cursor: idx === 0 ? 'default' : 'pointer',
                    }}
                  >
                    ▲
                  </button>
                  <button
                    disabled={idx === routineItems.length - 1}
                    onClick={() => reorderRoutineItem(idx, idx + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: idx === routineItems.length - 1 ? '#1e293b' : '#334155',
                      color: idx === routineItems.length - 1 ? '#475569' : '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      cursor: idx === routineItems.length - 1 ? 'default' : 'pointer',
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

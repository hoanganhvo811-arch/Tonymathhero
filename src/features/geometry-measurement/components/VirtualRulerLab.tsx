import React, { useState } from 'react';
import { Ruler, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import type { MeasurementToolTask } from '../../../types/geometryMeasurement';

interface VirtualRulerLabProps {
  task: MeasurementToolTask;
  userValue: number;
  rulerOffset: number;
  onUserValueChange: (val: number) => void;
  onRulerOffsetChange: (offset: number) => void;
  onSubmit: () => boolean;
  feedback: { message: string; isSuccess?: boolean } | null;
}

export const VirtualRulerLab: React.FC<VirtualRulerLabProps> = ({
  task,
  userValue,
  rulerOffset,
  onUserValueChange,
  onRulerOffsetChange,
  onSubmit,
  feedback,
}) => {
  const itemLengthCm = task.rulerConfig?.itemLengthCm || 8;
  const pixelsPerCm = 24; // 24px per 1 cm
  const rulerMaxCm = 15;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #38bdf8',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Title & Prompt */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800, marginBottom: '6px' }}>
          <Ruler size={22} />
          <span style={{ fontSize: '1.25rem' }}>{task.title}</span>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>{task.promptVi}</p>
      </div>

      {/* Interactive Ruler Workspace */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '30px 20px',
          overflowX: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          position: 'relative',
        }}
      >
        {/* Item to Measure */}
        <div style={{ marginLeft: `${40 + rulerOffset * pixelsPerCm}px`, transition: 'margin-left 0.2s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>{task.targetItemEmoji}</span>
            <div
              style={{
                width: `${itemLengthCm * pixelsPerCm}px`,
                height: '24px',
                background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
                borderRadius: '6px',
                border: '2px solid #d97706',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                position: 'relative',
              }}
            >
              {/* Left edge guide */}
              <div style={{ position: 'absolute', left: 0, top: '-10px', bottom: '-10px', width: '2px', background: '#38bdf8' }} />
              {/* Right edge guide */}
              <div style={{ position: 'absolute', right: 0, top: '-10px', bottom: '-10px', width: '2px', background: '#ef4444' }} />
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>{task.targetItemName}</span>
          </div>
        </div>

        {/* The Ruler */}
        <div style={{ marginLeft: '40px' }}>
          <div
            style={{
              width: `${rulerMaxCm * pixelsPerCm}px`,
              height: '55px',
              background: 'linear-gradient(180deg, #fef08a 0%, #facc15 100%)',
              border: '2px solid #ca8a04',
              borderRadius: '4px',
              position: 'relative',
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            }}
          >
            {/* Tick Marks (0 to 15 cm) */}
            {Array.from({ length: rulerMaxCm + 1 }).map((_, cm) => (
              <div
                key={cm}
                style={{
                  position: 'absolute',
                  left: `${cm * pixelsPerCm}px`,
                  bottom: 0,
                  top: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#713f12', fontSize: '0.7rem', fontWeight: 900, marginTop: '2px' }}>{cm}</span>
                <div style={{ width: '2px', height: cm % 5 === 0 ? '24px' : '14px', background: '#713f12' }} />
              </div>
            ))}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '6px', textAlign: 'right' }}>
            Đơn vị: Xăng-ti-mét (cm)
          </div>
        </div>

        {/* Ruler Adjustment Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '12px' }}>
          <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}>
            📏 Căn chỉnh vị trí đầu vật:
          </span>
          <button
            onClick={() => onRulerOffsetChange(0)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: rulerOffset === 0 ? '#10b981' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Về vạch 0 (Chuẩn)
          </button>
          <button
            onClick={() => onRulerOffsetChange(2)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: rulerOffset === 2 ? '#ef4444' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Thử thách: Đặt ở vạch 2
          </button>
        </div>
      </div>

      {/* Answer Input & Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.95rem' }}>
            Kết quả đo của Tony:
          </label>
          <input
            type="number"
            value={userValue || ''}
            onChange={(e) => onUserValueChange(Number(e.target.value))}
            placeholder="Nhập số..."
            style={{
              width: '120px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '2px solid #38bdf8',
              color: '#facc15',
              fontSize: '1.2rem',
              fontWeight: 900,
              textAlign: 'center',
              outline: 'none',
            }}
          />
          <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1rem' }}>{task.targetUnit}</span>
        </div>

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
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} /> Kiểm Tra Kết Quả
        </button>
      </div>

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

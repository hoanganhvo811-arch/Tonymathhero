import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import type { MeasurementToolTask } from '../../../types/geometryMeasurement';

interface VirtualScaleLabProps {
  task: MeasurementToolTask;
  placedWeights: { weight: number; label: string }[];
  onAddWeight: (weight: number, label: string) => void;
  onRemoveWeight: (index: number) => void;
  onReset: () => void;
  onSubmit: () => boolean;
  feedback: { message: string; isSuccess?: boolean } | null;
}

export const VirtualScaleLab: React.FC<VirtualScaleLabProps> = ({
  task,
  placedWeights,
  onAddWeight,
  onRemoveWeight,
  onReset,
  onSubmit,
  feedback,
}) => {
  const targetWeightGrams = task.scaleConfig?.itemWeightGrams || 3000;
  const currentWeightsGrams = placedWeights.reduce((sum, w) => sum + w.weight, 0);

  // Tilt calculation: -10 deg (left heavy) to +10 deg (right heavy)
  const diff = currentWeightsGrams - targetWeightGrams;
  const tiltDeg = Math.max(-12, Math.min(12, diff / 150));

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #facc15',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(250, 204, 21, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#facc15', fontWeight: 800, marginBottom: '6px' }}>
          <Scale size={22} />
          <span style={{ fontSize: '1.25rem' }}>{task.title}</span>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>{task.promptVi}</p>
      </div>

      {/* Balance Scale Stage */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px 20px 20px',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Balance Status Indicator */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            background: diff === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${diff === 0 ? '#10b981' : '#ef4444'}`,
            borderRadius: '20px',
            padding: '4px 14px',
            color: diff === 0 ? '#34d399' : '#f87171',
            fontSize: '0.8rem',
            fontWeight: 800,
          }}
        >
          {diff === 0 ? '⚖️ Đang thăng bằng!' : diff < 0 ? '◀ Đĩa trái nặng hơn' : 'Đĩa phải nặng hơn ▶'}
        </div>

        {/* The Balance Scale Graphic */}
        <div style={{ width: '320px', height: '140px', position: 'relative' }}>
          {/* Fulcrum Stand */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '18px',
              height: '110px',
              background: 'linear-gradient(180deg, #94a3b8 0%, #475569 100%)',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
            }}
          />
          {/* Base */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90px',
              height: '14px',
              background: '#334155',
              borderRadius: '6px',
              border: '1px solid #64748b',
            }}
          />

          {/* Tilting Beam */}
          <div
            style={{
              position: 'absolute',
              top: '25px',
              left: '10px',
              right: '10px',
              height: '8px',
              background: 'linear-gradient(90deg, #d97706 0%, #facc15 50%, #d97706 100%)',
              borderRadius: '4px',
              transform: `rotate(${tiltDeg}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Center Pivot Pin */}
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#ca8a04',
                border: '2px solid #fef08a',
              }}
            />

            {/* Left Pan (Target Item) */}
            <div
              style={{
                position: 'absolute',
                left: '-10px',
                top: '12px',
                width: '110px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `rotate(${-tiltDeg}deg)`, // counter-rotate pan to stay upright
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div style={{ width: '2px', height: '35px', background: 'rgba(255,255,255,0.4)' }} />
              <div
                style={{
                  width: '90px',
                  height: '24px',
                  background: 'linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%)',
                  borderRadius: '0 0 16px 16px',
                  border: '1px solid #ffffff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <span style={{ position: 'absolute', bottom: '16px', fontSize: '2.4rem' }}>
                  {task.targetItemEmoji}
                </span>
              </div>
              <span style={{ color: '#cbd5e1', fontSize: '0.72rem', fontWeight: 700, marginTop: '4px' }}>
                {task.targetItemName}
              </span>
            </div>

            {/* Right Pan (Placed Weights) */}
            <div
              style={{
                position: 'absolute',
                right: '-10px',
                top: '12px',
                width: '110px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `rotate(${-tiltDeg}deg)`,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div style={{ width: '2px', height: '35px', background: 'rgba(255,255,255,0.4)' }} />
              <div
                style={{
                  width: '90px',
                  height: '24px',
                  background: 'linear-gradient(180deg, #fef08a 0%, #facc15 100%)',
                  borderRadius: '0 0 16px 16px',
                  border: '1px solid #ffffff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Visual weights stacked */}
                <div style={{ position: 'absolute', bottom: '14px', display: 'flex', gap: '3px', flexWrap: 'wrap-reverse', justifyContent: 'center', maxWidth: '80px' }}>
                  {placedWeights.map((w, idx) => (
                    <span
                      key={idx}
                      onClick={() => onRemoveWeight(idx)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #facc15',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        color: '#facc15',
                        cursor: 'pointer',
                      }}
                      title="Bấm để bỏ bớt quả cân này"
                    >
                      {w.label}
                    </span>
                  ))}
                </div>
              </div>
              <span style={{ color: '#facc15', fontSize: '0.72rem', fontWeight: 800, marginTop: '4px' }}>
                Tổng: {currentWeightsGrams >= 1000 ? `${currentWeightsGrams / 1000} kg` : `${currentWeightsGrams} g`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Weights Picker */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 800 }}>
            🛒 Bấm để thêm quả cân lên đĩa phải:
          </span>
          <button
            onClick={onReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Trash2 size={14} /> Xóa hết quả cân
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {task.scaleConfig?.availableWeights.map((w, idx) => (
            <button
              key={idx}
              onClick={() => onAddWeight(w.weight, w.label)}
              style={{
                background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                border: '1.5px solid #facc15',
                borderRadius: '10px',
                padding: '8px 14px',
                color: '#facc15',
                fontWeight: 900,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} /> + {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
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
        <CheckCircle2 size={18} /> Kiểm Tra Độ Thăng Bằng
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

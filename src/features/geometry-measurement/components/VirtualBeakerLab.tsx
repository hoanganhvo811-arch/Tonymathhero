import React from 'react';
import { Droplet, CheckCircle2, AlertTriangle, Plus, RotateCcw } from 'lucide-react';
import type { MeasurementToolTask } from '../../../types/geometryMeasurement';

interface VirtualBeakerLabProps {
  task: MeasurementToolTask;
  currentVolumeMl: number;
  onPour: (amountMl: number) => void;
  onReset: () => void;
  onSubmit: () => boolean;
  feedback: { message: string; isSuccess?: boolean } | null;
}

export const VirtualBeakerLab: React.FC<VirtualBeakerLabProps> = ({
  task,
  currentVolumeMl,
  onPour,
  onReset,
  onSubmit,
  feedback,
}) => {
  const maxCap = task.beakerConfig?.maxCapacityMl || 5000;
  const targetCap = task.beakerConfig?.targetCapacityMl || 3000;
  const step = task.beakerConfig?.stepMl || 1000;
  const fillPercentage = Math.min(100, Math.max(0, (currentVolumeMl / maxCap) * 100));
  const targetPercentage = (targetCap / maxCap) * 100;

  const isLiter = step >= 1000;
  const displayCurrent = isLiter ? `${(currentVolumeMl / 1000).toFixed(1).replace('.0', '')} l` : `${currentVolumeMl} ml`;
  const displayTarget = isLiter ? `${(targetCap / 1000).toFixed(1).replace('.0', '')} l` : `${targetCap} ml`;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #06b6d4',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(6, 182, 212, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontWeight: 800, marginBottom: '6px' }}>
          <Droplet size={22} />
          <span style={{ fontSize: '1.25rem' }}>{task.title}</span>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>{task.promptVi}</p>
      </div>

      {/* Interactive Beaker Container */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          minHeight: '260px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        {/* The Graduated Cylinder Graphic */}
        <div
          style={{
            width: '130px',
            height: '220px',
            border: '3px solid rgba(255, 255, 255, 0.4)',
            borderTop: 'none',
            borderRadius: '0 0 20px 20px',
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.05)',
            boxShadow: 'inset 0 0 20px rgba(6, 182, 212, 0.2)',
            overflow: 'hidden',
          }}
        >
          {/* Liquid level */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${fillPercentage}%`,
              background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
              transition: 'height 0.3s ease-out',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
            }}
          />

          {/* Target Line Guide */}
          <div
            style={{
              position: 'absolute',
              bottom: `${targetPercentage}%`,
              left: 0,
              right: 0,
              borderBottom: '2px dashed #facc15',
              zIndex: 5,
            }}
          >
            <span
              style={{
                position: 'absolute',
                right: '4px',
                bottom: '2px',
                fontSize: '0.65rem',
                fontWeight: 900,
                color: '#facc15',
                background: 'rgba(0,0,0,0.7)',
                padding: '1px 3px',
                borderRadius: '3px',
              }}
            >
              Mục tiêu: {displayTarget}
            </span>
          </div>

          {/* Tick marks on beaker */}
          {Array.from({ length: 5 }).map((_, i) => {
            const pct = (i + 1) * 20;
            const val = (maxCap / 5) * (i + 1);
            const label = isLiter ? `${val / 1000} l` : `${val} ml`;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: `${pct}%`,
                  left: 0,
                  width: '18px',
                  borderBottom: '1.5px solid rgba(255,255,255,0.6)',
                  zIndex: 4,
                }}
              >
                <span style={{ position: 'absolute', left: '22px', bottom: '-7px', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Readout stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 20px', textAlign: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>MỰC NƯỚC HIỆN TẠI</div>
            <div style={{ color: '#38bdf8', fontSize: '1.8rem', fontWeight: 900 }}>{displayCurrent}</div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onPour(step)}
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 14px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={16} /> Rót +{isLiter ? `${step / 1000} l` : `${step} ml`}
            </button>
            <button
              onClick={onReset}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
              }}
              title="Đổ sạch nước"
            >
              <RotateCcw size={16} />
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
        <CheckCircle2 size={18} /> Kiểm Tra Mực Nước
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

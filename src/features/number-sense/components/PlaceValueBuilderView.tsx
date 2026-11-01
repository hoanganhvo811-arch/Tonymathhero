import React from 'react';
import { Building2, CheckCircle2, AlertTriangle, Plus, Minus, RotateCcw } from 'lucide-react';
import type { PlaceValueTask, PlaceValueBlockCount } from '../../../types/numberSense';

interface PlaceValueBuilderViewProps {
  task: PlaceValueTask;
  placedBlocks: PlaceValueBlockCount;
  feedback: { message: string; isSuccess?: boolean } | null;
  onAddBlock: (unit: 'thousands' | 'hundreds' | 'tens' | 'ones') => void;
  onRemoveBlock: (unit: 'thousands' | 'hundreds' | 'tens' | 'ones') => void;
  onReset: () => void;
  onSubmit: () => boolean;
}

export const PlaceValueBuilderView: React.FC<PlaceValueBuilderViewProps> = ({
  task,
  placedBlocks,
  feedback,
  onAddBlock,
  onRemoveBlock,
  onReset,
  onSubmit,
}) => {
  const currentTotal =
    placedBlocks.thousands * 1000 +
    placedBlocks.hundreds * 100 +
    placedBlocks.tens * 10 +
    placedBlocks.ones * 1;

  const isGrade3 = task.gradeLevel === 'grade-3';

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
      {/* Title & Goal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800, marginBottom: '6px' }}>
            <Building2 size={22} />
            <span style={{ fontSize: '1.25rem' }}>Tháp Giá Trị Hàng – Xây Dựng Con Số</span>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{task.promptVi}</p>
        </div>

        {/* Target Number Display */}
        <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '2px solid #38bdf8', borderRadius: '14px', padding: '10px 20px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>SỐ MỤC TIÊU</div>
          <div style={{ color: '#facc15', fontSize: '2.2rem', fontWeight: 900 }}>{task.targetNumber}</div>
        </div>
      </div>

      {/* Expanded Place Value Breakdown Formula */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '1.1rem', fontWeight: 900 }}>
          {isGrade3 && (
            <>
              <span style={{ color: '#a855f7' }}>{placedBlocks.thousands * 1000}</span>
              <span style={{ color: '#64748b' }}>+</span>
            </>
          )}
          <span style={{ color: '#f59e0b' }}>{placedBlocks.hundreds * 100}</span>
          <span style={{ color: '#64748b' }}>+</span>
          <span style={{ color: '#10b981' }}>{placedBlocks.tens * 10}</span>
          <span style={{ color: '#64748b' }}>+</span>
          <span style={{ color: '#38bdf8' }}>{placedBlocks.ones}</span>
          <span style={{ color: '#facc15' }}>=</span>
          <span
            style={{
              color: currentTotal === task.targetNumber ? '#34d399' : '#f87171',
              fontSize: '1.4rem',
            }}
          >
            {currentTotal}
          </span>
        </div>

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
          <RotateCcw size={14} /> Xóa làm lại
        </button>
      </div>

      {/* Interactive Base-10 Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isGrade3 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gap: '14px',
        }}
      >
        {/* Column Thousands (Grade 3) */}
        {isGrade3 && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1.5px solid #a855f7',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ color: '#c084fc', fontWeight: 900, fontSize: '0.9rem' }}>HÀNG NGHÌN</div>
            <div style={{ fontSize: '2.5rem' }}>🧊</div>
            <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 900 }}>
              {placedBlocks.thousands}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onRemoveBlock('thousands')}
                style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#334155', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => onAddBlock('thousands')}
                style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#a855f7', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Column Hundreds */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1.5px solid #f59e0b',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ color: '#fbbf24', fontWeight: 900, fontSize: '0.9rem' }}>HÀNG TRĂM</div>
          <div style={{ fontSize: '2.5rem' }}>🟨</div>
          <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 900 }}>
            {placedBlocks.hundreds}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onRemoveBlock('hundreds')}
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#334155', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => onAddBlock('hundreds')}
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f59e0b', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Column Tens */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1.5px solid #10b981',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ color: '#34d399', fontWeight: 900, fontSize: '0.9rem' }}>HÀNG CHỤC</div>
          <div style={{ fontSize: '2.5rem' }}>🟩</div>
          <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 900 }}>
            {placedBlocks.tens}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onRemoveBlock('tens')}
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#334155', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => onAddBlock('tens')}
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Column Ones */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1.5px solid #38bdf8',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ color: '#38bdf8', fontWeight: 900, fontSize: '0.9rem' }}>HÀNG ĐƠN VỊ</div>
          <div style={{ fontSize: '2.5rem' }}>🟦</div>
          <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 900 }}>
            {placedBlocks.ones}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onRemoveBlock('ones')}
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#334155', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => onAddBlock('ones')}
              style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#38bdf8', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Submit Check Button */}
      <button
        onClick={onSubmit}
        style={{
          padding: '14px 28px',
          borderRadius: '14px',
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
          fontSize: '1rem',
        }}
      >
        <CheckCircle2 size={20} /> Kiểm Tra Cấu Tạo Số
      </button>

      {/* Feedback Banner */}
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

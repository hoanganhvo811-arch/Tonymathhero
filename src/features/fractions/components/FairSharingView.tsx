import React from 'react';
import { useFractionStore } from '../useFractionStore';

export const FairSharingView: React.FC = () => {
  const {
    currentSharingTask,
    sharingFeedback,
    answerSharing,
    nextSharingTask,
    sharingIndex,
    campaignId,
  } = useFractionStore();

  const { totalItems, recipientCount, itemIcon, itemNameVi, storyContextVi, options } =
    currentSharingTask;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid rgba(16, 185, 129, 0.4)',
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
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#34d399',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            {campaignId === 'grade-3' ? 'LỚP 3 • CHIA PHẦN NÂNG CAO' : 'LỚP 2 • CHIA PHẦN CÔNG BẰNG'}
          </span>
          <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800, marginTop: '8px' }}>
            {currentSharingTask.titleVi}
          </h3>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
          Nhiệm vụ {sharingIndex + 1}
        </div>
      </div>

      {/* Story Context */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          borderLeft: '4px solid #34d399',
        }}
      >
        <div style={{ color: '#f1f5f9', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {storyContextVi}
        </div>
      </div>

      {/* Visual Display of Items to Share */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '10px' }}>
          Tổng cộng có <strong>{totalItems}</strong> {itemNameVi} cần chia đều cho <strong>{recipientCount}</strong> người:
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            maxWidth: '500px',
            margin: '0 auto',
            fontSize: '1.8rem',
          }}
        >
          {Array.from({ length: totalItems }).map((_, i) => (
            <span
              key={i}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '6px 10px',
                borderRadius: '10px',
                border: '1px solid #475569',
              }}
            >
              {itemIcon}
            </span>
          ))}
        </div>
        <div
          style={{
            marginTop: '16px',
            color: '#facc15',
            fontSize: '1rem',
            fontWeight: 800,
          }}
        >
          Mỗi người sẽ nhận được: {currentSharingTask.fractionLabel} số {itemNameVi}
        </div>
      </div>

      {/* Multiple-Choice Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => answerSharing(opt)}
            disabled={sharingFeedback !== null}
            style={{
              padding: '16px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              color: '#f8fafc',
              fontSize: '1.25rem',
              fontWeight: 800,
              cursor: sharingFeedback ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {opt} {itemNameVi}
          </button>
        ))}
      </div>

      {/* Feedback & Next */}
      {sharingFeedback && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '14px',
            background: sharingFeedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `2px solid ${sharingFeedback.isCorrect ? '#10b981' : '#ef4444'}`,
          }}
        >
          <div
            style={{
              color: sharingFeedback.isCorrect ? '#34d399' : '#fca5a5',
              fontSize: '0.95rem',
              fontWeight: 700,
              marginBottom: '10px',
            }}
          >
            {sharingFeedback.message}
          </div>
          <button
            onClick={nextSharingTask}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ➡️ Nhiệm Vụ Tiếp Theo
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, Heart, Sparkles, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import type { LearningDashboardSummary, CampaignId } from '@/types';
import { SoundButton } from '@/components/common/SoundButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  summary: LearningDashboardSummary | null;
  studentName: string;
  campaignId: CampaignId;
}

export const ParentFriendlySummaryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  summary,
  studentName,
  campaignId,
}) => {
  if (!isOpen || !summary) return null;

  const isG2 = campaignId === 'grade-2';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          borderRadius: '20px',
          padding: '26px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={20} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                TỔNG KẾT NHANH DÀNH CHO PHỤ HUYNH
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Học sinh: <strong style={{ color: '#38bdf8' }}>{studentName}</strong> • {isG2 ? 'Lớp 2' : 'Lớp 3'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 3 Key highlights in cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Độ chính xác:</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
              {summary.firstAttemptAccuracy}%
            </div>
          </div>

          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Thời gian học:</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
              {summary.totalLearningTimeMinutes}p
            </div>
          </div>

          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Thành thạo:</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
              {summary.topicsMastered}/{summary.totalTopics}
            </div>
          </div>
        </div>

        {/* Strengths & Needs practice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {summary.strengths.length > 0 && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <div style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                🌟 Điểm mạnh nổi bật:
              </div>
              <div style={{ color: '#f1f5f9', fontSize: '0.84rem' }}>
                Bé tính toán rất tự tin ở chuyên đề: <strong>{summary.strengths.slice(0, 2).map((s) => s.topicNameVi).join(', ')}</strong> ({summary.strengths[0].firstAttemptAccuracy}% đúng).
              </div>
            </div>
          )}

          {summary.needsPractice.length > 0 && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <div style={{ color: '#fbbf24', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                🛡️ Nội dung cần khuyến khích rèn luyện thêm:
              </div>
              <div style={{ color: '#f1f5f9', fontSize: '0.84rem' }}>
                Bé cần thêm một chút luyện tập ở: <strong>{summary.needsPractice[0].topicNameVi}</strong>.
              </div>
            </div>
          )}
        </div>

        {/* Daily home activity tip */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '0.82rem',
            color: '#cbd5e1',
            lineHeight: 1.5,
          }}
        >
          💡 <strong>Gợi ý hoạt động tại nhà hôm nay:</strong> Khi ăn trái cây hoặc xếp đồ chơi, hãy cùng bé đếm nhóm đồ vật (ví dụ 3 đĩa, mỗi đĩa 4 quả cam) để bé liên hệ trực quan giữa phép cộng nhiều lần và phép nhân!
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <SoundButton variant="secondary" size="md" onClick={onClose}>
            Đã Hiểu &amp; Đóng
          </SoundButton>
        </div>
      </div>
    </div>
  );
};

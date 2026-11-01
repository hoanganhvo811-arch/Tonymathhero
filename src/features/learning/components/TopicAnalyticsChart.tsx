import React from 'react';
import {
  TrendingUp,
  Minus,
  AlertCircle,
  Clock,
  CheckCircle,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import type { TopicAnalyticsData, MasteryLevel } from '@/types';
import { SoundButton } from '@/components/common/SoundButton';

interface Props {
  topicBreakdown: Record<string, TopicAnalyticsData>;
  isG2: boolean;
  onPracticeTopic?: (topicId: string, topicNameVi: string) => void;
}

export const TopicAnalyticsChart: React.FC<Props> = ({
  topicBreakdown,
  isG2,
  onPracticeTopic,
}) => {
  const topics = Object.values(topicBreakdown);

  const getMasteryBadge = (level: MasteryLevel) => {
    switch (level) {
      case 'MASTERED':
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#34d399',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={12} /> ĐÃ THÀNH THẠO
          </span>
        );
      case 'DEVELOPING':
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid #3b82f6',
              color: '#60a5fa',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ĐANG TIẾN BỘ
          </span>
        );
      case 'LEARNING':
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              color: '#fbbf24',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ĐANG HỌC
          </span>
        );
      case 'NOT_STARTED':
      default:
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(148, 163, 184, 0.1)',
              border: '1px solid #475569',
              color: '#94a3b8',
            }}
          >
            CHƯA BẮT ĐẦU
          </span>
        );
    }
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'needs_practice') => {
    switch (trend) {
      case 'improving':
        return (
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem' }}>
            <TrendingUp size={14} /> Tiến bộ
          </span>
        );
      case 'needs_practice':
        return (
          <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem' }}>
            <AlertCircle size={14} /> Cần rèn thêm
          </span>
        );
      case 'stable':
      default:
        return (
          <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem' }}>
            <Minus size={14} /> Ổn định
          </span>
        );
    }
  };

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '14px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '0.03em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📈 MA TRẬN NĂNG LỰC TOÁN HỌC THEO CHUYÊN ĐỀ
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            Chuẩn đánh giá 4 mức độ: Chưa bắt đầu • Đang học (&lt;60%) • Đang tiến bộ (60-84%) • Đã thành thạo (&ge;85% &amp; &ge;10 câu)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topics.map((t) => {
          const acc = t.firstAttemptAccuracy;
          const barColor =
            t.masteryLevel === 'MASTERED'
              ? 'linear-gradient(90deg, #059669, #10b981)'
              : t.masteryLevel === 'DEVELOPING'
              ? 'linear-gradient(90deg, #2563eb, #38bdf8)'
              : t.masteryLevel === 'LEARNING'
              ? 'linear-gradient(90deg, #d97706, #fbbf24)'
              : 'rgba(71, 85, 105, 0.3)';

          return (
            <div
              key={t.topicId}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'border-color 0.2s ease',
              }}
            >
              {/* Top row: Name, Badge, Trend */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {t.topicNameVi}
                  </span>
                  {getMasteryBadge(t.masteryLevel)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {getTrendIcon(t.trend)}
                  {onPracticeTopic && (
                    <SoundButton
                      variant={isG2 ? 'grade2' : 'grade3'}
                      size="sm"
                      onClick={() => onPracticeTopic(t.topicId, t.topicNameVi)}
                      icon={<PlayCircle size={14} />}
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                    >
                      Luyện Tập
                    </SoundButton>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '4px',
                  }}
                >
                  <span>Độ chính xác lần đầu</span>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                    {t.totalQuestions > 0 ? `${t.firstAttemptAccuracy}%` : 'Chưa có dữ liệu'}
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${acc}%`,
                      background: barColor,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>

              {/* Bottom statistics: attempts, correct, average time */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  paddingTop: '4px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={13} color="#10b981" />
                  Đã làm: <strong style={{ color: '#e2e8f0' }}>{t.totalQuestions} câu</strong> ({t.firstAttemptCorrect} đúng / {t.firstAttemptIncorrect} sửa lại)
                </span>
                {t.averageTimeSeconds > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="#38bdf8" />
                    Thời gian TB: <strong style={{ color: '#e2e8f0' }}>{t.averageTimeSeconds} giây/câu</strong>
                  </span>
                )}
                {t.finalAccuracy !== t.firstAttemptAccuracy && t.totalQuestions > 0 && (
                  <span style={{ color: '#a78bfa' }}>
                    Độ chính xác sau khi sửa: <strong>{t.finalAccuracy}%</strong>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

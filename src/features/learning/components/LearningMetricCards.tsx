import React from 'react';
import {
  Brain,
  CheckCircle2,
  XCircle,
  Percent,
  Clock,
  Flame,
  BookOpen,
  Award,
  ShieldCheck,
  Crown,
} from 'lucide-react';
import type { LearningDashboardSummary } from '@/types';

interface Props {
  summary: LearningDashboardSummary;
  isG2: boolean;
}

export const LearningMetricCards: React.FC<Props> = ({ summary, isG2 }) => {
  const primaryColor = isG2 ? '#38bdf8' : '#ef4444';
  const primaryBg = isG2 ? 'rgba(56, 189, 248, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  const primaryBorder = isG2 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(239, 68, 68, 0.25)';

  const metrics = [
    {
      id: 'total_questions',
      icon: <Brain size={22} color={primaryColor} />,
      label: 'Tổng Câu Hỏi Đã Làm',
      value: summary.totalQuestions,
      unit: 'câu',
      description: 'Số câu toán học Tony đã giải',
      accentColor: primaryColor,
    },
    {
      id: 'first_accuracy',
      icon: <Percent size={22} color="#10b981" />,
      label: 'Tỷ Lệ Đúng Lần Đầu',
      value: `${summary.firstAttemptAccuracy}%`,
      unit: '',
      description: 'Độ chuẩn xác ngay lần chọn đầu',
      accentColor: '#10b981',
    },
    {
      id: 'final_accuracy',
      icon: <Award size={22} color="#3b82f6" />,
      label: 'Tỷ Lệ Chính Xác Chung',
      value: `${summary.finalAccuracy}%`,
      unit: '',
      description: 'Bao gồm cả các câu đã sửa đúng',
      accentColor: '#3b82f6',
    },
    {
      id: 'correct_count',
      icon: <CheckCircle2 size={22} color="#10b981" />,
      label: 'Số Câu Trả Lời Đúng',
      value: summary.firstAttemptCorrect,
      unit: 'câu',
      description: 'Thành tích xuất sắc giải thành công',
      accentColor: '#10b981',
    },
    {
      id: 'incorrect_count',
      icon: <XCircle size={22} color="#f59e0b" />,
      label: 'Số Câu Cần Củng Cố',
      value: summary.firstAttemptIncorrect,
      unit: 'câu',
      description: 'Cơ hội rèn luyện để giỏi hơn',
      accentColor: '#f59e0b',
    },
    {
      id: 'learning_time',
      icon: <Clock size={22} color="#a855f7" />,
      label: 'Thời Gian Học Tích Luỹ',
      value: summary.totalLearningTimeMinutes,
      unit: 'phút',
      description: 'Tổng thời gian tập trung tư duy',
      accentColor: '#a855f7',
    },
    {
      id: 'streak',
      icon: <Flame size={22} color="#f97316" />,
      label: 'Chuỗi Ngày Rèn Luyện',
      value: summary.learningStreakDays,
      unit: 'ngày liên tiếp',
      description: 'Tính kiên trì bền bỉ mỗi ngày',
      accentColor: '#f97316',
    },
    {
      id: 'topics_practiced',
      icon: <BookOpen size={22} color="#06b6d4" />,
      label: 'Chuyên Đề Đã Luyện Tập',
      value: `${summary.topicsPracticed}/${summary.totalTopics}`,
      unit: 'chuyên đề',
      description: 'Độ phủ chương trình Toán chuẩn',
      accentColor: '#06b6d4',
    },
    {
      id: 'topics_mastered',
      icon: <Crown size={22} color="#fbbf24" />,
      label: 'Chuyên Đề Đã Thành Thạo',
      value: `${summary.topicsMastered}/${summary.totalTopics}`,
      unit: 'đạt chuẩn cao',
      description: 'Độ chính xác >=85% và >=10 câu',
      accentColor: '#fbbf24',
    },
    {
      id: 'milestones',
      icon: <ShieldCheck size={22} color="#ec4899" />,
      label: 'Cột Mốc Vương Quốc',
      value: `${summary.kingdomsRestoredCount}/7`,
      unit: 'vương quốc',
      description: `Đã hoàn thành ${summary.completedQuestsCount} nhiệm vụ giải cứu`,
      accentColor: '#ec4899',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '24px',
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.id}
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${m.accentColor ? `${m.accentColor}33` : primaryBorder}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {/* Subtle top indicator glow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: m.accentColor,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              {m.label}
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: `${m.accentColor}1a`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {m.icon}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
            <span
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#f8fafc',
                fontFamily: 'monospace',
                lineHeight: 1,
              }}
            >
              {m.value}
            </span>
            {m.unit && (
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 500 }}>
                {m.unit}
              </span>
            )}
          </div>

          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
            {m.description}
          </div>
        </div>
      ))}
    </div>
  );
};

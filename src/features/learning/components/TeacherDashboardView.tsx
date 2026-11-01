import React from 'react';
import {
  GraduationCap,
  HeartHandshake,
  Clock,
  Sparkles,
  BookMarked,
  Printer,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import type { LearningDashboardSummary } from '@/types';
import { SoundButton } from '@/components/common/SoundButton';
import { GRADE_2_TOPIC_REGISTRY, GRADE_3_TOPIC_REGISTRY } from '../services/learningAnalyticsService';

interface Props {
  summary: LearningDashboardSummary;
  isG2: boolean;
  onOpenReport: () => void;
}

export const TeacherDashboardView: React.FC<Props> = ({ summary, isG2, onOpenReport }) => {
  const topicRegistry = isG2 ? GRADE_2_TOPIC_REGISTRY : GRADE_3_TOPIC_REGISTRY;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Teacher / Parent Top Card */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraduationCap size={28} color="#3b82f6" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              GÓC SƯ PHẠM DÀNH CHO PHỤ HUYNH & GIÁO VIÊN
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Theo dõi thói quen học tập, hướng dẫn đồng hành tại nhà và đánh giá năng lực tư duy toán học
            </p>
          </div>
        </div>

        <SoundButton
          variant="gold"
          size="md"
          onClick={onOpenReport}
          icon={<Printer size={16} />}
        >
          Xuất Báo Cáo A4 (PDF)
        </SoundButton>
      </div>

      {/* Screen Time & Routine Guidelines */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Habit Card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700 }}>
            <Clock size={18} /> THỜI LƯỢNG HỌC TẬP KHUYẾN NGHỊ
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            Để bảo vệ thị lực và duy trì sự hào hứng của trẻ tiểu học, thời lượng lý tưởng là <strong>15 - 25 phút mỗi ngày</strong> (tương đương 1-2 trận chiến hoặc 10-15 câu toán).
          </p>
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#94a3b8',
            }}
          >
            Thời gian tích luỹ tuần này: <strong style={{ color: '#f8fafc' }}>{summary.totalLearningTimeMinutes} phút</strong> ({summary.learningStreakDays} ngày rèn luyện liên tục)
          </div>
        </div>

        {/* Positive Pedagogy Card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700 }}>
            <HeartHandshake size={18} /> NGUYÊN TẮC ĐỒNG HÀNH TÍCH CỰC
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            Tony Math Hero áp dụng triết lý <strong>Khen ngợi nỗ lực & Không trừng phạt lỗi sai</strong>. Khi bé chọn chưa đúng, hãy khích lệ bé đọc kỹ gợi ý suy luận thay vì làm thay cho bé.
          </p>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#34d399',
            }}
          >
            Mỗi sai sót là một cơ hội để nâng cấp &quot;Áo Giáp Trí Tuệ&quot; của bé!
          </div>
        </div>
      </div>

      {/* Practical Home Guidance per Topic */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BookMarked size={20} color="#fbbf24" />
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
            HƯỚNG DẪN ÔN TẬP TẠI NHÀ THEO TỪNG CHUYÊN ĐỀ
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.values(topicRegistry).map((meta) => {
            const topicStat = summary.topicBreakdown[meta.id];
            const acc = topicStat ? topicStat.firstAttemptAccuracy : 0;
            const isNeedHelp = acc < 65 && topicStat && topicStat.totalQuestions > 0;

            return (
              <div
                key={meta.id}
                style={{
                  background: isNeedHelp ? 'rgba(245, 158, 11, 0.08)' : 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${isNeedHelp ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                  borderRadius: '12px',
                  padding: '14px 18px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {meta.nameVi}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: isNeedHelp ? '#fbbf24' : '#94a3b8' }}>
                    {topicStat && topicStat.totalQuestions > 0
                      ? `Độ chính xác: ${acc}% (${topicStat.totalQuestions} câu)`
                      : 'Chưa làm câu nào'}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                  💡 <strong>Gợi ý hướng dẫn:</strong> {meta.adviceForParents}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

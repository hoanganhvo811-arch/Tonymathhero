import React from 'react';
import { Sparkles, Target, Zap, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import type { RecommendedPracticeItem, TopicAnalyticsData } from '@/types';
import { SoundButton } from '@/components/common/SoundButton';

interface Props {
  recommendations: RecommendedPracticeItem[];
  strengths: TopicAnalyticsData[];
  needsPractice: TopicAnalyticsData[];
  onStartPractice: (item: RecommendedPracticeItem) => void;
  isG2: boolean;
}

export const RecommendedPracticeSection: React.FC<Props> = ({
  recommendations,
  strengths,
  needsPractice,
  onStartPractice,
  isG2,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top 2 columns: Strengths vs Areas to Strengthen */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Strengths Card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={18} color="#10b981" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#34d399' }}>
                🌟 ĐIỂM MẠNH CỦA HIỆP SĨ TONY
              </h4>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                Các chuyên đề bé nắm vững và tự tin nhất (Độ chính xác &ge; 80%)
              </p>
            </div>
          </div>

          {strengths.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '12px 0' }}>
              Hãy rèn luyện thêm vài câu hỏi để Tony bộc lộ thế mạnh của mình nhé!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {strengths.slice(0, 4).map((s) => (
                <div
                  key={s.topicId}
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f1f5f9' }}>
                    {s.topicNameVi}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399' }}>
                    {s.firstAttemptAccuracy}% đúng ({s.totalQuestions} câu)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Areas needing reinforcement */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldAlert size={18} color="#f59e0b" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#fbbf24' }}>
                🛡️ CHỦ ĐỀ CẦN CỦNG CỐ THÊM
              </h4>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                Những vùng kiến thức cần rèn thêm bài tập để bứt phá
              </p>
            </div>
          </div>

          {needsPractice.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '12px 0' }}>
              Tuyệt vời! Tony đang nắm rất vững toàn bộ các chuyên đề đã học.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {needsPractice.slice(0, 4).map((n) => (
                <div
                  key={n.topicId}
                  style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f1f5f9' }}>
                    {n.topicNameVi}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
                    {n.totalQuestions > 0 ? `${n.firstAttemptAccuracy}% đúng` : 'Chưa thử sức'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Practice Missions */}
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
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#f8fafc',
              margin: '0 0 6px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🎯 LỘ TRÌNH RÈN LUYỆN ĐỀ XUẤT (ACTIONABLE MISSIONS)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            Hệ thống tự động phân tích điểm yếu và chuẩn bị các thử thách giúp Tony bứt phá năng lực
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
            Chưa có đề xuất mới. Hãy tiếp tục giải cứu các vương quốc trên Bản Đồ!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {recommendations.map((item) => (
              <div
                key={item.topicId}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        textTransform: 'uppercase',
                      }}
                    >
                      ĐỘ KHÓ: {item.recommendedDifficulty}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {item.suggestedQuestionsCount} câu thử thách
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: '4px 0 8px 0' }}>
                    {item.topicNameVi}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    {item.reason}
                  </p>
                </div>

                <SoundButton
                  variant={isG2 ? 'grade2' : 'grade3'}
                  size="md"
                  onClick={() => onStartPractice(item)}
                  icon={<Zap size={16} />}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  BẮT ĐẦU LUYỆN TẬP
                </SoundButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

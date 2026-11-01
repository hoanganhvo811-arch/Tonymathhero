import React from 'react';
import { useFractionStore } from '../useFractionStore';
import { FractionAdaptiveEngine } from '../services/fractionAdaptiveEngine';

export const FractionAnalyticsView: React.FC = () => {
  const { progress, campaignId } = useFractionStore();
  const { skillBreakdown, achievements, totalAttempts, successCount, accuracyPercentage } = progress;

  const recommendation = FractionAdaptiveEngine.getRecommendedFocus(skillBreakdown);

  const skillsList = [
    { name: 'Nhận biết một nửa (1/2)', score: skillBreakdown.halfRecognitionScore },
    { name: 'Nhận biết một phần ba (1/3)', score: skillBreakdown.thirdRecognitionScore },
    { name: 'Nhận biết một phần tư (1/4)', score: skillBreakdown.fourthRecognitionScore },
    { name: 'Nhận biết một phần năm (1/5)', score: skillBreakdown.fifthRecognitionScore },
    { name: 'Phân biệt chia đều & không đều', score: skillBreakdown.equalVsUnequalScore },
    { name: 'Tử số & Mẫu số', score: skillBreakdown.numeratorDenominatorScore },
    { name: 'So sánh phân số trực quan', score: skillBreakdown.visualComparisonScore },
    { name: 'Phân số của một tập hợp đồ vật', score: skillBreakdown.fractionOfSetScore },
    { name: 'Chia phần công bằng trong cuộc sống', score: skillBreakdown.realLifeSharingScore },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.8rem', color: '#34d399', fontWeight: 900 }}>
            {progress.builderTasksCompleted +
              progress.recognitionTasksCompleted +
              progress.comparisonTasksCompleted +
              progress.fairSharingCompleted}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, marginTop: '4px' }}>
            NHIỆM VỤ ĐÃ HOÀN THÀNH
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.8rem', color: '#38bdf8', fontWeight: 900 }}>
            {accuracyPercentage}%
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, marginTop: '4px' }}>
            ĐỘ CHÍNH XÁC ({successCount}/{totalAttempts} LẦN)
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.8rem', color: '#facc15', fontWeight: 900 }}>
            {achievements.filter((a) => a.unlocked).length}/{achievements.length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, marginTop: '4px' }}>
            HUY HIỆU THÀNH TÍCH
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.8rem', color: '#c084fc', fontWeight: 900 }}>
            {progress.bossDefeated ? 'ĐÃ GIẢI CỨU 🔮' : 'CHƯA MỞ 🔒'}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, marginTop: '4px' }}>
            KNOWLEDGE CRYSTAL
          </div>
        </div>
      </div>

      {/* Adaptive Recommendation Box */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '18px',
          padding: '18px 22px',
        }}
      >
        <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 800 }}>
          🧠 TONY&apos;S LEARNING BRAIN • ĐỀ XUẤT HỌC TẬP THÍCH ỨNG:
        </div>
        <div style={{ color: '#facc15', fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>
          Mục tiêu ưu tiên: {recommendation.skillNameVi}
        </div>
        <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}>
          {recommendation.adviceVi}
        </div>
      </div>

      {/* 9 Core Competency Breakdown */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '20px 24px',
        }}
      >
        <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px' }}>
          📊 ĐÁNH GIÁ 9 NĂNG LỰC CỐT LÕI VỀ PHÂN SỐ ({campaignId === 'grade-3' ? 'LỚP 3' : 'LỚP 2'})
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {skillsList.map((skill, i) => (
            <div key={i} style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '12px 16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                <span>{skill.name}</span>
                <span
                  style={{
                    color: skill.score >= 80 ? '#34d399' : skill.score >= 60 ? '#38bdf8' : '#facc15',
                  }}
                >
                  {skill.score}%
                </span>
              </div>
              <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${skill.score}%`,
                    background:
                      skill.score >= 80
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : skill.score >= 60
                        ? 'linear-gradient(90deg, #0284c7, #38bdf8)'
                        : 'linear-gradient(90deg, #d97706, #facc15)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Showcase */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '20px 24px',
        }}
      >
        <h4 style={{ color: '#facc15', fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px' }}>
          🏅 HUY HIỆU DANH DỰ VƯƠNG QUỐC PHÂN SỐ
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              style={{
                background: ach.unlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                border: `1px solid ${ach.unlocked ? '#10b981' : '#475569'}`,
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                opacity: ach.unlocked ? 1 : 0.6,
              }}
            >
              <div style={{ fontSize: '2rem' }}>{ach.icon}</div>
              <div>
                <div style={{ color: ach.unlocked ? '#34d399' : '#94a3b8', fontSize: '0.9rem', fontWeight: 800 }}>
                  {ach.nameVi}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>
                  {ach.descVi}
                </div>
                <div style={{ color: '#facc15', fontSize: '0.75rem', fontWeight: 700, marginTop: '4px' }}>
                  +{ach.xpReward} XP {ach.unlocked ? '✓ Đã đạt' : '🔒 Khóa'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Award, BarChart3, Brain, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { useNumberSenseStore } from '../useNumberSenseStore';
import { NumberSenseAdaptiveEngine } from '../services/numberSenseAdaptiveEngine';

export const NumberSenseAnalyticsView: React.FC = () => {
  const {
    attempts,
    achievements,
    totalExp,
    totalGold,
    solvedPlaceValueIds,
    masteredStrategyIds,
    solvedPatternIds,
    solvedPuzzleIds,
    highestStreak,
  } = useNumberSenseStore();

  const skills = NumberSenseAdaptiveEngine.calculateSkillBreakdown(attempts);

  const skillItems = [
    { label: 'Nhận Biết Số & Đọc Viết Số', score: skills.numberRecognitionScore, color: '#38bdf8' },
    { label: 'Giá Trị Hàng (Nghìn, Trăm, Chục, Đơn Vị)', score: skills.placeValueScore, color: '#a855f7' },
    { label: 'So Sánh & Sắp Xếp Số', score: skills.numberComparisonScore, color: '#f59e0b' },
    { label: 'Cấu Tạo & Ghép Số', score: skills.numberCompositionScore, color: '#34d399' },
    { label: 'Tách Số Linh Hoạt', score: skills.numberDecompositionScore, color: '#10b981' },
    { label: 'Mối Quan Hệ Số (Liền Trước/Sau, Cặp Số 10)', score: skills.numberRelationshipsScore, color: '#ec4899' },
    { label: 'Cộng Nhẩm (Tách Số, Bù Mười)', score: skills.mentalAdditionScore, color: '#f97316' },
    { label: 'Trừ Nhẩm (Làm Tròn Bù Trừ)', score: skills.mentalSubtractionScore, color: '#ef4444' },
    { label: 'Nhân Chia Nhẩm (Tách Thừa Số, Quan Hệ Đảo)', score: skills.mentalMultiplicationScore, color: '#06b6d4' },
    { label: 'Quy Luật & Dãy Số', score: skills.numberPatternsScore, color: '#eab308' },
  ];

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isSuccess).length;
  const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Stat Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>SỐ ĐÃ XÂY DỰNG</div>
          <div style={{ color: '#38bdf8', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>
            {solvedPlaceValueIds.length} số
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>CHIẾN LƯỢC ĐÃ THUỘC</div>
          <div style={{ color: '#a78bfa', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>
            {masteredStrategyIds.length} / 5 chiến lược
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>COMBO NHẨM TỐI ĐA</div>
          <div style={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Flame size={24} /> x{highestStreak}
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>ĐỘ CHÍNH XÁC TỔNG</div>
          <div style={{ color: '#34d399', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>
            {overallAccuracy}%
          </div>
        </div>
      </div>

      {/* 10 Competencies Skill Breakdown */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: 800, fontSize: '1.15rem', marginBottom: '16px' }}>
          <BarChart3 size={20} color="#38bdf8" />
          <span>Hồ Sơ Năng Lực Tư Duy Số & Tính Nhẩm (10 Trụ Cột)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {skillItems.map((item, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '5px' }}>
                <span style={{ color: '#e2e8f0' }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 900 }}>{item.score}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${item.score}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Badges */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: 800, fontSize: '1.15rem', marginBottom: '16px' }}>
          <Award size={20} color="#facc15" />
          <span>Huy Hiệu Danh Dự Vương Quốc Những Con Số</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {achievements.map((ach) => (
            <div
              key={ach.id}
              style={{
                background: ach.unlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                border: ach.unlocked ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '2.2rem' }}>{ach.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: ach.unlocked ? '#34d399' : '#f8fafc', fontWeight: 800, fontSize: '0.9rem' }}>
                  {ach.name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px', lineHeight: '1.4' }}>
                  {ach.description}
                </div>
                <div style={{ color: '#facc15', fontSize: '0.7rem', fontWeight: 700, marginTop: '4px' }}>
                  Tiến độ: {ach.progress} / {ach.maxProgress} {ach.unlocked && '✨ ĐÃ MỞ KHÓA!'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

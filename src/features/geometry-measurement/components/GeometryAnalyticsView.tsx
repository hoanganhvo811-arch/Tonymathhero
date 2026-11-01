import React from 'react';
import { Award, BarChart3, Brain, CheckCircle2, ShieldCheck, Target } from 'lucide-react';
import { useGeometryMeasurementStore } from '../useGeometryMeasurementStore';
import { GeometryAdaptiveEngine } from '../services/geometryAdaptiveEngine';

export const GeometryAnalyticsView: React.FC = () => {
  const { attempts, achievements, totalExp, totalGold, exploredShapeIds, solvedPuzzleIds } =
    useGeometryMeasurementStore();

  const skills = GeometryAdaptiveEngine.calculateSkillBreakdown(attempts);

  const skillItems = [
    { label: 'Nhận Biết Hình Phẳng & Khối (2D & 3D)', score: skills.shapeRecognitionScore, color: '#38bdf8' },
    { label: 'Đặc Điểm Hình (Cạnh, Đỉnh, Góc Vuông)', score: skills.shapePropertiesScore, color: '#facc15' },
    { label: 'Định Hướng Không Gian & Mê Cung', score: skills.spatialOrientationScore, color: '#10b981' },
    { label: 'Đo Độ Dài (Căn Thước Vạch 0, cm, mm)', score: skills.lengthMeasurementScore, color: '#34d399' },
    { label: 'Đo Khối Lượng (Cân Thăng Bằng, kg, g)', score: skills.massMeasurementScore, color: '#fb923c' },
    { label: 'Đo Dung Tích (Đong Lít, Mi-li-lít)', score: skills.capacityMeasurementScore, color: '#06b6d4' },
    { label: 'Đọc Đồng Hồ (Giờ Đúng, Rưỡi, Giờ Kém)', score: skills.timeReadingScore, color: '#c084fc' },
    { label: 'Bài Toán Hình Học & Đo Lường Thực Tế', score: skills.wordProblemReasoningScore, color: '#ec4899' },
  ];

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isSuccess).length;
  const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Stat Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>HÌNH ĐÃ KHÁM PHÁ</div>
          <div style={{ color: '#38bdf8', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>
            {exploredShapeIds.length} / 8 hình
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>CÂU ĐỐ ĐÃ HOÀN THÀNH</div>
          <div style={{ color: '#34d399', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>
            {solvedPuzzleIds.length} câu
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>ĐỘ CHÍNH XÁC TỔNG THỂ</div>
          <div style={{ color: '#facc15', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>
            {overallAccuracy}%
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>EXP ĐÃ TÍCH LŨY</div>
          <div style={{ color: '#c084fc', fontSize: '1.8rem', fontWeight: 900, marginTop: '2px' }}>
            +{totalExp} EXP
          </div>
        </div>
      </div>

      {/* 8 Competencies Skill Breakdown */}
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
          <span>Năng Lực Hình Học & Đo Lường Toàn Diện (8 Trụ Cột)</span>
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
          <span>Huy Hiệu Danh Dự Vương Quốc Hình Học & Đo Lường</span>
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

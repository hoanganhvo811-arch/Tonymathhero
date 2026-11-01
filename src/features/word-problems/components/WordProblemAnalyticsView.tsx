import React from 'react';
import { useWordProblemStore } from '../useWordProblemStore';
import { WORD_PROBLEMS_CATALOG } from '../data/wordProblemsCatalog';
import { WordProblemAdaptiveEngine } from '../services/wordProblemAdaptiveEngine';

export const WordProblemAnalyticsView: React.FC = () => {
  const { progress } = useWordProblemStore();

  const attempts = progress?.attempts || [];
  const skills = WordProblemAdaptiveEngine.calculateSkillBreakdown(attempts);
  const totalSolved = progress?.solvedProblemIds.length || 0;
  const totalCatalog = WORD_PROBLEMS_CATALOG.length;

  const skillBars = [
    { label: 'Khả năng Đọc Hiểu & Xác Định Câu Hỏi', score: skills.readingComprehensionScore, color: '#38bdf8' },
    { label: 'Xác Định Dữ Kiện Trọng Tâm', score: skills.givenIdentificationScore, color: '#4ade80' },
    { label: 'Lựa Chọn Phép Tính Phù Hợp (Tư duy bản chất)', score: skills.operationSelectionScore, color: '#facc15' },
    { label: 'Độ Chính Xác Trong Tính Toán', score: skills.calculationAccuracyScore, color: '#f472b6' },
    { label: 'Tư Duy Bài Toán Hai Bước Tính (Lớp 3)', score: skills.twoStepReasoningScore, color: '#a78bfa' },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
            fontSize: '1.6rem',
            color: '#38bdf8',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>📊</span>
          <span>BÁO CÁO NĂNG LỰC GIẢI TOÁN CÓ LỜI VĂN CỦA TONY</span>
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
          Hệ thống AI Thích Ứng tự động phân tách giữa lỗi tư duy lựa chọn phép tính và lỗi tính nhẩm đơn thuần.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '18px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
            {totalSolved} / {totalCatalog}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>BÀI TOÁN ĐÃ HOÀN THÀNH</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '18px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399' }}>
            {attempts.length > 0
              ? Math.round((attempts.filter((a) => a.isSuccess).length / attempts.length) * 100)
              : 100}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>TỶ LỆ ĐẠT CHUẨN</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '18px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#facc15' }}>
            {attempts.length} lượt
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>TỔNG SỐ LẦN LUYỆN TẬP</div>
        </div>
      </div>

      {/* 5 Core Skill Progress Bars */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
          Đánh Giá 5 Trụ Cột Năng Lực Giải Toán
        </h3>

        {skillBars.map((bar, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, color: '#cbd5e1' }}>{bar.label}</span>
              <span style={{ fontWeight: 900, color: bar.color }}>{bar.score}%</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${bar.score}%`,
                  height: '100%',
                  background: bar.color,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

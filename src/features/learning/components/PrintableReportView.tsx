import React from 'react';
import { X, Printer, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import type { LearningDashboardSummary, CampaignId } from '@/types';
import { SoundButton } from '@/components/common/SoundButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  summary: LearningDashboardSummary | null;
  studentName: string;
  campaignId: CampaignId;
}

export const PrintableReportView: React.FC<Props> = ({
  isOpen,
  onClose,
  summary,
  studentName,
  campaignId,
}) => {
  if (!isOpen || !summary) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const isG2 = campaignId === 'grade-2';
  const gradeLabel = isG2 ? 'Lớp 2 (Hiệp Sĩ Nhỏ)' : 'Lớp 3 (Đại Hiệp Sĩ Huyền Thoại)';
  const topics = Object.values(summary.topicBreakdown);

  return (
    <div
      className="printable-report-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 10, 20, 0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-report-content, .printable-report-content * {
            visibility: visible;
          }
          .printable-report-overlay {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: auto !important;
            background: white !important;
            padding: 0 !important;
          }
          .printable-report-content {
            background: white !important;
            color: #1e293b !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 20mm !important;
          }
          .no-print {
            display: none !important;
          }
          .print-black-text {
            color: #0f172a !important;
          }
          .print-table {
            border: 1px solid #cbd5e1 !important;
          }
          .print-table th, .print-table td {
            border: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
          }
        }
      `}</style>

      <div
        className="printable-report-content"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating action bar for on-screen controls */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 700 }}>
            <Award size={20} />
            Bản xem trước Báo Cáo Học Tập (Định dạng A4 Chuẩn)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SoundButton
              variant="gold"
              size="md"
              onClick={handlePrint}
              icon={<Printer size={16} />}
            >
              In Báo Cáo / Xuất PDF
            </SoundButton>

            <button
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE HEADER */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '18px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            BỘ GIÁO TRÌNH TOÁN HỌC NHẬP VAI RPG
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 4px 0', letterSpacing: '0.04em' }}>
            TONY MATH HERO – THE LEGEND OF SEVEN KINGDOMS
          </h1>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#334155', margin: 0 }}>
            PHIẾU BÁO CÁO NĂNG LỰC TOÁN HỌC & TIẾN ĐỘ RÈN LUYỆN
          </h2>
        </div>

        {/* STUDENT INFO GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <strong>Họ tên học sinh:</strong> <span style={{ color: '#0284c7', fontWeight: 700 }}>{studentName}</span>
          </div>
          <div>
            <strong>Chương trình:</strong> {gradeLabel}
          </div>
          <div>
            <strong>Ngày kết xuất báo cáo:</strong> {todayStr}
          </div>
          <div>
            <strong>Thời gian học tập:</strong> {summary.totalLearningTimeMinutes} phút ({summary.learningStreakDays} ngày liên tiếp)
          </div>
        </div>

        {/* SUMMARY 10 METRICS TABLE */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
            I. BẢNG TỔNG HỢP NĂNG LỰC TOÁN HỌC (10 CHỈ SỐ CỐT LÕI)
          </h3>
          <table
            className="print-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              textAlign: 'left',
              border: '1px solid #cbd5e1',
            }}
          >
            <tbody>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>1. Tổng số câu hỏi đã giải:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{summary.totalQuestions} câu</td>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>6. Thời gian rèn luyện:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>{summary.totalLearningTimeMinutes} phút</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>2. Tỷ lệ đúng lần đầu:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#16a34a' }}>{summary.firstAttemptAccuracy}%</td>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>7. Chuyên đề đã luyện:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>{summary.topicsPracticed}/{summary.totalTopics}</td>
              </tr>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>3. Tỷ lệ chính xác chung:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2563eb' }}>{summary.finalAccuracy}%</td>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>8. Chuyên đề thành thạo:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#ca8a04' }}>{summary.topicsMastered}/{summary.totalTopics}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>4. Số câu đúng:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#16a34a' }}>{summary.firstAttemptCorrect} câu</td>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>9. Chuỗi ngày liên tục:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#ea580c' }}>{summary.learningStreakDays} ngày</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>5. Số câu cần củng cố:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#dc2626' }}>{summary.firstAttemptIncorrect} câu</td>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>10. Vương quốc cứu thế:</td>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>{summary.kingdomsRestoredCount}/7 vương quốc</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TOPIC MASTERY BREAKDOWN TABLE */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
            II. ĐÁNH GIÁ CHI TIẾT THEO TỪNG CHUYÊN ĐỀ CHƯƠNG TRÌNH HỌC
          </h3>
          <table
            className="print-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.82rem',
              textAlign: 'left',
              border: '1px solid #cbd5e1',
            }}
          >
            <thead>
              <tr style={{ background: '#e2e8f0', color: '#0f172a' }}>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>STT</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Chuyên Đề Toán Học</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Số Câu</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Đúng Lần 1</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Thời Gian TB</th>
                <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>Mức Độ Thành Thạo</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t, idx) => {
                let badgeText = 'Chưa bắt đầu';
                if (t.masteryLevel === 'MASTERED') badgeText = 'Đã thành thạo (Xuất sắc)';
                else if (t.masteryLevel === 'DEVELOPING') badgeText = 'Đang tiến bộ tốt';
                else if (t.masteryLevel === 'LEARNING') badgeText = 'Đang rèn luyện';

                return (
                  <tr key={t.topicId} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>{idx + 1}</td>
                    <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                      {t.topicNameVi}
                    </td>
                    <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>{t.totalQuestions}</td>
                    <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                      {t.totalQuestions > 0 ? `${t.firstAttemptAccuracy}%` : '-'}
                    </td>
                    <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1' }}>
                      {t.averageTimeSeconds > 0 ? `${t.averageTimeSeconds}s` : '-'}
                    </td>
                    <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                      {badgeText}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TEACHER & PARENT FEEDBACK SECTION */}
        <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', background: '#f8fafc' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
            III. NHẬN XÉT SƯ PHẠM VÀ ĐỊNH HƯỚNG PHÁT TRIỂN
          </h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', lineHeight: 1.6, color: '#334155' }}>
            {summary.strengths.length > 0
              ? `Học sinh có tư duy phản xạ rất tốt ở các chuyên đề: ${summary.strengths.map((s) => s.topicNameVi).join(', ')}. `
              : 'Học sinh đang bắt đầu làm quen với hệ thống bài tập và thể hiện tinh thần học tập tích cực. '}
            {summary.needsPractice.length > 0
              ? `Cần khuyến khích học sinh duy trì rèn luyện thêm: ${summary.needsPractice.slice(0, 2).map((n) => n.topicNameVi).join(', ')}.`
              : 'Đạt phong độ học tập rất đồng đều và xuất sắc.'}
          </p>
        </div>

        {/* SIGNATURES ROW */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '0.88rem',
          }}
        >
          <div>
            <strong>Ý KIẾN PHỤ HUYNH HỌC SINH</strong>
            <div style={{ height: '60px' }} />
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>(Ký và ghi rõ họ tên)</div>
          </div>
          <div>
            <strong>GIÁO VIÊN / HỆ THỐNG ĐÁNH GIÁ</strong>
            <div style={{ height: '60px' }} />
            <div style={{ color: '#0284c7', fontWeight: 700 }}>HỆ THỐNG TONY MATH HERO</div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Crown, Sparkles, CheckCircle2, Award, Trophy, BookOpen, Star, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { SoundButton } from '@/components/common/SoundButton';
import { useStoryStore } from '../useStoryStore';
import { useAudio } from '@/hooks/useAudio';

export const CampaignEndingModal: React.FC = () => {
  const { endingSummary, clearEndingSummary } = useStoryStore();
  const { playLevelUp, playClick } = useAudio();

  if (!endingSummary) return null;

  return (
    <Modal
      isOpen={!!endingSummary}
      onClose={clearEndingSummary}
      title="CHIẾN DỊCH HOÀN THÀNH – ĐẠI KHẢI HOÀN BẢY VƯƠNG QUỐC"
      maxWidth="780px"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '10px 0',
          textAlign: 'center',
        }}
      >
        {/* Crown & Victory Fanfare Icon */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fbbf24 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 40px rgba(251, 191, 36, 0.7)',
            animation: 'pulse 2s infinite',
          }}
        >
          <Crown size={48} />
        </div>

        <div>
          <h2
            style={{
              margin: '0 0 6px 0',
              color: '#facc15',
              fontSize: '1.6rem',
              fontWeight: 900,
              letterSpacing: '0.5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            THE LEGEND OF SEVEN KINGDOMS COMPLETED
          </h2>
          <p style={{ margin: 0, color: '#38bdf8', fontSize: '1.05rem', fontWeight: 700 }}>
            {endingSummary.campaignTitle}
          </p>
          <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
            Chúc mừng Hiệp Sĩ Tony! Bạn đã đánh bại Lord Zero, thu hồi trọn vẹn 7 Viên Ngọc Tri Thức và mang lại ánh bình minh vĩnh cửu cho toàn cõi thế giới.
          </p>
        </div>

        {/* Honor Title Awarded */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.25) 100%)',
            border: '2px solid #fbbf24',
            borderRadius: '16px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Trophy size={24} color="#fbbf24" />
          <span style={{ color: '#fef08a', fontSize: '1.1rem', fontWeight: 800 }}>
            Danh Hiệu Danh Dự: [{endingSummary.heroTitleAwarded}]
          </span>
        </div>

        {/* Performance Statistics Grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '14px',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Vương Quốc Giải Cứu</div>
            <div style={{ color: '#4ade80', fontSize: '1.4rem', fontWeight: 900, marginTop: '4px' }}>
              {endingSummary.rescuedKingdomsCount} / {endingSummary.totalKingdomsCount}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '14px',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Đại Boss Đã Khuất Phục</div>
            <div style={{ color: '#f87171', fontSize: '1.4rem', fontWeight: 900, marginTop: '4px' }}>
              {endingSummary.defeatedBossesCount} / {endingSummary.totalBossesCount}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '14px',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Ngọc Tri Thức Thu Hồi</div>
            <div style={{ color: '#c084fc', fontSize: '1.4rem', fontWeight: 900, marginTop: '4px' }}>
              {endingSummary.crystalsCollectedCount} / {endingSummary.totalCrystalsCount}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '14px',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Câu Hỏi Đã Giải</div>
            <div style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: 900, marginTop: '4px' }}>
              {endingSummary.totalQuestionsAnswered} câu
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '14px',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Độ Chính Xác Trung Bình</div>
            <div style={{ color: '#fbbf24', fontSize: '1.4rem', fontWeight: 900, marginTop: '4px' }}>
              {endingSummary.accuracyPercentage}%
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '14px',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Cấp Độ Cuối Cùng</div>
            <div style={{ color: '#a78bfa', fontSize: '1.4rem', fontWeight: 900, marginTop: '4px' }}>
              Cấp {endingSummary.heroFinalLevel}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <SoundButton
            onClick={() => {
              playClick();
              clearEndingSummary();
            }}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '12px 32px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
            }}
          >
            Tiếp Tục Phiêu Lưu & Ôn Luyện
          </SoundButton>
        </div>
      </div>
    </Modal>
  );
};

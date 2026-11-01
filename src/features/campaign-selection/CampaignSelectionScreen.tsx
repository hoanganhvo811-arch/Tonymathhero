import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Shield,
  Crown,
  Trees,
  Castle,
  CheckCircle2,
} from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { HeroPortrait } from '@/components/common/HeroPortrait';
import { GameLogo } from '@/components/ui/GameLogo';
import { ThreeBackground } from '@/game/engine/ThreeBackground';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { useProgressStore } from '@/game/state/useProgressStore';
import { usePlayerStore } from '@/game/state/usePlayerStore';
import type { CampaignId } from '@/types';

export const CampaignSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { campaigns, selectCampaign, activeCampaignId } = useCampaignStore();
  const { player } = usePlayerStore();
  const { grade2Progress, grade3Progress, loadProgressForCampaign, loadAllCampaignsProgress } = useProgressStore();

  useEffect(() => {
    if (player) {
      loadAllCampaignsProgress(player.id);
    }
  }, [player, loadAllCampaignsProgress]);

  const handleEnterKingdom = async (campaignId: CampaignId) => {
    if (!player) return;
    await selectCampaign(campaignId, player.id);
    await loadProgressForCampaign(player.id, campaignId);
    navigate('/map');
  };

  const g2 = campaigns['grade-2'];
  const g3 = campaigns['grade-3'];

  // Calculate Progress Stats
  const g2UnlockedCount = grade2Progress?.unlockedKingdomIds.length || 1;
  const g2RescuedCount = grade2Progress?.rescuedKingdomIds.length || 0;
  const g2Percent = Math.min(100, Math.round((g2RescuedCount / 7) * 100));
  const g2Level = grade2Progress?.heroLevel || 1;

  const g3UnlockedCount = grade3Progress?.unlockedKingdomIds.length || 1;
  const g3RescuedCount = grade3Progress?.rescuedKingdomIds.length || 0;
  const g3Percent = Math.min(100, Math.round((g3RescuedCount / 7) * 100));
  const g3Level = grade3Progress?.heroLevel || 1;

  return (
    <div
      className="campaign-selection-screen"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 25%, #0d1e38 0%, #060e1d 55%, #03070f 100%)',
      }}
    >
      {/* 3D Atmospheric Background */}
      <ThreeBackground theme="intro" interactive={false} />

      {/* Top Header Section */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto 20px auto',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <SoundButton
          variant="secondary"
          size="sm"
          onClick={() => navigate('/')}
          icon={<ArrowLeft size={18} />}
        >
          QUAY LẠI TRANG CHỦ
        </SoundButton>

        <GameLogo size="sm" showSubtitle={false} showTagline={false} variant="gold" />

        <div style={{ width: '140px' }} />
      </div>

      {/* Main Campaign Selection Title */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 24px auto',
        }}
      >
        <h2
          className="font-cinematic"
          style={{
            fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
            color: '#ffffff',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
          }}
        >
          LỰA CHỌN CHIẾN DỊCH PHIÊU LƯU
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '6px' }}>
          Mỗi chiến dịch sở hữu bản đồ 7 vương quốc, quái vật thủ hộ, ngân hàng câu hỏi và tiến trình hoàn toàn độc lập
        </p>
      </div>

      {/* Dual Campaign Cards Grid */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '32px',
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          alignItems: 'stretch',
        }}
      >
        {/* ======================================================== */}
        {/* CAMPAIGN 01: THE LITTLE HERO – GRADE 2 (EMERALD & SILVER) */}
        {/* ======================================================== */}
        <Card
          variant="default"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, rgba(6, 40, 30, 0.92) 0%, rgba(4, 25, 18, 0.96) 100%)',
            border: activeCampaignId === 'grade-2' ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: activeCampaignId === 'grade-2' ? '0 0 32px rgba(16, 185, 129, 0.45)' : '0 12px 35px rgba(0, 0, 0, 0.65)',
            transition: 'transform 0.3s ease, border-color 0.3s ease',
          }}
        >
          {/* Card Ambient Header */}
          <div>
            {/* Top Badge and Region Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <Badge variant="emerald" icon={<Trees size={15} />}>
                {g2.heroBadge}
              </Badge>
              <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 700, letterSpacing: '0.04em' }}>
                BỐI CẢNH RỪNG & VƯƠNG QUỐC KHỞI NGUYÊN
              </span>
            </div>

            {/* Hero Visual: Tony in Silver-Emerald Explorer Armor */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '18px',
                animation: 'floatBob 4s ease-in-out infinite',
              }}
            >
              <HeroPortrait
                campaignId="grade-2"
                size={210}
                showBadge={true}
                glow={true}
              />
            </div>

            {/* Campaign Title & Subtitle */}
            <h3
              className="font-cinematic"
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#34d399',
                textAlign: 'center',
                letterSpacing: '0.08em',
                marginBottom: '4px',
                textShadow: '0 0 16px rgba(16, 185, 129, 0.5)',
              }}
            >
              CAMPAIGN 01: {g2.title}
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#a7f3d0',
                textAlign: 'center',
                marginBottom: '16px',
                fontStyle: 'italic',
                fontWeight: 600,
              }}
            >
              "{g2.subtitle}"
            </p>

            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
              {g2.description}
            </p>

            {/* Math Scope Highlights */}
            <div
              style={{
                background: 'rgba(4, 25, 18, 0.8)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  fontSize: '0.8rem',
                  color: '#6ee7b7',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <BookOpen size={16} />
                CHỦ ĐỀ TOÁN HỌC KHỞI NGUYÊN LỚP 2:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {g2.mathScope.map((topic, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '0.83rem',
                      color: '#e2e8f0',
                      lineHeight: 1.4,
                    }}
                  >
                    <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Stats & Enter Kingdom Button */}
          <div>
            {/* Progress Panel */}
            <div
              style={{
                background: 'rgba(6, 35, 25, 0.85)',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Cấp độ hiện tại:</span>
                <span style={{ color: '#34d399', fontWeight: 800 }}>Cấp {g2Level}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Vương quốc đã mở khóa:</span>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{g2UnlockedCount} / 7</span>
              </div>

              <ProgressBar
                value={g2Percent}
                max={100}
                label="Tiến trình hoàn thành:"
                sublabel={`${g2Percent}% (${g2RescuedCount}/7 Vương quốc giải cứu)`}
                variant="grade2"
                height={8}
                showValues={false}
              />
            </div>

            {/* Action: ENTER KINGDOM */}
            <SoundButton
              variant="grade2"
              size="lg"
              style={{ width: '100%' }}
              onClick={() => handleEnterKingdom('grade-2')}
              icon={<ChevronRight size={20} />}
              iconPosition="right"
              glow={true}
            >
              ENTER KINGDOM (VÀO VƯƠNG QUỐC)
            </SoundButton>
          </div>
        </Card>

        {/* ======================================================== */}
        {/* CAMPAIGN 02: THE LEGENDARY HERO – GRADE 3 (BLUE & GOLD) */}
        {/* ======================================================== */}
        <Card
          variant="default"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, rgba(8, 32, 65, 0.92) 0%, rgba(4, 18, 40, 0.96) 100%)',
            border: activeCampaignId === 'grade-3' ? '2px solid #facc15' : '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: activeCampaignId === 'grade-3' ? '0 0 32px rgba(56, 189, 248, 0.45), 0 0 16px rgba(250, 204, 21, 0.3)' : '0 12px 35px rgba(0, 0, 0, 0.65)',
            transition: 'transform 0.3s ease, border-color 0.3s ease',
          }}
        >
          {/* Card Ambient Header */}
          <div>
            {/* Top Badge and Region Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <Badge variant="gold" icon={<Castle size={15} />}>
                {g3.heroBadge}
              </Badge>
              <span style={{ fontSize: '0.8rem', color: '#fef08a', fontWeight: 700, letterSpacing: '0.04em' }}>
                BỐI CẢNH NÚI CAO & LÂU ĐÀI HUYỀN THOẠI
              </span>
            </div>

            {/* Hero Visual: Tony in Royal Blue & Gold Legendary Armor */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '18px',
                animation: 'floatBob 4s ease-in-out infinite',
              }}
            >
              <HeroPortrait
                campaignId="grade-3"
                size={210}
                showBadge={true}
                glow={true}
              />
            </div>

            {/* Campaign Title & Subtitle */}
            <h3
              className="font-cinematic"
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#38bdf8',
                textAlign: 'center',
                letterSpacing: '0.08em',
                marginBottom: '4px',
                textShadow: '0 0 16px rgba(56, 189, 248, 0.6), 0 0 8px rgba(250, 204, 21, 0.4)',
              }}
            >
              CAMPAIGN 02: {g3.title}
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#fef08a',
                textAlign: 'center',
                marginBottom: '16px',
                fontStyle: 'italic',
                fontWeight: 600,
              }}
            >
              "{g3.subtitle}"
            </p>

            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
              {g3.description}
            </p>

            {/* Math Scope Highlights */}
            <div
              style={{
                background: 'rgba(4, 18, 40, 0.8)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  fontSize: '0.8rem',
                  color: '#fef08a',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                <Sparkles size={16} />
                CHỦ ĐỀ TOÁN HỌC HUYỀN THOẠI LỚP 3:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {g3.mathScope.map((topic, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '0.83rem',
                      color: '#e2e8f0',
                      lineHeight: 1.4,
                    }}
                  >
                    <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Stats & Enter Kingdom Button */}
          <div>
            {/* Progress Panel */}
            <div
              style={{
                background: 'rgba(7, 30, 61, 0.85)',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Cấp độ hiện tại:</span>
                <span style={{ color: '#fef08a', fontWeight: 800 }}>Cấp {g3Level}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Vương quốc đã mở khóa:</span>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{g3UnlockedCount} / 7</span>
              </div>

              <ProgressBar
                value={g3Percent}
                max={100}
                label="Tiến trình hoàn thành:"
                sublabel={`${g3Percent}% (${g3RescuedCount}/7 Vương quốc giải cứu)`}
                variant="grade3"
                height={8}
                showValues={false}
              />
            </div>

            {/* Action: ENTER KINGDOM */}
            <SoundButton
              variant="grade3"
              size="lg"
              style={{ width: '100%' }}
              onClick={() => handleEnterKingdom('grade-3')}
              icon={<ChevronRight size={20} />}
              iconPosition="right"
              glow={true}
            >
              ENTER KINGDOM (VÀO VƯƠNG QUỐC)
            </SoundButton>
          </div>
        </Card>
      </div>

      {/* Footer Info */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#64748b',
          marginTop: '24px',
        }}
      >
        DỮ LIỆU ĐƯỢC LƯU TRỮ ĐỘC LẬP TỪNG CHIẾN DỊCH • KHÔNG BAO GIỜ GHI ĐÈ LẪN NHAU
      </div>
    </div>
  );
};

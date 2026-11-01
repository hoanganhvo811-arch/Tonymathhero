import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Shield,
  RotateCcw,
  Home,
  Settings as SettingsIcon,
  Coins,
  Gem,
  Award,
  Sparkles,
  Info,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { GameLogo } from '@/components/ui/GameLogo';
import { SettingModal } from '@/components/ui/SettingModal';
import { StoryCutsceneModal } from '../story/components/StoryCutsceneModal';
import { KnowledgeCrystalsModal } from '../story/components/KnowledgeCrystalsModal';
import { StoryJournalModal } from '../story/components/StoryJournalModal';
import { CampaignEndingModal } from '../story/components/CampaignEndingModal';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { useProgressStore } from '@/game/state/useProgressStore';
import { useKingdomProgressionStore } from '../kingdom-progression/useKingdomProgressionStore';
import { useStoryStore } from '../story/useStoryStore';
import { useAudio } from '@/hooks/useAudio';
import { ThreeWorldMap } from './components/ThreeWorldMap';
import { KingdomInfoPanel } from './components/KingdomInfoPanel';
import { LandmarkModal } from './components/LandmarkModal';
import { ProgressTimelineDock } from './components/ProgressTimelineDock';
import type { Kingdom, KingdomLandmark } from '@/types';

export const WorldMapScreen: React.FC = () => {
  const navigate = useNavigate();
  const { playHover, playSelect, playBgm, stopBgm } = useAudio();
  const { activeCampaignId, getActiveCampaign } = useCampaignStore();
  const { currentProgress, setCurrentKingdom, rescueKingdom, unlockKingdom } = useProgressStore();

  const campaign = getActiveCampaign();
  const isG2 = activeCampaignId === 'grade-2';

  // Play Atmospheric World Map BGM
  React.useEffect(() => {
    playBgm('main_menu');
    return () => {
      stopBgm();
    };
  }, [playBgm, stopBgm]);

  // Selected Kingdom for right panel and camera fly-to
  const [selectedKingdom, setSelectedKingdom] = useState<Kingdom | null>(null);
  // Selected landmark for 3D marker info popup
  const [selectedLandmark, setSelectedLandmark] = useState<KingdomLandmark | null>(null);
  // Reset camera trigger counter
  const [resetCameraCounter, setResetCameraCounter] = useState<number>(0);
  // Settings modal open state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  // Story Journal modal open state
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  // 7 Knowledge Crystals modal open state
  const [isCrystalsOpen, setIsCrystalsOpen] = useState<boolean>(false);
  // Info message modal
  const [infoModalMessage, setInfoModalMessage] = useState<string | null>(null);

  // Global hotkey 'J' for Journal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyJ') {
        setIsJournalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unlockedIds = currentProgress?.unlockedKingdomIds || [campaign.kingdoms[0].id];
  const rescuedIds = currentProgress?.rescuedKingdomIds || [];
  const currentKingdomId = currentProgress?.currentKingdomId || campaign.kingdoms[0].id;
  const heroLevel = currentProgress?.heroLevel || 1;
  const goldCoins = currentProgress?.goldCoins || 100;
  const currentExp = currentProgress?.currentExp || 0;
  const nextLevelExp = currentProgress?.nextLevelExp || 100;

  // Select kingdom from 3D zone or bottom dock
  const handleSelectKingdom = (kingdom: Kingdom) => {
    playSelect();
    setSelectedKingdom(kingdom);
  };

  // Select landmark from 3D zone
  const handleSelectLandmark = (landmark: KingdomLandmark) => {
    playSelect();
    setSelectedLandmark(landmark);
  };

  // Reset camera to default isometric overview
  const handleResetCamera = () => {
    playSelect();
    setSelectedKingdom(null);
    setResetCameraCounter((prev) => prev + 1);
  };

  // Enter kingdom action
  const handleEnterKingdom = async (kingdom: Kingdom) => {
    playSelect();
    await setCurrentKingdom(kingdom.id);
    setSelectedKingdom(null);
    navigate(`/explore/${kingdom.id}`);
  };

  // Simulate rescuing kingdom for live test of progressive unlocking
  const handleSimulateRescue = async (kingdom: Kingdom) => {
    playSelect();
    await rescueKingdom(kingdom.id, kingdom.gem.id);
    // Auto unlock next kingdom if available
    const nextIdx = kingdom.order;
    if (nextIdx < campaign.kingdoms.length) {
      const nextKingdom = campaign.kingdoms[nextIdx];
      await unlockKingdom(nextKingdom.id);
    }
    setInfoModalMessage(
      `✨ Thần kỳ! Bạn đã giải cứu thành công ${kingdom.vietnameseName} và thu thập [${kingdom.gem.name}]! Vương quốc tiếp theo đã được giải trừ phong ấn.`
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#071325',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 3D Interactive World Map (Continuous Continent with 7 Biomes) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <ThreeWorldMap
          kingdoms={campaign.kingdoms}
          unlockedKingdomIds={unlockedIds}
          rescuedKingdomIds={rescuedIds}
          currentKingdomId={currentKingdomId}
          selectedKingdom={selectedKingdom}
          heroLevel={heroLevel}
          campaignId={activeCampaignId}
          resetCameraTrigger={resetCameraCounter}
          onSelectKingdom={handleSelectKingdom}
          onSelectLandmark={handleSelectLandmark}
          onGroundClick={() => setSelectedKingdom(null)}
        />
      </div>

      {/* TOP-LEFT HUD: Game Logo, Active Campaign, Tony Level */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '16px',
            padding: '10px 16px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <GameLogo size="sm" />
          <div style={{ height: '32px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Badge variant={isG2 ? 'emerald' : 'gold'}>
                {isG2 ? 'CHIẾN DỊCH LỚP 2' : 'CHIẾN DỊCH LỚP 3'}
              </Badge>
              <Badge variant="locked">
                {rescuedIds.length}/7 VƯƠNG QUỐC
              </Badge>
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#94a3b8',
                marginTop: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Hiệp sĩ Tony:</span>
              <strong style={{ color: '#fbbf24' }}>Cấp {heroLevel}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* TOP-RIGHT HUD: EXP, Gold, Gems, Settings */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 20,
          display: selectedKingdom ? 'none' : 'flex', // Hide if info panel is open
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'auto',
        }}
      >
        {/* EXP Bar */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '14px',
            padding: '8px 14px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={16} color="#38bdf8" />
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '70px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
              <span>EXP</span>
              <span>{currentExp}/{nextLevelExp}</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.4)', borderRadius: '2px', overflow: 'hidden', marginTop: '2px' }}>
              <div style={{ width: `${Math.min(100, (currentExp / nextLevelExp) * 100)}%`, height: '100%', background: '#38bdf8' }} />
            </div>
          </div>
        </div>

        {/* Gold Coins */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '14px',
            padding: '8px 14px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#facc15',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          <Coins size={16} />
          <span>{goldCoins.toLocaleString()}</span>
        </div>

        {/* Knowledge Gems Collection Trigger */}
        <div
          onClick={() => {
            playSelect();
            setIsCrystalsOpen(true);
          }}
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '14px',
            padding: '8px 14px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#c084fc',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="Xem Bộ sưu tập Bảy Viên Ngọc Tri Thức"
        >
          <Gem size={16} />
          <span>{rescuedIds.length}/7 Ngọc</span>
        </div>

        {/* Story Journal Trigger */}
        <button
          onClick={() => {
            playSelect();
            setIsJournalOpen(true);
          }}
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '14px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fbbf24',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            fontWeight: 700,
            fontSize: '0.88rem',
            transition: 'all 0.2s',
          }}
          title="Mở Nhật Ký Hành Trình (Phím J)"
        >
          <BookOpen size={16} />
          <span>Nhật Ký (J)</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            playSelect();
            setIsSettingsOpen(true);
          }}
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '14px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          title="Cài đặt hệ thống"
        >
          <SettingsIcon size={18} />
        </button>
      </div>

      {/* BOTTOM-LEFT HUD: Home, Reset Camera, Switch Campaign, Profile */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <SoundButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/')}
            icon={<Home size={16} />}
          >
            Trang Chủ
          </SoundButton>

          <SoundButton
            variant="secondary"
            size="sm"
            onClick={handleResetCamera}
            icon={<RotateCcw size={16} />}
            title="Đặt lại camera về góc nhìn toàn cảnh thế giới"
          >
            Góc Nhìn Thế Giới
          </SoundButton>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <SoundButton
            variant="fantasy-gold"
            size="sm"
            onClick={() => navigate('/division-kingdom')}
          >
            ➗ Vương Quốc Phép Chia
          </SoundButton>

          <SoundButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/fractions-kingdom')}
          >
            🍕 Vương Quốc Phân Số
          </SoundButton>

          <SoundButton
            variant="fantasy-gold"
            size="sm"
            onClick={() => navigate('/time-kingdom')}
          >
            ⏳ Vương Quốc Thời Gian
          </SoundButton>

          <SoundButton
            variant="fantasy-gold"
            size="sm"
            onClick={() => navigate('/money-kingdom')}
          >
            💰 Vương Quốc Tiền Tệ
          </SoundButton>

          <SoundButton
            variant="fantasy-gold"
            size="sm"
            onClick={() => navigate('/advanced-arena')}
          >
            🏆 Đấu Trường Tổng Hợp
          </SoundButton>

          <SoundButton
            variant="fantasy-gold"
            size="sm"
            onClick={() => navigate('/logic-kingdom')}
          >
            🧠 Vương Quốc Trí Tuệ
          </SoundButton>

          <SoundButton
            variant="fantasy-gold"
            size="sm"
            onClick={() => navigate('/final-campaign')}
          >
            👑 Chiến Dịch Cuối Cùng
          </SoundButton>

          <SoundButton
            variant="fantasy-gold"
            size="sm"
            onClick={() => navigate('/learning-dashboard')}
            icon={<GraduationCap size={16} />}
          >
            Báo Cáo Học Tập
          </SoundButton>

          <SoundButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/campaigns')}
            icon={<Compass size={16} />}
          >
            Đổi Chiến Dịch
          </SoundButton>

          <SoundButton
            variant={isG2 ? 'grade2' : 'grade3'}
            size="sm"
            onClick={() => navigate('/profile')}
            icon={<Shield size={16} />}
          >
            Hồ Sơ Hiệp Sĩ
          </SoundButton>
        </div>
      </div>

      {/* BOTTOM CENTER: Progress Navigation Timeline Dock */}
      <ProgressTimelineDock
        kingdoms={campaign.kingdoms}
        unlockedKingdomIds={unlockedIds}
        rescuedKingdomIds={rescuedIds}
        selectedKingdomId={selectedKingdom?.id || null}
        currentKingdomId={currentKingdomId}
        onSelectKingdom={handleSelectKingdom}
      />

      {/* RIGHT SIDE: Interactive Kingdom Information Panel */}
      {selectedKingdom && (
        <KingdomInfoPanel
          kingdom={selectedKingdom}
          isUnlocked={unlockedIds.includes(selectedKingdom.id) || selectedKingdom.isUnlockedByDefault}
          isRescued={rescuedIds.includes(selectedKingdom.id)}
          isCurrent={currentKingdomId === selectedKingdom.id}
          onClose={() => setSelectedKingdom(null)}
          onEnter={handleEnterKingdom}
          onSimulateRescue={handleSimulateRescue}
          onChallengeBoss={(bossId) => {
            playSelect();
            navigate(`/battle?monster=${bossId}`);
          }}
        />
      )}

      {/* 3D LANDMARK DETAIL MODAL */}
      <LandmarkModal
        landmark={selectedLandmark}
        onClose={() => setSelectedLandmark(null)}
      />

      {/* SETTINGS MODAL */}
      <SettingModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* STORY CUTSCENE MODAL */}
      <StoryCutsceneModal />

      {/* KNOWLEDGE CRYSTALS MODAL */}
      <KnowledgeCrystalsModal
        isOpen={isCrystalsOpen}
        onClose={() => setIsCrystalsOpen(false)}
      />

      {/* STORY JOURNAL MODAL */}
      <StoryJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />

      {/* CAMPAIGN ENDING SUMMARY MODAL */}
      <CampaignEndingModal />

      {/* INFO MESSAGE MODAL */}
      <Modal
        isOpen={!!infoModalMessage}
        onClose={() => setInfoModalMessage(null)}
        title="THÔNG BÁO VƯƠNG QUỐC"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            {infoModalMessage}
          </p>
          <SoundButton variant="primary" style={{ width: '100%' }} onClick={() => setInfoModalMessage(null)}>
            XÁC NHẬN
          </SoundButton>
        </div>
      </Modal>
    </div>
  );
};

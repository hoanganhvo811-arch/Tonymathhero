import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Compass, User, Settings, Sparkles, PlusCircle, ShieldAlert, Download, WifiOff } from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { HeroPortrait } from '@/components/common/HeroPortrait';
import { SettingModal } from '@/components/ui/SettingModal';
import { ReleaseShowcaseModal } from '@/components/ui/ReleaseShowcaseModal';
import { GameLogo } from '@/components/ui/GameLogo';
import { ThreeBackground } from '@/game/engine/ThreeBackground';
import { FantasyKingdomScenery } from '@/components/common/FantasyKingdomScenery';
import { Modal } from '@/components/common/Modal';
import { StoryCutsceneModal } from '../story/components/StoryCutsceneModal';
import { useStoryStore } from '../story/useStoryStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { useProgressStore } from '@/game/state/useProgressStore';
import { usePlayerStore } from '@/game/state/usePlayerStore';
import { useAudio } from '@/hooks/useAudio';
import { usePwaStore } from '@/services/pwa/usePwaStore';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { playBgm, stopBgm } = useAudio();
  const { player } = usePlayerStore();
  const { activeCampaignId, selectCampaign } = useCampaignStore();
  const { currentProgress, grade2Progress, grade3Progress, loadProgressForCampaign } = useProgressStore();
  const { isInstalled, setInstallModalOpen, setOfflineModalOpen } = usePwaStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [showNewAdventureModal, setShowNewAdventureModal] = useState(false);

  // Background Music for Main Menu
  React.useEffect(() => {
    playBgm('main_menu');
    return () => {
      stopBgm();
    };
  }, [playBgm, stopBgm]);

  // Check if saved progress exists
  const hasSavedG2 = Boolean(grade2Progress && (grade2Progress.rescuedKingdomIds.length > 0 || grade2Progress.completedQuestIds.length > 0 || grade2Progress.heroLevel > 1));
  const hasSavedG3 = Boolean(grade3Progress && (grade3Progress.rescuedKingdomIds.length > 0 || grade3Progress.completedQuestIds.length > 0 || grade3Progress.heroLevel > 1));
  const hasSavedProgress = hasSavedG2 || hasSavedG3 || Boolean(currentProgress);

  // Button 1: NEW ADVENTURE
  const handleNewAdventureClick = () => {
    if (hasSavedProgress) {
      setShowNewAdventureModal(true);
    } else {
      navigate('/campaigns');
    }
  };

  const handleConfirmStartFresh = async (campaignId: 'grade-2' | 'grade-3') => {
    if (!player) return;
    setShowNewAdventureModal(false);
    await selectCampaign(campaignId, player.id);
    await loadProgressForCampaign(player.id, campaignId);
    navigate('/map');
  };

  // Button 2: CONTINUE ADVENTURE
  const handleContinueAdventure = async () => {
    if (!hasSavedProgress || !player) return;
    await loadProgressForCampaign(player.id, activeCampaignId);
    navigate('/map');
  };

  // Button 3: SELECT CAMPAIGN
  const handleSelectCampaign = () => {
    navigate('/campaigns');
  };

  // Button 4: PLAYER PROFILE
  const handlePlayerProfile = () => {
    navigate('/profile');
  };

  // Button 5: SETTINGS
  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  return (
    <div
      className="home-screen-container"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '28px 24px',
        overflow: 'hidden',
        background: '#070b14',
      }}
    >
      {/* 1. Layered Fantasy Scenery (Castle, Mountains, River, Sunset Sky) */}
      <FantasyKingdomScenery timeOfDay="sunset" />

      {/* 2. 3D Floating Knowledge Gem & Orbiting Particles */}
      <ThreeBackground theme={activeCampaignId} interactive={true} />

      {/* 3. Top Section: Grand Fantasy RPG Game Logo */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.8s ease-out',
        }}
      >
        <GameLogo size="hero" showSubtitle={true} showTagline={true} variant="gold" />
      </div>

      {/* 4. Center Section: Tony Standing in Foreground Hero Stance */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '10px 0',
        }}
      >
        <div style={{ animation: 'floatBob 4s ease-in-out infinite' }}>
          <HeroPortrait
            campaignId={activeCampaignId}
            size={260}
            showBadge={true}
            glow={true}
            interactive={true}
          />
        </div>
      </div>

      {/* 5. Bottom Section: 5 Fantasy Metallic Gold Action Buttons */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          maxWidth: '1080px',
        }}
      >
        {/* Main 5 Navigation Buttons Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px',
            width: '100%',
          }}
        >
          {/* Button 1: NEW ADVENTURE */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={handleNewAdventureClick}
            icon={<PlusCircle size={20} />}
          >
            NEW ADVENTURE
          </SoundButton>

          {/* Button 2: CONTINUE ADVENTURE */}
          <SoundButton
            variant={hasSavedProgress ? 'fantasy-gold' : 'secondary'}
            size="lg"
            onClick={handleContinueAdventure}
            disabled={!hasSavedProgress}
            icon={<Play size={20} fill="currentColor" />}
            title={hasSavedProgress ? 'Tiếp tục hành trình gần nhất' : 'Chưa có tiến trình đã lưu'}
          >
            {hasSavedProgress ? 'CONTINUE ADVENTURE' : 'CONTINUE (CHƯA CÓ LƯU)'}
          </SoundButton>

          {/* Button 3: SELECT CAMPAIGN */}
          <SoundButton
            variant="secondary"
            size="lg"
            onClick={handleSelectCampaign}
            icon={<Compass size={20} />}
          >
            SELECT CAMPAIGN
          </SoundButton>

          {/* Button: DIVISION KINGDOM */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => navigate('/division-kingdom')}
          >
            ➗ DIVISION KINGDOM
          </SoundButton>

          {/* Button: WORD PROBLEM ADVENTURE */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => navigate('/word-problem-adventure')}
          >
            📖 WORD PROBLEM ADVENTURE
          </SoundButton>

          {/* Button: GEOMETRY & MEASUREMENT KINGDOM */}
          <SoundButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/geometry-measurement')}
          >
            📐 GEOMETRY & MEASUREMENT KINGDOM
          </SoundButton>

          {/* Button: NUMBER SENSE & MENTAL MATH KINGDOM */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => navigate('/number-kingdom')}
          >
            🔢 NUMBER KINGDOM
          </SoundButton>

          {/* Button: FRACTIONS KINGDOM */}
          <SoundButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/fractions-kingdom')}
          >
            🍕 FRACTIONS KINGDOM
          </SoundButton>

          {/* Button: TIME & CALENDAR KINGDOM */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => navigate('/time-kingdom')}
          >
            ⏳ TIME &amp; CALENDAR KINGDOM
          </SoundButton>

          {/* Button: MONEY & SHOPPING KINGDOM */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => navigate('/money-kingdom')}
          >
            💰 MONEY &amp; SHOPPING KINGDOM
          </SoundButton>

          {/* Button: ADVANCED MATH ARENA */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => navigate('/advanced-arena')}
          >
            🏆 ADVANCED MATH ARENA
          </SoundButton>

          {/* Button: KINGDOM OF LOGIC */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => navigate('/logic-kingdom')}
          >
            🧠 KINGDOM OF LOGIC
          </SoundButton>

          {/* Button: THE FINAL CAMPAIGN - LORD ZERO */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => navigate('/final-campaign')}
          >
            👑 THE FINAL CAMPAIGN – LORD ZERO
          </SoundButton>

          {/* Button 4: PLAYER PROFILE */}
          <SoundButton
            variant="secondary"
            size="lg"
            onClick={handlePlayerProfile}
            icon={<User size={20} />}
          >
            PLAYER PROFILE
          </SoundButton>

          {/* Button: SETTINGS */}
          <SoundButton
            variant="secondary"
            size="lg"
            onClick={handleOpenSettings}
            icon={<Settings size={20} />}
          >
            SETTINGS
          </SoundButton>

          {/* Button: RELEASE SHOWCASE / GIỚI THIỆU SẢN PHẨM */}
          <SoundButton
            variant="fantasy-gold"
            size="lg"
            onClick={() => setIsShowcaseOpen(true)}
            icon={<Sparkles size={20} />}
          >
            🌟 GIỚI THIỆU SẢN PHẨM
          </SoundButton>

          {/* Button: PWA INSTALL */}
          {!isInstalled && (
            <SoundButton
              variant="fantasy-gold"
              size="lg"
              onClick={() => setInstallModalOpen(true)}
              icon={<Download size={20} />}
            >
              📲 CÀI ĐẶT ỨNG DỤNG (PWA)
            </SoundButton>
          )}

          {/* Button: PREPARE OFFLINE MODE */}
          <SoundButton
            variant="secondary"
            size="lg"
            onClick={() => setOfflineModalOpen(true)}
            icon={<WifiOff size={20} />}
          >
            ⚡ CHẾ ĐỘ NGOẠI TUYẾN
          </SoundButton>
        </div>

        {/* Status ticker & credits */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: '0.78rem',
            color: '#94a3b8',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#facc15" />
            <span>Chiến dịch đang chọn: <strong style={{ color: '#ffffff' }}>{activeCampaignId === 'grade-2' ? 'Lớp 2 (The Little Hero)' : 'Lớp 3 (The Legendary Hero)'}</strong></span>
          </div>
          <span>TONY MATH HERO • PREMIUM 3D FANTASY REALISTIC RPG</span>
        </div>
      </div>

      {/* Modal: New Adventure Confirmation without overwriting existing data */}
      {showNewAdventureModal && (
        <Modal
          isOpen={showNewAdventureModal}
          onClose={() => setShowNewAdventureModal(false)}
          title="BẮT ĐẦU HÀNH TRÌNH MỚI (NEW ADVENTURE)"
          subtitle="Chọn chiến dịch bạn muốn phiêu lưu"
          maxWidth="560px"
          variant="gold"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              Hệ thống sẽ chuyển bạn đến màn hình chiến dịch. Dữ liệu đã lưu trước đây của bạn sẽ được bảo tồn an toàn và không bị tự ý xóa bỏ.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <SoundButton
                variant="grade2"
                size="md"
                onClick={() => handleConfirmStartFresh('grade-2')}
              >
                HÀNH TRÌNH LỚP 2
              </SoundButton>

              <SoundButton
                variant="grade3"
                size="md"
                onClick={() => handleConfirmStartFresh('grade-3')}
              >
                HÀNH TRÌNH LỚP 3
              </SoundButton>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SoundButton variant="ghost" size="sm" onClick={() => setShowNewAdventureModal(false)}>
                Hủy bỏ
              </SoundButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Settings Modal */}
      <SettingModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Release Showcase / About Product Modal */}
      <ReleaseShowcaseModal
        isOpen={isShowcaseOpen}
        onClose={() => setIsShowcaseOpen(false)}
        onStartPlaying={() => navigate('/campaigns')}
      />

      {/* Cinematic Story Cutscene Modal */}
      <StoryCutsceneModal />
    </div>
  );
};

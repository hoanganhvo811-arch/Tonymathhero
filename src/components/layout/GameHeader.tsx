import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Gem,
  Coins,
  Settings,
  User,
  Map,
  Compass,
  Volume2,
  VolumeX,
  GraduationCap,
  Download,
  WifiOff,
} from 'lucide-react';
import { SoundButton } from '../common/SoundButton';
import { Badge } from '../common/Badge';
import { HeroPortrait } from '../common/HeroPortrait';
import { SettingModal } from '../ui/SettingModal';
import { ReleaseShowcaseModal } from '../ui/ReleaseShowcaseModal';
import { usePlayerStore } from '@/game/state/usePlayerStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { useProgressStore } from '@/game/state/useProgressStore';
import { useSettingsStore } from '@/game/state/useSettingsStore';
import { usePwaStore } from '@/services/pwa/usePwaStore';

export const GameHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { player } = usePlayerStore();
  const { activeCampaignId } = useCampaignStore();
  const { currentProgress } = useProgressStore();
  const { settings, toggleMute } = useSettingsStore();
  const { isInstalled, setInstallModalOpen, setOfflineModalOpen } = usePwaStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);

  const isG2 = activeCampaignId === 'grade-2';
  const isImmersiveScreen =
    location.pathname === '/' ||
    location.pathname === '/map' ||
    location.pathname.startsWith('/explore');

  if (isImmersiveScreen) {
    return null; // The intro screen, 3D world map, and 3D exploration screen have their own immersive cinematic HUDs
  }

  const expValue = currentProgress?.currentExp || 0;
  const expMax = currentProgress?.nextLevelExp || 100;
  const expPercent = Math.min(100, Math.round((expValue / expMax) * 100));

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '70px',
          background: 'rgba(10, 15, 29, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isG2 ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          paddingLeft: 'max(16px, env(safe-area-inset-left))',
          paddingRight: 'max(16px, env(safe-area-inset-right))',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Left: Brand Logo & Campaign Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <HeroPortrait
              campaignId={activeCampaignId}
              mode="avatar"
              size={42}
              glow={true}
              showBadge={false}
            />
            <div>
              <h1
                className="font-cinematic"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  letterSpacing: '0.06em',
                }}
              >
                TONY MATH HERO
              </h1>
              <p
                style={{
                  fontSize: '0.7rem',
                  color: isG2 ? '#7dd3fc' : '#fca5a5',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                SEVEN KINGDOMS
              </p>
            </div>
          </div>

          <Badge variant={isG2 ? 'emerald' : 'gold'} size="sm">
            {isG2 ? 'LỚP 2 • THE LITTLE HERO' : 'LỚP 3 • THE LEGENDARY HERO'}
          </Badge>
        </div>

        {/* Center: Hero Level & EXP Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '6px 18px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Level Circle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>LV</span>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: isG2 ? '#38bdf8' : '#ef4444',
                textShadow: isG2 ? '0 0 8px rgba(56, 189, 248, 0.5)' : '0 0 8px rgba(239, 68, 68, 0.5)',
              }}
            >
              {currentProgress?.heroLevel || 1}
            </span>
          </div>

          {/* Exp Bar */}
          <div style={{ width: '130px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: '#94a3b8',
                marginBottom: '2px',
              }}
            >
              <span>EXP</span>
              <span>{expPercent}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '3px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  width: `${expPercent}%`,
                  height: '100%',
                  background: isG2
                    ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
                    : 'linear-gradient(90deg, #b91c1c 0%, #ef4444 100%)',
                  boxShadow: isG2 ? '0 0 8px #38bdf8' : '0 0 8px #ef4444',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Knowledge Gems count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              paddingLeft: '14px',
            }}
          >
            <Gem size={16} color={isG2 ? '#38bdf8' : '#ef4444'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              {currentProgress?.collectedGemIds.length || 0}/7
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Ngọc</span>
          </div>

          {/* Gold Coins count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              paddingLeft: '14px',
            }}
          >
            <Coins size={16} color="#facc15" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fef08a' }}>
              {currentProgress?.goldCoins || 0}
            </span>
          </div>
        </div>

        {/* Right: Navigation Actions & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SoundButton
            variant={location.pathname === '/division-kingdom' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/division-kingdom')}
          >
            ➗ Phép Chia
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/word-problem-adventure' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/word-problem-adventure')}
          >
            📖 Toán Lời Văn
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/geometry-measurement' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/geometry-measurement')}
          >
            📐 Hình Học & Đo Lường
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/number-kingdom' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/number-kingdom')}
          >
            🔢 Tư Duy Số & Nhẩm
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/fractions-kingdom' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/fractions-kingdom')}
          >
            🍕 Phân Số
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/time-kingdom' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/time-kingdom')}
          >
            ⏳ Thời Gian & Lịch
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/money-kingdom' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/money-kingdom')}
          >
            💰 Tiền Tệ & Mua Sắm
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/advanced-arena' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/advanced-arena')}
          >
            🏆 Đấu Trường Tổng Hợp
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/logic-kingdom' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/logic-kingdom')}
          >
            🧠 Trí Tuệ & Logic
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/final-campaign' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/final-campaign')}
          >
            👑 Chiến Dịch Cuối Cùng
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/learning-dashboard' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/learning-dashboard')}
            icon={<GraduationCap size={16} />}
          >
            Báo Cáo Học Tập
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/map' ? (isG2 ? 'grade2' : 'grade3') : 'secondary'}
            size="sm"
            onClick={() => navigate('/map')}
            icon={<Map size={16} />}
          >
            Bản Đồ
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/campaigns' ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => navigate('/campaigns')}
            icon={<Compass size={16} />}
          >
            Đổi Chiến Dịch
          </SoundButton>

          <SoundButton
            variant={location.pathname === '/profile' ? (isG2 ? 'grade2' : 'grade3') : 'secondary'}
            size="sm"
            onClick={() => navigate('/profile')}
            icon={<User size={16} />}
          >
            {player?.name || 'Hồ Sơ'}
          </SoundButton>

          {/* PWA Install Shortcut (If not already running in standalone) */}
          {!isInstalled && (
            <SoundButton
              variant="gold"
              size="sm"
              onClick={() => setInstallModalOpen(true)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Cài đặt Tony Math Hero lên thiết bị (PWA)"
            >
              <Download size={14} />
              <span className="hidden sm:inline">CÀI APP</span>
            </SoundButton>
          )}

          {/* Offline Readiness Check */}
          <SoundButton
            variant="ghost"
            size="sm"
            onClick={() => setOfflineModalOpen(true)}
            style={{ padding: '8px', borderRadius: '8px' }}
            title="Kiểm tra & Chuẩn bị chơi Ngoại tuyến (Offline Mode)"
          >
            <WifiOff size={18} color="#38bdf8" />
          </SoundButton>

          {/* About / Release Showcase Button */}
          <SoundButton
            variant="ghost"
            size="sm"
            onClick={() => setIsShowcaseOpen(true)}
            style={{ padding: '8px', borderRadius: '8px' }}
            aria-label="Giới thiệu sản phẩm"
            title="Giới thiệu sản phẩm (About Tony Math Hero)"
          >
            <Sparkles size={18} color="#facc15" />
          </SoundButton>

          {/* Mute Quick Toggle */}
          <SoundButton
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            style={{ padding: '8px', borderRadius: '8px' }}
            aria-label="Bật/Tắt âm"
          >
            {settings.isMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#94a3b8" />}
          </SoundButton>

          {/* Settings Modal Button */}
          <SoundButton
            variant="ghost"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            style={{ padding: '8px', borderRadius: '8px' }}
            aria-label="Cài đặt"
          >
            <Settings size={18} color="#94a3b8" />
          </SoundButton>
        </div>
      </header>

      <SettingModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ReleaseShowcaseModal isOpen={isShowcaseOpen} onClose={() => setIsShowcaseOpen(false)} />
    </>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Monitor,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Globe,
  Music,
  Headphones,
  Smartphone,
  Download,
  WifiOff,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { SoundButton } from '../common/SoundButton';
import { useSettingsStore } from '@/game/state/useSettingsStore';
import { useProgressStore } from '@/game/state/useProgressStore';
import { usePlayerStore } from '@/game/state/usePlayerStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { usePwaStore } from '@/services/pwa/usePwaStore';
import { persistenceService } from '@/services/persistence/persistenceService';
import type { GraphicsQuality } from '@/types';

interface SettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingModal: React.FC<SettingModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    setVolume,
    toggleMute,
    toggleBgm,
    toggleSfx,
    setLanguage,
    setGraphicsQuality,
    toggleParticles,
    toggleReducedMotion,
  } = useSettingsStore();

  const { player, initPlayer } = usePlayerStore();
  const { activeCampaignId } = useCampaignStore();
  const { resetCampaignProgress, loadAllCampaignsProgress } = useProgressStore();
  const { isInstalled, isOnline, deviceInfo, setInstallModalOpen, setOfflineModalOpen } = usePwaStore();

  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [confirmReset, setConfirmReset] = useState<'campaign' | 'all' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };

  const handleResetCampaign = async () => {
    if (!player) return;
    await resetCampaignProgress(player.id, activeCampaignId);
    setConfirmReset(null);
    setSuccessMessage(`Đã thiết lập lại tiến trình ${activeCampaignId === 'grade-2' ? 'Lớp 2' : 'Lớp 3'} thành công!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleResetAllData = async () => {
    await persistenceService.clearAllData();
    await initPlayer();
    if (player) {
      await loadAllCampaignsProgress(player.id);
    }
    setConfirmReset(null);
    setSuccessMessage('Đã xóa toàn bộ dữ liệu lưu trữ. Dữ liệu mới đã được khởi tạo!');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CÀI ĐẶT TRÒ CHƠI (GAME SETTINGS)"
      subtitle="Tùy chỉnh âm thanh, đồ họa, chế độ toàn màn hình và ngôn ngữ"
      maxWidth="640px"
      variant="gold"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Success Alert Banner */}
        {successMessage && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#86efac',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <ShieldCheck size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Section 1: Audio Settings (BGM, SFX, Volumes) */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '8px',
            }}
          >
            <h4
              className="font-cinematic"
              style={{
                fontSize: '0.98rem',
                color: '#fde047',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
              }}
            >
              <Volume2 size={18} />
              ÂM THANH & HIỆU ỨNG (AUDIO SETTINGS)
            </h4>
            <SoundButton
              variant={settings.isMuted ? 'danger' : 'secondary'}
              size="sm"
              onClick={toggleMute}
              icon={settings.isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            >
              {settings.isMuted ? 'TẮT TIẾNG (MUTE ON)' : 'ÂM THANH ĐANG BẬT'}
            </SoundButton>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Background Music (BGM) Toggle & Volume */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Music size={16} color="#f59e0b" />
                  <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>Nhạc nền RPG (Background Music)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: 700 }}>{settings.bgmVolume}%</span>
                  <SoundButton
                    variant={settings.bgmEnabled !== false ? 'fantasy-gold' : 'secondary'}
                    size="sm"
                    onClick={toggleBgm}
                  >
                    {settings.bgmEnabled !== false ? 'BẬT' : 'TẮT'}
                  </SoundButton>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.bgmVolume}
                onChange={(e) => setVolume('bgm', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>

            {/* Sound Effects (SFX) Toggle & Volume */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Headphones size={16} color="#22c55e" />
                  <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>Hiệu ứng âm thanh (Sound Effects)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#22c55e', fontWeight: 700 }}>{settings.sfxVolume}%</span>
                  <SoundButton
                    variant={settings.sfxEnabled !== false ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={toggleSfx}
                  >
                    {settings.sfxEnabled !== false ? 'BẬT' : 'TẮT'}
                  </SoundButton>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume}
                onChange={(e) => setVolume('sfx', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#22c55e', cursor: 'pointer' }}
              />
            </div>

            {/* Master Volume */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>Âm lượng tổng thể (Master Volume)</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{settings.masterVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.masterVolume}
                onChange={(e) => setVolume('master', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Display & Fullscreen */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '8px',
            }}
          >
            <h4
              className="font-cinematic"
              style={{
                fontSize: '0.98rem',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
              }}
            >
              <Monitor size={18} />
              HIỂN THỊ & TOÀN MÀN HÌNH (DISPLAY)
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Fullscreen Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(15, 23, 42, 0.65)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600, display: 'block' }}>
                  Chế độ toàn màn hình (Fullscreen)
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Tối ưu trải nghiệm không viền trên máy tính và tablet
                </span>
              </div>
              <SoundButton
                variant={isFullscreen ? 'fantasy-gold' : 'secondary'}
                size="sm"
                onClick={handleToggleFullscreen}
                icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              >
                {isFullscreen ? 'THU NHỎ' : 'TOÀN MÀN HÌNH'}
              </SoundButton>
            </div>

            {/* Graphics Quality */}
            <div>
              <label style={{ fontSize: '0.84rem', color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>
                Chất lượng đồ họa 3D (Graphics Quality):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(['cinematic', 'high', 'medium', 'low'] as GraphicsQuality[]).map((q) => (
                  <SoundButton
                    key={q}
                    variant={settings.graphicsQuality === q ? 'fantasy-gold' : 'secondary'}
                    size="sm"
                    onClick={() => setGraphicsQuality(q)}
                  >
                    {q === 'cinematic' ? 'Điện Ảnh' : q === 'high' ? 'Cao' : q === 'medium' ? 'Tiêu Chuẩn' : 'Tiết Kiệm'}
                  </SoundButton>
                ))}
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.88rem', color: '#f8fafc', display: 'block' }}>Chế độ giảm chuyển động (Reduced Motion)</span>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Hạn chế rung lắc camera và bảo vệ mắt cho trẻ</span>
              </div>
              <SoundButton
                variant={settings.reducedMotion ? 'primary' : 'secondary'}
                size="sm"
                onClick={toggleReducedMotion}
              >
                {settings.reducedMotion ? 'ĐANG BẬT' : 'TẮT'}
              </SoundButton>
            </div>

            {/* Particles Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.88rem', color: '#f8fafc', display: 'block' }}>Hạt ánh sáng & sương mù ma thuật (Particles)</span>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Hiệu ứng bụi sao lấp lánh trong không gian</span>
              </div>
              <SoundButton
                variant={settings.particlesEnabled ? 'primary' : 'secondary'}
                size="sm"
                onClick={toggleParticles}
                icon={<Sparkles size={15} />}
              >
                {settings.particlesEnabled ? 'BẬT' : 'TẮT'}
              </SoundButton>
            </div>
          </div>
        </div>

        {/* Section 3: Language Selector */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '8px',
            }}
          >
            <h4
              className="font-cinematic"
              style={{
                fontSize: '0.98rem',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
              }}
            >
              <Globe size={18} />
              NGÔN NGỮ (LANGUAGE)
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <SoundButton
              variant={settings.language === 'vi' ? 'fantasy-gold' : 'secondary'}
              size="sm"
              onClick={() => setLanguage('vi')}
              style={{ flex: 1 }}
            >
              🇻🇳 TIẾNG VIỆT (VIETNAMESE)
            </SoundButton>

            <SoundButton
              variant={settings.language === 'en' ? 'fantasy-gold' : 'secondary'}
              size="sm"
              onClick={() => setLanguage('en')}
              style={{ flex: 1 }}
            >
              🇬🇧 ENGLISH (GLOBAL)
            </SoundButton>
          </div>
        </div>

        {/* Section 4: Data Management */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '8px',
            }}
          >
            <h4
              className="font-cinematic"
              style={{
                fontSize: '0.98rem',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
              }}
            >
              <RotateCcw size={18} />
              DỮ LIỆU & LƯU TRỮ (DATA PERSISTENCE)
            </h4>
          </div>

          {/* Backup & Restore Tools (Phase 22 Polish) */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              marginBottom: '14px',
            }}
          >
            <span style={{ fontSize: '0.86rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Sao Lưu & Phục Hồi Dữ Liệu An Toàn:
            </span>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 10px 0' }}>
              Xuất toàn bộ tiến trình học tập, vàng, cấp độ và thành tựu của Tony ra file .JSON để lưu trữ hoặc chuyển sang máy tính khác.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <SoundButton
                variant="fantasy-gold"
                size="sm"
                onClick={() => {
                  persistenceService.triggerDownloadBackupFile();
                  setSuccessMessage('Đã tải xuống file sao lưu tiến trình thành công!');
                  setTimeout(() => setSuccessMessage(null), 3500);
                }}
              >
                💾 TẢI FILE SAO LƯU (.JSON)
              </SoundButton>

              <label style={{ display: 'inline-block' }}>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                      const content = event.target?.result as string;
                      if (!content) return;
                      const res = persistenceService.importBackupData(content);
                      if (res.success) {
                        await initPlayer();
                        if (player) await loadAllCampaignsProgress(player.id);
                        setSuccessMessage(res.message);
                        setTimeout(() => window.location.reload(), 1500);
                      } else {
                        alert(res.message);
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#f8fafc',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  📥 NHẬP FILE KHÔI PHỤC (.JSON)
                </span>
              </label>
            </div>
          </div>

          {/* Cross-Platform PWA & Offline Readiness (Phase 23) */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(30, 41, 59, 0.45)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={18} color="#38bdf8" />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f8fafc' }}>
                  Ứng Dụng Đa Nền Tảng (PWA) &amp; Ngoại Tuyến
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: isOnline ? '#34d399' : '#fbbf24',
                  border: isOnline ? '1px solid #059669' : '1px solid #d97706',
                }}
              >
                {isOnline ? '🟢 ONLINE' : '🟡 OFFLINE'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.5 }}>
              Tony Math Hero có thể cài đặt trực tiếp lên iPhone, iPad, Android hoặc Windows/macOS. Dữ liệu được lưu trữ
              cục bộ và sẵn sàng hoạt động 100% khi không có mạng.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {!isInstalled && (
                <SoundButton
                  variant="gold"
                  size="sm"
                  onClick={() => setInstallModalOpen(true)}
                  icon={<Download size={15} />}
                >
                  Cài đặt App lên thiết bị
                </SoundButton>
              )}
              <SoundButton
                variant="secondary"
                size="sm"
                onClick={() => setOfflineModalOpen(true)}
                icon={<WifiOff size={15} />}
              >
                Kiểm tra tài nguyên Ngoại tuyến
              </SoundButton>
            </div>
          </div>

          {confirmReset === null ? (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <SoundButton
                variant="secondary"
                size="sm"
                onClick={() => setConfirmReset('campaign')}
              >
                Đặt lại tiến trình {activeCampaignId === 'grade-2' ? 'Lớp 2' : 'Lớp 3'}
              </SoundButton>

              <SoundButton
                variant="danger"
                size="sm"
                onClick={() => setConfirmReset('all')}
              >
                Xóa sạch mọi dữ liệu
              </SoundButton>
            </div>
          ) : (
            <div
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.14)',
                border: '1.5px solid rgba(239, 68, 68, 0.45)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', marginBottom: '8px' }}>
                <AlertTriangle size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {confirmReset === 'campaign'
                    ? `Bạn có chắc muốn đặt lại toàn bộ tiến trình ${activeCampaignId === 'grade-2' ? 'Lớp 2' : 'Lớp 3'}?`
                    : 'Bạn có chắc muốn xóa sạch toàn bộ hồ sơ và cả hai chiến dịch?'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '12px' }}>
                Hành động này không thể hoàn tác sau khi xác nhận.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <SoundButton
                  variant="danger"
                  size="sm"
                  onClick={confirmReset === 'campaign' ? handleResetCampaign : handleResetAllData}
                >
                  Xác nhận đặt lại
                </SoundButton>
                <SoundButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmReset(null)}
                >
                  Hủy
                </SoundButton>
              </div>
            </div>
          )}
        </div>

        {/* System Info */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.76rem',
            color: '#64748b',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '10px',
          }}
        >
          TONY MATH HERO • THE LEGEND OF SEVEN KINGDOMS • V2.0 PREMIUM RPG UI
        </div>
      </div>
    </Modal>
  );
};

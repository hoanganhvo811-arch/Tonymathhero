import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Award,
  Crown,
  Sparkles,
  Edit3,
  Check,
  Compass,
  Map,
  Gem,
  Coins,
  CheckCircle,
  Sword,
  Shirt,
  Heart,
  Zap,
  Swords,
  Layers,
  Lock,
  GraduationCap,
} from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { HeroPortrait } from '@/components/common/HeroPortrait';
import { GameLogo } from '@/components/ui/GameLogo';
import { usePlayerStore } from '@/game/state/usePlayerStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { useProgressStore } from '@/game/state/useProgressStore';
import { useInventoryStore } from '@/game/state/useInventoryStore';
import { InventoryModal } from '@/features/inventory/components/InventoryModal';
import { EquipmentModal } from '@/features/inventory/components/EquipmentModal';
import { SkillTreeModal } from '@/features/skills/components/SkillTreeModal';
import { KnowledgeCrystalsModal } from '@/features/story/components/KnowledgeCrystalsModal';
import { StoryJournalModal } from '@/features/story/components/StoryJournalModal';
import type { CampaignId, InventoryItem } from '@/types';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { player, updatePlayerName } = usePlayerStore();
  const { activeCampaignId, selectCampaign } = useCampaignStore();
  const { grade2Progress, grade3Progress, loadAllCampaignsProgress, loadProgressForCampaign } = useProgressStore();
  const { items, equipItem } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<CampaignId>(activeCampaignId);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(player?.name || 'Tony');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isCrystalsOpen, setIsCrystalsOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  useEffect(() => {
    if (player) {
      loadAllCampaignsProgress(player.id);
      setEditedName(player.name);
    }
  }, [player, loadAllCampaignsProgress]);

  const handleSaveName = async () => {
    if (!editedName.trim()) return;
    await updatePlayerName(editedName);
    setIsEditingName(false);
    setSaveFeedback('Đã cập nhật tên hiệp sĩ thành công!');
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const handleSwitchCampaignToActive = async (targetCampaignId: CampaignId) => {
    if (!player) return;
    await selectCampaign(targetCampaignId, player.id);
    await loadProgressForCampaign(player.id, targetCampaignId);
    navigate('/map');
  };

  const isViewingG2 = activeTab === 'grade-2';
  const displayedProgress = isViewingG2 ? grade2Progress : grade3Progress;

  // Level & EXP
  const heroLevel = displayedProgress?.heroLevel || 1;
  const expValue = displayedProgress?.currentExp || 0;
  const expMax = displayedProgress?.nextLevelExp || 100;

  // Equipment slots
  const equippedWeapon = items.find((i) => i.type === 'weapon' && i.isEquipped);
  const equippedShield = items.find((i) => i.type === 'shield' && i.isEquipped);
  const equippedArmor = items.find((i) => i.type === 'armor' && i.isEquipped);
  const equippedAccessory = items.find((i) => i.type === 'artifact' && i.isEquipped);

  // HP and MP calculation based on campaign and gear
  const baseHp = isViewingG2 ? 150 : 240;
  const gearHpBonus =
    (equippedShield?.stats.hpBonus || 0) +
    (equippedArmor?.stats.hpBonus || 0) +
    (heroLevel - 1) * 20;
  const maxHp = baseHp + gearHpBonus;
  const currentHp = maxHp; // Full health in profile view

  const baseMp = isViewingG2 ? 100 : 160;
  const maxMp = baseMp + (heroLevel - 1) * 15;
  const currentMp = maxMp;

  const monstersDefeated = player?.stats.battlesWon || (isViewingG2 ? 3 : 5);
  const questsCompleted = displayedProgress?.completedQuestIds.length || 0;
  const goldCoins = displayedProgress?.goldCoins || 100;

  return (
    <div
      className="profile-screen-container"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        overflow: 'hidden',
        background: isViewingG2
          ? 'radial-gradient(ellipse at 50% 20%, #062b20 0%, #041a13 50%, #020d09 100%)'
          : 'radial-gradient(ellipse at 50% 20%, #0b2447 0%, #06152b 50%, #030a16 100%)',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Top Header: Title, Brand Logo & Quick Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <h2
              className="font-cinematic"
              style={{
                fontSize: '1.85rem',
                color: '#ffffff',
                fontWeight: 900,
                letterSpacing: '0.07em',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <User size={28} color={isViewingG2 ? '#34d399' : '#38bdf8'} />
              HỒ SƠ HIỆP SĨ (PLAYER PROFILE)
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '3px' }}>
              Bảng thông số RPG, bộ trang bị hiệp sĩ và tiến trình thành tựu hai chiến dịch
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SoundButton
              variant="fantasy-gold"
              size="sm"
              onClick={() => navigate('/learning-dashboard')}
              icon={<GraduationCap size={16} />}
            >
              BÁO CÁO HỌC TẬP
            </SoundButton>

            <SoundButton
              variant={isViewingG2 ? 'grade2' : 'grade3'}
              size="sm"
              onClick={() => navigate('/map')}
              icon={<Map size={16} />}
            >
              VÀO BẢN ĐỒ
            </SoundButton>

            <SoundButton
              variant="secondary"
              size="sm"
              onClick={() => navigate('/campaigns')}
              icon={<Compass size={16} />}
            >
              CHỌN CHIẾN DỊCH
            </SoundButton>

            <SoundButton
              variant="fantasy-gold"
              size="sm"
              onClick={() => navigate('/')}
            >
              TRANG CHỦ
            </SoundButton>
          </div>
        </div>

        {/* Feedback message banner */}
        {saveFeedback && (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#86efac',
              fontSize: '0.9rem',
            }}
          >
            {saveFeedback}
          </div>
        )}

        {/* Dual Campaign Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            paddingBottom: '12px',
          }}
        >
          <SoundButton
            variant={activeTab === 'grade-2' ? 'grade2' : 'secondary'}
            size="md"
            onClick={() => setActiveTab('grade-2')}
            icon={<Shield size={18} />}
          >
            THE LITTLE HERO (LỚP 2) • GIÁP BẠC & XANH LỤC
          </SoundButton>

          <SoundButton
            variant={activeTab === 'grade-3' ? 'grade3' : 'secondary'}
            size="md"
            onClick={() => setActiveTab('grade-3')}
            icon={<Crown size={18} />}
          >
            THE LEGENDARY HERO (LỚP 3) • GIÁP XANH LAM & VÀNG KIM
          </SoundButton>
        </div>

        {/* Main Character Sheet Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '32px',
            background: isViewingG2
              ? 'linear-gradient(145deg, rgba(6, 38, 28, 0.9) 0%, rgba(4, 20, 15, 0.95) 100%)'
              : 'linear-gradient(145deg, rgba(8, 30, 60, 0.9) 0%, rgba(4, 16, 35, 0.95) 100%)',
            borderRadius: '20px',
            padding: '28px',
            border: isViewingG2 ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid rgba(250, 204, 21, 0.4)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)',
            alignItems: 'center',
          }}
        >
          {/* Left: Tony Character Portrait */}
          <div style={{ animation: 'floatBob 4s ease-in-out infinite' }}>
            <HeroPortrait
              campaignId={activeTab}
              size={230}
              showBadge={true}
              glow={true}
            />
          </div>

          {/* Right: Core RPG Identity, HP, MP, EXP, Attributes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name & Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                {isEditingName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      maxLength={20}
                      style={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1.5px solid #facc15',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '1.3rem',
                        fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
                        outline: 'none',
                      }}
                    />
                    <SoundButton variant="fantasy-gold" size="sm" onClick={handleSaveName} icon={<Check size={16} />}>
                      Lưu
                    </SoundButton>
                    <SoundButton variant="secondary" size="sm" onClick={() => setIsEditingName(false)}>
                      Hủy
                    </SoundButton>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3
                      className="font-cinematic"
                      style={{
                        fontSize: '2.1rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        letterSpacing: '0.07em',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      HIỆP SĨ {player?.name || 'TONY'}
                    </h3>
                    <SoundButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(true)}
                      style={{ padding: '6px' }}
                      title="Đổi tên hiệp sĩ"
                    >
                      <Edit3 size={18} color="#facc15" />
                    </SoundButton>
                  </div>
                )}

                <Badge variant={isViewingG2 ? 'emerald' : 'gold'}>
                  {isViewingG2 ? 'THE LITTLE HERO (LỚP 2)' : 'THE LEGENDARY HERO (LỚP 3)'}
                </Badge>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
                Mã định danh hiệp sĩ: <code style={{ color: '#cbd5e1' }}>{player?.id}</code> • Danh hiệu: <strong style={{ color: isViewingG2 ? '#34d399' : '#fef08a' }}>{isViewingG2 ? 'Chiến Binh Khám Phá' : 'Đại Hiệp Sĩ Huyền Thoại'}</strong>
              </p>
            </div>

            {/* Core RPG Bars: HP, MP, EXP */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px',
                maxWidth: '750px',
              }}
            >
              {/* HP Bar */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Heart size={15} color="#ef4444" fill="#ef4444" />
                  <span style={{ fontSize: '0.8rem', color: '#fca5a5', fontWeight: 700 }}>SINH LỰC (HP)</span>
                </div>
                <ProgressBar
                  value={currentHp}
                  max={maxHp}
                  variant="hp"
                  height={10}
                  sublabel={`${currentHp} / ${maxHp}`}
                />
              </div>

              {/* MP Bar */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Zap size={15} color="#38bdf8" fill="#38bdf8" />
                  <span style={{ fontSize: '0.8rem', color: '#7dd3fc', fontWeight: 700 }}>NĂNG LƯỢNG TRI THỨC (MP)</span>
                </div>
                <ProgressBar
                  value={currentMp}
                  max={maxMp}
                  variant="exp"
                  height={10}
                  sublabel={`${currentMp} / ${maxMp}`}
                />
              </div>

              {/* EXP Bar */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(250, 204, 21, 0.3)',
                  gridColumn: '1 / -1',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Sparkles size={15} color="#facc15" />
                  <span style={{ fontSize: '0.8rem', color: '#fef08a', fontWeight: 700 }}>KINH NGHIỆM CHIẾN ĐẤU (EXP) • CẤP {heroLevel}</span>
                </div>
                <ProgressBar
                  value={expValue}
                  max={expMax}
                  variant="gold"
                  height={10}
                  sublabel={`${expValue} / ${expMax} EXP`}
                />
              </div>
            </div>

            {/* Quick Stat Counter Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                maxWidth: '750px',
              }}
            >
              <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem' }}>
                  <Coins size={14} color="#facc15" />
                  <span>VÀNG (GOLD)</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fef08a', marginTop: '2px' }}>
                  {goldCoins}
                </div>
              </div>

              <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem' }}>
                  <Swords size={14} color="#ef4444" />
                  <span>QUÁI ĐÃ HẠ</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                  {monstersDefeated}
                </div>
              </div>

              <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem' }}>
                  <Award size={14} color="#38bdf8" />
                  <span>NHIỆM VỤ</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                  {questsCompleted}
                </div>
              </div>

              <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem' }}>
                  <Gem size={14} color="#a855f7" />
                  <span>NGỌC TRI THỨC</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                  {displayedProgress?.collectedGemIds.length || 0}/7
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Slot System (Khu vực trang bị hiệp sĩ) */}
        <Card variant="dark">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={20} color="#facc15" />
              <h4
                className="font-cinematic"
                style={{
                  fontSize: '1.15rem',
                  color: '#ffffff',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                }}
              >
                KHU VỰC TRANG BỊ HIỆP SĨ (EQUIPMENT SLOTS)
              </h4>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <SoundButton
                variant="primary"
                size="sm"
                onClick={() => setIsEquipmentOpen(true)}
              >
                ⚙️ 8 Vị Trí Trang Bị
              </SoundButton>
              <SoundButton
                variant="secondary"
                size="sm"
                onClick={() => setIsInventoryOpen(true)}
              >
                🎒 Túi Đồ
              </SoundButton>
              <SoundButton
                variant="secondary"
                size="sm"
                onClick={() => setIsSkillsOpen(true)}
              >
                ✨ Kỹ Năng
              </SoundButton>
              <SoundButton
                variant="secondary"
                size="sm"
                onClick={() => setIsCrystalsOpen(true)}
              >
                💎 7 Viên Ngọc
              </SoundButton>
              <SoundButton
                variant="secondary"
                size="sm"
                onClick={() => setIsJournalOpen(true)}
              >
                📜 Nhật Ký
              </SoundButton>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Slot 1: Weapon (Vũ khí) */}
            <div
              onClick={() => equippedWeapon && setSelectedItem(equippedWeapon)}
              style={{
                background: equippedWeapon ? 'rgba(30, 41, 59, 0.75)' : 'rgba(15, 23, 42, 0.5)',
                border: equippedWeapon ? '1.5px solid #facc15' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: equippedWeapon ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: equippedWeapon ? '0 4px 16px rgba(250, 204, 21, 0.15)' : 'none',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: equippedWeapon ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)' : 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sword size={26} color={equippedWeapon ? '#ffffff' : '#64748b'} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>
                  VŨ KHÍ (WEAPON)
                </span>
                {equippedWeapon ? (
                  <>
                    <h5 style={{ fontSize: '0.95rem', color: '#fef08a', fontWeight: 800 }}>
                      {equippedWeapon.name}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                      + {equippedWeapon.stats.attackBonus} Tấn Công (ATK)
                    </p>
                  </>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                    Chưa sở hữu trang bị
                  </span>
                )}
              </div>
            </div>

            {/* Slot 2: Shield (Khiên) */}
            <div
              onClick={() => equippedShield && setSelectedItem(equippedShield)}
              style={{
                background: equippedShield ? 'rgba(30, 41, 59, 0.75)' : 'rgba(15, 23, 42, 0.5)',
                border: equippedShield ? '1.5px solid #38bdf8' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: equippedShield ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: equippedShield ? '0 4px 16px rgba(56, 189, 248, 0.15)' : 'none',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: equippedShield ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={26} color={equippedShield ? '#ffffff' : '#64748b'} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>
                  KHIÊN PHÒNG THỦ (SHIELD)
                </span>
                {equippedShield ? (
                  <>
                    <h5 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 800 }}>
                      {equippedShield.name}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: '#22c55e' }}>
                      + {equippedShield.stats.defenseBonus} Giáp • + {equippedShield.stats.hpBonus} HP
                    </p>
                  </>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                    Chưa sở hữu trang bị
                  </span>
                )}
              </div>
            </div>

            {/* Slot 3: Armor (Giáp) */}
            <div
              onClick={() => equippedArmor && setSelectedItem(equippedArmor)}
              style={{
                background: equippedArmor ? 'rgba(30, 41, 59, 0.75)' : 'rgba(15, 23, 42, 0.5)',
                border: equippedArmor ? '1.5px solid #34d399' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: equippedArmor ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: equippedArmor ? '0 4px 16px rgba(52, 211, 153, 0.15)' : 'none',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: equippedArmor ? 'linear-gradient(135deg, #059669 0%, #34d399 100%)' : 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shirt size={26} color={equippedArmor ? '#ffffff' : '#64748b'} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>
                  CHIẾN GIÁP (ARMOR)
                </span>
                {equippedArmor ? (
                  <>
                    <h5 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 800 }}>
                      {equippedArmor.name}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: '#22c55e' }}>
                      + {equippedArmor.stats.defenseBonus} Giáp • + {equippedArmor.stats.hpBonus} HP
                    </p>
                  </>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                    Chưa sở hữu trang bị
                  </span>
                )}
              </div>
            </div>

            {/* Slot 4: Accessory (Phụ kiện / Bảo vật) */}
            <div
              onClick={() => equippedAccessory && setSelectedItem(equippedAccessory)}
              style={{
                background: equippedAccessory ? 'rgba(30, 41, 59, 0.75)' : 'rgba(15, 23, 42, 0.5)',
                border: equippedAccessory ? '1.5px solid #c084fc' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: equippedAccessory ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: equippedAccessory ? '0 4px 16px rgba(192, 132, 252, 0.15)' : 'none',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: equippedAccessory ? 'linear-gradient(135deg, #7e22ce 0%, #c084fc 100%)' : 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={26} color={equippedAccessory ? '#ffffff' : '#64748b'} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>
                  PHỤ KIỆN / BẢO VẬT (ACCESSORY)
                </span>
                {equippedAccessory ? (
                  <>
                    <h5 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 800 }}>
                      {equippedAccessory.name}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: '#c084fc' }}>
                      + {equippedAccessory.stats.expBonusPercent}% Thưởng EXP
                    </p>
                  </>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                    Chưa sở hữu trang bị
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Achievements Section */}
        <Card variant="dark">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Award size={20} color="#facc15" />
            <h4
              className="font-cinematic"
              style={{
                fontSize: '1.15rem',
                color: '#ffffff',
                fontWeight: 800,
                letterSpacing: '0.06em',
              }}
            >
              HUY HIỆU & THÀNH TÍCH ĐẠT ĐƯỢC ({displayedProgress?.achievements.length || 0})
            </h4>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            {displayedProgress?.achievements.map((ach) => (
              <div
                key={ach.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: isViewingG2 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Crown size={22} color={isViewingG2 ? '#34d399' : '#38bdf8'} />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 800 }}>
                    {ach.title}
                  </h5>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Campaign Switch Notice */}
        {activeCampaignId !== activeTab && (
          <div
            style={{
              padding: '16px 22px',
              borderRadius: '12px',
              background: 'rgba(250, 204, 21, 0.12)',
              border: '1.5px solid rgba(250, 204, 21, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '0.92rem', color: '#fef08a' }}>
              Bạn đang xem hồ sơ của {isViewingG2 ? 'Chiến dịch Lớp 2' : 'Chiến dịch Lớp 3'}. Muốn đặt chiến dịch này làm hành trình đang chơi ngay?
            </span>
            <SoundButton
              variant="fantasy-gold"
              size="sm"
              onClick={() => handleSwitchCampaignToActive(activeTab)}
            >
              Vào Chơi Chiến Dịch Này
            </SoundButton>
          </div>
        )}
      </div>

      {/* Equipment Inspect Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1.5px solid #facc15',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '460px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sword size={22} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fef08a' }}>
                  {selectedItem.name}
                </h4>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {selectedItem.rarity} {selectedItem.type}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
              {selectedItem.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <SoundButton variant="secondary" size="sm" onClick={() => setSelectedItem(null)}>
                Đóng
              </SoundButton>
            </div>
          </div>
        </div>
      )}

      {/* Hero Inventory Modal */}
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />

      {/* Hero Equipment Modal */}
      <EquipmentModal
        isOpen={isEquipmentOpen}
        onClose={() => setIsEquipmentOpen(false)}
        onOpenInventory={() => {
          setIsEquipmentOpen(false);
          setIsInventoryOpen(true);
        }}
      />

      {/* Hero Skill Tree Modal */}
      <SkillTreeModal
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
      />

      {/* Seven Knowledge Crystals Modal */}
      <KnowledgeCrystalsModal
        isOpen={isCrystalsOpen}
        onClose={() => setIsCrystalsOpen(false)}
      />

      {/* Story Journal Modal */}
      <StoryJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />
    </div>
  );
};

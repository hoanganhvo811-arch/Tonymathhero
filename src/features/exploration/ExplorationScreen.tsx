import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { useProgressStore } from '@/game/state/useProgressStore';
import { useQuestStore } from '@/features/quests/useQuestStore';
import { useAudio } from '@/hooks/useAudio';
import { ExplorationCanvas } from './components/ExplorationCanvas';
import { ExplorationHud } from './components/ExplorationHud';
import { DialogueModal } from './components/DialogueModal';
import { MerchantShopModal } from './components/MerchantShopModal';
import { InventoryModal } from '@/features/inventory/components/InventoryModal';
import { EquipmentModal } from '@/features/inventory/components/EquipmentModal';
import { SkillTreeModal } from '@/features/skills/components/SkillTreeModal';
import { QuestJournalModal } from '@/features/quests/components/QuestJournalModal';
import { QuestTrackerWidget } from '@/features/quests/components/QuestTrackerWidget';
import { QuestRewardModal } from '@/features/quests/components/QuestRewardModal';
import { SettingModal } from '@/components/ui/SettingModal';
import { StoryCutsceneModal } from '@/features/story/components/StoryCutsceneModal';
import { StoryJournalModal } from '@/features/story/components/StoryJournalModal';
import { VirtualJoystick } from './components/VirtualJoystick';
import { Modal } from '@/components/common/Modal';
import { SoundButton } from '@/components/common/SoundButton';
import { getKingdomExplorationData } from './data/kingdomsExplorationData';
import type { NpcData, InteractiveObjectData } from '@/types/exploration';
import type { BgmTrack } from '@/game/engine/AudioEngine';

export const ExplorationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { kingdomId } = useParams<{ kingdomId?: string }>();
  const { playSelect, playClick, playBgm, stopBgm, playRewardCollect } = useAudio();
  const { activeCampaignId } = useCampaignStore();
  const { currentProgress } = useProgressStore();

  // Load exploration data for the active kingdom
  const kingdomData = getKingdomExplorationData(activeCampaignId, kingdomId);

  const {
    quests,
    initQuests,
    acceptQuest,
    advanceObjective,
    completeQuest,
    collectObject,
    isObjectCollected,
    collectedObjectIds,
    unlockedSubZoneIds,
  } = useQuestStore();

  // Modals state
  const [activeNpcDialogue, setActiveNpcDialogue] = useState<NpcData | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState<string | null>(null);

  // Proximity & Touch control state
  const [nearbyInteractable, setNearbyInteractable] = useState<{
    type: 'npc' | 'object';
    data: NpcData | InteractiveObjectData;
  } | null>(null);
  const [joystickVector, setJoystickVector] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [interactTrigger, setInteractTrigger] = useState(0);

  // Current sub-zone title & Discovery Banner
  const [currentZoneName, setCurrentZoneName] = useState(kingdomData.subZones[0]?.nameVi || 'Vùng Khám Phá');
  const [discoveryBanner, setDiscoveryBanner] = useState<{ title: string; subtitle: string } | null>({
    title: kingdomData.titleVi,
    subtitle: kingdomData.loreVi,
  });

  // Play Kingdom Background Music
  useEffect(() => {
    const bgmMap: Record<string, BgmTrack> = {
      emerald_forest: 'kingdom_emerald',
      golden_desert: 'kingdom_desert',
      ocean_kingdom: 'kingdom_ocean',
      frozen_kingdom: 'kingdom_frozen',
      stone_mountain: 'kingdom_stone',
      sweet_valley: 'kingdom_sweet',
      dark_kingdom: 'kingdom_dark',
    };
    const track = bgmMap[kingdomData.biomeType] || 'kingdom_emerald';
    playBgm(track);

    return () => {
      stopBgm();
    };
  }, [kingdomData.biomeType, playBgm, stopBgm]);

  // Hide initial discovery banner after 3.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setDiscoveryBanner(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [kingdomData.kingdomId]);

  // Initialize quests for campaign & kingdom
  useEffect(() => {
    initQuests(activeCampaignId, kingdomData.kingdomId);
  }, [activeCampaignId, kingdomData.kingdomId, initQuests]);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyJ') {
        setIsJournalOpen((prev) => !prev);
      } else if (e.code === 'KeyM') {
        navigate('/map');
      } else if (e.code === 'KeyB') {
        navigate('/battle');
      } else if (e.code === 'KeyI') {
        setIsInventoryOpen((prev) => !prev);
      } else if (e.code === 'KeyE') {
        setIsEquipmentOpen((prev) => !prev);
      } else if (e.code === 'KeyK') {
        setIsSkillsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const heroLevel = currentProgress?.heroLevel || 1;
  const currentExp = currentProgress?.currentExp || 0;
  const nextLevelExp = currentProgress?.nextLevelExp || 100;
  const goldCoins = currentProgress?.goldCoins || 100;

  // Handle interaction with NPC or Object
  const handleInteract = (interactable: { type: 'npc' | 'object'; data: NpcData | InteractiveObjectData }) => {
    playSelect();

    if (interactable.type === 'npc') {
      const npc = interactable.data as NpcData;
      setActiveNpcDialogue(npc);
      advanceObjective('talk_npc', npc.id);
    } else {
      const obj = interactable.data as InteractiveObjectData;
      if (isObjectCollected(obj.id)) {
        setInfoModalMessage(`[${obj.name}] đã được thu thập hoặc kích hoạt trước đó.`);
        return;
      }

      collectObject(obj.id);
      playRewardCollect();
      advanceObjective('collect_item', obj.id);

      let msg = `✨ Bạn đã khám phá thành công [${obj.name}]!`;
      if (obj.rewardExp) msg += `\n+${obj.rewardExp} EXP`;
      if (obj.rewardGold) msg += `\n+${obj.rewardGold} Vàng`;
      if (obj.rewardItemName) msg += `\nNhận được: [${obj.rewardItemName}]`;
      setInfoModalMessage(msg);
    }
  };

  const handleZoneChange = (zoneName: string) => {
    if (zoneName !== currentZoneName) {
      setCurrentZoneName(zoneName);
      setDiscoveryBanner({
        title: zoneName,
        subtitle: `Khu vực thuộc ${kingdomData.titleVi}`,
      });
      setTimeout(() => setDiscoveryBanner(null), 3000);
    }
  };

  const isAnyModalOpen =
    isEquipmentOpen ||
    isInventoryOpen ||
    isShopOpen ||
    isJournalOpen ||
    isSkillsOpen ||
    isSettingsOpen ||
    Boolean(activeNpcDialogue) ||
    Boolean(infoModalMessage);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: kingdomData.environment.fogColor,
      }}
    >
      {/* 3D Exploration Canvas */}
      <ExplorationCanvas
        heroLevel={heroLevel}
        subZones={kingdomData.subZones}
        npcs={kingdomData.npcs}
        interactiveObjects={kingdomData.interactiveObjects}
        collectedObjectIds={collectedObjectIds}
        nearbyInteractable={nearbyInteractable}
        environment={kingdomData.environment}
        joystickVector={joystickVector}
        interactTrigger={interactTrigger}
        hideNameplates={isAnyModalOpen}
        onProximityChange={setNearbyInteractable}
        onInteract={handleInteract}
        onZoneChange={handleZoneChange}
      />

      {/* Discovery Location Banner Notification */}
      {discoveryBanner && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 11, 20, 0.98) 100%)',
            border: '1.5px solid rgba(250, 204, 21, 0.6)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(250, 204, 21, 0.3)',
            borderRadius: '14px',
            padding: '12px 28px',
            textAlign: 'center',
            pointerEvents: 'none',
            animation: 'fadeInSlideDown 0.4s ease-out forwards',
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              color: '#facc15',
              fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}
          >
            🗺️ ĐÃ KHÁM PHÁ ĐỊA ĐIỂM
          </div>
          <div
            style={{
              fontSize: '1.35rem',
              color: '#ffffff',
              fontWeight: 900,
              letterSpacing: '0.04em',
            }}
          >
            {discoveryBanner.title}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
            {discoveryBanner.subtitle}
          </div>
        </div>
      )}

      {/* Exploration HUD (Health, MP, Minimap, Action buttons) */}
      <ExplorationHud
        heroLevel={heroLevel}
        currentExp={currentExp}
        nextLevelExp={nextLevelExp}
        goldCoins={goldCoins}
        currentZoneName={currentZoneName}
        nearbyInteractable={nearbyInteractable}
        onOpenJournal={() => {
          playSelect();
          setIsJournalOpen(true);
        }}
        onReturnToMap={() => {
          playSelect();
          navigate('/map');
        }}
        onOpenShop={() => {
          playSelect();
          setIsShopOpen(true);
        }}
        onOpenSettings={() => {
          playClick();
          setIsSettingsOpen(true);
        }}
        onOpenBattle={() => {
          playSelect();
          navigate('/battle');
        }}
        onOpenInventory={() => {
          playSelect();
          setIsInventoryOpen(true);
        }}
        onOpenEquipment={() => {
          playSelect();
          setIsEquipmentOpen(true);
        }}
        onOpenSkills={() => {
          playSelect();
          setIsSkillsOpen(true);
        }}
        onInteract={() => {
          if (nearbyInteractable) handleInteract(nearbyInteractable);
        }}
      />

      {/* Persistent Quest Tracker Widget on Right Side */}
      <QuestTrackerWidget onOpenJournal={() => setIsJournalOpen(true)} />

      {/* Virtual Touch Joystick for Tablet */}
      <VirtualJoystick onMove={setJoystickVector} />

      {/* NPC Dialogue Modal */}
      <DialogueModal
        npc={activeNpcDialogue}
        onClose={() => setActiveNpcDialogue(null)}
        onAcceptQuest={(qId) => {
          acceptQuest(qId);
          setInfoModalMessage(`⚔️ ĐÃ NHẬN NHIỆM VỤ! Mở Sổ Nhiệm Vụ (J) để theo dõi mục tiêu.`);
        }}
        onCompleteQuest={(qId) => {
          completeQuest(qId);
        }}
        onOpenShop={() => setIsShopOpen(true)}
      />

      {/* Quest Journal Modal (J) */}
      <QuestJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />

      {/* Merchant Shop Modal */}
      <MerchantShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />

      {/* Hero Inventory Modal (I) */}
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />

      {/* Hero Equipment Modal (E) */}
      <EquipmentModal
        isOpen={isEquipmentOpen}
        onClose={() => setIsEquipmentOpen(false)}
        onOpenInventory={() => {
          setIsEquipmentOpen(false);
          setIsInventoryOpen(true);
        }}
      />

      {/* Hero Skill Tree Modal (K) */}
      <SkillTreeModal
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
      />

      {/* Settings Modal */}
      <SettingModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Story Cutscene Modal */}
      <StoryCutsceneModal />

      {/* Story Journal Modal */}
      <StoryJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />

      {/* Quest Completion Victory Notification */}
      <QuestRewardModal />

      {/* Info / Toast Modal */}
      <Modal
        isOpen={!!infoModalMessage}
        onClose={() => setInfoModalMessage(null)}
        title="THÔNG ĐIỆP HIỆP SĨ"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {infoModalMessage}
          </p>
          <SoundButton variant="primary" style={{ width: '100%' }} onClick={() => setInfoModalMessage(null)}>
            XÁC NHẬN
          </SoundButton>
        </div>
      </Modal>

      <style>{`
        @keyframes fadeInSlideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
};

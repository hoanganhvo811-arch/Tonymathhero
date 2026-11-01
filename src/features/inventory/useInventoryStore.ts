import { create } from 'zustand';
import type { CampaignId } from '@/types/campaign';
import type { EquipmentLoadout, EquipmentSlot, InventoryItem } from '@/types/inventory';
import type { HeroSkill } from '@/types/skill';
import { MASTER_ITEMS_CATALOG, getItemDef } from './data/itemsCatalog';
import { HERO_SKILLS_CATALOG, getSkillDef } from '../skills/data/skillsCatalog';
import { HeroStatsCalculator, type HeroCalculatedStats } from '../character/heroStatsCalculator';
import { useProgressStore } from '../../game/state/useProgressStore';

const INVENTORY_STORAGE_KEY = 'tony_math_hero_inventory_state';

const createEmptyEquipment = (): EquipmentLoadout => ({
  weapon: null,
  helmet: null,
  armor: null,
  gloves: null,
  boots: null,
  shield: null,
  ring: null,
  amulet: null,
});

// Initial starter inventory for Grade 2
function createInitialGrade2Inventory(): { items: InventoryItem[]; equipment: EquipmentLoadout } {
  const eq = createEmptyEquipment();
  eq.weapon = getItemDef('wp-sword-apprentice') || null;
  eq.shield = getItemDef('arm-shield-valour') || null;
  eq.helmet = getItemDef('arm-helmet-scout') || null;
  eq.armor = getItemDef('arm-armor-explorer') || null;
  eq.amulet = getItemDef('acc-amulet-origin') || null;

  const items: InventoryItem[] = [
    { ...getItemDef('con-potion-hp-small')!, quantity: 3 },
    { ...getItemDef('con-potion-mp-small')!, quantity: 2 },
    { ...getItemDef('acc-ring-meadow')!, quantity: 1 },
    { ...getItemDef('arm-gloves-steel')!, quantity: 1 },
    { ...getItemDef('arm-boots-swift')!, quantity: 1 },
    { ...getItemDef('con-elixir-power')!, quantity: 1 },
  ];

  return { items, equipment: eq };
}

// Initial starter inventory for Grade 3
function createInitialGrade3Inventory(): { items: InventoryItem[]; equipment: EquipmentLoadout } {
  const eq = createEmptyEquipment();
  eq.weapon = getItemDef('wp-sword-sunfire-legend') || null;
  eq.shield = getItemDef('arm-shield-aegis') || null;
  eq.helmet = getItemDef('arm-helmet-elder') || null;
  eq.armor = getItemDef('arm-armor-legendary') || null;
  eq.amulet = getItemDef('acc-badge-chivalry') || null;

  const items: InventoryItem[] = [
    { ...getItemDef('con-potion-hp-large')!, quantity: 3 },
    { ...getItemDef('con-potion-mp-large')!, quantity: 2 },
    { ...getItemDef('acc-ring-crystal-lake')!, quantity: 1 },
    { ...getItemDef('arm-gloves-steel')!, quantity: 1 },
    { ...getItemDef('con-elixir-defense')!, quantity: 2 },
  ];

  return { items, equipment: eq };
}

interface InventoryStoreState {
  activeCampaignId: CampaignId;
  items: InventoryItem[];
  equipment: EquipmentLoadout;
  inventoryByCampaign: Record<CampaignId, InventoryItem[]>;
  equipmentByCampaign: Record<CampaignId, EquipmentLoadout>;
  unlockedSkillsByCampaign: Record<CampaignId, string[]>;
  activeBuffs: { attackPercent: number; defensePercent: number; remainingTurns: number };
  selectedItemForDetail: InventoryItem | null;
  inventoryCapacity: number;

  // Actions
  setCampaign: (campaignId: CampaignId) => void;
  getItems: (campaignId?: CampaignId) => InventoryItem[];
  getEquipment: (campaignId?: CampaignId) => EquipmentLoadout;
  getCalculatedStats: (campaignId?: CampaignId, level?: number) => HeroCalculatedStats;
  getSkills: (campaignId?: CampaignId) => HeroSkill[];
  addItem: (item: InventoryItem, quantity?: number, campaignId?: CampaignId) => boolean;
  removeItem: (itemId: string, quantity?: number, campaignId?: CampaignId) => boolean;
  equipItem: (itemId: string, slot?: EquipmentSlot, campaignId?: CampaignId) => { success: boolean; message: string };
  unequipItem: (slot: EquipmentSlot, campaignId?: CampaignId) => { success: boolean; message: string };
  useConsumable: (
    itemId: string,
    currentHp: number,
    currentMp: number,
    campaignId?: CampaignId
  ) => { success: boolean; message: string; healHp?: number; healMp?: number; buff?: any };
  buyItem: (item: InventoryItem, quantity?: number, campaignId?: CampaignId) => { success: boolean; message: string };
  sellItem: (itemId: string, quantity?: number, campaignId?: CampaignId) => { success: boolean; message: string };
  unlockSkill: (skillId: string, campaignId?: CampaignId) => boolean;
  setSelectedItemForDetail: (item: InventoryItem | null) => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

export const useHeroInventoryStore = create<InventoryStoreState>((set, get) => {
  const g2 = createInitialGrade2Inventory();
  const g3 = createInitialGrade3Inventory();

  // Try loading from localStorage
  let savedG2Items = g2.items;
  let savedG2Equipment = g2.equipment;
  let savedG3Items = g3.items;
  let savedG3Equipment = g3.equipment;
  let savedG2Skills = ['skill-sword-strike'];
  let savedG3Skills = ['skill-sword-strike', 'skill-power-slash', 'skill-magic-blast'];

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.inventoryByCampaign) {
          savedG2Items = parsed.inventoryByCampaign['grade-2'] || g2.items;
          savedG3Items = parsed.inventoryByCampaign['grade-3'] || g3.items;
        }
        if (parsed.equipmentByCampaign) {
          savedG2Equipment = parsed.equipmentByCampaign['grade-2'] || g2.equipment;
          savedG3Equipment = parsed.equipmentByCampaign['grade-3'] || g3.equipment;
        }
        if (parsed.unlockedSkillsByCampaign) {
          savedG2Skills = parsed.unlockedSkillsByCampaign['grade-2'] || savedG2Skills;
          savedG3Skills = parsed.unlockedSkillsByCampaign['grade-3'] || savedG3Skills;
        }
      }
    } catch {
      // fallback
    }
  }

  return {
    activeCampaignId: 'grade-2',
    items: savedG2Items,
    equipment: savedG2Equipment,
    inventoryByCampaign: {
      'grade-2': savedG2Items,
      'grade-3': savedG3Items,
    },
    equipmentByCampaign: {
      'grade-2': savedG2Equipment,
      'grade-3': savedG3Equipment,
    },
    unlockedSkillsByCampaign: {
      'grade-2': savedG2Skills,
      'grade-3': savedG3Skills,
    },
    activeBuffs: { attackPercent: 0, defensePercent: 0, remainingTurns: 0 },
    selectedItemForDetail: null,
    inventoryCapacity: 40,

    setCampaign: (campaignId: CampaignId) => {
      set((state) => ({
        activeCampaignId: campaignId,
        items: state.inventoryByCampaign[campaignId] || [],
        equipment: state.equipmentByCampaign[campaignId] || createEmptyEquipment(),
      }));
    },

    getItems: (campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      return get().inventoryByCampaign[cid] || [];
    },

    getEquipment: (campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      return get().equipmentByCampaign[cid] || createEmptyEquipment();
    },

    getCalculatedStats: (campaignId?: CampaignId, level?: number) => {
      const cid = campaignId || get().activeCampaignId;
      const eq = get().getEquipment(cid);
      const lvl =
        level ||
        useProgressStore.getState().currentProgress?.heroLevel ||
        1;
      return HeroStatsCalculator.calculate(lvl, cid, eq);
    },

    getSkills: (campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const unlockedIds = get().unlockedSkillsByCampaign[cid] || ['skill-sword-strike'];
      const currentLevel = useProgressStore.getState().currentProgress?.heroLevel || 1;

      return HERO_SKILLS_CATALOG.map((skill) => {
        // Automatically unlocked if level requirement is met or explicitly in unlocked list
        const isUnlocked = unlockedIds.includes(skill.id) || currentLevel >= skill.levelRequirement;
        return {
          ...skill,
          isUnlocked,
        };
      });
    },

    addItem: (item: InventoryItem, quantity = 1, campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const currentItems = get().getItems(cid);

      if (currentItems.length >= get().inventoryCapacity && !item.stackable) {
        return false;
      }

      let updatedList: InventoryItem[];
      const existingIdx = currentItems.findIndex((i) => i.id === item.id);

      if (existingIdx >= 0 && item.stackable) {
        updatedList = currentItems.map((i, idx) =>
          idx === existingIdx ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        updatedList = [...currentItems, { ...item, quantity }];
      }

      set((state) => ({
        inventoryByCampaign: {
          ...state.inventoryByCampaign,
          [cid]: updatedList,
        },
        items: cid === state.activeCampaignId ? updatedList : state.items,
      }));

      get().saveToStorage();
      return true;
    },

    removeItem: (itemId: string, quantity = 1, campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const currentItems = get().getItems(cid);
      const existing = currentItems.find((i) => i.id === itemId);

      if (!existing) return false;

      let updatedList: InventoryItem[];
      if (existing.quantity > quantity) {
        updatedList = currentItems.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
        );
      } else {
        updatedList = currentItems.filter((i) => i.id !== itemId);
      }

      set((state) => ({
        inventoryByCampaign: {
          ...state.inventoryByCampaign,
          [cid]: updatedList,
        },
        items: cid === state.activeCampaignId ? updatedList : state.items,
      }));

      get().saveToStorage();
      return true;
    },

    equipItem: (itemId: string, slotTarget?: EquipmentSlot, campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const items = get().getItems(cid);
      const targetItem = items.find((i) => i.id === itemId);

      if (!targetItem) {
        return { success: false, message: 'Không tìm thấy vật phẩm trong túi đồ.' };
      }

      // Check slot compatibility
      const targetSlot = slotTarget || targetItem.slot;
      if (!targetSlot) {
        return { success: false, message: 'Vật phẩm này không thể trang bị!' };
      }

      // Check level requirement
      const heroLevel = useProgressStore.getState().currentProgress?.heroLevel || 1;
      if (heroLevel < targetItem.levelRequirement) {
        return {
          success: false,
          message: `Cần Cấp độ ${targetItem.levelRequirement} để trang bị vật phẩm này!`,
        };
      }

      const currentEq = { ...get().getEquipment(cid) };
      const currentlyEquippedItem = currentEq[targetSlot];

      // Remove 1 count of targetItem from inventory
      let updatedInventory: InventoryItem[];
      if (targetItem.quantity > 1) {
        updatedInventory = items.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        updatedInventory = items.filter((i) => i.id !== itemId);
      }

      // If an item was previously equipped in this slot, put it back to inventory
      if (currentlyEquippedItem) {
        const backIdx = updatedInventory.findIndex((i) => i.id === currentlyEquippedItem.id);
        if (backIdx >= 0 && currentlyEquippedItem.stackable) {
          updatedInventory[backIdx].quantity += 1;
        } else {
          updatedInventory.push({ ...currentlyEquippedItem, quantity: 1, isEquipped: false });
        }
      }

      // Set new equipped item
      currentEq[targetSlot] = { ...targetItem, quantity: 1, isEquipped: true };

      set((state) => ({
        inventoryByCampaign: {
          ...state.inventoryByCampaign,
          [cid]: updatedInventory,
        },
        equipmentByCampaign: {
          ...state.equipmentByCampaign,
          [cid]: currentEq,
        },
        items: cid === state.activeCampaignId ? updatedInventory : state.items,
        equipment: cid === state.activeCampaignId ? currentEq : state.equipment,
      }));

      get().saveToStorage();
      return {
        success: true,
        message: `Đã trang bị thành công [${targetItem.name}] vào ô ${targetSlot}!`,
      };
    },

    unequipItem: (slot: EquipmentSlot, campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const currentEq = { ...get().getEquipment(cid) };
      const equipped = currentEq[slot];

      if (!equipped) {
        return { success: false, message: `Ô ${slot} hiện đang trống!` };
      }

      const currentItems = get().getItems(cid);
      if (currentItems.length >= get().inventoryCapacity) {
        return { success: false, message: 'Túi đồ đã đầy, không thể tháo trang bị!' };
      }

      // Put item back into inventory
      let updatedInventory: InventoryItem[];
      const existIdx = currentItems.findIndex((i) => i.id === equipped.id);
      if (existIdx >= 0 && equipped.stackable) {
        updatedInventory = currentItems.map((i, idx) =>
          idx === existIdx ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedInventory = [...currentItems, { ...equipped, quantity: 1, isEquipped: false }];
      }

      currentEq[slot] = null;

      set((state) => ({
        inventoryByCampaign: {
          ...state.inventoryByCampaign,
          [cid]: updatedInventory,
        },
        equipmentByCampaign: {
          ...state.equipmentByCampaign,
          [cid]: currentEq,
        },
        items: cid === state.activeCampaignId ? updatedInventory : state.items,
        equipment: cid === state.activeCampaignId ? currentEq : state.equipment,
      }));

      get().saveToStorage();
      return { success: true, message: `Đã tháo [${equipped.name}] về túi đồ!` };
    },

    useConsumable: (itemId: string, currentHp: number, currentMp: number, campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const items = get().getItems(cid);
      const targetItem = items.find((i) => i.id === itemId);

      if (!targetItem || targetItem.category !== 'consumables') {
        return { success: false, message: 'Vật phẩm không thể sử dụng!' };
      }

      const stats = get().getCalculatedStats(cid);
      const maxHp = stats.finalStats.maxHp;
      const maxMp = stats.finalStats.maxMp;

      const effects = targetItem.effects || {};

      // Validation: do not consume if HP is already full
      if (effects.healHp && currentHp >= maxHp) {
        return { success: false, message: 'Sinh lực (HP) của Tony đã đầy, không cần dùng thuốc!' };
      }

      // Validation: do not consume if MP is already full
      if (effects.healMp && currentMp >= maxMp) {
        return { success: false, message: 'Năng lượng (MP) của Tony đã đầy, không cần dùng thuốc!' };
      }

      // Deduct 1 item from inventory
      get().removeItem(itemId, 1, cid);

      // Handle buff effects
      if (effects.buffAttackPercent || effects.buffDefensePercent) {
        set({
          activeBuffs: {
            attackPercent: effects.buffAttackPercent || 0,
            defensePercent: effects.buffDefensePercent || 0,
            remainingTurns: effects.buffDurationTurns || 3,
          },
        });
      }

      let msg = `Đã sử dụng [${targetItem.name}]!`;
      if (effects.healHp) msg += ` Hồi phục +${effects.healHp} HP.`;
      if (effects.healMp) msg += ` Hồi phục +${effects.healMp} MP.`;
      if (effects.buffAttackPercent) msg += ` Tăng +${effects.buffAttackPercent}% Tấn Công.`;
      if (effects.buffDefensePercent) msg += ` Tăng +${effects.buffDefensePercent}% Phòng Thủ.`;

      return {
        success: true,
        message: msg,
        healHp: effects.healHp,
        healMp: effects.healMp,
        buff: effects,
      };
    },

    buyItem: (item: InventoryItem, quantity = 1, campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const progressStore = useProgressStore.getState();
      const currentGold = progressStore.currentProgress?.goldCoins || 0;
      const totalCost = (item.buyPrice || 50) * quantity;

      if (currentGold < totalCost) {
        return {
          success: false,
          message: `Không đủ Vàng! Cần ${totalCost} Vàng (Hiện có: ${currentGold} Vàng).`,
        };
      }

      // Deduct gold atomically
      if (progressStore.currentProgress) {
        progressStore.currentProgress.goldCoins -= totalCost;
        progressStore.saveCurrentProgress().catch(() => {});
      }

      // Add to inventory
      get().addItem(item, quantity, cid);

      return {
        success: true,
        message: `Mua thành công ${quantity}x [${item.name}] (-${totalCost} Vàng)!`,
      };
    },

    sellItem: (itemId: string, quantity = 1, campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const items = get().getItems(cid);
      const target = items.find((i) => i.id === itemId);

      if (!target) {
        return { success: false, message: 'Vật phẩm không tồn tại trong túi!' };
      }

      // Protection: Quest items cannot be sold
      if (target.category === 'quest_items' || target.category === 'special_items' || target.sellPrice <= 0) {
        return {
          success: false,
          message: 'Vật phẩm nhiệm vụ hoặc đặc biệt không thể bán!',
        };
      }

      const totalEarned = (target.sellPrice || 10) * quantity;

      // Remove from inventory
      get().removeItem(itemId, quantity, cid);

      // Add gold atomically
      const progressStore = useProgressStore.getState();
      if (progressStore.currentProgress) {
        progressStore.currentProgress.goldCoins += totalEarned;
        progressStore.saveCurrentProgress().catch(() => {});
      }

      return {
        success: true,
        message: `Bán thành công ${quantity}x [${target.name}] (+${totalEarned} Vàng)!`,
      };
    },

    unlockSkill: (skillId: string, campaignId?: CampaignId) => {
      const cid = campaignId || get().activeCampaignId;
      const currentSkills = get().unlockedSkillsByCampaign[cid] || [];
      if (currentSkills.includes(skillId)) return true;

      set((state) => ({
        unlockedSkillsByCampaign: {
          ...state.unlockedSkillsByCampaign,
          [cid]: [...currentSkills, skillId],
        },
      }));

      get().saveToStorage();
      return true;
    },

    setSelectedItemForDetail: (item: InventoryItem | null) => {
      set({ selectedItemForDetail: item });
    },

    saveToStorage: () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const data = {
            inventoryByCampaign: get().inventoryByCampaign,
            equipmentByCampaign: get().equipmentByCampaign,
            unlockedSkillsByCampaign: get().unlockedSkillsByCampaign,
          };
          localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(data));
        } catch {
          // ignore
        }
      }
    },

    loadFromStorage: () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            set({
              inventoryByCampaign: parsed.inventoryByCampaign || get().inventoryByCampaign,
              equipmentByCampaign: parsed.equipmentByCampaign || get().equipmentByCampaign,
              unlockedSkillsByCampaign: parsed.unlockedSkillsByCampaign || get().unlockedSkillsByCampaign,
            });
          }
        } catch {
          // ignore
        }
      }
    },
  };
});

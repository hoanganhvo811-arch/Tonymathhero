import type { CampaignId } from './campaign';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type ItemCategory =
  | 'weapons'
  | 'armor'
  | 'accessories'
  | 'consumables'
  | 'materials'
  | 'quest_items'
  | 'special_items';

export type EquipmentSlot =
  | 'weapon'
  | 'helmet'
  | 'armor'
  | 'gloves'
  | 'boots'
  | 'shield'
  | 'ring'
  | 'amulet';

// Legacy ItemType alias for backward compatibility
export type ItemType = 'weapon' | 'armor' | 'shield' | 'potion' | 'gem' | 'artifact' | 'helmet' | 'gloves' | 'boots' | 'ring' | 'amulet';

export interface ItemStats {
  attackBonus?: number;
  defenseBonus?: number;
  magicBonus?: number;
  hpBonus?: number;
  mpBonus?: number;
  critChancePercent?: number;
  expBonusPercent?: number;
}

export interface ItemEffects {
  healHp?: number;
  healMp?: number;
  buffAttackPercent?: number;
  buffDefensePercent?: number;
  buffDurationTurns?: number;
  customEffect?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  slot?: EquipmentSlot;
  type?: ItemType; // backward compatibility
  rarity: ItemRarity;
  iconName: string;
  quantity: number;
  levelRequirement: number;
  stats: ItemStats;
  effects?: ItemEffects;
  sellPrice: number;
  buyPrice: number;
  stackable: boolean;
  isEquipped?: boolean;
  campaignId?: CampaignId;
}

export type EquipmentLoadout = Record<EquipmentSlot, InventoryItem | null>;

export interface Reward {
  exp: number;
  gold: number;
  items: InventoryItem[];
  gemId?: string;
}

export type SubZoneId = string;

export type HeroAnimationState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'attack'
  | 'cast_magic'
  | 'take_damage'
  | 'victory'
  | 'defeat'
  | 'celebrate';

export type MonsterAnimationState =
  | 'spawn'
  | 'idle'
  | 'movement'
  | 'threaten'
  | 'attack'
  | 'take_damage'
  | 'phase_transition'
  | 'defeat';

export interface SubZone {
  id: SubZoneId;
  nameVi: string;
  nameEn: string;
  description: string;
  center: [number, number, number];
  radius: number;
  isUnlocked: boolean;
  requiredQuestId?: string;
  themeColor: string;
}

export interface DialogueLine {
  id: string;
  speakerName: string;
  text: string;
  options?: {
    label: string;
    action: 'next' | 'accept_quest' | 'complete_quest' | 'open_shop' | 'close';
    targetDialogueId?: string;
    questId?: string;
  }[];
}

export interface NpcData {
  id: string;
  name: string;
  role: string;
  subZoneId: SubZoneId;
  position: [number, number, number];
  rotationY?: number;
  avatarIcon: string;
  hasQuestMarker: boolean;
  relatedQuestId?: string;
  dialogueTree: Record<string, DialogueLine>;
  defaultDialogueId: string;
}

export type InteractiveObjectType =
  | 'treasure_chest'
  | 'energy_crystal'
  | 'villager_cage'
  | 'signpost'
  | 'teleport_portal';

export interface InteractiveObjectData {
  id: string;
  type: InteractiveObjectType;
  name: string;
  subZoneId: SubZoneId;
  position: [number, number, number];
  interactionRadius: number;
  promptText: string;
  isCollected?: boolean;
  relatedQuestId?: string;
  rewardExp?: number;
  rewardGold?: number;
  rewardItemName?: string;
}

export type MonsterElement = 'earth' | 'water' | 'fire' | 'wind' | 'shadow' | 'cosmic' | 'iron';

export interface Monster {
  id: string;
  name: string;
  title: string;
  kingdomId: string;
  level: number;
  maxHp: number;
  attackPower: number;
  defense: number;
  element: MonsterElement;
  avatarSeed: string;
  iconName: string;
  description: string;
  specialMove: string;
  weaknessMathTopic: string;
  rewardExp?: number;
  rewardGold?: number;
  modelType?: 'slime' | 'goblin' | 'wolf' | 'golem' | 'boss';
  dialogue: {
    encounter: string;
    taunt: string;
    defeat: string;
  };
}

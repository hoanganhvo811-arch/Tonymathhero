import { GRADE_2_MONSTERS } from '@/campaigns/grade-2/data/monsters';
import { GRADE_3_MONSTERS } from '@/campaigns/grade-3/data/monsters';
import type { Monster } from '@/types';

export const ALL_MONSTERS: Record<string, Monster> = {
  ...GRADE_2_MONSTERS,
  ...GRADE_3_MONSTERS,
};

export function getMonsterById(monsterId: string): Monster | undefined {
  return ALL_MONSTERS[monsterId];
}

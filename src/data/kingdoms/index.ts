import { GRADE_2_KINGDOMS } from '@/campaigns/grade-2/data/kingdoms';
import { GRADE_3_KINGDOMS } from '@/campaigns/grade-3/data/kingdoms';
import type { CampaignId, Kingdom } from '@/types';

export const ALL_KINGDOMS: Kingdom[] = [...GRADE_2_KINGDOMS, ...GRADE_3_KINGDOMS];

export function getKingdomsByCampaign(campaignId: CampaignId): Kingdom[] {
  return campaignId === 'grade-2' ? GRADE_2_KINGDOMS : GRADE_3_KINGDOMS;
}

export function getKingdomById(kingdomId: string): Kingdom | undefined {
  return ALL_KINGDOMS.find((k) => k.id === kingdomId);
}

import type { CampaignId } from '@/types/campaign';
import type { EquipmentLoadout, EquipmentSlot, InventoryItem } from '@/types/inventory';

export interface HeroCalculatedStats {
  level: number;
  base: {
    maxHp: number;
    maxMp: number;
    attack: number;
    defense: number;
    magicPower: number;
  };
  equipmentBonuses: {
    attackBonus: number;
    defenseBonus: number;
    magicBonus: number;
    hpBonus: number;
    mpBonus: number;
    critChancePercent: number;
    expBonusPercent: number;
  };
  finalStats: {
    maxHp: number;
    maxMp: number;
    attack: number;
    defense: number;
    magicPower: number;
    critChancePercent: number;
    expBonusPercent: number;
  };
}

export class HeroStatsCalculator {
  public static calculate(
    level: number,
    campaignId: CampaignId,
    equipment: Partial<EquipmentLoadout> = {}
  ): HeroCalculatedStats {
    const isGrade3 = campaignId === 'grade-3';
    const lvl = Math.max(1, level);
    const levelGains = lvl - 1;

    // 1. Base Stats
    const baseHp = (isGrade3 ? 240 : 150) + levelGains * 25;
    const baseMp = (isGrade3 ? 160 : 100) + levelGains * 15;
    const baseAtk = (isGrade3 ? 40 : 25) + levelGains * 6;
    const baseDef = (isGrade3 ? 25 : 15) + levelGains * 4;
    const baseMag = (isGrade3 ? 35 : 20) + levelGains * 5;

    // 2. Equipment Bonuses
    let attackBonus = 0;
    let defenseBonus = 0;
    let magicBonus = 0;
    let hpBonus = 0;
    let mpBonus = 0;
    let critChancePercent = 5; // base 5% crit
    let expBonusPercent = 0;

    const slots: EquipmentSlot[] = ['weapon', 'helmet', 'armor', 'gloves', 'boots', 'shield', 'ring', 'amulet'];

    for (const slot of slots) {
      const item: InventoryItem | null | undefined = equipment[slot];
      if (item && item.stats) {
        if (item.stats.attackBonus) attackBonus += item.stats.attackBonus;
        if (item.stats.defenseBonus) defenseBonus += item.stats.defenseBonus;
        if (item.stats.magicBonus) magicBonus += item.stats.magicBonus;
        if (item.stats.hpBonus) hpBonus += item.stats.hpBonus;
        if (item.stats.mpBonus) mpBonus += item.stats.mpBonus;
        if (item.stats.critChancePercent) critChancePercent += item.stats.critChancePercent;
        if (item.stats.expBonusPercent) expBonusPercent += item.stats.expBonusPercent;
      }
    }

    // 3. Final Combined Stats
    const finalHp = baseHp + hpBonus;
    const finalMp = baseMp + mpBonus;
    const finalAtk = baseAtk + attackBonus;
    const finalDef = baseDef + defenseBonus;
    const finalMag = baseMag + magicBonus;

    return {
      level: lvl,
      base: {
        maxHp: baseHp,
        maxMp: baseMp,
        attack: baseAtk,
        defense: baseDef,
        magicPower: baseMag,
      },
      equipmentBonuses: {
        attackBonus,
        defenseBonus,
        magicBonus,
        hpBonus,
        mpBonus,
        critChancePercent: critChancePercent - 5,
        expBonusPercent,
      },
      finalStats: {
        maxHp: finalHp,
        maxMp: finalMp,
        attack: finalAtk,
        defense: finalDef,
        magicPower: finalMag,
        critChancePercent,
        expBonusPercent,
      },
    };
  }
}

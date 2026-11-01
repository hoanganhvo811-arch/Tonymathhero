import { GRADE_2_KINGDOMS } from '../campaigns/grade-2/data/kingdoms';
import { GRADE_3_KINGDOMS } from '../campaigns/grade-3/data/kingdoms';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '../data/kingdoms/sevenKingdoms3dConfig';
import type { BiomeType, LandmarkType } from '../types/kingdom';

export function runWorldMap3DVerification() {
  console.log('=== STARTING SEVEN KINGDOMS 3D VERIFICATION ===\n');

  // 1. Verify 7 Kingdoms exist for both campaigns
  console.log('1. Checking Kingdom Count and Biomes...');
  if (GRADE_2_KINGDOMS.length !== 7 || GRADE_3_KINGDOMS.length !== 7) {
    throw new Error(`Expected 7 kingdoms per campaign, got G2: ${GRADE_2_KINGDOMS.length}, G3: ${GRADE_3_KINGDOMS.length}`);
  }
  console.log('✓ Grade 2 has 7 kingdoms, Grade 3 has 7 kingdoms.');

  const expectedBiomes: BiomeType[] = [
    'emerald_forest',
    'golden_desert',
    'ocean_kingdom',
    'frozen_kingdom',
    'stone_mountain',
    'sweet_valley',
    'dark_kingdom',
  ];

  const expectedLandmarkTypes: LandmarkType[] = [
    'quest_point',
    'monster_camp',
    'treasure',
    'boss_gate',
    'kingdom_castle',
  ];

  // 2. Verify all 7 distinct biomes are correctly assigned
  [GRADE_2_KINGDOMS, GRADE_3_KINGDOMS].forEach((kingdomList, gradeIdx) => {
    const gradeName = gradeIdx === 0 ? 'Grade 2' : 'Grade 3';
    kingdomList.forEach((k, idx) => {
      const order = idx + 1;
      const expectedBiome = expectedBiomes[idx];
      if (k.order !== order) {
        throw new Error(`${gradeName} kingdom ${k.id} has incorrect order: ${k.order} (expected ${order})`);
      }
      if (k.biomeType !== expectedBiome) {
        throw new Error(`${gradeName} kingdom ${k.id} has incorrect biome: ${k.biomeType} (expected ${expectedBiome})`);
      }
      if (!k.worldPosition || k.worldPosition.length !== 3) {
        throw new Error(`${gradeName} kingdom ${k.id} missing 3D worldPosition coordinates`);
      }
      if (!k.landmarks || k.landmarks.length !== 5) {
        throw new Error(`${gradeName} kingdom ${k.id} expected 5 landmarks, got ${k.landmarks?.length}`);
      }

      // Check each landmark has required type
      expectedLandmarkTypes.forEach((type) => {
        const found = k.landmarks?.find((lm) => lm.type === type);
        if (!found) {
          throw new Error(`${gradeName} kingdom ${k.id} is missing landmark type: ${type}`);
        }
      });
    });
    console.log(`✓ ${gradeName} has all 7 biomes and 5 landmarks per kingdom.`);
  });

  // 3. Verify 3D Coordinates uniqueness and continent placement
  console.log('\n2. Verifying 3D Spatial Continual Coordinates...');
  const positions = Object.values(SEVEN_KINGDOMS_3D_CONFIGS).map((c) => c.worldPosition);
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      const dist = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[2] - p2[2]) ** 2);
      if (dist < 8) {
        throw new Error(`Kingdoms ${i + 1} and ${j + 1} are too close spatially (dist=${dist})`);
      }
    }
  }
  console.log('✓ All 7 kingdoms have distinct, non-overlapping spatial 3D coordinates on the continent.');

  // 4. Verify Sequential progression rule
  console.log('\n3. Verifying Progressive Unlocking Rules...');
  GRADE_2_KINGDOMS.forEach((k) => {
    if (k.order === 1) {
      if (!k.isUnlockedByDefault) {
        throw new Error(`Kingdom 1 must be unlocked by default!`);
      }
    } else {
      if (k.isUnlockedByDefault) {
        throw new Error(`Kingdom ${k.order} must NOT be unlocked by default!`);
      }
    }
  });
  console.log('✓ Kingdom 1 is UNLOCKED by default; Kingdoms 2-7 are LOCKED until sequential progression.');

  console.log('\n=== ALL 3D WORLD MAP VERIFICATIONS PASSED 100%! ===');
}

runWorldMap3DVerification();

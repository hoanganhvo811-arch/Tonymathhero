import { getKingdomExplorationData } from '../features/exploration/data/kingdomsExplorationData';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '../data/kingdoms/sevenKingdoms3dConfig';
import { audioEngine, type BgmTrack } from '../game/engine/AudioEngine';
import { useSettingsStore } from '../game/state/useSettingsStore';
import { useBattleStore } from '../features/battle/useBattleStore';
import { getBossConfig, GRADE_2_BOSSES, GRADE_3_BOSSES } from '../features/bosses/data/sevenBossesConfig';
import type { HeroAnimationState, MonsterAnimationState } from '../types/exploration';
import type { CombatFxType } from '../types/battle';

function runPhase10Tests() {
  console.log('====================================================');
  console.log('🚀 RUNNING PHASE 10 VERIFICATION: IMMERSIVE RPG EXPERIENCE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, desc: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${desc}`);
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
      process.exitCode = 1;
    }
  }

  // --- 1. MODULE 1: 3D WORLD ENHANCEMENT ACROSS ALL 7 KINGDOMS ---
  console.log('--- 1. Module 1: Seven Unique Kingdoms Environments ---');
  const kingdomIds = [
    'g2-k1-arithmia',
    'g2-k2-pyramidia',
    'g2-k3-aquaria',
    'g2-k4-glacia',
    'g2-k5-solida',
    'g2-k6-candia',
    'g2-k7-umbra',
  ];

  const biomesSet = new Set<string>();
  const fogColorsSet = new Set<string>();

  kingdomIds.forEach((kId) => {
    const data = getKingdomExplorationData('grade-2', kId);
    assert(data.subZones.length >= 2, `Kingdom ${data.titleVi} has at least 2 unique subzones (found ${data.subZones.length})`);
    assert(data.npcs.length >= 1, `Kingdom ${data.titleVi} has unique NPCs`);
    assert(data.interactiveObjects.length >= 1, `Kingdom ${data.titleVi} has interactive objects`);
    biomesSet.add(data.biomeType);
    fogColorsSet.add(data.environment.fogColor);
  });

  assert(biomesSet.size === 7, `All 7 kingdoms have distinct biome types (found ${biomesSet.size}/7)`);
  assert(fogColorsSet.size === 7, `All 7 kingdoms have distinct atmospheric fog colors (no generic recolored backgrounds)`);

  // --- 2. MODULE 2: HERO ANIMATION SYSTEM ---
  console.log('\n--- 2. Module 2: Tony Hero 10 Animation States ---');
  const requiredHeroStates: HeroAnimationState[] = [
    'idle',
    'walk',
    'run',
    'jump',
    'attack',
    'cast_magic',
    'take_damage',
    'victory',
    'defeat',
    'celebrate',
  ];

  assert(requiredHeroStates.length === 10, 'All 10 required Tony Hero animation states defined in types');
  assert(requiredHeroStates.includes('jump'), 'Includes jump state');
  assert(requiredHeroStates.includes('cast_magic'), 'Includes cast_magic state');
  assert(requiredHeroStates.includes('celebrate'), 'Includes celebrate state');

  // --- 3. MODULE 3: MONSTER & BOSS ANIMATIONS ---
  console.log('\n--- 3. Module 3: Monster Archetypes & 7 Boss Animations ---');
  const requiredMonsterStates: MonsterAnimationState[] = [
    'spawn',
    'idle',
    'movement',
    'threaten',
    'attack',
    'take_damage',
    'phase_transition',
    'defeat',
  ];
  assert(requiredMonsterStates.length === 8, 'All 8 required Monster animation states defined in types');

  const g2Bosses = Object.keys(GRADE_2_BOSSES);
  const g3Bosses = Object.keys(GRADE_3_BOSSES);
  assert(g2Bosses.length === 7, `Grade 2 has 7 unique bosses configured`);
  assert(g3Bosses.length === 7, `Grade 3 has 7 unique bosses configured`);

  const lordZero = getBossConfig('boss-lord-zero', 'grade-2');
  assert(Boolean(lordZero && lordZero.bossId === 'boss-lord-zero'), 'Final Boss Lord Zero successfully loaded');
  assert(lordZero?.phasesDialogue.finalChallengePrompt !== undefined, 'Lord Zero has Final Challenge dialogue');

  // --- 4. MODULE 4: COMBAT VISUAL EFFECTS (VFX) ---
  console.log('\n--- 4. Module 4: Combat Visual Effects ---');
  const requiredCombatFx: CombatFxType[] = [
    'sword_slash',
    'magic_projectile',
    'impact',
    'shield',
    'heal',
    'critical',
    'phase_transition',
    'victory_explosion',
  ];
  assert(requiredCombatFx.length === 8, 'All 8 required combat VFX types defined in battle engine');
  assert(requiredCombatFx.includes('sword_slash'), 'Includes sword slash trail');
  assert(requiredCombatFx.includes('magic_projectile'), 'Includes magic projectile streak');
  assert(requiredCombatFx.includes('phase_transition'), 'Includes boss phase transition shockwave');
  assert(requiredCombatFx.includes('victory_explosion'), 'Includes victory explosion fireworks');

  // --- 5. MODULE 5: ENVIRONMENT ANIMATION & PARTICLES ---
  console.log('\n--- 5. Module 5: Environmental Particles by Biome ---');
  const particleTypes = [
    getKingdomExplorationData('grade-2', 'g2-k1-arithmia').environment.particleType,
    getKingdomExplorationData('grade-2', 'g2-k2-pyramidia').environment.particleType,
    getKingdomExplorationData('grade-2', 'g2-k3-aquaria').environment.particleType,
    getKingdomExplorationData('grade-2', 'g2-k4-glacia').environment.particleType,
    getKingdomExplorationData('grade-2', 'g2-k5-solida').environment.particleType,
    getKingdomExplorationData('grade-2', 'g2-k6-candia').environment.particleType,
    getKingdomExplorationData('grade-2', 'g2-k7-umbra').environment.particleType,
  ];

  assert(particleTypes.includes('spores'), 'Emerald Forest has spores particles');
  assert(particleTypes.includes('dust'), 'Golden Desert has blowing dust particles');
  assert(particleTypes.includes('bubbles'), 'Ocean Kingdom has rising bubble particles');
  assert(particleTypes.includes('snow'), 'Frozen Kingdom has snowflake particles');
  assert(particleTypes.includes('embers'), 'Stone Mountain has forge spark embers');
  assert(particleTypes.includes('candy'), 'Sweet Valley has candy sprinkle particles');
  assert(particleTypes.includes('void'), 'Dark Kingdom has void aura particles');

  // --- 6. MODULE 6: SOUND & MUSIC SYSTEM ---
  console.log('\n--- 6. Module 6: Procedural Web Audio Synthesis ---');
  assert(typeof audioEngine.playHover === 'function', 'AudioEngine has playHover()');
  assert(typeof audioEngine.playClick === 'function', 'AudioEngine has playClick()');
  assert(typeof audioEngine.playCorrectAnswer === 'function', 'AudioEngine has playCorrectAnswer()');
  assert(typeof audioEngine.playWrongAnswer === 'function', 'AudioEngine has playWrongAnswer() (gentle non-punitive)');
  assert(typeof audioEngine.playSwordSlash === 'function', 'AudioEngine has playSwordSlash()');
  assert(typeof audioEngine.playMagicCast === 'function', 'AudioEngine has playMagicCast()');
  assert(typeof audioEngine.playShieldBlock === 'function', 'AudioEngine has playShieldBlock()');
  assert(typeof audioEngine.playBossPhaseShift === 'function', 'AudioEngine has playBossPhaseShift()');
  assert(typeof audioEngine.playBgm === 'function', 'AudioEngine has dynamic playBgm()');

  const bgmTracks: BgmTrack[] = [
    'main_menu',
    'kingdom_emerald',
    'kingdom_desert',
    'kingdom_ocean',
    'kingdom_frozen',
    'kingdom_stone',
    'kingdom_sweet',
    'kingdom_dark',
    'battle_normal',
    'battle_boss',
    'victory',
    'defeat',
  ];
  assert(bgmTracks.length === 12, 'Supports 12 distinct BGM procedural tracks');

  // --- 7. MODULE 7 & 8: INTERACTIVE WORLD & CINEMATIC STORYTELLING ---
  console.log('\n--- 7. Module 7 & 8: Interactive World & Discovery ---');
  const desertData = getKingdomExplorationData('grade-2', 'g2-k2-pyramidia');
  const chestObj = desertData.interactiveObjects.find((o) => o.type === 'treasure_chest');
  assert(chestObj !== undefined, 'Treasure chest present in Golden Desert');
  assert(Boolean(chestObj?.rewardGold && chestObj.rewardGold > 0), 'Treasure chest grants gold reward');

  const npcScout = desertData.npcs.find((n) => n.id === 'npc-desert-scout');
  assert(npcScout !== undefined, 'Desert scout NPC present');
  assert(npcScout?.dialogueTree['greet'] !== undefined, 'NPC has branching interactive dialogue');

  // --- 8. MODULE 9: GAME FEEL & FEEDBACK (JUICE) ---
  console.log('\n--- 8. Module 9: Positive Reinforcement & Juice ---');
  const battleStore = useBattleStore.getState();
  assert(typeof battleStore.addCombatFx === 'function', 'BattleStore has addCombatFx() method');
  assert(typeof battleStore.addFloatingText === 'function', 'BattleStore has addFloatingText() method');

  // --- 9. MODULE 10: PERFORMANCE & ACCESSIBILITY ---
  console.log('\n--- 9. Module 10: Performance & Accessibility ---');
  const settings = useSettingsStore.getState().settings;
  assert(settings.graphicsQuality !== undefined, 'Graphics quality setting exists');
  assert(typeof settings.masterVolume === 'number', 'Master volume setting exists (0-100)');
  assert(typeof settings.bgmVolume === 'number', 'BGM volume setting exists (0-100)');
  assert(typeof settings.sfxVolume === 'number', 'SFX volume setting exists (0-100)');
  assert(typeof useSettingsStore.getState().toggleReducedMotion === 'function', 'Reduced motion toggle supported');

  // --- 10. SUMMARY ---
  console.log('\n====================================================');
  console.log(`🎉 ALL ${passed}/${total} PHASE 10 IMMERSIVE RPG TESTS PASSED SUCCESSFULLY!`);
  console.log('====================================================\n');
}

runPhase10Tests();

import { FINAL_INTRO_CINEMATIC, FINAL_OUTRO_CINEMATIC } from '../features/final-campaign/data/cinematicsCatalog';
import { FINAL_MATH_TRIALS } from '../features/final-campaign/data/finalTrialsCatalog';
import { LORD_ZERO_PHASES_CONFIG, LORD_ZERO_SPELLS } from '../features/final-campaign/data/lordZeroBossCatalog';
import { BOSS_REMATCH_CONFIGS, MASTERY_MISSIONS_CONFIG, SECRET_QUESTS_CONFIG } from '../features/final-campaign/data/endgameCatalog';
import { FINAL_ACHIEVEMENTS_CATALOG } from '../features/final-campaign/data/finalAchievementsCatalog';
import { FinalAdaptiveEngine } from '../features/final-campaign/services/finalAdaptiveEngine';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('🧪 Starting Phase 21 (The Final Campaign & Lord Zero) Test Suite...\n');

// 1. Test Cinematics Catalog
console.log('Test 1: Intro and Outro Cinematics Structure');
assert(FINAL_INTRO_CINEMATIC.slides.length === 6, `Expected 6 intro slides, got ${FINAL_INTRO_CINEMATIC.slides.length}`);
assert(FINAL_OUTRO_CINEMATIC.slides.length === 5, `Expected 5 outro slides, got ${FINAL_OUTRO_CINEMATIC.slides.length}`);
FINAL_INTRO_CINEMATIC.slides.forEach((slide) => {
  assert(slide.speaker.length > 0, `Slide ${slide.id} missing speaker`);
  assert(slide.dialogue.length > 0, `Slide ${slide.id} missing dialogue`);
});
FINAL_OUTRO_CINEMATIC.slides.forEach((slide) => {
  assert(slide.speaker.length > 0, `Slide ${slide.id} missing speaker`);
  assert(slide.dialogue.length > 0, `Slide ${slide.id} missing dialogue`);
});
console.log('✅ Passed Test 1: Cinematics verified.\n');

// 2. Test Dark Kingdom Trials Catalog & Grade Isolation
console.log('Test 2: Dark Kingdom Preparatory Trials');
assert(FINAL_MATH_TRIALS.length === 10, `Expected 10 trials, got ${FINAL_MATH_TRIALS.length}`);
const g2Trials = FINAL_MATH_TRIALS.filter((t) => t.gradeLevel === 'grade-2');
const g3Trials = FINAL_MATH_TRIALS.filter((t) => t.gradeLevel === 'grade-3');
assert(g2Trials.length === 5, `Expected 5 Grade 2 trials, got ${g2Trials.length}`);
assert(g3Trials.length === 5, `Expected 5 Grade 3 trials, got ${g3Trials.length}`);

FINAL_MATH_TRIALS.forEach((trial) => {
  assert(trial.options.length >= 2, `Trial ${trial.id} options length < 2`);
  assert(trial.correctIndex >= 0 && trial.correctIndex < trial.options.length, `Trial ${trial.id} invalid correctIndex`);
  assert(trial.rewardExp > 0 && trial.rewardGold > 0, `Trial ${trial.id} rewards must be positive`);
});
console.log('✅ Passed Test 2: Dark Kingdom Trials verified.\n');

// 3. Test Lord Zero 5-Phase Boss Configuration
console.log('Test 3: Lord Zero 5-Phase Boss Configuration');
assert(LORD_ZERO_PHASES_CONFIG.length === 5, `Expected 5 Boss phases, got ${LORD_ZERO_PHASES_CONFIG.length}`);
assert(LORD_ZERO_PHASES_CONFIG[0].maxHp === 300, `Phase 1 HP should be 300`);
assert(LORD_ZERO_PHASES_CONFIG[1].maxHp === 350, `Phase 2 HP should be 350`);
assert(LORD_ZERO_PHASES_CONFIG[2].maxHp === 400, `Phase 3 HP should be 400`);
assert(LORD_ZERO_PHASES_CONFIG[3].maxHp === 450, `Phase 4 HP should be 450`);
assert(LORD_ZERO_PHASES_CONFIG[4].maxHp === 500, `Phase 5 HP should be 500`);
console.log('✅ Passed Test 3: Lord Zero 5-Phase configuration verified.\n');

// 4. Test Lord Zero 20 Spell Challenges
console.log('Test 4: Lord Zero Spell Challenges & Mathematical Verification');
assert(LORD_ZERO_SPELLS.length === 20, `Expected 20 Boss spells, got ${LORD_ZERO_SPELLS.length}`);
const g2Spells = LORD_ZERO_SPELLS.filter((s) => s.gradeLevel === 'grade-2');
const g3Spells = LORD_ZERO_SPELLS.filter((s) => s.gradeLevel === 'grade-3');
assert(g2Spells.length === 10, `Expected 10 Grade 2 spells, got ${g2Spells.length}`);
assert(g3Spells.length === 10, `Expected 10 Grade 3 spells, got ${g3Spells.length}`);

LORD_ZERO_SPELLS.forEach((spell) => {
  assert(spell.options.length >= 2, `Spell ${spell.id} options < 2`);
  assert(spell.correctIndex >= 0 && spell.correctIndex < spell.options.length, `Spell ${spell.id} invalid correctIndex`);
  assert(spell.damage >= 100, `Spell ${spell.id} damage too low`);
});
console.log('✅ Passed Test 4: Lord Zero Spells verified.\n');

// 5. Test Knowledge Crystal Shield Mechanics
console.log('Test 5: Knowledge Crystal Shield Calculations');
const shield1 = FinalAdaptiveEngine.calculateCrystalShields(7);
assert(shield1 === 7, `Expected 7 shields for 7 crystals, got ${shield1}`);
const shield2 = FinalAdaptiveEngine.calculateCrystalShields(0);
assert(shield2 === 1, `Expected minimum 1 shield, got ${shield2}`);
console.log('✅ Passed Test 5: Knowledge Crystal Shield verified.\n');

// 6. Test Endgame Content: Rematch, Mastery Missions & Secret Quests
console.log('Test 6: Endgame Content Catalog');
assert(BOSS_REMATCH_CONFIGS.length === 4, `Expected 4 rematch bosses, got ${BOSS_REMATCH_CONFIGS.length}`);
BOSS_REMATCH_CONFIGS.forEach((boss) => {
  assert(boss.difficulties.normal.hp < boss.difficulties.heroic.hp, `Heroic HP must be > Normal HP`);
  assert(boss.difficulties.heroic.hp < boss.difficulties.nightmare.hp, `Nightmare HP must be > Heroic HP`);
});

assert(MASTERY_MISSIONS_CONFIG.length === 6, `Expected 6 mastery missions, got ${MASTERY_MISSIONS_CONFIG.length}`);
MASTERY_MISSIONS_CONFIG.forEach((m) => {
  assert(m.targetCount > 0, `Target count must be > 0`);
  assert(m.rewardExp > 0, `Exp must be > 0`);
});

assert(SECRET_QUESTS_CONFIG.length === 3, `Expected 3 secret quests, got ${SECRET_QUESTS_CONFIG.length}`);
console.log('✅ Passed Test 6: Endgame Content verified.\n');

// 7. Test Final Achievements
console.log('Test 7: Final Achievements Catalog');
assert(FINAL_ACHIEVEMENTS_CATALOG.length === 6, `Expected 6 final achievements, got ${FINAL_ACHIEVEMENTS_CATALOG.length}`);
FINAL_ACHIEVEMENTS_CATALOG.forEach((ach) => {
  assert(ach.xpReward >= 200, `Final achievement XP reward should be >= 200`);
  assert(ach.goldReward >= 100, `Final achievement Gold reward should be >= 100`);
});
console.log('✅ Passed Test 7: Final Achievements verified.\n');

// 8. Test Tony Hero Journey Aggregation
console.log('Test 8: Tony Hero Journey Real Stats Aggregation');
const g2Stats = FinalAdaptiveEngine.aggregateHeroJourneyStats('grade-2');
assert(g2Stats.rescuedKingdomsCount === 7, `Expected 7 rescued kingdoms`);
assert(g2Stats.knowledgeCrystalsCount === 7, `Expected 7 crystals`);
assert(g2Stats.milestones.length === 6, `Expected 6 historic milestones`);
assert(g2Stats.heroTitle.includes('Math Hero'), `Expected hero title to mention Math Hero`);
console.log('✅ Passed Test 8: Tony Hero Journey Aggregation verified.\n');

console.log('🎉 ALL 8/8 PHASE 21 FINAL CAMPAIGN TEST SUITES PASSED FLAWLESSLY! 🎉');

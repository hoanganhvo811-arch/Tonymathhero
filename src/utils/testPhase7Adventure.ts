/**
 * Comprehensive Automated Verification Suite for Phase 7:
 * The Seven Kingdoms Adventure - Story Campaign, Progression, Boss Battle & Rescue
 */
import { STORY_CHAPTERS_CONFIG, STORY_CUTSCENES, getCutsceneById } from '../features/story/data/mainStoryConfig';
import { SEVEN_KNOWLEDGE_CRYSTALS, getCrystalById } from '../features/story/data/sevenCrystalsConfig';
import { GRADE_2_BOSSES, GRADE_3_BOSSES, getBossConfig } from '../features/bosses/data/sevenBossesConfig';
import { EMERALD_FOREST_FULL_QUESTS, getQuestsForKingdom } from '../features/quests/data/sevenKingdomsQuestChains';
import { useStoryStore } from '../features/story/useStoryStore';
import { useKingdomProgressionStore } from '../features/kingdom-progression/useKingdomProgressionStore';
import { useBattleStore } from '../features/battle/useBattleStore';
import { useProgressStore } from '../game/state/useProgressStore';
import { createDefaultPlayer, createDefaultProgress } from '../services/persistence/persistenceService';
import type { CampaignId } from '../types/campaign';

export async function runPhase7AdventureVerification() {
  console.log('===============================================================');
  console.log('🚀 RUNNING PHASE 7: THE SEVEN KINGDOMS ADVENTURE TEST SUITE');
  console.log('===============================================================\n');

  // Initialize test state with clean progress
  const testPlayer = createDefaultPlayer();
  const g2Progress = createDefaultProgress(testPlayer.id, 'grade-2');
  const g3Progress = createDefaultProgress(testPlayer.id, 'grade-3');

  useProgressStore.setState({
    currentProgress: g2Progress,
    grade2Progress: g2Progress,
    grade3Progress: g3Progress,
  });

  // --- TEST 1: Main Story Chapters & Cutscenes ---
  console.log('--- TEST 1: Main Story Chapters & Cutscenes ---');
  if (STORY_CHAPTERS_CONFIG.length !== 9) {
    throw new Error(`Expected 9 story chapters (Prologue + 7 Chapters + Epilogue), found ${STORY_CHAPTERS_CONFIG.length}`);
  }
  console.log(`  ✓ 9 Story Chapters verified (Prologue to Epilogue)`);

  const introCutscene = getCutsceneById('cutscene-intro-prologue');
  if (!introCutscene || introCutscene.slides.length < 3) {
    throw new Error('Intro cutscene invalid or missing slides');
  }
  console.log(`  ✓ Intro Cutscene [${introCutscene.title}] has ${introCutscene.slides.length} cinematic slides`);

  // Test cutscene controls
  const storyStore = useStoryStore.getState();
  storyStore.playCutscene('cutscene-intro-prologue', true);
  if (!useStoryStore.getState().activeCutscene) {
    throw new Error('Failed to play cutscene');
  }
  console.log('  ✓ Cutscene playback started');

  useStoryStore.getState().nextSlide();
  if (useStoryStore.getState().activeSlideIndex !== 1) {
    throw new Error('nextSlide failed to advance index');
  }
  console.log('  ✓ nextSlide advanced slide index to 1');

  useStoryStore.getState().skipCutscene();
  if (useStoryStore.getState().activeCutscene !== null) {
    throw new Error('skipCutscene failed to dismiss cutscene');
  }
  console.log('  ✓ skipCutscene dismissed active cutscene smoothly');

  // --- TEST 2: Seven Knowledge Crystals Data & One-Time Claim ---
  console.log('\n--- TEST 2: Seven Knowledge Crystals Data & Collection ---');
  if (SEVEN_KNOWLEDGE_CRYSTALS.length !== 7) {
    throw new Error(`Expected 7 Knowledge Crystals, found ${SEVEN_KNOWLEDGE_CRYSTALS.length}`);
  }
  SEVEN_KNOWLEDGE_CRYSTALS.forEach((c) => {
    console.log(`  ✓ Crystal #${c.order}: [${c.vietnameseName}] (${c.element}) - ${c.powerGranted.slice(0, 30)}...`);
  });

  // --- TEST 3: Kingdom Progression & Unlock Mechanics ---
  console.log('\n--- TEST 3: Kingdom Progression & Unlock Conditions ---');
  const progStore = useKingdomProgressionStore.getState();
  progStore.initProgression('grade-2');

  const k1Status = progStore.getKingdomStatus('g2-k1-arithmia');
  if (k1Status !== 'IN_PROGRESS' && k1Status !== 'RESTORED') {
    throw new Error(`Kingdom 1 should be accessible, found status: ${k1Status}`);
  }
  console.log(`  ✓ Emerald Forest initially accessible: Status [${k1Status}]`);

  const k2Status = progStore.getKingdomStatus('g2-k2-chronos');
  if (k2Status !== 'LOCKED') {
    throw new Error(`Kingdom 2 should be LOCKED initially, found status: ${k2Status}`);
  }
  console.log(`  ✓ Golden Desert initially LOCKED: Status [${k2Status}]`);

  // Dark Kingdom entry condition test (requires 6 crystals)
  const darkEntryCheck = progStore.canEnterKingdom('g2-k7-apex');
  if (darkEntryCheck.allowed) {
    throw new Error('Dark Kingdom should be locked when player has fewer than 6 crystals');
  }
  console.log(`  ✓ Dark Kingdom strictly locked: "${darkEntryCheck.reason}"`);

  // --- TEST 4: Quest Chains Sequence (Emerald Forest) ---
  console.log('\n--- TEST 4: Emerald Forest Full Quest Chain ---');
  const efQuests = getQuestsForKingdom('g2-k1-arithmia', 'grade-2');
  if (efQuests.length !== 5) {
    throw new Error(`Expected 5 full quest modules for Emerald Forest, found ${efQuests.length}`);
  }
  console.log(`  ✓ Quest 1: ${efQuests[0].title} (Status: ${efQuests[0].status})`);
  console.log(`  ✓ Quest 2: ${efQuests[1].title} (Prereq: ${efQuests[1].prerequisiteQuestId})`);
  console.log(`  ✓ Quest 3: ${efQuests[2].title} (Prereq: ${efQuests[2].prerequisiteQuestId})`);
  console.log(`  ✓ Quest 4: ${efQuests[3].title} (Prereq: ${efQuests[3].prerequisiteQuestId})`);
  console.log(`  ✓ Quest 5 (Boss Quest): ${efQuests[4].title} (Prereq: ${efQuests[4].prerequisiteQuestId})`);

  // --- TEST 5: Seven Bosses Configuration & Dual Grades ---
  console.log('\n--- TEST 5: Seven Bosses Configuration (Grade 2 vs Grade 3) ---');
  const g2BossKeys = Object.keys(GRADE_2_BOSSES);
  const g3BossKeys = Object.keys(GRADE_3_BOSSES);
  if (g2BossKeys.length !== 7 || g3BossKeys.length !== 7) {
    throw new Error(`Expected 7 bosses per grade, found G2: ${g2BossKeys.length}, G3: ${g3BossKeys.length}`);
  }
  console.log(`  ✓ All 7 Bosses configured for Grade 2: ${g2BossKeys.join(', ')}`);
  console.log(`  ✓ All 7 Bosses configured for Grade 3: ${g3BossKeys.join(', ')}`);

  const emeraldBossG2 = getBossConfig('boss-emerald-guardian', 'grade-2');
  const emeraldBossG3 = getBossConfig('boss-emerald-guardian', 'grade-3');
  if (!emeraldBossG2 || !emeraldBossG3) {
    throw new Error('Failed to load emerald guardian boss');
  }
  if (emeraldBossG3.maxHp <= emeraldBossG2.maxHp) {
    throw new Error('Grade 3 boss should scale up in HP and power');
  }
  console.log(`  ✓ Grade 2 Boss HP (${emeraldBossG2.maxHp}) vs Grade 3 Boss HP (${emeraldBossG3.maxHp}) scaled properly`);

  // --- TEST 6: Boss Battle State Machine & 3 Phases ---
  console.log('\n--- TEST 6: Boss Battle 3-Phase Mechanics ---');
  const battleStore = useBattleStore.getState();
  battleStore.initBattle('boss-emerald-guardian', 'grade-2');

  const bState = useBattleStore.getState();
  if (!bState.isBossBattle || !bState.bossData) {
    throw new Error('Battle store failed to initialize boss mode');
  }
  if (bState.bossPhase !== 'normal') {
    throw new Error(`Expected initial bossPhase to be 'normal', found ${bState.bossPhase}`);
  }
  console.log(`  ✓ Boss Battle initialized: [${bState.monster.name}], Phase 1: [NORMAL], HP: ${bState.monsterHp}/${bState.monsterMaxHp}`);

  // Simulate damage down to 45% (should trigger Phase 2: Enraged)
  useBattleStore.setState({ monsterHp: Math.round(bState.monsterMaxHp * 0.45) });
  // Submit correct answer to trigger phase transition checks
  const q = useBattleStore.getState().currentQuestion;
  if (q) {
    useBattleStore.getState().submitAnswer(q.correctOptionIndex);
  }

  const enragedState = useBattleStore.getState();
  if (enragedState.bossPhase !== 'enraged') {
    throw new Error(`Expected bossPhase to be 'enraged' at 45% HP, found ${enragedState.bossPhase}`);
  }
  console.log('  ✓ Phase 2 [ENRAGED] triggered accurately when HP dropped <= 50%');

  // Simulate damage down to 15% (should trigger Phase 3: Final Challenge)
  useBattleStore.setState({ monsterHp: Math.round(bState.monsterMaxHp * 0.15) });
  const q2 = useBattleStore.getState().currentQuestion;
  if (q2) {
    useBattleStore.getState().submitAnswer(q2.correctOptionIndex);
  }

  const finalState = useBattleStore.getState();
  if (finalState.bossPhase !== 'final_challenge') {
    throw new Error(`Expected bossPhase to be 'final_challenge' at 15% HP, found ${finalState.bossPhase}`);
  }
  console.log('  ✓ Phase 3 [FINAL CHALLENGE] triggered accurately when HP dropped <= 20%');

  // Simulate combo streak finish
  useBattleStore.setState({ comboStreak: 2 });
  const q3 = useBattleStore.getState().currentQuestion;
  if (q3) {
    useBattleStore.getState().submitAnswer(q3.correctOptionIndex);
  }

  const victoryState = useBattleStore.getState();
  if (victoryState.phase !== 'victory') {
    throw new Error(`Expected battle phase to be 'victory' after completing final challenge, found ${victoryState.phase}`);
  }
  console.log('  ✓ Hero Finishing Strike executed successfully! Boss defeated!');

  // --- TEST 7: Crystal Claim & Kingdom Restoration ---
  console.log('\n--- TEST 7: Knowledge Crystal Claim & Kingdom Restoration ---');
  const claimResult = await useKingdomProgressionStore.getState().claimKnowledgeCrystal('g2-k1-arithmia', 'crystal-emerald');
  if (!claimResult.success) {
    throw new Error(`Failed to claim emerald crystal: ${claimResult.message}`);
  }
  console.log(`  ✓ ${claimResult.message}`);

  const restoredStatus = useKingdomProgressionStore.getState().getKingdomStatus('g2-k1-arithmia');
  if (restoredStatus !== 'RESTORED') {
    throw new Error(`Expected kingdom status to be RESTORED, found ${restoredStatus}`);
  }
  console.log(`  ✓ Emerald Forest status transitioned to: [${restoredStatus}]`);

  // Check next kingdom unlocked
  const nextStatus = useKingdomProgressionStore.getState().getKingdomStatus('g2-k2-chronos');
  if (nextStatus !== 'IN_PROGRESS') {
    throw new Error(`Expected Golden Desert to be unlocked to IN_PROGRESS, found ${nextStatus}`);
  }
  console.log(`  ✓ Golden Desert automatically UNLOCKED: Status [${nextStatus}]`);

  // Duplicate claim protection
  const duplicateClaim = await useKingdomProgressionStore.getState().claimKnowledgeCrystal('g2-k1-arithmia', 'crystal-emerald');
  if (duplicateClaim.success) {
    throw new Error('Duplicate claim should have been rejected');
  }
  console.log(`  ✓ Duplicate crystal claim rejected: "${duplicateClaim.message}"`);

  // --- TEST 8: Final Boss Lord Zero & Campaign Ending ---
  console.log('\n--- TEST 8: Final Boss Lord Zero & Campaign Ending ---');
  battleStore.initBattle('boss-lord-zero', 'grade-2');
  const zeroState = useBattleStore.getState();
  if (!zeroState.isBossBattle || zeroState.monster.id !== 'boss-lord-zero') {
    throw new Error('Failed to initialize Lord Zero battle');
  }
  console.log(`  ✓ Final Boss initialized: [${zeroState.monster.name}], HP: ${zeroState.monsterHp}`);

  // Simulate defeating Lord Zero
  useBattleStore.setState({ monsterHp: 10, bossPhase: 'final_challenge', comboStreak: 2 });
  const zeroQuestion = useBattleStore.getState().currentQuestion;
  if (zeroQuestion) {
    useBattleStore.getState().submitAnswer(zeroQuestion.correctOptionIndex);
  }

  const endingSummary = useStoryStore.getState().endingSummary;
  if (!endingSummary) {
    throw new Error('CampaignEndingSummary was not generated on Lord Zero defeat');
  }
  if (endingSummary.rescuedKingdomsCount !== 7 || endingSummary.totalKingdomsCount !== 7) {
    throw new Error(`Incorrect ending summary kingdom count: ${endingSummary.rescuedKingdomsCount}/7`);
  }
  console.log(`  ✓ Campaign Ending Summary generated: [${endingSummary.heroTitleAwarded}]`);
  console.log(`  ✓ Kingdoms Rescued: ${endingSummary.rescuedKingdomsCount}/${endingSummary.totalKingdomsCount}`);
  console.log(`  ✓ Bosses Defeated: ${endingSummary.defeatedBossesCount}/${endingSummary.totalBossesCount}`);
  console.log(`  ✓ Overall Accuracy: ${endingSummary.accuracyPercentage}%`);

  // --- TEST 9: Dual Campaign Data Isolation ---
  console.log('\n--- TEST 9: Grade 2 & Grade 3 Strict Data Isolation ---');
  const g2Rescued = useProgressStore.getState().grade2Progress?.rescuedKingdomIds || [];
  const g3Rescued = useProgressStore.getState().grade3Progress?.rescuedKingdomIds || [];
  if (g3Rescued.length !== 0) {
    throw new Error('Grade 2 progress mutated Grade 3 data!');
  }
  console.log(`  ✓ Grade 2 has ${g2Rescued.length} rescued kingdoms; Grade 3 has ${g3Rescued.length} rescued kingdoms (0% cross-contamination).`);

  console.log('\n===============================================================');
  console.log('✅ ALL PHASE 7 THE SEVEN KINGDOMS ADVENTURE TESTS PASSED 100%!');
  console.log('===============================================================\n');
  return true;
}

if (typeof window === 'undefined') {
  runPhase7AdventureVerification().catch((err) => {
    console.error('❌ PHASE 7 VERIFICATION FAILED:', err);
    process.exit(1);
  });
}

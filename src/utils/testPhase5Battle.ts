import { generateQuestion, getTopicsForGrade } from '../features/math-engine/questionGenerator';
import { MathEngineService } from '../features/math-engine/mathEngineService';
import { useBattleStore } from '../features/battle/useBattleStore';
import { EMERALD_FOREST_BATTLE_MONSTERS } from '../features/battle/data/emeraldMonsters';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    throw new Error(msg);
  } else {
    console.log(`  ✓ ${msg}`);
  }
}

async function runPhase5BattleTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING PHASE 5 MATH BATTLE SYSTEM VERIFICATION');
  console.log('====================================================');

  // TEST 1: Grade 2 Question Generation & Curriculum Integrity
  console.log('\n--- TEST 1: Grade 2 Math Question Generation ---');
  const g2Topics = getTopicsForGrade('grade-2');
  assert(g2Topics.length >= 6, `Grade 2 has at least 6 curriculum topics (found ${g2Topics.length})`);

  for (let i = 0; i < 20; i++) {
    const q = generateQuestion({ grade: 'grade-2' });
    assert(String(q.grade).includes('2'), `Question ${i + 1} has grade='grade-2'`);
    assert(q.options.length === 4, `Question has 4 multiple choice options`);
    // Check no duplicate options
    const uniqueOpts = new Set(q.options);
    assert(uniqueOpts.size === 4, `Question has 4 UNIQUE options with no duplicates: [${q.options.join(', ')}]`);
    assert(q.correctOptionIndex >= 0 && q.correctOptionIndex < 4, `Correct option index is valid (0-3)`);
    assert(q.hint.length > 5, `Question provides companion hint`);
    assert(q.explanation.length > 10, `Question provides pedagogical explanation`);
  }

  // TEST 2: Grade 3 Question Generation & Curriculum Integrity
  console.log('\n--- TEST 2: Grade 3 Math Question Generation ---');
  const g3Topics = getTopicsForGrade('grade-3');
  assert(g3Topics.length >= 4, `Grade 3 has at least 4 curriculum topics (found ${g3Topics.length})`);

  for (let i = 0; i < 20; i++) {
    const q = generateQuestion({ grade: 'grade-3' });
    assert(String(q.grade).includes('3'), `Question ${i + 1} has grade='grade-3'`);
    assert(q.options.length === 4, `Question has 4 multiple choice options`);
    const uniqueOpts = new Set(q.options);
    assert(uniqueOpts.size === 4, `Question has 4 UNIQUE options with no duplicates: [${q.options.join(', ')}]`);
    assert(q.correctOptionIndex >= 0 && q.correctOptionIndex < 4, `Correct option index is valid`);
    assert(q.hint.length > 5, `Question provides companion hint`);
    assert(q.explanation.length > 10, `Question provides pedagogical explanation`);
  }

  // TEST 3: Math Evaluation & Pedagogical Guidance
  console.log('\n--- TEST 3: Math Engine Evaluation & Pedagogical Feedback ---');
  const sampleQ = generateQuestion({ grade: 'grade-2' });
  const correctEval = MathEngineService.evaluateAnswer(sampleQ, sampleQ.correctOptionIndex);
  assert(correctEval.isCorrect === true, `Correct answer evaluated as TRUE`);
  assert(correctEval.expBonus > 0, `Correct answer awards EXP bonus`);

  const wrongIndex = (sampleQ.correctOptionIndex + 1) % 4;
  const wrongEval = MathEngineService.evaluateAnswer(sampleQ, wrongIndex);
  assert(wrongEval.isCorrect === false, `Incorrect answer evaluated as FALSE`);
  assert(wrongEval.explanation.length > 10, `Pedagogical explanation returned on mistake`);

  // TEST 4: Emerald Forest Battle Monsters Configuration
  console.log('\n--- TEST 4: Emerald Forest Battle Monsters ---');
  const slime = EMERALD_FOREST_BATTLE_MONSTERS.slime;
  const goblin = EMERALD_FOREST_BATTLE_MONSTERS.goblin;
  const wolf = EMERALD_FOREST_BATTLE_MONSTERS.wolf;
  const golem = EMERALD_FOREST_BATTLE_MONSTERS.golem_guard;

  assert(!!slime && slime.maxHp === 90 && slime.level === 1, 'Slime monster correctly configured');
  assert(!!goblin && goblin.maxHp === 160 && goblin.level === 2, 'Goblin monster correctly configured');
  assert(!!wolf && wolf.maxHp === 220 && wolf.level === 3, 'Wolf monster correctly configured');
  assert(!!golem && golem.maxHp === 320 && golem.level === 4, 'Golem Guard Boss correctly configured');

  // TEST 5: Battle State Machine & Turn Logic
  console.log('\n--- TEST 5: Battle State Machine Flow ---');
  const battleStore = useBattleStore.getState();
  battleStore.initBattle('slime', 'grade-2');

  const s1 = useBattleStore.getState();
  assert(s1.monster.id === 'slime', 'Battle initialized with Forest Slime');
  assert(s1.playerHp > 0, 'Player HP initialized');
  assert(s1.monsterHp === 90, 'Monster HP at max');
  assert(s1.comboStreak === 0, 'Combo streak begins at 0');
  assert(s1.currentQuestion !== null, 'Initial math question drawn automatically');

  // Skill selection checks
  const powerAllowedWithoutCombo = battleStore.selectSkill('power');
  assert(powerAllowedWithoutCombo === false, 'Power Attack locked when Combo streak < 2');

  // Test Answer Execution: First answer CORRECT
  const activeQ = useBattleStore.getState().currentQuestion!;
  const initialMonsterHp = useBattleStore.getState().monsterHp;
  battleStore.submitAnswer(activeQ.correctOptionIndex);

  const s2 = useBattleStore.getState();
  assert(s2.comboStreak === 1, 'Combo streak increased to 1 on correct answer');
  assert(s2.monsterHp < initialMonsterHp, `Monster took damage (${initialMonsterHp} -> ${s2.monsterHp})`);
  assert(s2.consecutiveMistakes === 0, 'Consecutive mistakes reset to 0');

  // Test Pedagogical Feature: First mistake does NOT defeat player!
  console.log('\n--- TEST 6: Pedagogical Forgiveness Mechanic ---');
  // Trigger a wrong answer on next question
  const nextQ = useBattleStore.getState().currentQuestion!;
  const wrongChoice = (nextQ.correctOptionIndex + 1) % 4;
  const hpBeforeWrong = useBattleStore.getState().playerHp;

  battleStore.submitAnswer(wrongChoice);
  const s3 = useBattleStore.getState();

  assert(s3.consecutiveMistakes === 1, 'Consecutive mistakes marked as 1');
  assert(s3.isExplaining === true, 'Pedagogical step-by-step explanation modal triggered');
  assert(s3.playerHp >= hpBeforeWrong - 10, 'Player received only minor scratch/shield block, not wiped out');
  assert(s3.phase !== 'defeat', 'Player is NOT defeated on first wrong answer');

  battleStore.dismissExplanation();
  const s4 = useBattleStore.getState();
  assert(s4.isExplaining === false, 'Explanation modal dismissed');

  // TEST 7: Single-Distribution Reward Guarantee
  console.log('\n--- TEST 7: Victory & Reward Persistence ---');
  // Artificially simulate monster defeat
  useBattleStore.setState({ monsterHp: 0, phase: 'victory' });
  const reward1 = battleStore.claimRewards();
  assert(reward1.exp > 0 && reward1.gold > 0, `Rewards granted: +${reward1.exp} EXP, +${reward1.gold} Gold`);

  const reward2 = battleStore.claimRewards();
  assert(reward2.exp === 0 && reward2.gold === 0, 'Subsequent claimRewards call returns 0 (single distribution guaranteed)');

  // TEST 8: Learning Analytics Recording
  console.log('\n--- TEST 8: Learning Analytics Service ---');
  const stats = MathEngineService.getLearningStats('test_player', 'grade-2');
  assert(typeof stats.totalAnswered === 'number', 'Learning stats tracks total answers');
  assert(typeof stats.accuracyRate === 'number', 'Learning stats tracks accuracy percentage');

  console.log('\n====================================================');
  console.log('✅ ALL PHASE 5 MATH BATTLE SYSTEM TESTS PASSED 100%!');
  console.log('====================================================\n');
}

runPhase5BattleTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});

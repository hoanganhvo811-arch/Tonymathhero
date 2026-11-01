import { ARENA_QUESTIONS_CATALOG, getQuestionsByGradeAndTopic } from '../features/advanced-arena/data/arenaQuestionsCatalog';
import { MULTI_STEP_QUESTIONS_CATALOG } from '../features/advanced-arena/data/multiStepQuestionsCatalog';
import { STRATEGY_QUESTIONS_CATALOG } from '../features/advanced-arena/data/strategyQuestionsCatalog';
import { CHALLENGE_TOWER_FLOORS } from '../features/advanced-arena/data/towerCatalog';
import { MARATHON_CHECKPOINTS } from '../features/advanced-arena/data/marathonCatalog';
import { GRAND_BOSS_PHASES, GRAND_BOSS_SPELLS } from '../features/advanced-arena/data/grandBossCatalog';
import { ARENA_ACHIEVEMENTS } from '../features/advanced-arena/data/arenaAchievementsCatalog';
import { ArenaAdaptiveEngine } from '../features/advanced-arena/services/arenaAdaptiveEngine';
import type { ArenaTopicId } from '@/types/advancedArena';

console.log('================================================================');
console.log('🧪 RUNNING PHASE 19 ADVANCED MATH ARENA TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, errorDetail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (errorDetail) console.error(`     Details: ${errorDetail}`);
    failCount++;
  }
}

// 1. Arena Questions Catalog Test (36 questions, 18 G2, 18 G3 across 9 topics)
const g2Questions = ARENA_QUESTIONS_CATALOG.filter((q) => q.gradeLevel === 'grade-2');
const g3Questions = ARENA_QUESTIONS_CATALOG.filter((q) => q.gradeLevel === 'grade-3');

const all9Topics: ArenaTopicId[] = [
  'arithmetic_place_value',
  'addition_subtraction',
  'multiplication_division',
  'mental_math',
  'word_problems',
  'geometry_measurement',
  'time_calendar',
  'money_shopping',
  'fractions',
];

const g2TopicsCovered = all9Topics.every((tid) => g2Questions.some((q) => q.topicId === tid));
const g3TopicsCovered = all9Topics.every((tid) => g3Questions.some((q) => q.topicId === tid));
const questionsValid = ARENA_QUESTIONS_CATALOG.every(
  (q) =>
    q.correctIndex >= 0 &&
    q.correctIndex < q.options.length &&
    q.explanationVi.length > 0 &&
    q.hintVi.length > 0
);

assert(
  g2Questions.length === 18 &&
    g3Questions.length === 18 &&
    g2TopicsCovered &&
    g3TopicsCovered &&
    questionsValid,
  'Arena Questions Catalog has 36 questions covering all 9 kingdoms evenly (18 Grade 2, 18 Grade 3)'
);

// 2. Multi-step Questions Catalog Test (12 problems, 6 G2, 6 G3)
const g2Multi = MULTI_STEP_QUESTIONS_CATALOG.filter((q) => q.gradeLevel === 'grade-2');
const g3Multi = MULTI_STEP_QUESTIONS_CATALOG.filter((q) => q.gradeLevel === 'grade-3');
const multiStepsValid = MULTI_STEP_QUESTIONS_CATALOG.every(
  (q) =>
    q.steps &&
    q.steps.length >= 2 &&
    q.steps.every((s) => s.stepIndex > 0 && s.promptVi.length > 0 && s.expectedResult.length > 0) &&
    q.correctIndex >= 0 &&
    q.correctIndex < q.options.length
);

assert(
  g2Multi.length === 6 && g3Multi.length === 6 && multiStepsValid,
  'Multi-step Catalog has 12 verified problems with explicit sequential reasoning steps (6 G2, 6 G3)'
);

// 3. Strategy Questions Catalog Test (12 problems, 6 G2, 6 G3)
const g2Strat = STRATEGY_QUESTIONS_CATALOG.filter((q) => q.gradeLevel === 'grade-2');
const g3Strat = STRATEGY_QUESTIONS_CATALOG.filter((q) => q.gradeLevel === 'grade-3');
const stratValid = STRATEGY_QUESTIONS_CATALOG.every(
  (q) =>
    q.alternativeStrategies &&
    q.alternativeStrategies.length >= 1 &&
    q.alternativeStrategies.every((s) => s.strategyNameVi.length > 0 && s.descriptionVi.length > 0) &&
    q.correctIndex >= 0 &&
    q.correctIndex < q.options.length
);

assert(
  g2Strat.length === 6 && g3Strat.length === 6 && stratValid,
  'Strategy Catalog has 12 problems exploring alternative valid methods (e.g. Splitting, Compensation, Inverses)'
);

// 4. Challenge Tower Floors Test (6 floors)
const floorsValid = CHALLENGE_TOWER_FLOORS.every(
  (f) =>
    f.floorNumber >= 1 &&
    f.floorNumber <= 6 &&
    f.requiredQuestions > 0 &&
    f.focusTopics.length > 0 &&
    f.rewardGold > 0 &&
    f.rewardXp > 0
);
assert(
  CHALLENGE_TOWER_FLOORS.length === 6 && floorsValid,
  'Challenge Tower has 6 scalable floors from Foundation up to Archmage Nexus Floor'
);

// 5. Math Marathon Checkpoints Test (6 checkpoints)
const cpsValid = MARATHON_CHECKPOINTS.every(
  (cp) => cp.questionThreshold > 0 && cp.rewardGold > 0 && cp.rewardXp > 0 && cp.titleVi.length > 0
);
assert(
  MARATHON_CHECKPOINTS.length === 6 &&
    MARATHON_CHECKPOINTS[0].questionThreshold === 5 &&
    MARATHON_CHECKPOINTS[5].questionThreshold === 30 &&
    cpsValid,
  'Math Marathon has 6 progressive checkpoints (5, 10, 15, 20, 25, 30 questions) with rewards'
);

// 6. Grand Boss Archmage Nexus Test
const p1Spells = GRAND_BOSS_SPELLS.filter((s) => s.phaseIndex === 1);
const p2Spells = GRAND_BOSS_SPELLS.filter((s) => s.phaseIndex === 2);
const p3Spells = GRAND_BOSS_SPELLS.filter((s) => s.phaseIndex === 3);
const spellsValid = GRAND_BOSS_SPELLS.every(
  (s) => s.correctIndex >= 0 && s.correctIndex < s.options.length && s.damage > 0
);

assert(
  GRAND_BOSS_PHASES.length === 3 &&
    GRAND_BOSS_PHASES[0].maxHp === 400 &&
    GRAND_BOSS_PHASES[1].maxHp === 450 &&
    GRAND_BOSS_PHASES[2].maxHp === 500 &&
    p1Spells.length === 4 &&
    p2Spells.length === 4 &&
    p3Spells.length === 4 &&
    spellsValid,
  'Grand Boss Archmage Nexus has 3 progressive phases (HP 400, 450, 500) and 12 verified spells across G2 & G3'
);

// 7. Adaptive Engine Diagnostics Test
const diag1 = ArenaAdaptiveEngine.diagnoseError('10 quả', '7 quả', MULTI_STEP_QUESTIONS_CATALOG[0]);
const diag2 = ArenaAdaptiveEngine.diagnoseError('32 cm²', '64 cm²', ARENA_QUESTIONS_CATALOG.find((q) => q.id === 'arn_g3_gm_2')!);
const diag3 = ArenaAdaptiveEngine.diagnoseError('Cộng que tính', 'Tách số', STRATEGY_QUESTIONS_CATALOG[0]);
const diag4 = ArenaAdaptiveEngine.diagnoseError('80', '75', ARENA_QUESTIONS_CATALOG.find((q) => q.id === 'arn_g2_as_1')!);

assert(
  diag1.errorType === 'MULTI_STEP_OVERLOOK' &&
    diag2.errorType === 'CONCEPT_CONFUSION' &&
    diag3.errorType === 'STRATEGY_SUBOPTIMAL' &&
    diag4.errorType === 'CALCULATION_ERROR',
  'Adaptive Engine accurately detects MULTI_STEP_OVERLOOK, CONCEPT_CONFUSION, STRATEGY_SUBOPTIMAL, and CALCULATION_ERROR'
);

// 8. Topic Mastery Breakdown & Achievements Test
const mockAttempts = [
  {
    id: 'att_1',
    questionId: 'arn_g2_pv_1',
    topicId: 'arithmetic_place_value' as const,
    difficulty: 'easy' as const,
    isSuccess: true,
    selectedAnswer: '4 trăm 5 chục 8 đơn vị',
    correctAnswer: '4 trăm 5 chục 8 đơn vị',
    timestamp: Date.now(),
  },
  {
    id: 'att_2',
    questionId: 'arn_g2_as_1',
    topicId: 'addition_subtraction' as const,
    difficulty: 'easy' as const,
    isSuccess: false,
    selectedAnswer: '65',
    correctAnswer: '75',
    timestamp: Date.now(),
  },
];
const mastery = ArenaAdaptiveEngine.calculateTopicMastery(mockAttempts);
const achievementsValid = ARENA_ACHIEVEMENTS.every(
  (a) => a.id.length > 0 && a.titleVi.length > 0 && a.goldReward > 0 && a.xpReward > 0
);

assert(
  Object.keys(mastery).length === 9 &&
    mastery.arithmetic_place_value.correct === 1 &&
    mastery.addition_subtraction.correct === 0 &&
    ARENA_ACHIEVEMENTS.length === 6 &&
    achievementsValid,
  'Topic Mastery engine computes status across all 9 domains and Achievements Catalog has 6 achievements'
);

console.log('\n================================================================');
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} PHASE 19 ADVANCED ARENA TESTS PASSED!`);
} else {
  console.error(`💥 ${failCount} TESTS FAILED out of ${passCount + failCount}`);
}
console.log('================================================================\n');

if (failCount > 0) process.exit(1);

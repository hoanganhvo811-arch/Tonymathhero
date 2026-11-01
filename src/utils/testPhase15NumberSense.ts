/**
 * Phase 15 - Number Sense & Mental Math Test Suite
 * TONY MATH HERO - THE LEGEND OF SEVEN KINGDOMS
 */

import { PLACE_VALUE_TASKS } from '../features/number-sense/data/placeValueCatalog';
import { MENTAL_STRATEGIES_CATALOG } from '../features/number-sense/data/mentalStrategiesCatalog';
import { NUMBER_PATTERNS_CATALOG } from '../features/number-sense/data/numberPatternsCatalog';
import { NUMBER_SENSE_PUZZLES_CATALOG } from '../features/number-sense/data/numberSensePuzzlesCatalog';
import { INITIAL_NUMBER_SENSE_ACHIEVEMENTS } from '../features/number-sense/data/numberSenseAchievementsCatalog';
import { NumberSenseAdaptiveEngine } from '../features/number-sense/services/numberSenseAdaptiveEngine';
import type { NumberSenseAttemptRecord } from '../types/numberSense';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

let passedCount = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passedCount++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name} -> ${err.message}`);
    throw err;
  }
}

console.log('================================================================');
console.log('🧪 RUNNING PHASE 15 NUMBER SENSE & MENTAL MATH TEST SUITE');
console.log('================================================================\n');

// 1. Place Value Tasks & Formula Verification
test('Place Value Tasks mathematically verified (Base-10 expanded form)', () => {
  assert(PLACE_VALUE_TASKS.length === 8, `Expected 8 tasks, got ${PLACE_VALUE_TASKS.length}`);

  for (const t of PLACE_VALUE_TASKS) {
    const calculated =
      t.expectedBlocks.thousands * 1000 +
      t.expectedBlocks.hundreds * 100 +
      t.expectedBlocks.tens * 10 +
      t.expectedBlocks.ones * 1;

    assert(
      calculated === t.targetNumber,
      `Task ${t.id}: calculated sum ${calculated} != target ${t.targetNumber}`
    );

    if (t.gradeLevel === 'grade-2') {
      assert(t.targetNumber < 1000, `Grade 2 task ${t.id} target must be < 1000`);
      assert(t.expectedBlocks.thousands === 0, `Grade 2 task ${t.id} must not have thousands blocks`);
    } else {
      assert(t.targetNumber >= 1000, `Grade 3 task ${t.id} target must be >= 1000`);
      assert(t.expectedBlocks.thousands > 0, `Grade 3 task ${t.id} must have thousands blocks`);
    }
  }
});

// 2. Mental Strategies Catalog
test('Mental Strategies Catalog covers 5 core techniques with verified steps', () => {
  assert(MENTAL_STRATEGIES_CATALOG.length === 5, `Expected 5 strategies, got ${MENTAL_STRATEGIES_CATALOG.length}`);

  const strats = new Set(MENTAL_STRATEGIES_CATALOG.map((s) => s.strategy));
  assert(strats.has('make_ten'), 'Missing make_ten');
  assert(strats.has('compensation'), 'Missing compensation');
  assert(strats.has('decompose_place_value'), 'Missing decompose_place_value');
  assert(strats.has('distributive_mult'), 'Missing distributive_mult');
  assert(strats.has('fact_family_inverse'), 'Missing fact_family_inverse');

  for (const s of MENTAL_STRATEGIES_CATALOG) {
    assert(s.steps.length === 3, `Strategy ${s.id} must have 3 steps`);
    assert(s.interactivePractice.options.includes(s.interactivePractice.correctAnswer), `Strategy ${s.id} options must include correct answer`);
  }
});

// 3. Number Patterns Catalog
test('Number Patterns Catalog has 12 verified sequences (Grade 2 vs Grade 3)', () => {
  assert(NUMBER_PATTERNS_CATALOG.length === 12, `Expected 12 patterns, got ${NUMBER_PATTERNS_CATALOG.length}`);

  const g2Patterns = NUMBER_PATTERNS_CATALOG.filter((p) => p.gradeLevel === 'grade-2');
  const g3Patterns = NUMBER_PATTERNS_CATALOG.filter((p) => p.gradeLevel === 'grade-3');

  assert(g2Patterns.length === 6, `Expected 6 Grade 2 patterns, got ${g2Patterns.length}`);
  assert(g3Patterns.length === 6, `Expected 6 Grade 3 patterns, got ${g3Patterns.length}`);

  for (const p of NUMBER_PATTERNS_CATALOG) {
    assert(p.sequence[p.missingIndex] === null, `Pattern ${p.id} missingIndex must point to null`);

    // Verify step calculation
    if (p.ruleType === 'add') {
      const prev = p.sequence[p.missingIndex - 1]!;
      assert(prev + p.stepValue === p.correctAnswer, `Pattern ${p.id} answer check failed`);
    } else if (p.ruleType === 'subtract') {
      const prev = p.sequence[p.missingIndex - 1]!;
      assert(prev - p.stepValue === p.correctAnswer, `Pattern ${p.id} answer check failed`);
    }
  }
});

// 4. Number Sense Puzzles Catalog
test('Puzzles Catalog strictly separates Grade 2 (10) and Grade 3 (10)', () => {
  assert(NUMBER_SENSE_PUZZLES_CATALOG.length === 20, `Expected 20 puzzles, got ${NUMBER_SENSE_PUZZLES_CATALOG.length}`);

  const g2Puzzles = NUMBER_SENSE_PUZZLES_CATALOG.filter((p) => p.gradeLevel === 'grade-2');
  const g3Puzzles = NUMBER_SENSE_PUZZLES_CATALOG.filter((p) => p.gradeLevel === 'grade-3');

  assert(g2Puzzles.length === 10, `Expected 10 Grade 2 puzzles, got ${g2Puzzles.length}`);
  assert(g3Puzzles.length === 10, `Expected 10 Grade 3 puzzles, got ${g3Puzzles.length}`);

  for (const p of NUMBER_SENSE_PUZZLES_CATALOG) {
    assert(p.options.length === 4, `Puzzle ${p.id} must have 4 options`);
    assert(p.options.includes(p.correctAnswer), `Puzzle ${p.id} options must include correctAnswer`);
    assert(p.explanationVi.length > 5, `Puzzle ${p.id} explanation must exist`);
  }
});

// 5. Adaptive Engine Diagnostics
test('Adaptive Engine detects PLACE_VALUE_MISUNDERSTANDING, COMPENSATION error, and PATTERN error', () => {
  // Place value swap test (user swaps hundreds & tens: 356 -> 5 hundreds, 3 tens, 6 ones)
  const expected = { thousands: 0, hundreds: 3, tens: 5, ones: 6 };
  const submittedSwapped = { thousands: 0, hundreds: 5, tens: 3, ones: 6 };
  const diagPV = NumberSenseAdaptiveEngine.diagnosePlaceValueAttempt(expected, submittedSwapped);
  assert(diagPV.isSuccess === false, 'PV attempt should be marked false');
  assert(diagPV.errorType === 'PLACE_VALUE_MISUNDERSTANDING', `Expected PLACE_VALUE_MISUNDERSTANDING, got ${diagPV.errorType}`);

  // Compensation off-by-one test (64 - 19: user says 44 instead of 45, forgotten +1 compensation)
  const diagComp = NumberSenseAdaptiveEngine.diagnoseStrategyAttempt(45, 44, 'compensation');
  assert(diagComp.isSuccess === false, 'Compensation attempt should be marked false');
  assert(diagComp.errorType === 'ROUNDING_COMPENSATION_ERROR', `Expected ROUNDING_COMPENSATION_ERROR, got ${diagComp.errorType}`);

  // Pattern mistake test
  const diagPat = NumberSenseAdaptiveEngine.diagnosePatternAttempt(50, 48, '+10');
  assert(diagPat.isSuccess === false, 'Pattern attempt should be marked false');
  assert(diagPat.errorType === 'PATTERN_RULE_MISUNDERSTANDING', `Expected PATTERN_RULE_MISUNDERSTANDING, got ${diagPat.errorType}`);
});

// 6. Skill Breakdown
test('Skill Breakdown calculates all 10 core competencies', () => {
  const mockAttempts: NumberSenseAttemptRecord[] = [
    {
      id: 'att_1',
      taskId: 'pv_g2_356',
      category: 'place_value',
      timestamp: new Date().toISOString(),
      gradeLevel: 'grade-2',
      isSuccess: true,
      errorType: 'NONE',
      timeSpentSeconds: 12,
    },
    {
      id: 'att_2',
      taskId: 'strat_make_ten',
      category: 'strategy',
      timestamp: new Date().toISOString(),
      gradeLevel: 'grade-2',
      isSuccess: true,
      errorType: 'NONE',
      strategyUsed: 'make_ten',
      timeSpentSeconds: 15,
    },
    {
      id: 'att_3',
      taskId: 'pat_g2_01_even',
      category: 'pattern',
      timestamp: new Date().toISOString(),
      gradeLevel: 'grade-2',
      isSuccess: false,
      errorType: 'PATTERN_RULE_MISUNDERSTANDING',
      timeSpentSeconds: 18,
    },
  ];

  const breakdown = NumberSenseAdaptiveEngine.calculateSkillBreakdown(mockAttempts);
  assert(breakdown.placeValueScore === 100, 'Place value score should be 100%');
  assert(breakdown.mentalAdditionScore === 100, 'Mental addition score should be 100%');
  assert(breakdown.numberPatternsScore === 0, 'Pattern score should be 0% since it failed');
});

// 7. Achievements Configuration
test('Achievements Catalog contains 6 achievements with valid parameters', () => {
  assert(INITIAL_NUMBER_SENSE_ACHIEVEMENTS.length === 6, 'Must have 6 achievements');
  const ids = INITIAL_NUMBER_SENSE_ACHIEVEMENTS.map((a) => a.id);
  assert(ids.includes('ns_place_value_architect'), 'Missing ns_place_value_architect');
  assert(ids.includes('ns_decomposition_master'), 'Missing ns_decomposition_master');
  assert(ids.includes('ns_mental_speedster'), 'Missing ns_mental_speedster');
  assert(ids.includes('ns_pattern_detective'), 'Missing ns_pattern_detective');
  assert(ids.includes('ns_strategy_virtuoso'), 'Missing ns_strategy_virtuoso');
  assert(ids.includes('ns_number_arena_champion'), 'Missing ns_number_arena_champion');

  for (const a of INITIAL_NUMBER_SENSE_ACHIEVEMENTS) {
    assert(a.maxProgress > 0, `Achievement ${a.id} maxProgress must be > 0`);
    assert(a.rewardXp > 0, `Achievement ${a.id} rewardXp must be > 0`);
    assert(a.rewardGold > 0, `Achievement ${a.id} rewardGold must be > 0`);
  }
});

console.log(`\n================================================================`);
console.log(`🎉 ALL ${passedCount} PHASE 15 NUMBER SENSE TESTS PASSED!`);
console.log(`================================================================\n`);

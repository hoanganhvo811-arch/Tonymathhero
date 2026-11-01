/**
 * Phase 13 - Word Problem Adventure Test Suite
 * TONY MATH HERO - THE LEGEND OF SEVEN KINGDOMS
 */

import { WORD_PROBLEMS_CATALOG, INITIAL_WORD_PROBLEM_ACHIEVEMENTS } from '../features/word-problems/data/wordProblemsCatalog';
import { WordProblemAdaptiveEngine } from '../features/word-problems/services/wordProblemAdaptiveEngine';
import type { WordProblemAttemptRecord, WordProblem, OperationType } from '../types/wordProblem';

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
console.log('🧪 RUNNING PHASE 13 WORD PROBLEM ADVENTURE TEST SUITE');
console.log('================================================================\n');

// 1. Catalog integrity
test('Catalog contains 10 problems with valid structure', () => {
  assert(WORD_PROBLEMS_CATALOG.length === 10, `Expected 10 problems, got ${WORD_PROBLEMS_CATALOG.length}`);
  for (const p of WORD_PROBLEMS_CATALOG) {
    assert(p.id.length > 0, 'Problem ID must not be empty');
    assert(p.title.length > 0, 'Problem title must not be empty');
    assert(p.prompt.length > 10, 'Prompt text must be descriptive');
    assert(p.givens.length >= 2, 'Problem must have at least 2 givens');
    assert(p.question.length > 5, 'Question text must be specified');
    assert(p.hints.tier1_nudge.length > 0, 'Tier 1 nudge must exist');
    assert(p.hints.tier2_guidance.length > 0, 'Tier 2 guidance must exist');
    assert(p.hints.tier3_walkthrough.length > 0, 'Tier 3 walkthrough must exist');
    assert(p.steps.length >= 1, 'Problem must have at least 1 step');
    assert(p.finalAnswer !== undefined && !isNaN(p.finalAnswer), 'Final answer must be a valid number');
    assert(p.finalUnit.length > 0, 'Final unit must be specified');
    assert(p.fullSolutionMarkdown.length > 10, 'Full solution markdown must be provided');
  }
});

// 2. Grade 2 vs Grade 3 Curriculum Isolation
test('Grade 2 vs Grade 3 curriculum isolation', () => {
  const g2Problems = WORD_PROBLEMS_CATALOG.filter((p) => p.gradeLevel === 'grade-2');
  const g3Problems = WORD_PROBLEMS_CATALOG.filter((p) => p.gradeLevel === 'grade-3');

  assert(g2Problems.length === 5, `Expected 5 Grade 2 problems, got ${g2Problems.length}`);
  assert(g3Problems.length === 5, `Expected 5 Grade 3 problems, got ${g3Problems.length}`);

  // Grade 2 must be 1-step problems
  for (const p of g2Problems) {
    assert(p.steps.length === 1, `Grade 2 problem ${p.id} must have exactly 1 step`);
  }

  // Grade 3 must include 2-step multi-step reasoning
  const g3MultiStep = g3Problems.filter((p) => p.steps.length === 2);
  assert(g3MultiStep.length >= 3, `Expected at least 3 multi-step problems in Grade 3, got ${g3MultiStep.length}`);
});

// 3. Mathematical validation of all problem steps
test('All step calculations are mathematically verified', () => {
  for (const p of WORD_PROBLEMS_CATALOG) {
    for (const s of p.steps) {
      let expected = 0;
      switch (s.correctOperation) {
        case 'addition':
          expected = s.operands[0] + s.operands[1];
          break;
        case 'subtraction':
          expected = s.operands[0] - s.operands[1];
          break;
        case 'multiplication':
          expected = s.operands[0] * s.operands[1];
          break;
        case 'division':
          expected = Math.floor(s.operands[0] / s.operands[1]);
          break;
      }
      assert(
        s.correctValue === expected,
        `Problem ${p.id} step ${s.stepIndex} correctValue ${s.correctValue} does not match calculation ${expected}`
      );
    }
    // Verify finalAnswer matches the last step result
    const lastStep = p.steps[p.steps.length - 1];
    assert(
      p.finalAnswer === lastStep.correctValue,
      `Problem ${p.id} finalAnswer ${p.finalAnswer} does not match last step result ${lastStep.correctValue}`
    );
  }
});

// 4. WordProblemAdaptiveEngine diagnostic tests
test('Adaptive Engine diagnoses correct answers as NONE', () => {
  const p1 = WORD_PROBLEMS_CATALOG[0]; // 1-step: 28 + 15 = 43
  const diagnosis = WordProblemAdaptiveEngine.diagnoseAttempt(
    p1,
    ['addition'],
    [43],
    2
  );
  assert(diagnosis.isSuccess === true, 'Attempt should be marked success');
  assert(diagnosis.errorType === 'NONE', 'Error type should be NONE');
});

test('Adaptive Engine detects READING_MISUNDERSTANDING when givens are missed', () => {
  const p1 = WORD_PROBLEMS_CATALOG[0];
  const diagnosis = WordProblemAdaptiveEngine.diagnoseAttempt(
    p1,
    ['addition'],
    [43],
    0 // 0 givens identified
  );
  assert(diagnosis.isSuccess === false, 'Should be unsuccessful');
  assert(diagnosis.errorType === 'READING_MISUNDERSTANDING', `Expected READING_MISUNDERSTANDING, got ${diagnosis.errorType}`);
});

test('Adaptive Engine distinguishes OPERATION_MISMATCH vs CALCULATION_MISTAKE', () => {
  const p1 = WORD_PROBLEMS_CATALOG[0]; // 1-step addition: 28 + 15 = 43

  // Wrong operation chosen: chose subtraction instead of addition
  const diagOpMismatch = WordProblemAdaptiveEngine.diagnoseAttempt(
    p1,
    ['subtraction'],
    [13],
    2
  );
  assert(diagOpMismatch.isSuccess === false, 'Should be unsuccessful');
  assert(diagOpMismatch.errorType === 'OPERATION_MISMATCH', `Expected OPERATION_MISMATCH, got ${diagOpMismatch.errorType}`);

  // Correct operation chosen, but calculation arithmetic wrong: 28 + 15 = 45 (mistake)
  const diagCalcMistake = WordProblemAdaptiveEngine.diagnoseAttempt(
    p1,
    ['addition'],
    [45],
    2
  );
  assert(diagCalcMistake.isSuccess === false, 'Should be unsuccessful');
  assert(diagCalcMistake.errorType === 'CALCULATION_MISTAKE', `Expected CALCULATION_MISTAKE, got ${diagCalcMistake.errorType}`);
});

test('Adaptive Engine diagnoses 2-step problems accurately', () => {
  // wp_g3_mixed_marbles_gift: 7 * 5 = 35, 35 - 15 = 20
  const p2Step = WORD_PROBLEMS_CATALOG.find((p) => p.id === 'wp_g3_mixed_marbles_gift')!;

  // Perfect 2-step solution
  const diagPerfect = WordProblemAdaptiveEngine.diagnoseAttempt(
    p2Step,
    ['multiplication', 'subtraction'],
    [35, 20],
    3
  );
  assert(diagPerfect.isSuccess === true, 'Perfect 2-step should be success');
  assert(diagPerfect.errorType === 'NONE', 'Error type should be NONE');

  // Step 1 correct, Step 2 operation wrong
  const diagStep2OpWrong = WordProblemAdaptiveEngine.diagnoseAttempt(
    p2Step,
    ['multiplication', 'addition'],
    [35, 50],
    3
  );
  assert(diagStep2OpWrong.isSuccess === false, 'Should be unsuccessful');
  assert(
    diagStep2OpWrong.errorType === 'OPERATION_MISMATCH',
    `Expected OPERATION_MISMATCH on step 2, got ${diagStep2OpWrong.errorType}`
  );

  // Step 1 correct, Step 2 integration/calculation error
  const diagStep2CalcWrong = WordProblemAdaptiveEngine.diagnoseAttempt(
    p2Step,
    ['multiplication', 'subtraction'],
    [35, 18], // Expected 20
    3
  );
  assert(diagStep2CalcWrong.isSuccess === false, 'Should be unsuccessful');
  assert(
    diagStep2CalcWrong.errorType === 'STEP2_INTEGRATION_ERROR',
    `Expected STEP2_INTEGRATION_ERROR on step 2, got ${diagStep2CalcWrong.errorType}`
  );
});

// 5. Skill breakdown calculation
test('Skill breakdown calculation aggregates performance metrics', () => {
  const mockAttempts: WordProblemAttemptRecord[] = [
    {
      problemId: 'wp_g2_add_farm_sheep',
      timestamp: new Date().toISOString(),
      isSuccess: true,
      selectedGivenIds: ['g1', 'g2'],
      selectedOperations: ['addition'],
      calculatedValues: [43],
      errorType: 'NONE',
      hintLevelUsed: 0,
      timeSpentSeconds: 24,
    },
    {
      problemId: 'wp_g2_sub_wood_fence',
      timestamp: new Date().toISOString(),
      isSuccess: false,
      selectedGivenIds: ['g1', 'g2'],
      selectedOperations: ['subtraction'],
      calculatedValues: [20],
      errorType: 'CALCULATION_MISTAKE',
      hintLevelUsed: 1,
      timeSpentSeconds: 35,
    },
  ];

  const breakdown = WordProblemAdaptiveEngine.calculateSkillBreakdown(mockAttempts);
  assert(breakdown.readingComprehensionScore === 100, 'Reading score should be 100% since no reading misunderstanding');
  assert(breakdown.operationSelectionScore === 100, 'Operation score should be 100% since correct ops chosen');
  assert(breakdown.calculationAccuracyScore === 50, 'Calculation accuracy should be 50% (1 of 2 had calc mistake)');
});

// 6. Adaptive Problem Selection
test('Adaptive Engine selects next problem smartly', () => {
  const selected = WordProblemAdaptiveEngine.selectAdaptiveProblem(
    WORD_PROBLEMS_CATALOG,
    ['wp_g2_add_farm_sheep'],
    [],
    'grade-2'
  );
  assert(selected !== undefined, 'Must select an eligible problem');
  assert(selected.id !== 'wp_g2_add_farm_sheep', 'Should not select already solved problem if unsolved exist');
  assert(selected.gradeLevel === 'grade-2', 'Should select Grade 2 problem');
});

// 7. Achievements configuration
test('All 6 Word Problem Achievements are properly configured', () => {
  assert(INITIAL_WORD_PROBLEM_ACHIEVEMENTS.length === 6, 'Must have 6 achievements');
  const ids = INITIAL_WORD_PROBLEM_ACHIEVEMENTS.map((a) => a.id);
  assert(ids.includes('word_problem_apprentice'), 'Missing word_problem_apprentice');
  assert(ids.includes('givens_detective'), 'Missing givens_detective');
  assert(ids.includes('operation_master'), 'Missing operation_master');
  assert(ids.includes('two_step_hero'), 'Missing two_step_hero');
  assert(ids.includes('story_quest_champion'), 'Missing story_quest_champion');
  assert(ids.includes('analytical_mind'), 'Missing analytical_mind');

  for (const ach of INITIAL_WORD_PROBLEM_ACHIEVEMENTS) {
    assert(ach.maxProgress > 0, `Achievement ${ach.id} maxProgress must be > 0`);
    assert(ach.rewardXp > 0, `Achievement ${ach.id} rewardXp must be > 0`);
    assert(ach.rewardGold > 0, `Achievement ${ach.id} rewardGold must be > 0`);
  }
});

console.log(`\n================================================================`);
console.log(`🎉 ALL ${passedCount} PHASE 13 WORD PROBLEM ADVENTURE TESTS PASSED!`);
console.log(`================================================================\n`);

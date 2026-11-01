import {
  DIVISION_FACTS,
  DIVISION_TABLES,
  DIVISION_PUZZLES,
  INITIAL_DIVISION_ACHIEVEMENTS,
  GRADE_2_DIVISION_TABLES,
  GRADE_3_DIVISION_TABLES,
  spellVietnameseNumber,
} from '../features/division/data/divisionCatalog';
import {
  generateDivisionQuestion,
  generateDivisionQuestionsBatch,
} from '../features/division/services/divisionQuestionGenerator';
import { DivisionAdaptiveEngine } from '../features/division/services/divisionAdaptiveEngine';
import type { DivisionFactProgress } from '../types/division';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

console.log('====================================================');
console.log('TEST SUITE: PHASE 12 - DIVISION KINGDOM VERIFICATION');
console.log('====================================================\n');

// 1. Division Catalog & Data Structure
console.log('--- 1. Division Catalog & 80 Facts Verification ---');
assert(DIVISION_FACTS.length === 80, `Exactly 80 division facts defined (found ${DIVISION_FACTS.length})`);
assert(DIVISION_TABLES.length === 8, `Tables 2 through 9 present (found ${DIVISION_TABLES.length})`);

let allMathCorrect = true;
let allMultiplicationLinked = true;
for (const fact of DIVISION_FACTS) {
  if (fact.dividend / fact.divisor !== fact.quotient || fact.remainder !== 0) {
    allMathCorrect = false;
  }
  if (fact.divisor * fact.quotient !== fact.dividend) {
    allMultiplicationLinked = false;
  }
}
assert(allMathCorrect, 'All 80 division calculations are 100% mathematically exact (dividend / divisor = quotient)');
assert(allMultiplicationLinked, 'All 80 facts satisfy the inverse multiplication law: divisor * quotient = dividend');

// Test Vietnamese spelling function
assert(spellVietnameseNumber(1) === 'một', 'Number 1 spelt correctly: một');
assert(spellVietnameseNumber(15) === 'mười lăm', 'Number 15 spelt correctly: mười lăm');
assert(spellVietnameseNumber(24) === 'hai mươi tư', 'Number 24 spelt correctly: hai mươi tư');
assert(spellVietnameseNumber(45) === 'bốn mươi lăm', 'Number 45 spelt correctly: bốn mươi lăm');
assert(spellVietnameseNumber(72) === 'bảy mươi hai', 'Number 72 spelt correctly: bảy mươi hai');

// 2. Question Generator & 8 Question Types
console.log('\n--- 2. Question Generator & Distinct Distractors ---');
const sampleFact = DIVISION_FACTS.find((f) => f.dividend === 24 && f.divisor === 4)!; // 24 / 4 = 6
assert(!!sampleFact, 'Sample fact 24 / 4 = 6 found');

// Test MULTIPLE_CHOICE
const mcQ = generateDivisionQuestion(sampleFact, 'MULTIPLE_CHOICE');
assert(mcQ.type === 'MULTIPLE_CHOICE', 'Generated MULTIPLE_CHOICE question');
assert(mcQ.options?.length === 4, 'Multiple choice has exactly 4 options');
assert(new Set(mcQ.options).size === 4, 'Multiple choice options have ZERO duplicates');
assert(!!mcQ.options?.includes(mcQ.correctAnswer), 'Options list includes correct answer');

// Test FILL_QUOTIENT
const fqQ = generateDivisionQuestion(sampleFact, 'FILL_QUOTIENT');
assert(fqQ.type === 'FILL_QUOTIENT', 'Generated FILL_QUOTIENT question');
assert(fqQ.correctAnswer === 6, 'Correct quotient is 6');

// Test FILL_MISSING
const fmQ = generateDivisionQuestion(sampleFact, 'FILL_MISSING');
assert(fmQ.type === 'FILL_MISSING', 'Generated FILL_MISSING question');
assert(fmQ.options?.length === 4, 'FILL_MISSING has 4 choices with no duplicates');
assert(new Set(fmQ.options).size === 4, 'FILL_MISSING options are all distinct');

// Test FIND_EQUATION
const feQ = generateDivisionQuestion(sampleFact, 'FIND_EQUATION');
assert(feQ.type === 'FIND_EQUATION', 'Generated FIND_EQUATION question');
assert(!!feQ.options?.includes('24 ÷ 4 = 6'), 'FIND_EQUATION contains the valid formula');

// Test INVERSE_MULTIPLICATION
const invQ = generateDivisionQuestion(sampleFact, 'INVERSE_MULTIPLICATION');
assert(invQ.type === 'INVERSE_MULTIPLICATION', 'Generated INVERSE_MULTIPLICATION question');
assert(!!invQ.options?.includes('24 ÷ 4 = 6'), 'Inverse question presents 24 / 4 = 6 as valid option');

// Test WORD_PROBLEM
const wpQ = generateDivisionQuestion(sampleFact, 'WORD_PROBLEM');
assert(wpQ.type === 'WORD_PROBLEM', 'Generated WORD_PROBLEM question');
assert(wpQ.prompt.includes('24'), 'Word problem mentions dividend 24');
assert(wpQ.prompt.includes('4'), 'Word problem mentions divisor 4');

// Test REAL_WORLD
const rwQ = generateDivisionQuestion(sampleFact, 'REAL_WORLD');
assert(rwQ.type === 'REAL_WORLD', 'Generated REAL_WORLD grouping question');

// Batch generation
const batch = generateDivisionQuestionsBatch(DIVISION_FACTS, 15, { includeInverse: true, includeWordProblems: true });
assert(batch.length === 15, `Batch question generator generated 15 questions (found ${batch.length})`);

// 3. Adaptive Engine & 4-Tier Mastery Evaluation
console.log('\n--- 3. Adaptive Division Engine & Mastery Verification ---');
const notStartedProg: DivisionFactProgress = {
  factId: 'div_4_6',
  attempts: 0,
  correct: 0,
  firstAttemptCorrect: 0,
  lastPracticed: new Date().toISOString(),
  masteryLevel: 'NOT_STARTED',
  consecutiveCorrect: 0,
  avgResponseTimeMs: 0,
  hintCount: 0,
  linkedMultiplicationMistakes: 0,
};
assert(DivisionAdaptiveEngine.calculateMastery(notStartedProg) === 'NOT_STARTED', '0 attempts = NOT_STARTED');

// Record 1 correct attempt
let prog = DivisionAdaptiveEngine.recordAttempt(notStartedProg, 'div_4_6', true, true, 2000, false);
assert(prog.attempts === 1 && prog.correct === 1, 'Attempt recorded: 1 attempt, 1 correct');
assert(prog.masteryLevel === 'LEARNING', '1 attempt = LEARNING');

// Record 2 more correct attempts
prog = DivisionAdaptiveEngine.recordAttempt(prog, 'div_4_6', true, true, 1800, false);
prog = DivisionAdaptiveEngine.recordAttempt(prog, 'div_4_6', true, true, 1900, false);
assert(prog.attempts === 3 && prog.correct === 3, 'Recorded 3 attempts, 3 correct (100% accuracy)');
assert(prog.masteryLevel === 'MASTERED', '3 consecutive correct attempts = MASTERED');

// Record a mistake
prog = DivisionAdaptiveEngine.recordAttempt(prog, 'div_4_6', false, false, 3000, true);
assert(prog.consecutiveCorrect === 0, 'Consecutive correct streak resets to 0 on mistake');
assert(prog.masteryLevel === 'DEVELOPING', 'Accuracy dropped to 75% = DEVELOPING');

// 4. Smart Fact Selection with Cross-Linkage to Multiplication
console.log('\n--- 4. Cross-Linkage with Multiplication & Smart Selection ---');
const testProgressMap: Record<string, DivisionFactProgress> = {
  div_4_6: prog, // weak/developing
};

// If multiplication fact 7 x 8 was weak in player's multiplication history
const smartSelected = DivisionAdaptiveEngine.selectSmartFacts(
  DIVISION_FACTS,
  testProgressMap,
  5,
  ['fact_7_8'] // linked multiplication fact id
);
assert(smartSelected.length === 5, 'Smart selector returned requested 5 facts');
const hasLinkedFact = smartSelected.some((f) => f.dividend === 56 && (f.divisor === 7 || f.divisor === 8));
assert(hasLinkedFact, 'Smart selector prioritized division fact linked to weak multiplication fact 7 x 8');

// 5. Visual Division Puzzles Verification
console.log('\n--- 5. Visual Division Puzzles Verification ---');
assert(DIVISION_PUZZLES.length === 6, `Exactly 6 visual sharing puzzles defined (found ${DIVISION_PUZZLES.length})`);
let allPuzzlesExact = true;
for (const p of DIVISION_PUZZLES) {
  if (p.totalItems !== p.targetGroups * p.itemsPerGroup) {
    allPuzzlesExact = false;
  }
}
assert(allPuzzlesExact, 'All 6 puzzles have exact integer division (totalItems = targetGroups * itemsPerGroup)');

// 6. Division Achievements
console.log('\n--- 6. Division Achievements Verification ---');
assert(INITIAL_DIVISION_ACHIEVEMENTS.length === 6, `6 Division Achievements defined (found ${INITIAL_DIVISION_ACHIEVEMENTS.length})`);
assert(INITIAL_DIVISION_ACHIEVEMENTS.some((a) => a.id === 'division_beginner'), 'Achievement division_beginner present');
assert(INITIAL_DIVISION_ACHIEVEMENTS.some((a) => a.id === 'equal_sharing_expert'), 'Achievement equal_sharing_expert present');
assert(INITIAL_DIVISION_ACHIEVEMENTS.some((a) => a.id === 'division_table_master'), 'Achievement division_table_master present');
assert(INITIAL_DIVISION_ACHIEVEMENTS.some((a) => a.id === 'inverse_master'), 'Achievement inverse_master present');
assert(INITIAL_DIVISION_ACHIEVEMENTS.some((a) => a.id === 'division_hero'), 'Achievement division_hero present');
assert(INITIAL_DIVISION_ACHIEVEMENTS.some((a) => a.id === 'division_boss_slayer'), 'Achievement division_boss_slayer present');

// 7. Dual Campaign Isolation
console.log('\n--- 7. Dual Campaign Isolation (Grade 2 vs Grade 3) ---');
assert(GRADE_2_DIVISION_TABLES.length === 2, 'Grade 2 primary tables are 2 and 5');
assert(GRADE_2_DIVISION_TABLES.includes(2) && GRADE_2_DIVISION_TABLES.includes(5), 'Grade 2 has tables 2 and 5');
assert(GRADE_3_DIVISION_TABLES.length === 8, 'Grade 3 includes all 8 tables (2 through 9)');

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log(`RESULT: ${totalTests === passedTests ? '100% PASS' : 'FAILED'}`);
console.log('====================================================\n');

if (totalTests !== passedTests) {
  process.exit(1);
}

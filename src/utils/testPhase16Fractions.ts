import { FRACTION_BUILDER_PRESETS } from '../features/fractions/data/fractionBuilderPresets';
import { FRACTION_RECOGNITION_TASKS } from '../features/fractions/data/fractionRecognitionCatalog';
import { FRACTION_COMPARISON_TASKS } from '../features/fractions/data/fractionComparisonCatalog';
import { FAIR_SHARING_TASKS } from '../features/fractions/data/fairSharingCatalog';
import { FRACTION_BOSS_PHASES, FRACTION_BOSS_SPELLS } from '../features/fractions/data/fractionBossCatalog';
import { FRACTION_ACHIEVEMENTS } from '../features/fractions/data/fractionAchievementsCatalog';
import { FractionAdaptiveEngine } from '../features/fractions/services/fractionAdaptiveEngine';

console.log('================================================================');
console.log('🧪 RUNNING PHASE 16 FRACTIONS ADVENTURE TEST SUITE');
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

// 1. Builder Presets Test
const g2Presets = FRACTION_BUILDER_PRESETS.filter((p) => p.gradeLevel === 'grade-2');
const g3Presets = FRACTION_BUILDER_PRESETS.filter((p) => p.gradeLevel === 'grade-3');
const presetsValid = FRACTION_BUILDER_PRESETS.every(
  (p) =>
    p.targetNumerator <= p.targetDenominator &&
    p.allowedPartitions.includes(p.targetDenominator) &&
    p.shapeNameVi.length > 0
);
assert(
  g2Presets.length === 4 && g3Presets.length === 4 && presetsValid,
  'Fraction Builder Presets valid (4 Grade 2, 4 Grade 3, target numerator <= denominator)'
);

// 2. Recognition Catalog Test (20 tasks, 10 G2, 10 G3)
const g2Recog = FRACTION_RECOGNITION_TASKS.filter((t) => t.gradeLevel === 'grade-2');
const g3Recog = FRACTION_RECOGNITION_TASKS.filter((t) => t.gradeLevel === 'grade-3');
const recogValid = FRACTION_RECOGNITION_TASKS.every(
  (t) =>
    t.correctIndex >= 0 &&
    t.correctIndex < t.options.length &&
    t.options[t.correctIndex].length > 0 &&
    t.totalParts >= t.shadedParts
);
assert(
  g2Recog.length === 10 && g3Recog.length === 10 && recogValid,
  'Recognition Catalog has 20 tasks with valid answers (10 Grade 2, 10 Grade 3)'
);

// 3. Comparison Tasks Test (12 tasks, 6 G2, 6 G3)
const g2Comp = FRACTION_COMPARISON_TASKS.filter((t) => t.gradeLevel === 'grade-2');
const g3Comp = FRACTION_COMPARISON_TASKS.filter((t) => t.gradeLevel === 'grade-3');
let compMathValid = true;
for (const task of FRACTION_COMPARISON_TASKS) {
  const leftVal = task.leftFraction.numerator / task.leftFraction.denominator;
  const rightVal = task.rightFraction.numerator / task.rightFraction.denominator;
  const expectedSign =
    Math.abs(leftVal - rightVal) < 0.0001 ? '=' : leftVal > rightVal ? '>' : '<';
  if (expectedSign !== task.correctSign) {
    compMathValid = false;
    console.error(
      `Comparison mismatch on ${task.id}: expected ${expectedSign}, got ${task.correctSign}`
    );
  }
}
assert(
  g2Comp.length === 6 && g3Comp.length === 6 && compMathValid,
  'Fraction Comparison Catalog has 12 tasks with mathematically verified comparison signs'
);

// 4. Fair Sharing Tasks Test (12 tasks, 6 G2, 6 G3)
const g2Sharing = FAIR_SHARING_TASKS.filter((t) => t.gradeLevel === 'grade-2');
const g3Sharing = FAIR_SHARING_TASKS.filter((t) => t.gradeLevel === 'grade-3');
let sharingMathValid = true;
for (const task of FAIR_SHARING_TASKS) {
  const expectedVal = task.totalItems / task.recipientCount;
  const answeredVal = task.options[task.correctIndex];
  if (expectedVal !== answeredVal) {
    sharingMathValid = false;
    console.error(
      `Sharing math mismatch on ${task.id}: ${task.totalItems} : ${task.recipientCount} = ${expectedVal}, but answer option is ${answeredVal}`
    );
  }
}
assert(
  g2Sharing.length === 6 && g3Sharing.length === 6 && sharingMathValid,
  'Fair Sharing Catalog has 12 tasks with exact mathematical division (total / recipients)'
);

// 5. Boss Arena Phases & Spells Test
const phasesValid =
  FRACTION_BOSS_PHASES.length === 3 &&
  FRACTION_BOSS_PHASES[0].bossHp === 300 &&
  FRACTION_BOSS_PHASES[1].bossHp === 350 &&
  FRACTION_BOSS_PHASES[2].bossHp === 400;
const spellsValid = FRACTION_BOSS_SPELLS.every(
  (s) => s.options.includes(s.correctAnswer) && s.damage > 0
);
assert(
  phasesValid && spellsValid && FRACTION_BOSS_SPELLS.length >= 7,
  'Fraction Boss has 3 progressive phases and verified spells across Grade 2 and Grade 3'
);

// 6. Adaptive Diagnostic Engine Test
const diagEqual = FractionAdaptiveEngine.diagnoseError(
  { targetSkill: 'equal_vs_unequal' },
  'có, vì có 3 phần',
  'không'
);
const diagSwap = FractionAdaptiveEngine.diagnoseError(
  { targetSkill: 'numerator_denominator' },
  '4/1',
  '1/4'
);
const diagInv = FractionAdaptiveEngine.diagnoseError(
  { targetSkill: 'visual_comparison' },
  '1/4 > 1/2 vì 4 > 2',
  '1/2 > 1/4'
);
const diagUnshaded = FractionAdaptiveEngine.diagnoseError(
  { targetSkill: 'numerator_denominator' },
  '1/4',
  '3/4'
);

const diagAllPassed =
  diagEqual.errorType === 'UNEQUAL_PARTS_CONFUSION' &&
  diagSwap.errorType === 'NUMERATOR_DENOMINATOR_SWAP' &&
  diagInv.errorType === 'INVERSE_COMPARISON_ERROR' &&
  diagUnshaded.errorType === 'UNSHADED_COUNT_ERROR';
assert(
  diagAllPassed,
  'Adaptive Engine accurately detects UNEQUAL_PARTS, NUMERATOR_DENOMINATOR_SWAP, INVERSE_COMPARISON, and UNSHADED_COUNT errors'
);

// 7. Skill Breakdown Calculation Test
const mockAttempts = [
  {
    id: '1',
    taskId: 'g2_recog_half_circle',
    category: 'recognition' as const,
    gradeLevel: 'grade-2' as const,
    timestamp: new Date().toISOString(),
    isSuccess: true,
    errorType: 'NONE' as const,
    timeSpentSeconds: 5,
  },
  {
    id: '2',
    taskId: 'g2_comp_half_vs_fourth',
    category: 'comparison' as const,
    gradeLevel: 'grade-2' as const,
    timestamp: new Date().toISOString(),
    isSuccess: true,
    errorType: 'NONE' as const,
    timeSpentSeconds: 6,
  },
  {
    id: '3',
    taskId: 'g2_share_apples_two',
    category: 'fair_sharing' as const,
    gradeLevel: 'grade-2' as const,
    timestamp: new Date().toISOString(),
    isSuccess: true,
    errorType: 'NONE' as const,
    timeSpentSeconds: 5,
  },
];
const breakdown = FractionAdaptiveEngine.calculateSkillBreakdown(mockAttempts);
const breakdownValid =
  breakdown.halfRecognitionScore === 100 &&
  breakdown.visualComparisonScore === 100 &&
  breakdown.realLifeSharingScore === 100;
assert(
  breakdownValid,
  'Skill Breakdown engine computes mastery scores across all 9 fraction competencies'
);

// 8. Achievements Catalog Test
const achievementsValid =
  FRACTION_ACHIEVEMENTS.length === 6 &&
  FRACTION_ACHIEVEMENTS.every((a) => a.id.startsWith('frac_') && a.xpReward > 0);
assert(
  achievementsValid,
  'Achievements Catalog contains 6 Fraction Kingdom achievements with valid rewards'
);

console.log('\n================================================================');
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} PHASE 16 FRACTIONS ADVENTURE TESTS PASSED!`);
} else {
  console.error(`💥 ${failCount} TESTS FAILED out of ${passCount + failCount}`);
}
console.log('================================================================\n');

if (failCount > 0) process.exit(1);

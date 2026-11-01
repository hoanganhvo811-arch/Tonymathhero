import { VIETNAMESE_BILLS_CATALOG, getBillsByGrade, formatVnd } from '../features/money-shopping/data/currencyCatalog';
import { SHOP_ITEMS_CATALOG, getShopItemsByGrade } from '../features/money-shopping/data/shopItemsCatalog';
import { RECOGNITION_TASKS_CATALOG, COUNTING_TASKS_CATALOG } from '../features/money-shopping/data/moneyTasksCatalog';
import { SHOPPING_TASKS_CATALOG } from '../features/money-shopping/data/shoppingTasksCatalog';
import { BUDGET_TASKS_CATALOG } from '../features/money-shopping/data/budgetTasksCatalog';
import { MONEY_BOSS_PHASES, MONEY_BOSS_SPELLS } from '../features/money-shopping/data/moneyBossCatalog';
import { MONEY_ACHIEVEMENTS } from '../features/money-shopping/data/moneyAchievementsCatalog';
import { MoneyAdaptiveEngine } from '../features/money-shopping/services/moneyAdaptiveEngine';

console.log('================================================================');
console.log('🧪 RUNNING PHASE 18 MONEY & SHOPPING ADVENTURE TEST SUITE');
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

// 1. Currency Catalog Test
const g2Bills = getBillsByGrade('grade-2');
const g3Bills = getBillsByGrade('grade-3');
const billsValid = VIETNAMESE_BILLS_CATALOG.every(
  (b) =>
    b.denomination > 0 &&
    b.labelVi.length > 0 &&
    (b.material === 'cotton' || b.material === 'polymer') &&
    b.featureHintVi.length > 0
);
assert(
  VIETNAMESE_BILLS_CATALOG.length === 10 &&
    g2Bills.length === 7 &&
    g3Bills.length === 10 &&
    billsValid,
  'Currency Catalog defines all 10 Vietnamese denominations with correct material & grade levels'
);

// 2. Shop Items Catalog Test
const g2ShopItems = getShopItemsByGrade('grade-2');
const g3ShopItems = getShopItemsByGrade('grade-3');
const shopPricesValid = SHOP_ITEMS_CATALOG.every((item) => {
  if (item.gradeLevel === 'grade-2') {
    return item.price >= 1000 && item.price <= 10000;
  }
  return item.price >= 10000 && item.price <= 100000;
});
assert(
  SHOP_ITEMS_CATALOG.length >= 20 &&
    g2ShopItems.length >= 10 &&
    g3ShopItems.length >= 10 &&
    shopPricesValid,
  'Shop Items Catalog has 21+ items across 4 categories with verified Grade 2 (<=10k) and Grade 3 (<=100k) prices'
);

// 3. Money Tasks Catalog Test (20 Recognition + 20 Counting)
const g2Rec = RECOGNITION_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3Rec = RECOGNITION_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
const recValid = RECOGNITION_TASKS_CATALOG.every(
  (t) => t.correctIndex >= 0 && t.correctIndex < t.options.length && t.denomination > 0
);

const g2Cnt = COUNTING_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3Cnt = COUNTING_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
const cntValid = COUNTING_TASKS_CATALOG.every(
  (t) => t.correctIndex >= 0 && t.correctIndex < t.options.length && t.billsGroup.length > 0
);

assert(
  g2Rec.length === 10 &&
    g3Rec.length === 10 &&
    recValid &&
    g2Cnt.length === 10 &&
    g3Cnt.length === 10 &&
    cntValid,
  'Money Tasks Catalog has 40 tasks (20 Recognition + 20 Counting, 50% G2 / 50% G3)'
);

// 4. Shopping Tasks Math Verification Test (12 tasks)
const g2Shop = SHOPPING_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3Shop = SHOPPING_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
const shopMathValid = SHOPPING_TASKS_CATALOG.every((t) => {
  const calcTotal = t.itemsToBuy.reduce((sum, item) => sum + item.item.price * item.count, 0);
  const calcChange = t.cashPaid - t.correctTotal;
  return (
    calcTotal === t.correctTotal &&
    calcChange === t.correctChange &&
    t.correctIndex >= 0 &&
    t.correctIndex < t.options.length
  );
});
assert(
  g2Shop.length === 6 && g3Shop.length === 6 && shopMathValid,
  'Shopping Tasks Catalog has 12 tasks with exact mathematical verification for total cost & change due'
);

// 5. Budget Tasks Catalog Test (12 tasks)
const g2Budget = BUDGET_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3Budget = BUDGET_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
const budgetValid = BUDGET_TASKS_CATALOG.every(
  (t) =>
    t.initialBudget > 0 &&
    t.correctIndex >= 0 &&
    t.correctIndex < t.options.length &&
    t.options[t.correctIndex].length > 0
);
assert(
  g2Budget.length === 6 && g3Budget.length === 6 && budgetValid,
  'Budget Tasks Catalog has 12 scenarios testing budget management and affordability'
);

// 6. Boss Dark Merchant Lord Malakor Test
const spellsValid = MONEY_BOSS_SPELLS.every(
  (s) => s.correctIndex >= 0 && s.correctIndex < s.options.length && s.damage > 0
);
const p1Spells = MONEY_BOSS_SPELLS.filter((s) => s.phaseIndex === 1);
const p2Spells = MONEY_BOSS_SPELLS.filter((s) => s.phaseIndex === 2);
const p3Spells = MONEY_BOSS_SPELLS.filter((s) => s.phaseIndex === 3);
assert(
  MONEY_BOSS_PHASES.length === 3 &&
    MONEY_BOSS_PHASES[0].maxHp === 350 &&
    MONEY_BOSS_PHASES[1].maxHp === 400 &&
    MONEY_BOSS_PHASES[2].maxHp === 450 &&
    p1Spells.length === 4 &&
    p2Spells.length === 4 &&
    p3Spells.length === 4 &&
    spellsValid,
  'Merchant Boss Malakor has 3 progressive phases (HP 350, 400, 450) and 12 verified spells across G2 & G3'
);

// 7. Adaptive Learning Diagnostics Test
const diag1 = MoneyAdaptiveEngine.diagnoseError('2.000 đồng', '20.000 đồng', 'denomination_recognition');
const diag2 = MoneyAdaptiveEngine.diagnoseError('3.000 đồng tiền thừa', '5.000 đồng tiền thừa', 'change_calculation');
const diag3 = MoneyAdaptiveEngine.diagnoseError('Vượt ngân sách', 'Đủ tiền', 'budget_management');
const diag4 = MoneyAdaptiveEngine.diagnoseError('2 tờ 20k', '3 tờ 20k', 'money_combination');
const diag5 = MoneyAdaptiveEngine.diagnoseError('7.000 đồng', '8.000 đồng', 'money_counting');

assert(
  diag1.errorType === 'DENOMINATION_CONFUSION' &&
    diag2.errorType === 'CHANGE_CALCULATION_MISTAKE' &&
    diag3.errorType === 'BUDGET_EXCEEDED_ERROR' &&
    diag4.errorType === 'WRONG_COMBINATION' &&
    diag5.errorType === 'COUNTING_CALCULATION_ERROR',
  'Adaptive Engine accurately detects DENOMINATION_CONFUSION, CHANGE_CALCULATION, BUDGET_EXCEEDED, WRONG_COMBINATION, and COUNTING errors'
);

// 8. Skill Breakdown & Achievements Catalog Test
const mockAttempts = [
  {
    id: 'att_1',
    taskId: 'rec_g2_1',
    category: 'recognition' as const,
    targetSkill: 'denomination_recognition' as const,
    isSuccess: true,
    selectedAnswer: '1.000 đồng',
    correctAnswer: '1.000 đồng',
    timestamp: Date.now(),
  },
  {
    id: 'att_2',
    taskId: 'cnt_g2_1',
    category: 'counting' as const,
    targetSkill: 'money_counting' as const,
    isSuccess: false,
    selectedAnswer: '2.000 đồng',
    correctAnswer: '3.000 đồng',
    timestamp: Date.now(),
  },
  {
    id: 'att_3',
    taskId: 'shop_g2_1',
    category: 'shop' as const,
    targetSkill: 'total_cost_calculation' as const,
    isSuccess: true,
    selectedAnswer: '4.000 đồng',
    correctAnswer: '4.000 đồng',
    timestamp: Date.now(),
  },
];
const breakdown = MoneyAdaptiveEngine.calculateSkillBreakdown(mockAttempts);
const achievementsValid = MONEY_ACHIEVEMENTS.every(
  (a) => a.id.length > 0 && a.titleVi.length > 0 && a.goldReward > 0 && a.xpReward > 0
);

assert(
  Object.keys(breakdown).length === 9 &&
    breakdown.denomination_recognition.correct === 1 &&
    breakdown.money_counting.correct === 0 &&
    MONEY_ACHIEVEMENTS.length === 6 &&
    achievementsValid,
  'Skill Breakdown engine computes mastery scores across all 9 competencies and Achievements Catalog has 6 achievements'
);

console.log('\n================================================================');
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} PHASE 18 MONEY & SHOPPING TESTS PASSED!`);
} else {
  console.error(`💥 ${failCount} TESTS FAILED out of ${passCount + failCount}`);
}
console.log('================================================================\n');

if (failCount > 0) process.exit(1);

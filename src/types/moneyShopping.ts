export type MoneyZone =
  | 'recognition'
  | 'counting'
  | 'interactive_shop'
  | 'budget_challenge'
  | 'boss_arena'
  | 'analytics';

export type MoneyDenomination =
  | 100
  | 200
  | 500
  | 1000
  | 2000
  | 5000
  | 10000
  | 20000
  | 50000
  | 100000;

export type MoneySkillId =
  | 'denomination_recognition' // Nhận biết mệnh giá tờ tiền
  | 'money_counting' // Đếm tổng số tiền trong một tập hợp
  | 'money_combination' // Phối hợp các mệnh giá tạo thành số tiền cho trước
  | 'money_comparison' // So sánh hai số tiền / hai xấp tiền
  | 'total_cost_calculation' // Tính tổng tiền hóa đơn mua nhiều món
  | 'change_calculation' // Tính tiền trả lại (tiền thối)
  | 'budget_management' // Quản lý chi tiêu không vượt ngân sách
  | 'shopping_word_problem' // Giải bài toán mua sắm có lời văn
  | 'smart_pricing_evaluation'; // Đánh giá mua sắm thông thái

export type MoneyErrorType =
  | 'NONE'
  | 'DENOMINATION_CONFUSION' // Nhầm mệnh giá (nhìn nhầm 2k thành 20k, 10k thành 100k)
  | 'COUNTING_CALCULATION_ERROR' // Đếm thiếu hoặc thừa, cộng sai tổng giá trị tiền
  | 'CHANGE_CALCULATION_MISTAKE' // Trừ sai tiền thừa cần trả lại
  | 'BUDGET_EXCEEDED_ERROR' // Chọn tổng tiền vượt quá ngân sách cho phép
  | 'WRONG_COMBINATION'; // Chọn tổ hợp tiền chưa đủ hoặc vượt số tiền yêu cầu

export interface CurrencyBill {
  denomination: MoneyDenomination;
  labelVi: string;
  gradeLevel: 'grade-2' | 'grade-3';
  colorHex: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  descriptionVi: string;
  material: 'cotton' | 'polymer';
  featureHintVi: string;
}

export type ShopItemCategory = 'food' | 'school' | 'adventure' | 'gear';

export interface ShopItem {
  id: string;
  nameVi: string;
  category: ShopItemCategory;
  price: number; // in VND
  gradeLevel: 'grade-2' | 'grade-3';
  icon: string;
  descriptionVi: string;
  popular?: boolean;
}

export interface CartItem {
  item: ShopItem;
  quantity: number;
}

export interface MoneyRecognitionTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  promptVi: string;
  denomination: MoneyDenomination;
  targetProperty?: 'color' | 'face_value' | 'material' | 'reading';
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: MoneySkillId;
}

export interface BillGroupItem {
  denomination: MoneyDenomination;
  count: number;
}

export interface MoneyCountingTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  taskType: 'count_total' | 'make_amount' | 'compare_amounts';
  titleVi: string;
  promptVi: string;
  billsGroup: BillGroupItem[];
  targetAmount?: number;
  compareGroupB?: BillGroupItem[];
  expectedComparison?: '>' | '<' | '=';
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: MoneySkillId;
}

export interface ShoppingChallengeTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  storyContextVi: string;
  itemsToBuy: { item: ShopItem; count: number }[];
  cashPaid: number;
  correctTotal: number;
  correctChange: number;
  promptVi: string;
  options: string[];
  correctIndex: number;
  questionType: 'total_cost' | 'change_due' | 'is_enough_cash';
  explanationVi: string;
  hintVi: string;
  targetSkill: MoneySkillId;
}

export interface BudgetChallengeTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  scenarioVi: string;
  initialBudget: number;
  availableItems: ShopItem[];
  promptVi: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: MoneySkillId;
}

export interface MoneyBossSpellQuestion {
  id: string;
  phaseIndex: number;
  gradeLevel: 'grade-2' | 'grade-3';
  spellNameVi: string;
  bossDialogueVi: string;
  challengeTextVi: string;
  billsShown?: BillGroupItem[];
  options: string[];
  correctIndex: number;
  explanationVi: string;
  damage: number;
  targetSkill: MoneySkillId;
}

export interface MoneyBossPhase {
  phaseIndex: number;
  phaseNameVi: string;
  maxHp: number;
  themeVi: string;
  descriptionVi: string;
}

export interface MoneyAchievement {
  id: string;
  titleVi: string;
  descriptionVi: string;
  icon: string;
  goldReward: number;
  xpReward: number;
}

export interface MoneySkillBreakdown {
  skillId: MoneySkillId;
  nameVi: string;
  score: number; // 0 - 100
  attempts: number;
  correct: number;
  status: 'mastered' | 'learning' | 'struggling';
}

export interface MoneyAttemptRecord {
  id: string;
  taskId: string;
  category: 'recognition' | 'counting' | 'shop' | 'budget' | 'boss';
  targetSkill: MoneySkillId;
  isSuccess: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  errorType?: MoneyErrorType;
  timestamp: number;
}

export interface MoneyKingdomProgress {
  completedTasks: string[];
  bossDefeatedPhases: number[];
  unlockedAchievements: string[];
  totalShoppingPurchases: number;
  totalCashHandled: number;
  totalChangeCalculated: number;
}

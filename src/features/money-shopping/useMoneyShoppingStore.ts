import { create } from 'zustand';
import type {
  MoneyZone,
  CurrencyBill,
  ShopItem,
  ShopItemCategory,
  CartItem,
  MoneyRecognitionTask,
  MoneyCountingTask,
  ShoppingChallengeTask,
  BudgetChallengeTask,
  MoneyBossSpellQuestion,
  MoneyKingdomProgress,
  MoneyAttemptRecord,
  MoneyDenomination,
  MoneySkillId,
} from '@/types/moneyShopping';
import type { CampaignId } from '@/types/campaign';
import { VIETNAMESE_BILLS_CATALOG } from './data/currencyCatalog';
import { SHOP_ITEMS_CATALOG } from './data/shopItemsCatalog';
import {
  RECOGNITION_TASKS_CATALOG,
  COUNTING_TASKS_CATALOG,
} from './data/moneyTasksCatalog';
import { SHOPPING_TASKS_CATALOG } from './data/shoppingTasksCatalog';
import { BUDGET_TASKS_CATALOG } from './data/budgetTasksCatalog';
import {
  MONEY_BOSS_PHASES,
  MONEY_BOSS_SPELLS,
} from './data/moneyBossCatalog';
import { MONEY_ACHIEVEMENTS } from './data/moneyAchievementsCatalog';
import { MoneyAdaptiveEngine, type MoneyDiagnosticResult } from './services/moneyAdaptiveEngine';
import { persistenceService } from '@/services/persistence/persistenceService';

export interface MoneyShoppingState {
  activeZone: MoneyZone | 'hub';
  campaignId: CampaignId;
  setActiveZone: (zone: MoneyZone | 'hub') => void;
  setCampaignId: (campaignId: CampaignId) => void;

  // Recognition
  recognitionIndex: number;
  activeRecognitionTask: MoneyRecognitionTask;
  selectedBillDetail: CurrencyBill | null;
  recognitionFeedback: { isCorrect?: boolean; message: string; diagnostic?: MoneyDiagnosticResult } | null;
  selectBillDetail: (bill: CurrencyBill | null) => void;
  answerRecognitionTask: (selectedIdx: number) => boolean;
  nextRecognitionTask: () => void;

  // Counting & Combination
  countingIndex: number;
  activeCountingTask: MoneyCountingTask;
  tableBills: { denomination: MoneyDenomination; count: number }[];
  countingFeedback: { isCorrect?: boolean; message: string; diagnostic?: MoneyDiagnosticResult } | null;
  addBillToTable: (denomination: MoneyDenomination) => void;
  removeBillFromTable: (denomination: MoneyDenomination) => void;
  clearTable: () => void;
  getTableTotal: () => number;
  answerCountingTask: (selectedIdx: number) => boolean;
  verifyTableAmount: () => boolean;
  nextCountingTask: () => void;

  // Interactive Shopping Simulation
  selectedShopCategory: ShopItemCategory | 'all';
  cart: CartItem[];
  shoppingIndex: number;
  activeShoppingTask: ShoppingChallengeTask;
  walletCashGiven: number;
  shoppingReceipt: {
    items: CartItem[];
    total: number;
    cashPaid: number;
    change: number;
    time: string;
  } | null;
  shoppingFeedback: { isCorrect?: boolean; message: string; diagnostic?: MoneyDiagnosticResult } | null;
  setShopCategory: (category: ShopItemCategory | 'all') => void;
  addToCart: (item: ShopItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  addPaymentBill: (denomination: MoneyDenomination) => void;
  clearPaymentCash: () => void;
  processShopCheckout: (userCalculatedChange: number) => boolean;
  answerShoppingTask: (selectedIdx: number) => boolean;
  nextShoppingTask: () => void;

  // Budget Challenge
  budgetIndex: number;
  activeBudgetTask: BudgetChallengeTask;
  budgetFeedback: { isCorrect?: boolean; message: string; diagnostic?: MoneyDiagnosticResult } | null;
  answerBudgetTask: (selectedIdx: number) => boolean;
  nextBudgetTask: () => void;

  // Boss Battle
  currentPhaseIndex: number;
  bossHp: number;
  bossMaxHp: number;
  tonyHp: number;
  tonyMaxHp: number;
  bossSpellIndex: number;
  activeBossSpell: MoneyBossSpellQuestion;
  comboStreak: number;
  shieldActive: boolean;
  bossBattleFinished: boolean;
  bossVictory: boolean;
  bossFeedback: { isCorrect?: boolean; message: string; diagnostic?: MoneyDiagnosticResult } | null;
  answerBossSpell: (selectedIdx: number) => boolean;
  restartBossBattle: () => void;

  // Progress & Analytics
  attempts: MoneyAttemptRecord[];
  progress: MoneyKingdomProgress;
  recordAttempt: (record: Omit<MoneyAttemptRecord, 'id' | 'timestamp'>) => void;
  unlockAchievement: (id: string) => void;
  loadInitialState: () => Promise<void>;
}

export const useMoneyShoppingStore = create<MoneyShoppingState>((set, get) => {
  const defaultGrade: 'grade-2' | 'grade-3' = 'grade-2';

  const filterTasks = <T extends { gradeLevel: 'grade-2' | 'grade-3' }>(
    catalog: T[],
    grade: 'grade-2' | 'grade-3'
  ): T[] => catalog.filter((t) => t.gradeLevel === grade);

  const initialRecognitionTasks = filterTasks(RECOGNITION_TASKS_CATALOG, defaultGrade);
  const initialCountingTasks = filterTasks(COUNTING_TASKS_CATALOG, defaultGrade);
  const initialShoppingTasks = filterTasks(SHOPPING_TASKS_CATALOG, defaultGrade);
  const initialBudgetTasks = filterTasks(BUDGET_TASKS_CATALOG, defaultGrade);
  const initialSpells = filterTasks(
    MONEY_BOSS_SPELLS.filter((s) => s.phaseIndex === 1),
    defaultGrade
  );

  return {
    activeZone: 'hub',
    campaignId: 'grade-2',
    setActiveZone: (zone) => set({ activeZone: zone }),

    setCampaignId: (campaignId) => {
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const recTasks = filterTasks(RECOGNITION_TASKS_CATALOG, g);
      const cntTasks = filterTasks(COUNTING_TASKS_CATALOG, g);
      const shopTasks = filterTasks(SHOPPING_TASKS_CATALOG, g);
      const bgtTasks = filterTasks(BUDGET_TASKS_CATALOG, g);
      const phaseSpells = filterTasks(
        MONEY_BOSS_SPELLS.filter((s) => s.phaseIndex === 1),
        g
      );

      set({
        campaignId,
        recognitionIndex: 0,
        activeRecognitionTask: recTasks[0] || RECOGNITION_TASKS_CATALOG[0],
        recognitionFeedback: null,
        countingIndex: 0,
        activeCountingTask: cntTasks[0] || COUNTING_TASKS_CATALOG[0],
        countingFeedback: null,
        shoppingIndex: 0,
        activeShoppingTask: shopTasks[0] || SHOPPING_TASKS_CATALOG[0],
        shoppingFeedback: null,
        budgetIndex: 0,
        activeBudgetTask: bgtTasks[0] || BUDGET_TASKS_CATALOG[0],
        budgetFeedback: null,
        currentPhaseIndex: 1,
        bossHp: MONEY_BOSS_PHASES[0].maxHp,
        bossMaxHp: MONEY_BOSS_PHASES[0].maxHp,
        tonyHp: 100,
        tonyMaxHp: 100,
        bossSpellIndex: 0,
        activeBossSpell: phaseSpells[0] || MONEY_BOSS_SPELLS[0],
        comboStreak: 0,
        bossBattleFinished: false,
        bossVictory: false,
        bossFeedback: null,
      });
    },

    // Recognition
    recognitionIndex: 0,
    activeRecognitionTask: initialRecognitionTasks[0] || RECOGNITION_TASKS_CATALOG[0],
    selectedBillDetail: VIETNAMESE_BILLS_CATALOG[3], // default 1k
    recognitionFeedback: null,

    selectBillDetail: (bill) => set({ selectedBillDetail: bill }),

    answerRecognitionTask: (selectedIdx) => {
      const { activeRecognitionTask, recordAttempt } = get();
      const isCorrect = selectedIdx === activeRecognitionTask.correctIndex;
      const selectedOption = activeRecognitionTask.options[selectedIdx];
      const correctOption = activeRecognitionTask.options[activeRecognitionTask.correctIndex];

      const diagnostic = isCorrect
        ? undefined
        : MoneyAdaptiveEngine.diagnoseError(
            selectedOption,
            correctOption,
            activeRecognitionTask.targetSkill
          );

      recordAttempt({
        taskId: activeRecognitionTask.id,
        category: 'recognition',
        targetSkill: activeRecognitionTask.targetSkill,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
        errorType: diagnostic?.errorType || 'NONE',
      });

      set({
        recognitionFeedback: {
          isCorrect,
          message: isCorrect
            ? 'Chính xác! Tony đã nhận diện tờ tiền rất chuẩn xác!'
            : `Chưa đúng rồi! ${activeRecognitionTask.explanationVi}`,
          diagnostic,
        },
      });

      return isCorrect;
    },

    nextRecognitionTask: () => {
      const { campaignId, recognitionIndex } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const tasks = filterTasks(RECOGNITION_TASKS_CATALOG, g);
      const nextIdx = (recognitionIndex + 1) % tasks.length;
      set({
        recognitionIndex: nextIdx,
        activeRecognitionTask: tasks[nextIdx],
        recognitionFeedback: null,
      });
    },

    // Counting & Combination
    countingIndex: 0,
    activeCountingTask: initialCountingTasks[0] || COUNTING_TASKS_CATALOG[0],
    tableBills: [],
    countingFeedback: null,

    addBillToTable: (denomination) => {
      const { tableBills } = get();
      const existing = tableBills.find((b) => b.denomination === denomination);
      if (existing) {
        set({
          tableBills: tableBills.map((b) =>
            b.denomination === denomination ? { ...b, count: b.count + 1 } : b
          ),
        });
      } else {
        set({ tableBills: [...tableBills, { denomination, count: 1 }] });
      }
    },

    removeBillFromTable: (denomination) => {
      const { tableBills } = get();
      const existing = tableBills.find((b) => b.denomination === denomination);
      if (!existing) return;
      if (existing.count > 1) {
        set({
          tableBills: tableBills.map((b) =>
            b.denomination === denomination ? { ...b, count: b.count - 1 } : b
          ),
        });
      } else {
        set({ tableBills: tableBills.filter((b) => b.denomination !== denomination) });
      }
    },

    clearTable: () => set({ tableBills: [] }),

    getTableTotal: () => {
      const { tableBills } = get();
      return tableBills.reduce((sum, b) => sum + b.denomination * b.count, 0);
    },

    answerCountingTask: (selectedIdx) => {
      const { activeCountingTask, recordAttempt } = get();
      const isCorrect = selectedIdx === activeCountingTask.correctIndex;
      const selectedOption = activeCountingTask.options[selectedIdx];
      const correctOption = activeCountingTask.options[activeCountingTask.correctIndex];

      const diagnostic = isCorrect
        ? undefined
        : MoneyAdaptiveEngine.diagnoseError(
            selectedOption,
            correctOption,
            activeCountingTask.targetSkill
          );

      recordAttempt({
        taskId: activeCountingTask.id,
        category: 'counting',
        targetSkill: activeCountingTask.targetSkill,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
        errorType: diagnostic?.errorType || 'NONE',
      });

      set({
        countingFeedback: {
          isCorrect,
          message: isCorrect
            ? 'Xuất sắc! Tony đã tính toán số tiền hoàn toàn chính xác!'
            : `Chưa đúng! ${activeCountingTask.explanationVi}`,
          diagnostic,
        },
      });

      return isCorrect;
    },

    verifyTableAmount: () => {
      const { activeCountingTask, getTableTotal, recordAttempt } = get();
      const currentTotal = getTableTotal();
      const target = activeCountingTask.targetAmount || 0;
      const isCorrect = currentTotal === target;

      const diagnostic = isCorrect
        ? undefined
        : MoneyAdaptiveEngine.diagnoseError(
            `${currentTotal} đồng`,
            `${target} đồng`,
            activeCountingTask.targetSkill
          );

      recordAttempt({
        taskId: activeCountingTask.id,
        category: 'counting',
        targetSkill: activeCountingTask.targetSkill,
        isSuccess: isCorrect,
        selectedAnswer: `${currentTotal} đồng`,
        correctAnswer: `${target} đồng`,
        errorType: diagnostic?.errorType || 'NONE',
      });

      set({
        countingFeedback: {
          isCorrect,
          message: isCorrect
            ? `Tuyệt vời! Tony đã ghép đúng ${target.toLocaleString('vi-VN')} đồng!`
            : `Hiện tại trên bàn có ${currentTotal.toLocaleString('vi-VN')} đồng. Cần có đúng ${target.toLocaleString('vi-VN')} đồng.`,
          diagnostic,
        },
      });

      return isCorrect;
    },

    nextCountingTask: () => {
      const { campaignId, countingIndex } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const tasks = filterTasks(COUNTING_TASKS_CATALOG, g);
      const nextIdx = (countingIndex + 1) % tasks.length;
      set({
        countingIndex: nextIdx,
        activeCountingTask: tasks[nextIdx],
        tableBills: [],
        countingFeedback: null,
      });
    },

    // Interactive Shopping Simulation
    selectedShopCategory: 'all',
    cart: [],
    shoppingIndex: 0,
    activeShoppingTask: initialShoppingTasks[0] || SHOPPING_TASKS_CATALOG[0],
    walletCashGiven: 0,
    shoppingReceipt: null,
    shoppingFeedback: null,

    setShopCategory: (category) => set({ selectedShopCategory: category }),

    addToCart: (item) => {
      const { cart } = get();
      const existing = cart.find((c) => c.item.id === item.id);
      if (existing) {
        set({
          cart: cart.map((c) =>
            c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        });
      } else {
        set({ cart: [...cart, { item, quantity: 1 }] });
      }
    },

    removeFromCart: (itemId) => {
      const { cart } = get();
      set({ cart: cart.filter((c) => c.item.id !== itemId) });
    },

    updateCartQuantity: (itemId, quantity) => {
      const { cart } = get();
      if (quantity <= 0) {
        set({ cart: cart.filter((c) => c.item.id !== itemId) });
      } else {
        set({
          cart: cart.map((c) => (c.item.id === itemId ? { ...c, quantity } : c)),
        });
      }
    },

    clearCart: () => set({ cart: [], walletCashGiven: 0, shoppingReceipt: null }),

    getCartTotal: () => {
      const { cart } = get();
      return cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
    },

    addPaymentBill: (denomination) => {
      const { walletCashGiven } = get();
      set({ walletCashGiven: walletCashGiven + denomination });
    },

    clearPaymentCash: () => set({ walletCashGiven: 0 }),

    processShopCheckout: (userCalculatedChange) => {
      const { cart, walletCashGiven, getCartTotal, recordAttempt, progress } = get();
      const total = getCartTotal();

      if (total === 0) {
        set({
          shoppingFeedback: {
            isCorrect: false,
            message: 'Giỏ hàng đang trống! Tony hãy chọn ít nhất 1 món đồ nhé.',
          },
        });
        return false;
      }

      if (walletCashGiven < total) {
        const diagnostic: MoneyDiagnosticResult = {
          errorType: 'BUDGET_EXCEEDED_ERROR',
          remediationAdviceVi: `Số tiền đưa (${walletCashGiven.toLocaleString('vi-VN')} đ) nhỏ hơn tổng hóa đơn (${total.toLocaleString('vi-VN')} đ). Tony hãy đưa thêm tiền nhé!`,
          recommendedZone: 'interactive_shop',
        };
        set({
          shoppingFeedback: {
            isCorrect: false,
            message: `Chưa đủ tiền thanh toán! Tổng hóa đơn là ${total.toLocaleString('vi-VN')} đ.`,
            diagnostic,
          },
        });
        return false;
      }

      const exactChange = walletCashGiven - total;
      const isChangeCorrect = userCalculatedChange === exactChange;

      recordAttempt({
        taskId: `shop_checkout_${Date.now()}`,
        category: 'shop',
        targetSkill: 'change_calculation',
        isSuccess: isChangeCorrect,
        selectedAnswer: `${userCalculatedChange} đồng`,
        correctAnswer: `${exactChange} đồng`,
        errorType: isChangeCorrect ? 'NONE' : 'CHANGE_CALCULATION_MISTAKE',
      });

      if (!isChangeCorrect) {
        set({
          shoppingFeedback: {
            isCorrect: false,
            message: `Tính tiền thừa chưa đúng! Tiền Tony đưa: ${walletCashGiven.toLocaleString('vi-VN')} đ - Tổng tiền: ${total.toLocaleString('vi-VN')} đ = Tiền thừa phải là ${exactChange.toLocaleString('vi-VN')} đ.`,
          },
        });
        return false;
      }

      // Success checkout
      const receipt = {
        items: [...cart],
        total,
        cashPaid: walletCashGiven,
        change: exactChange,
        time: new Date().toLocaleTimeString('vi-VN'),
      };

      const updatedProgress: MoneyKingdomProgress = {
        ...progress,
        totalShoppingPurchases: progress.totalShoppingPurchases + 1,
        totalCashHandled: progress.totalCashHandled + walletCashGiven,
        totalChangeCalculated: progress.totalChangeCalculated + exactChange,
      };

      set({
        shoppingReceipt: receipt,
        cart: [],
        walletCashGiven: 0,
        progress: updatedProgress,
        shoppingFeedback: {
          isCorrect: true,
          message: `Giao dịch thành công! Tony đã tính đúng tiền thừa: ${exactChange.toLocaleString('vi-VN')} đ. Bác bán hàng rất hài lòng!`,
        },
      });

      // Save to persistence
      persistenceService.saveCustomData('money_kingdom_progress', updatedProgress);

      return true;
    },

    answerShoppingTask: (selectedIdx) => {
      const { activeShoppingTask, recordAttempt } = get();
      const isCorrect = selectedIdx === activeShoppingTask.correctIndex;
      const selectedOption = activeShoppingTask.options[selectedIdx];
      const correctOption = activeShoppingTask.options[activeShoppingTask.correctIndex];

      const diagnostic = isCorrect
        ? undefined
        : MoneyAdaptiveEngine.diagnoseError(
            selectedOption,
            correctOption,
            activeShoppingTask.targetSkill
          );

      recordAttempt({
        taskId: activeShoppingTask.id,
        category: 'shop',
        targetSkill: activeShoppingTask.targetSkill,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
        errorType: diagnostic?.errorType || 'NONE',
      });

      set({
        shoppingFeedback: {
          isCorrect,
          message: isCorrect
            ? 'Chính xác! Tony giải quyết bài toán mua sắm rất thông minh!'
            : `Chưa đúng! ${activeShoppingTask.explanationVi}`,
          diagnostic,
        },
      });

      return isCorrect;
    },

    nextShoppingTask: () => {
      const { campaignId, shoppingIndex } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const tasks = filterTasks(SHOPPING_TASKS_CATALOG, g);
      const nextIdx = (shoppingIndex + 1) % tasks.length;
      set({
        shoppingIndex: nextIdx,
        activeShoppingTask: tasks[nextIdx],
        shoppingFeedback: null,
      });
    },

    // Budget Challenge
    budgetIndex: 0,
    activeBudgetTask: initialBudgetTasks[0] || BUDGET_TASKS_CATALOG[0],
    budgetFeedback: null,

    answerBudgetTask: (selectedIdx) => {
      const { activeBudgetTask, recordAttempt } = get();
      const isCorrect = selectedIdx === activeBudgetTask.correctIndex;
      const selectedOption = activeBudgetTask.options[selectedIdx];
      const correctOption = activeBudgetTask.options[activeBudgetTask.correctIndex];

      const diagnostic = isCorrect
        ? undefined
        : MoneyAdaptiveEngine.diagnoseError(
            selectedOption,
            correctOption,
            activeBudgetTask.targetSkill
          );

      recordAttempt({
        taskId: activeBudgetTask.id,
        category: 'budget',
        targetSkill: activeBudgetTask.targetSkill,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
        errorType: diagnostic?.errorType || 'NONE',
      });

      set({
        budgetFeedback: {
          isCorrect,
          message: isCorrect
            ? 'Rất xuất sắc! Tony quản lý ngân sách rất khoa học và thông thái!'
            : `Chưa chính xác! ${activeBudgetTask.explanationVi}`,
          diagnostic,
        },
      });

      return isCorrect;
    },

    nextBudgetTask: () => {
      const { campaignId, budgetIndex } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const tasks = filterTasks(BUDGET_TASKS_CATALOG, g);
      const nextIdx = (budgetIndex + 1) % tasks.length;
      set({
        budgetIndex: nextIdx,
        activeBudgetTask: tasks[nextIdx],
        budgetFeedback: null,
      });
    },

    // Boss Battle
    currentPhaseIndex: 1,
    bossHp: MONEY_BOSS_PHASES[0].maxHp,
    bossMaxHp: MONEY_BOSS_PHASES[0].maxHp,
    tonyHp: 100,
    tonyMaxHp: 100,
    bossSpellIndex: 0,
    activeBossSpell: initialSpells[0] || MONEY_BOSS_SPELLS[0],
    comboStreak: 0,
    shieldActive: false,
    bossBattleFinished: false,
    bossVictory: false,
    bossFeedback: null,

    answerBossSpell: (selectedIdx) => {
      const {
        activeBossSpell,
        bossHp,
        tonyHp,
        currentPhaseIndex,
        comboStreak,
        shieldActive,
        campaignId,
        bossSpellIndex,
        recordAttempt,
        progress,
        unlockAchievement,
      } = get();

      const isCorrect = selectedIdx === activeBossSpell.correctIndex;
      const selectedOption = activeBossSpell.options[selectedIdx];
      const correctOption = activeBossSpell.options[activeBossSpell.correctIndex];

      const diagnostic = isCorrect
        ? undefined
        : MoneyAdaptiveEngine.diagnoseError(
            selectedOption,
            correctOption,
            activeBossSpell.targetSkill
          );

      recordAttempt({
        taskId: activeBossSpell.id,
        category: 'boss',
        targetSkill: activeBossSpell.targetSkill,
        isSuccess: isCorrect,
        selectedAnswer: selectedOption,
        correctAnswer: correctOption,
        errorType: diagnostic?.errorType || 'NONE',
      });

      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';

      if (isCorrect) {
        const bonusDamage = comboStreak * 15;
        const totalDamage = activeBossSpell.damage + bonusDamage;
        const newBossHp = Math.max(0, bossHp - totalDamage);
        const newCombo = comboStreak + 1;
        const newShield = newCombo >= 3;

        if (newBossHp === 0) {
          // Phase cleared
          if (currentPhaseIndex < 3) {
            const nextPhase = currentPhaseIndex + 1;
            const nextPhaseConfig = MONEY_BOSS_PHASES[nextPhase - 1];
            const nextSpells = filterTasks(
              MONEY_BOSS_SPELLS.filter((s) => s.phaseIndex === nextPhase),
              g
            );

            set({
              currentPhaseIndex: nextPhase,
              bossHp: nextPhaseConfig.maxHp,
              bossMaxHp: nextPhaseConfig.maxHp,
              tonyHp: 100,
              bossSpellIndex: 0,
              activeBossSpell: nextSpells[0] || MONEY_BOSS_SPELLS[0],
              comboStreak: newCombo,
              shieldActive: newShield,
              bossFeedback: {
                isCorrect: true,
                message: `Tuyệt đỉnh! Đã phá vỡ ${MONEY_BOSS_PHASES[currentPhaseIndex - 1].phaseNameVi}! Chuẩn bị bước vào ${nextPhaseConfig.phaseNameVi}!`,
              },
            });
          } else {
            // Boss fully defeated!
            unlockAchievement('merchant_boss_slayer');
            const updatedPhases = Array.from(new Set([...progress.bossDefeatedPhases, 1, 2, 3]));
            const updatedProgress = { ...progress, bossDefeatedPhases: updatedPhases };
            persistenceService.saveCustomData('money_kingdom_progress', updatedProgress);

            set({
              bossHp: 0,
              bossBattleFinished: true,
              bossVictory: true,
              progress: updatedProgress,
              bossFeedback: {
                isCorrect: true,
                message: 'CHIẾN THẮNG HUY HOÀNG! Tony đã đánh bại Dark Merchant Lord Malakor và đem lại sự phồn vinh cho Vương Quốc Tiền Tệ!',
              },
            });
          }
        } else {
          // Next spell in current phase
          const phaseSpells = filterTasks(
            MONEY_BOSS_SPELLS.filter((s) => s.phaseIndex === currentPhaseIndex),
            g
          );
          const nextIdx = (bossSpellIndex + 1) % phaseSpells.length;

          set({
            bossHp: newBossHp,
            comboStreak: newCombo,
            shieldActive: newShield,
            bossSpellIndex: nextIdx,
            activeBossSpell: phaseSpells[nextIdx],
            bossFeedback: {
              isCorrect: true,
              message: `Đòn đánh chính xác! Gây ${totalDamage} sát thương lên Malakor! (Combo x${newCombo})`,
            },
          });
        }
        return true;
      } else {
        // Tony takes damage
        const damageTaken = shieldActive ? 0 : 25;
        const newTonyHp = Math.max(0, tonyHp - damageTaken);

        if (newTonyHp === 0) {
          set({
            tonyHp: 0,
            comboStreak: 0,
            shieldActive: false,
            bossBattleFinished: true,
            bossVictory: false,
            bossFeedback: {
              isCorrect: false,
              message: 'Tony đã kiệt sức trước ma thuật của Boss! Hãy bấm nút Thử Lại để phục hồi và tiếp tục chiến đấu.',
              diagnostic,
            },
          });
        } else {
          set({
            tonyHp: newTonyHp,
            comboStreak: 0,
            shieldActive: false,
            bossFeedback: {
              isCorrect: false,
              message: shieldActive
                ? 'Khiên thần bảo vệ Tony khỏi đòn đánh! Mau tính toán lại câu tiếp theo!'
                : `Tony bị trúng đòn gian thương mất 25 HP! ${activeBossSpell.explanationVi}`,
              diagnostic,
            },
          });
        }
        return false;
      }
    },

    restartBossBattle: () => {
      const { campaignId } = get();
      const g = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const initialPhaseSpells = filterTasks(
        MONEY_BOSS_SPELLS.filter((s) => s.phaseIndex === 1),
        g
      );

      set({
        currentPhaseIndex: 1,
        bossHp: MONEY_BOSS_PHASES[0].maxHp,
        bossMaxHp: MONEY_BOSS_PHASES[0].maxHp,
        tonyHp: 100,
        bossSpellIndex: 0,
        activeBossSpell: initialPhaseSpells[0] || MONEY_BOSS_SPELLS[0],
        comboStreak: 0,
        shieldActive: false,
        bossBattleFinished: false,
        bossVictory: false,
        bossFeedback: null,
      });
    },

    // Progress & Persistence
    attempts: [],
    progress: {
      completedTasks: [],
      bossDefeatedPhases: [],
      unlockedAchievements: [],
      totalShoppingPurchases: 0,
      totalCashHandled: 0,
      totalChangeCalculated: 0,
    },

    recordAttempt: (record) => {
      const fullRecord: MoneyAttemptRecord = {
        ...record,
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
      };
      set((state) => {
        const updatedAttempts = [...state.attempts, fullRecord];
        persistenceService.saveCustomData('money_attempts', updatedAttempts);
        return { attempts: updatedAttempts };
      });
    },

    unlockAchievement: (id) => {
      set((state) => {
        if (state.progress.unlockedAchievements.includes(id)) return state;
        const updated = {
          ...state.progress,
          unlockedAchievements: [...state.progress.unlockedAchievements, id],
        };
        persistenceService.saveCustomData('money_kingdom_progress', updated);
        return { progress: updated };
      });
    },

    loadInitialState: async () => {
      try {
        const savedProgress = await persistenceService.getCustomData<MoneyKingdomProgress>(
          'money_kingdom_progress'
        );
        const savedAttempts = await persistenceService.getCustomData<MoneyAttemptRecord[]>(
          'money_attempts'
        );

        if (savedProgress) {
          set({ progress: savedProgress });
        }
        if (savedAttempts && Array.isArray(savedAttempts)) {
          set({ attempts: savedAttempts });
        }
      } catch (err) {
        console.warn('Failed to load initial money state:', err);
      }
    },
  };
});

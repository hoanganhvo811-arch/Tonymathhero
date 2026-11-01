import type { ShoppingChallengeTask } from '@/types/moneyShopping';
import { SHOP_ITEMS_CATALOG } from './shopItemsCatalog';

// Find items helper
const getItem = (id: string) => {
  const item = SHOP_ITEMS_CATALOG.find((i) => i.id === id);
  if (!item) throw new Error(`Item ${id} not found`);
  return item;
};

export const SHOPPING_TASKS_CATALOG: ShoppingChallengeTask[] = [
  // --- GRADE 2 (6 tasks - Calculations within 10.000đ) ---
  {
    id: 'shop_g2_1',
    gradeLevel: 'grade-2',
    titleVi: 'Mua kẹo và bánh quy',
    storyContextVi: 'Tony vào tiệm bánh kẹo để nạp năng lượng sau chặng đường dài.',
    itemsToBuy: [
      { item: getItem('food_lollipop'), count: 2 }, // 1000 * 2 = 2000
      { item: getItem('food_biscuit'), count: 1 }, // 2000 * 1 = 2000
    ],
    cashPaid: 5000,
    correctTotal: 4000,
    correctChange: 1000,
    promptVi: 'Tony mua 2 cây kẹo mút (1.000đ/cây) và 1 chiếc bánh quy (2.000đ). Tổng số tiền Tony phải trả là bao nhiêu?',
    options: ['3.000 đồng', '4.000 đồng', '5.000 đồng', '6.000 đồng'],
    correctIndex: 1,
    questionType: 'total_cost',
    explanationVi: 'Tiền kẹo: 1.000 x 2 = 2.000đ. Tổng tiền: 2.000 + 2.000 = 4.000 đồng.',
    hintVi: 'Tính tiền 2 cây kẹo trước, rồi cộng với tiền bánh quy.',
    targetSkill: 'total_cost_calculation',
  },
  {
    id: 'shop_g2_2',
    gradeLevel: 'grade-2',
    titleVi: 'Tính tiền thừa mua bút chì',
    storyContextVi: 'Tony mua dụng cụ học tập để giải các bài toán trên bản đồ cổ.',
    itemsToBuy: [
      { item: getItem('school_pencil'), count: 1 }, // 3000
      { item: getItem('school_eraser'), count: 1 }, // 2000
    ],
    cashPaid: 10000,
    correctTotal: 5000,
    correctChange: 5000,
    promptVi: 'Tony mua 1 bút chì (3.000đ) và 1 cục tẩy (2.000đ). Tony đưa cho bác bán hàng tờ 10.000đ. Bác bán hàng phải trả lại Tony bao nhiêu tiền thừa?',
    options: ['3.000 đồng', '4.000 đồng', '5.000 đồng', '6.000 đồng'],
    correctIndex: 2,
    questionType: 'change_due',
    explanationVi: 'Tổng tiền mua hàng: 3.000 + 2.000 = 5.000đ. Tiền thừa trả lại: 10.000 - 5.000 = 5.000 đồng.',
    hintVi: 'Tiền thừa = Tiền Tony đưa (10.000đ) - Tổng tiền hàng (5.000đ).',
    targetSkill: 'change_calculation',
  },
  {
    id: 'shop_g2_3',
    gradeLevel: 'grade-2',
    titleVi: 'Mua vở ô ly và sữa tươi',
    storyContextVi: 'Tony chuẩn bị hành trang học tập cho học kỳ phép thuật mới.',
    itemsToBuy: [
      { item: getItem('school_notebook'), count: 1 }, // 8000
    ],
    cashPaid: 10000,
    correctTotal: 8000,
    correctChange: 2000,
    promptVi: 'Một quyển vở ô ly có giá 8.000đ. Tony đưa tờ 10.000đ. Số tiền thừa nhận lại là:',
    options: ['1.000 đồng', '2.000 đồng', '3.000 đồng', '18.000 đồng'],
    correctIndex: 1,
    questionType: 'change_due',
    explanationVi: '10.000 - 8.000 = 2.000 đồng.',
    hintVi: 'Lấy 10.000 trừ đi 8.000.',
    targetSkill: 'change_calculation',
  },
  {
    id: 'shop_g2_4',
    gradeLevel: 'grade-2',
    titleVi: 'Kiểm tra đủ tiền mua thước kẻ',
    storyContextVi: 'Tony muốn mua thước kẻ hình rồng con để kẻ các đoạn thẳng hình học.',
    itemsToBuy: [
      { item: getItem('school_ruler'), count: 1 }, // 5000
      { item: getItem('food_apple'), count: 1 }, // 5000
    ],
    cashPaid: 10000,
    correctTotal: 10000,
    correctChange: 0,
    promptVi: 'Thước kẻ giá 5.000đ, quả táo giá 5.000đ. Tony có tờ 10.000đ. Tony có đủ tiền mua cả 2 món không và thừa bao nhiêu?',
    options: [
      'Đủ tiền và vừa hết, không thừa đồng nào (0đ)',
      'Không đủ tiền, còn thiếu 2.000đ',
      'Đủ tiền và còn thừa 1.000đ',
      'Không đủ tiền mua món nào',
    ],
    correctIndex: 0,
    questionType: 'is_enough_cash',
    explanationVi: 'Tổng giá tiền: 5.000 + 5.000 = 10.000đ. Đúng bằng số tiền Tony có, vừa vặn không thừa không thiếu.',
    hintVi: '5.000 + 5.000 = 10.000đ.',
    targetSkill: 'shopping_word_problem',
  },
  {
    id: 'shop_g2_5',
    gradeLevel: 'grade-2',
    titleVi: 'Mua 3 chiếc kẹo mút',
    storyContextVi: 'Tony mua quà vặt chia cho các bạn đồng hành.',
    itemsToBuy: [
      { item: getItem('food_lollipop'), count: 3 }, // 1000 * 3 = 3000
      { item: getItem('school_pencil'), count: 1 }, // 3000
    ],
    cashPaid: 10000,
    correctTotal: 6000,
    correctChange: 4000,
    promptVi: 'Mua 3 chiếc kẹo mút (1.000đ/cây) và 1 cây bút chì (3.000đ). Tổng số tiền phải trả là:',
    options: ['4.000 đồng', '5.000 đồng', '6.000 đồng', '7.000 đồng'],
    correctIndex: 2,
    questionType: 'total_cost',
    explanationVi: '(1.000 x 3) + 3.000 = 3.000 + 3.000 = 6.000 đồng.',
    hintVi: '3 cây kẹo hết 3.000đ, thêm bút chì 3.000đ nữa.',
    targetSkill: 'total_cost_calculation',
  },
  {
    id: 'shop_g2_6',
    gradeLevel: 'grade-2',
    titleVi: 'Mua sữa năng lượng',
    storyContextVi: 'Hộp sữa năng lượng giúp tăng cường trí thông minh.',
    itemsToBuy: [
      { item: getItem('food_milk'), count: 1 }, // 6000
    ],
    cashPaid: 10000,
    correctTotal: 6000,
    correctChange: 4000,
    promptVi: 'Hộp sữa có giá 6.000đ. Tony đưa cho thu ngân 1 tờ 5.000đ và 1 tờ 5.000đ (tổng 10.000đ). Thu ngân thối lại bao nhiêu tiền?',
    options: ['3.000 đồng', '4.000 đồng', '5.000 đồng', '1.000 đồng'],
    correctIndex: 1,
    questionType: 'change_due',
    explanationVi: 'Tiền khách đưa là 10.000đ. Tiền hàng là 6.000đ. Tiền thối: 10.000 - 6.000 = 4.000 đồng.',
    hintVi: '10 - 6 = 4 nghìn đồng.',
    targetSkill: 'change_calculation',
  },

  // --- GRADE 3 (6 tasks - Calculations up to 100.000đ) ---
  {
    id: 'shop_g3_1',
    gradeLevel: 'grade-3',
    titleVi: 'Mua compa và bút màu sáp',
    storyContextVi: 'Tony sắm bộ dụng cụ vẽ bản đồ thám hiểm các hòn đảo bí mật.',
    itemsToBuy: [
      { item: getItem('school_compass_set'), count: 1 }, // 15000
      { item: getItem('school_color_pens'), count: 1 }, // 25000
    ],
    cashPaid: 50000,
    correctTotal: 40000,
    correctChange: 10000,
    promptVi: 'Tony mua 1 bộ compa (15.000đ) và 1 hộp bút màu (25.000đ). Tony đưa tờ 50.000đ. Bác bán hàng trả lại bao nhiêu tiền thừa?',
    options: ['5.000 đồng', '10.000 đồng', '15.000 đồng', '20.000 đồng'],
    correctIndex: 1,
    questionType: 'change_due',
    explanationVi: 'Tổng tiền mua hàng: 15.000 + 25.000 = 40.000đ. Tiền thừa: 50.000 - 40.000 = 10.000 đồng.',
    hintVi: 'Tổng tiền = 15k + 25k = 40k. Tiền thừa = 50k - 40k.',
    targetSkill: 'change_calculation',
  },
  {
    id: 'shop_g3_2',
    gradeLevel: 'grade-3',
    titleVi: 'Trang bị balo thám hiểm và la bàn',
    storyContextVi: 'Tony chuẩn bị trang bị bước vào vùng đất sương mù.',
    itemsToBuy: [
      { item: getItem('gear_backpack'), count: 1 }, // 50000
      { item: getItem('adv_compass'), count: 1 }, // 20000
    ],
    cashPaid: 100000,
    correctTotal: 70000,
    correctChange: 30000,
    promptVi: 'Balo giá 50.000đ và la bàn giá 20.000đ. Tony đưa tờ 100.000đ. Tony nhận lại số tiền thừa là:',
    options: ['20.000 đồng', '30.000 đồng', '40.000 đồng', '50.000 đồng'],
    correctIndex: 1,
    questionType: 'change_due',
    explanationVi: 'Tổng tiền: 50.000 + 20.000 = 70.000đ. Tiền thừa: 100.000 - 70.000 = 30.000 đồng.',
    hintVi: '100.000 - 70.000 = 30.000 đồng.',
    targetSkill: 'change_calculation',
  },
  {
    id: 'shop_g3_3',
    gradeLevel: 'grade-3',
    titleVi: 'Mua 2 hộp bánh kem cho tiệc mừng',
    storyContextVi: 'Đội hiệp sĩ tổ chức liên hoan sau khi giải phóng một ngôi làng.',
    itemsToBuy: [
      { item: getItem('food_cake_box'), count: 2 }, // 25000 * 2 = 50000
      { item: getItem('food_elixir'), count: 1 }, // 35000
    ],
    cashPaid: 100000,
    correctTotal: 85000,
    correctChange: 15000,
    promptVi: 'Mua 2 hộp bánh kem (25.000đ/hộp) và 1 chai nước thần (35.000đ). Tổng tiền của hóa đơn là:',
    options: ['75.000 đồng', '80.000 đồng', '85.000 đồng', '90.000 đồng'],
    correctIndex: 2,
    questionType: 'total_cost',
    explanationVi: 'Tiền 2 hộp bánh: 25.000 x 2 = 50.000đ. Tổng hóa đơn: 50.000 + 35.000 = 85.000 đồng.',
    hintVi: '25.000 x 2 = 50.000. 50.000 + 35.000 = 85.000.',
    targetSkill: 'total_cost_calculation',
  },
  {
    id: 'shop_g3_4',
    gradeLevel: 'grade-3',
    titleVi: 'Mua bách khoa toàn thư toán học',
    storyContextVi: 'Cuốn bách khoa toàn thư chứa vô số bí kíp thần kỳ.',
    itemsToBuy: [
      { item: getItem('school_math_encyclopedia'), count: 1 }, // 80000
    ],
    cashPaid: 100000,
    correctTotal: 80000,
    correctChange: 20000,
    promptVi: 'Cuốn sách Bách Khoa có giá 80.000đ. Tony đưa 2 tờ 50.000đ. Hỏi bác thủ thư phải trả lại Tony bao nhiêu tiền?',
    options: ['10.000 đồng', '20.000 đồng', '30.000 đồng', '0 đồng'],
    correctIndex: 1,
    questionType: 'change_due',
    explanationVi: 'Tony đưa 2 tờ 50.000đ = 100.000đ. Tiền thối: 100.000 - 80.000 = 20.000 đồng.',
    hintVi: '2 tờ 50k là 100k. 100k - 80k = 20k.',
    targetSkill: 'change_calculation',
  },
  {
    id: 'shop_g3_5',
    gradeLevel: 'grade-3',
    titleVi: 'Kiểm tra tiền khi mua đèn pin và ủng tốc độ',
    storyContextVi: 'Tony chuẩn bị thám hiểm mê cung hang động tối tăm.',
    itemsToBuy: [
      { item: getItem('adv_flashlight'), count: 1 }, // 30000
      { item: getItem('gear_boots'), count: 1 }, // 70000
    ],
    cashPaid: 100000,
    correctTotal: 100000,
    correctChange: 0,
    promptVi: 'Đèn pin giá 30.000đ, đôi ủng giá 70.000đ. Nếu Tony có 1 tờ 100.000đ, số tiền còn lại sau khi mua cả 2 món là:',
    options: ['0 đồng (vừa đủ tiền)', '10.000 đồng', '20.000 đồng', 'Thiếu 10.000 đồng'],
    correctIndex: 0,
    questionType: 'is_enough_cash',
    explanationVi: 'Tổng chi phí: 30.000 + 70.000 = 100.000đ. Vừa đúng bằng số tiền Tony có, số tiền còn lại là 0 đồng.',
    hintVi: '30.000 + 70.000 = 100.000 đồng.',
    targetSkill: 'shopping_word_problem',
  },
  {
    id: 'shop_g3_6',
    gradeLevel: 'grade-3',
    titleVi: 'Mua 3 chiếc la bàn thám hiểm',
    storyContextVi: 'Trang bị la bàn cho cả 3 thành viên đội tuần tra.',
    itemsToBuy: [
      { item: getItem('adv_compass'), count: 3 }, // 20000 * 3 = 60000
    ],
    cashPaid: 100000,
    correctTotal: 60000,
    correctChange: 40000,
    promptVi: 'Mỗi chiếc la bàn có giá 20.000đ. Mua 3 chiếc la bàn, trả bằng tờ 100.000đ thì nhận lại bao nhiêu tiền thừa?',
    options: ['30.000 đồng', '40.000 đồng', '50.000 đồng', '60.000 đồng'],
    correctIndex: 1,
    questionType: 'change_due',
    explanationVi: 'Tiền 3 la bàn: 20.000 x 3 = 60.000đ. Tiền thừa: 100.000 - 60.000 = 40.000 đồng.',
    hintVi: '20.000 x 3 = 60.000. 100.000 - 60.000 = 40.000.',
    targetSkill: 'change_calculation',
  },
];

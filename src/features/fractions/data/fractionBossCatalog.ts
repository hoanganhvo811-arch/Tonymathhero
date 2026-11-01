import type { FractionBossPhase } from '@/types/fractions';

export interface FractionBossSpellQuestion {
  id: string;
  phaseIndex: number;
  gradeLevel: 'grade-2' | 'grade-3';
  spellNameVi: string;
  bossDialogueVi: string;
  questionTextVi: string;
  visualPromptVi?: string;
  options: string[];
  correctAnswer: string;
  damage: number;
  explanationVi: string;
}

export const FRACTION_BOSS_PHASES: FractionBossPhase[] = [
  {
    phaseIndex: 1,
    phaseNameVi: 'Giai Đoạn 1: Phá Giải Phong Ấn Chia Tách',
    phaseDescVi: 'Ma Vương phân tách các vật thể trong vương quốc thành những mảnh hỗn loạn! Hãy nhận diện đúng phân số để phá vỡ lớp vỏ phong ấn.',
    bossHp: 300,
    maxHp: 300,
    spellTypes: ['partition_unseal'],
  },
  {
    phaseIndex: 2,
    phaseNameVi: 'Giai Đoạn 2: Xuyên Phá Khiên Chắn So Sánh',
    phaseDescVi: 'Ma Vương dựng khiên năng lượng so sánh phân số! Hãy chọn kích thước phân số chính xác để công phá lớp khiên.',
    bossHp: 350,
    maxHp: 350,
    spellTypes: ['fraction_shield'],
  },
  {
    phaseIndex: 3,
    phaseNameVi: 'Giai Đoạn 3: Khôi Phục Tinh Thể Tri Thức',
    phaseDescVi: 'Ma Vương tung toàn lực tấn công! Hãy vận dụng chia phần công bằng và phân số tập hợp để thanh tẩy bóng tối và thu hồi Knowledge Crystal!',
    bossHp: 400,
    maxHp: 400,
    spellTypes: ['truth_ray'],
  },
];

export const FRACTION_BOSS_SPELLS: FractionBossSpellQuestion[] = [
  // Phase 1 Spells (Grade 2 & Grade 3)
  {
    id: 'boss_p1_g2_half',
    phaseIndex: 1,
    gradeLevel: 'grade-2',
    spellNameVi: 'Bẫy Chia Đôi Hắc Ám',
    bossDialogueVi: 'Ngươi có biết chiếc khiên này bị cắn mất bao nhiêu phần không?',
    questionTextVi: 'Một tấm khiên tròn bị chia làm 2 phần bằng nhau, Ma Vương lấy đi 1 phần. Phân số chỉ phần khiên đã mất là:',
    visualPromptVi: '🛡️ [Chia 2 phần, mất 1 phần]',
    options: ['1/2 (Một nửa)', '1/3', '1/4', '2/1'],
    correctAnswer: '1/2 (Một nửa)',
    damage: 100,
    explanationVi: 'Chia làm 2 phần bằng nhau và lấy 1 phần là 1/2.',
  },
  {
    id: 'boss_p1_g2_fourth',
    phaseIndex: 1,
    gradeLevel: 'grade-2',
    spellNameVi: 'Lôi Đình Phân Tư',
    bossDialogueVi: 'Chia làm 4 phần bằng nhau, lấy 1 phần thì gọi là gì hỡi Tony?',
    questionTextVi: 'Hình vuông ma pháp chia làm 4 ô bằng nhau, đã phong ấn 1 ô. Phân số tương ứng là:',
    visualPromptVi: '⬛ [1/4 ô bị phong ấn]',
    options: ['1/4 (Một phần tư)', '1/2', '1/3', '4/1'],
    correctAnswer: '1/4 (Một phần tư)',
    damage: 100,
    explanationVi: 'Lấy 1 phần trong 4 phần bằng nhau là 1/4.',
  },
  {
    id: 'boss_p1_g3_three_fourths',
    phaseIndex: 1,
    gradeLevel: 'grade-3',
    spellNameVi: 'Hỗn Mang Tam Phân',
    bossDialogueVi: '3 trong 4 phần sức mạnh đã thuộc về ta!',
    questionTextVi: 'Viên ngọc năng lượng chia làm 4 phần bằng nhau, đã bị hút mất 3 phần. Phân số biểu diễn là:',
    visualPromptVi: '🔮 [3 trong 4 phần bị hút]',
    options: ['3/4', '1/4', '4/3', '3/1'],
    correctAnswer: '3/4',
    damage: 100,
    explanationVi: 'Lấy 3 trong 4 phần bằng nhau là 3/4.',
  },

  // Phase 2 Spells (Comparison)
  {
    id: 'boss_p2_g2_half_vs_fourth',
    phaseIndex: 2,
    gradeLevel: 'grade-2',
    spellNameVi: 'Khiên Nghịch Đảo Kích Thước',
    bossDialogueVi: 'Số 4 lớn hơn số 2, vậy 1/4 phải lớn hơn 1/2 chứ ha ha ha!',
    questionTextVi: 'Phát biểu của Ma Vương có đúng không? So sánh 1/2 và 1/4 chiếc bánh:',
    visualPromptVi: '🍕 [1/2] vs [1/4]',
    options: ['Sai! 1/2 LỚN HƠN 1/4 (1/2 > 1/4)', 'Đúng! 1/4 lớn hơn vì 4 > 2', 'Hai phần bằng nhau', 'Không so sánh được'],
    correctAnswer: 'Sai! 1/2 LỚN HƠN 1/4 (1/2 > 1/4)',
    damage: 120,
    explanationVi: 'Cùng một chiếc bánh, chia làm 2 phần thì mỗi phần to hơn chia làm 4 phần. Vậy 1/2 > 1/4!',
  },
  {
    id: 'boss_p2_g3_same_denom',
    phaseIndex: 2,
    gradeLevel: 'grade-3',
    spellNameVi: 'Cuồng Nộ Cùng Mẫu Số',
    bossDialogueVi: 'So sánh luồng khí: 5/8 sức mạnh và 3/8 sức mạnh, bên nào mạnh hơn?',
    questionTextVi: 'Chọn dấu thích hợp giữa 5/8 và 3/8:',
    visualPromptVi: '⚡ 5/8 ... 3/8',
    options: ['>', '<', '=', 'Không xác định'],
    correctAnswer: '>',
    damage: 120,
    explanationVi: 'Cùng mẫu số 8: 5 > 3 nên 5/8 > 3/8.',
  },

  // Phase 3 Spells (Real life sharing & Set fractions)
  {
    id: 'boss_p3_g2_share_six',
    phaseIndex: 3,
    gradeLevel: 'grade-2',
    spellNameVi: 'Khắc Tinh Chia Sẻ',
    bossDialogueVi: '6 quả cầu ánh sáng chia đều cho 2 hộ vệ, mỗi hộ vệ nhận 1/2 là mấy quả?',
    questionTextVi: 'Một nửa (1/2) của 6 quả cầu ánh sáng là bao nhiêu?',
    visualPromptVi: '✨ 6 quả cầu : 2 = ?',
    options: ['3 quả cầu (6 : 2 = 3)', '2 quả cầu', '4 quả cầu', '1 quả cầu'],
    correctAnswer: '3 quả cầu (6 : 2 = 3)',
    damage: 150,
    explanationVi: 'Một nửa của 6 là 6 : 2 = 3 quả cầu.',
  },
  {
    id: 'boss_p3_g3_share_fifteen',
    phaseIndex: 3,
    gradeLevel: 'grade-3',
    spellNameVi: 'Ánh Sáng Tri Thức Tối Thượng',
    bossDialogueVi: 'Ngươi không thể phân giải 1/5 của 15 luồng thần thạch đâu!',
    questionTextVi: 'Tính 1/5 của 15 viên thần thạch:',
    visualPromptVi: '💎 15 viên thạch : 5 = ?',
    options: ['3 viên (15 : 5 = 3)', '5 viên', '4 viên', '2 viên'],
    correctAnswer: '3 viên (15 : 5 = 3)',
    damage: 150,
    explanationVi: '1/5 của 15 là 15 : 5 = 3 viên thần thạch. Ánh sáng tri thức bùng nổ!',
  },
];

import type { DivisionFact, VisualSharingPuzzle, DivisionAchievement } from '../../../types/division';

export function spellVietnameseNumber(n: number): string {
  const units = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  if (n <= 9) return units[n];
  if (n === 10) return 'mười';
  if (n < 20) {
    const unit = n % 10;
    if (unit === 5) return 'mười lăm';
    return `mười ${units[unit]}`;
  }
  const tens = Math.floor(n / 10);
  const unit = n % 10;
  const tensStr = tens === 2 ? 'hai mươi' : tens === 4 ? 'bốn mươi' : `${units[tens]} mươi`;
  if (unit === 0) return tensStr;
  if (unit === 1) return `${tensStr} mốt`;
  if (unit === 4) return `${tensStr} tư`;
  if (unit === 5) return `${tensStr} lăm`;
  return `${tensStr} ${units[unit]}`;
}

// Generate the 80 standard division facts (Tables 2 through 9, 10 calculations each)
export const DIVISION_FACTS: DivisionFact[] = [];

for (let divisor = 2; divisor <= 9; divisor++) {
  for (let quotient = 1; quotient <= 10; quotient++) {
    const dividend = divisor * quotient;
    const factId = `div_${divisor}_${quotient}`;
    const multFactId = `fact_${divisor}_${quotient}`;
    const dividendVi = spellVietnameseNumber(dividend);
    const divisorVi = spellVietnameseNumber(divisor);
    const quotientVi = spellVietnameseNumber(quotient);

    const isGrade2 = divisor === 2 || divisor === 5;
    const isBoth = divisor === 3 || divisor === 4;

    DIVISION_FACTS.push({
      id: factId,
      dividend,
      divisor,
      quotient,
      tableNumber: divisor,
      remainder: 0,
      multiplicationFactId: multFactId,
      spellingVi: `${dividend} : ${divisor} = ${quotient}`,
      promptVi: `${dividendVi.charAt(0).toUpperCase() + dividendVi.slice(1)} chia ${divisorVi} bằng ${quotientVi}`,
      gradeLevel: isGrade2 ? 'both' : isBoth ? 'both' : 'grade-3',
      tipVi: `Vì ${divisor} × ${quotient} = ${dividend}, nên lấy ${dividend} chia cho ${divisor} ta được ${quotient}.`,
    });
  }
}

export const DIVISION_TABLES = [2, 3, 4, 5, 6, 7, 8, 9];

export const GRADE_2_DIVISION_TABLES = [2, 5];
export const GRADE_3_DIVISION_TABLES = [2, 3, 4, 5, 6, 7, 8, 9];

// 6 Interactive Visual Sharing Puzzles
export const DIVISION_PUZZLES: VisualSharingPuzzle[] = [
  {
    id: 'puzzle_candies_3',
    title: 'Kẹo Phép Thuật Rừng Xanh',
    description: 'Có 12 viên kẹo bổng bồng. Tony hãy chia đều vào 3 chiếc đĩa cho 3 bạn sóc tinh nghịch nhé!',
    totalItems: 12,
    targetGroups: 3,
    itemsPerGroup: 4,
    itemType: 'candies',
    itemIcon: '🍬',
    containerIcon: '🍽️',
    containerName: 'Chiếc đĩa',
    rewardGold: 50,
    rewardExp: 80,
  },
  {
    id: 'puzzle_gold_4',
    title: 'Vàng Cổ Tích Sa Mạc',
    description: 'Tony tìm thấy 20 thỏi vàng hoàng gia. Hãy chia đều vào 4 rương báu để kích hoạt phong ấn cổ.',
    totalItems: 20,
    targetGroups: 4,
    itemsPerGroup: 5,
    itemType: 'coins',
    itemIcon: '🪙',
    containerIcon: '📦',
    containerName: 'Rương báu',
    rewardGold: 70,
    rewardExp: 100,
  },
  {
    id: 'puzzle_gems_5',
    title: 'Pha Lê Đại Dương Sâu Thẳm',
    description: 'Có 25 viên ngọc trai biển sâu tỏa sáng. Hãy chia đều cho 5 cột đèn hải đăng ma thuật.',
    totalItems: 25,
    targetGroups: 5,
    itemsPerGroup: 5,
    itemType: 'gems',
    itemIcon: '💎',
    containerIcon: '🏛️',
    containerName: 'Cột trụ',
    rewardGold: 85,
    rewardExp: 120,
  },
  {
    id: 'puzzle_apples_2',
    title: 'Táo Vàng Đỉnh Băng Giá',
    description: 'Có 16 quả táo tuyết ngọt lịm. Hãy chia đều cho 2 chú Hươu Trắng hộ vệ băng tuyết.',
    totalItems: 16,
    targetGroups: 2,
    itemsPerGroup: 8,
    itemType: 'apples',
    itemIcon: '🍎',
    containerIcon: '🦌',
    containerName: 'Hươu thần',
    rewardGold: 60,
    rewardExp: 90,
  },
  {
    id: 'puzzle_gems_6',
    title: 'Đá Lửa Vùng Núi Lửa',
    description: 'Có 18 viên đá nham thạch rực sáng. Hãy phân phối đều vào 6 túi phép của các hiệp sĩ rèn kiếm.',
    totalItems: 18,
    targetGroups: 6,
    itemsPerGroup: 3,
    itemType: 'gems',
    itemIcon: '🔥',
    containerIcon: '🎒',
    containerName: 'Túi phép',
    rewardGold: 90,
    rewardExp: 130,
  },
  {
    id: 'puzzle_coins_8',
    title: 'Kho Báu Đền Mặt Trời',
    description: 'Đại điện Mặt Trời trao 32 đồng huy hiệu rực rỡ. Hãy chia đều cho 8 bức tượng hộ thần!',
    totalItems: 32,
    targetGroups: 8,
    itemsPerGroup: 4,
    itemType: 'coins',
    itemIcon: '⭐',
    containerIcon: '🗿',
    containerName: 'Bức tượng',
    rewardGold: 120,
    rewardExp: 160,
  },
];

// Initial 6 Division Achievements
export const INITIAL_DIVISION_ACHIEVEMENTS: DivisionAchievement[] = [
  {
    id: 'division_beginner',
    name: 'Khởi Đầu Phép Chia',
    description: 'Hoàn thành bài học phép chia đầu tiên tại Vương quốc Phép Chia.',
    icon: '🌱',
    unlocked: false,
    rewardXp: 100,
    rewardGold: 50,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'equal_sharing_expert',
    name: 'Chuyên Gia Chia Đều',
    description: 'Giải quyết xuất sắc 3 câu đố chia đều đồ vật trực quan.',
    icon: '⚖️',
    unlocked: false,
    rewardXp: 150,
    rewardGold: 80,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'division_table_master',
    name: 'Bậc Thầy Bảng Chia',
    description: 'Thành thạo tối thiểu 2 bảng chia theo cấp lớp của Tony.',
    icon: '📜',
    unlocked: false,
    rewardXp: 200,
    rewardGold: 100,
    progress: 0,
    maxProgress: 2,
  },
  {
    id: 'inverse_master',
    name: 'Bậc Thầy Quan Hệ Nhân - Chia',
    description: 'Trả lời đúng 10 bài tập chuyển đổi tương ứng giữa phép nhân và phép chia.',
    icon: '🔄',
    unlocked: false,
    rewardXp: 250,
    rewardGold: 120,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'division_hero',
    name: 'Hiệp Sĩ Phép Chia',
    description: 'Hoàn thành Thử Thách Hiệp Sĩ (Hero Challenge 30 câu) đạt độ chính xác trên 90%.',
    icon: '👑',
    unlocked: false,
    rewardXp: 300,
    rewardGold: 150,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'division_boss_slayer',
    name: 'Dũng Sĩ Diệt Cự Thạch Phép Chia',
    description: 'Khuất phục Cự Thạch Ma Vương Phép Chia bằng sức mạnh tri thức toán học.',
    icon: '⚔️',
    unlocked: false,
    rewardXp: 400,
    rewardGold: 200,
    progress: 0,
    maxProgress: 1,
  },
];

import type {
  MultiplicationFact,
  MultiplicationTableNumber,
  MultiplicationAchievement,
} from '../../../types/multiplication';

const VI_NUMBER_WORDS: Record<number, string> = {
  1: 'một',
  2: 'hai',
  3: 'ba',
  4: 'bốn',
  5: 'năm',
  6: 'sáu',
  7: 'bảy',
  8: 'tám',
  9: 'chín',
  10: 'mười',
};

export function spellVietnameseNumber(n: number): string {
  if (n <= 10) return VI_NUMBER_WORDS[n] || String(n);
  if (n < 20) {
    const unit = n % 10;
    if (unit === 5) return 'mười lăm';
    return `mười ${VI_NUMBER_WORDS[unit]}`;
  }
  const tens = Math.floor(n / 10);
  const units = n % 10;
  const tensWord = `${VI_NUMBER_WORDS[tens]} mươi`;
  if (units === 0) return tensWord;
  if (units === 1 && tens > 1) return `${tensWord} mốt`;
  if (units === 4) return `${tensWord} tư`;
  if (units === 5) return `${tensWord} lăm`;
  return `${tensWord} ${VI_NUMBER_WORDS[units]}`;
}

export const MULTIPLICATION_TABLES: MultiplicationTableNumber[] = [2, 3, 4, 5, 6, 7, 8, 9];

export const TABLE_METADATA: Record<
  MultiplicationTableNumber,
  {
    titleVi: string;
    grade: 'grade-2' | 'grade-3';
    color: string;
    itemType: 'apple' | 'gem' | 'star' | 'coin' | 'candy' | 'shield';
    itemNameVi: string;
    tipVi: string;
  }
> = {
  2: {
    titleVi: 'Bảng Nhân 2',
    grade: 'grade-2',
    color: '#10b981',
    itemType: 'apple',
    itemNameVi: 'quả táo',
    tipVi: 'Nhân 2 chính là gấp đôi một số (cộng số đó với chính nó). Tích luôn là số chẵn!',
  },
  3: {
    titleVi: 'Bảng Nhân 3',
    grade: 'grade-3',
    color: '#06b6d4',
    itemType: 'gem',
    itemNameVi: 'viên ngọc',
    tipVi: 'Tổng các chữ số của tích trong bảng nhân 3 luôn chia hết cho 3 (3, 6, 9)!',
  },
  4: {
    titleVi: 'Bảng Nhân 4',
    grade: 'grade-3',
    color: '#3b82f6',
    itemType: 'shield',
    itemNameVi: 'chiếc khiên',
    tipVi: 'Nhân 4 bằng gấp đôi hai lần (nhân 2 rồi nhân 2 tiếp)!',
  },
  5: {
    titleVi: 'Bảng Nhân 5',
    grade: 'grade-2',
    color: '#f59e0b',
    itemType: 'star',
    itemNameVi: 'ngôi sao',
    tipVi: 'Tất cả các tích trong bảng nhân 5 đều có chữ số tận cùng là 0 hoặc 5!',
  },
  6: {
    titleVi: 'Bảng Nhân 6',
    grade: 'grade-3',
    color: '#8b5cf6',
    itemType: 'coin',
    itemNameVi: 'đồng vàng',
    tipVi: 'Nhân 6 bằng nhân 5 cộng thêm một lần số đó (hoặc gấp đôi bảng nhân 3)!',
  },
  7: {
    titleVi: 'Bảng Nhân 7',
    grade: 'grade-3',
    color: '#ec4899',
    itemType: 'candy',
    itemNameVi: 'viên kẹo',
    tipVi: 'Mỗi bước trong bảng nhân 7 tăng đúng 7 đơn vị (đếm cách 7: 7, 14, 21, 28, 35...)!',
  },
  8: {
    titleVi: 'Bảng Nhân 8',
    grade: 'grade-3',
    color: '#f97316',
    itemType: 'shield',
    itemNameVi: 'huy hiệu',
    tipVi: 'Nhân 8 bằng nhân 4 rồi gấp đôi, hoặc gấp đôi 3 lần liên tiếp!',
  },
  9: {
    titleVi: 'Bảng Nhân 9',
    grade: 'grade-3',
    color: '#eab308',
    itemType: 'gem',
    itemNameVi: 'viên kim cương',
    tipVi: 'Mẹo thần kỳ: Chữ số hàng chục tăng dần từ 0-9, hàng đơn vị giảm dần từ 9-0! Tổng 2 chữ số luôn bằng 9!',
  },
};

// Generate all 80 facts
function generateAllFacts(): Record<string, MultiplicationFact> {
  const catalog: Record<string, MultiplicationFact> = {};

  MULTIPLICATION_TABLES.forEach((table) => {
    const meta = TABLE_METADATA[table];
    for (let factor2 = 1; factor2 <= 10; factor2++) {
      const id = `${table}x${factor2}`;
      const product = table * factor2;
      const vietnameseRead = `${VI_NUMBER_WORDS[table]} nhân ${VI_NUMBER_WORDS[factor2]} bằng ${spellVietnameseNumber(product)}`;

      catalog[id] = {
        id,
        factor1: table,
        factor2,
        product,
        table,
        grade: meta.grade,
        vietnameseRead,
        visualGroup: {
          groupCount: table,
          itemsPerGroup: factor2,
          itemType: meta.itemType,
          itemNameVi: meta.itemNameVi,
        },
        tipVi: meta.tipVi,
        commutativeFactId: factor2 >= 2 && factor2 <= 9 ? `${factor2}x${table}` : undefined,
      };
    }
  });

  return catalog;
}

export const MULTIPLICATION_FACTS: Record<string, MultiplicationFact> = generateAllFacts();

export function getFactsByTable(table: MultiplicationTableNumber): MultiplicationFact[] {
  return Array.from({ length: 10 }, (_, i) => {
    const id = `${table}x${i + 1}`;
    return MULTIPLICATION_FACTS[id];
  });
}

export function getFactsByGrade(grade: 'grade-2' | 'grade-3'): MultiplicationFact[] {
  return Object.values(MULTIPLICATION_FACTS).filter((f) => f.grade === grade);
}

// 8 Master Achievements for Module 7
export const DEFAULT_MULTIPLICATION_ACHIEVEMENTS: MultiplicationAchievement[] = [
  {
    id: 'mult_beginner',
    titleVi: 'Tân Binh Phép Nhân',
    descVi: 'Hoàn thành bài tập luyện bảng nhân đầu tiên',
    badgeCode: 'BEGINNER',
    iconName: 'Sparkles',
    rewardGold: 50,
    rewardExp: 80,
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'table_2_master',
    titleVi: 'Bậc Thầy Bảng Nhân 2',
    descVi: 'Thành thạo toàn bộ 10 phép tính của bảng nhân 2',
    badgeCode: 'TABLE_2',
    iconName: 'Award',
    rewardGold: 100,
    rewardExp: 150,
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'table_5_master',
    titleVi: 'Bậc Thầy Bảng Nhân 5',
    descVi: 'Thành thạo toàn bộ 10 phép tính của bảng nhân 5',
    badgeCode: 'TABLE_5',
    iconName: 'Star',
    rewardGold: 100,
    rewardExp: 150,
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'table_9_master',
    titleVi: 'Bậc Thầy Bảng Nhân 9',
    descVi: 'Thành thạo toàn bộ 10 phép tính của bảng nhân 9 kỳ ảo',
    badgeCode: 'TABLE_9',
    iconName: 'Zap',
    rewardGold: 150,
    rewardExp: 200,
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'mult_expert',
    titleVi: 'Chuyên Gia Cửu Chương',
    descVi: 'Đạt cấp độ Mastered cho ít nhất 40 phép tính nhân',
    badgeCode: 'EXPERT',
    iconName: 'GraduationCap',
    rewardGold: 200,
    rewardExp: 300,
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'mult_hero',
    titleVi: 'Đại Hiệp Sĩ Cửu Chương',
    descVi: 'Thành thạo tuyệt đối toàn bộ 80 phép tính từ bảng nhân 2 đến 9',
    badgeCode: 'HERO',
    iconName: 'Crown',
    rewardGold: 500,
    rewardExp: 800,
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'perfect_challenge',
    titleVi: 'Thử Thách Hoàn Hảo',
    descVi: 'Hoàn thành một lượt Challenge với độ chính xác tuyệt đối 100%',
    badgeCode: 'PERFECT',
    iconName: 'ShieldCheck',
    rewardGold: 150,
    rewardExp: 250,
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'boss_slayer',
    titleVi: 'Dũng Sĩ Diệt Cự Thạch',
    descVi: 'Hạ gục Cự Thạch Ma Vương trong Đấu Trường Bảng Nhân',
    badgeCode: 'SLAYER',
    iconName: 'Swords',
    rewardGold: 250,
    rewardExp: 400,
    unlocked: false,
    progressPercent: 0,
  },
];

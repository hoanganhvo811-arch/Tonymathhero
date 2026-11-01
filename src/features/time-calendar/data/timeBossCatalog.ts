import type { TimeBossSpellQuestion } from '@/types/timeCalendar';

export interface TimeBossPhase {
  phaseIndex: number;
  phaseNameVi: string;
  phaseDescVi: string;
  bossHp: number;
  maxHp: number;
}

export const TIME_BOSS_PHASES: TimeBossPhase[] = [
  {
    phaseIndex: 1,
    phaseNameVi: 'Giai Đoạn 1: Vòng Xoay Kim Đồng Hồ',
    phaseDescVi: 'Chronos Watcher xoay ngược các bánh răng đồng hồ khổng lồ! Hãy đọc chính xác giờ để giữ vững trục kim thời gian.',
    bossHp: 320,
    maxHp: 320,
  },
  {
    phaseIndex: 2,
    phaseNameVi: 'Giai Đoạn 2: Mảnh Ghép Lịch Thời Gian',
    phaseDescVi: 'Vệ Binh xé rách các trang lịch khiến ngày tháng đảo lộn! Hãy xác định chính xác số ngày và năm nhuận để khôi phục cuốn lịch vạn niên.',
    bossHp: 360,
    maxHp: 360,
  },
  {
    phaseIndex: 3,
    phaseNameVi: 'Giai Đoạn 3: Dòng Chảy Khoảng Thời Gian',
    phaseDescVi: 'Ma lực thời không bùng nổ! Hãy tính chuẩn xác thời lượng hành trình và thời khắc hội tụ để giải cứu Chrono Knowledge Crystal!',
    bossHp: 420,
    maxHp: 420,
  },
];

export const TIME_BOSS_SPELLS: TimeBossSpellQuestion[] = [
  // Phase 1 (Clock Reading)
  {
    id: 'boss_time_p1_g2_half',
    phaseIndex: 1,
    gradeLevel: 'grade-2',
    spellNameVi: 'Hãm Tốc Bán Nhật',
    bossDialogueVi: 'Ngươi có biết kim ngắn giữa số 8 và số 9, kim dài chỉ số 6 là mấy giờ không?',
    questionTextVi: 'Kim ngắn ở giữa số 8 và 9, kim dài chỉ số 6. Đồng hồ đang chỉ mấy giờ?',
    visualClock: { hours: 8, minutes: 30 },
    options: ['8 giờ 30 phút (8 giờ rưỡi)', '8 giờ 6 phút', '9 giờ 30 phút', '6 giờ 40 phút'],
    correctAnswer: '8 giờ 30 phút (8 giờ rưỡi)',
    damage: 110,
    explanationVi: 'Kim dài chỉ số 6 là 30 phút. Kim ngắn qua số 8 nên là 8 giờ rưỡi.',
  },
  {
    id: 'boss_time_p1_g3_past_hour',
    phaseIndex: 1,
    gradeLevel: 'grade-3',
    spellNameVi: 'Nghịch Đảo Giờ Kém',
    bossDialogueVi: 'Kim phút đã chạm số 9! Ngươi dám đọc giờ kém trước mặt ta không?',
    questionTextVi: 'Đồng hồ chỉ 8 giờ 45 phút. Cách đọc giờ kém chuẩn xác là:',
    visualClock: { hours: 8, minutes: 45 },
    options: ['9 giờ kém 15 phút', '8 giờ kém 15 phút', '9 giờ kém 45 phút', '8 giờ 9 phút'],
    correctAnswer: '9 giờ kém 15 phút',
    damage: 110,
    explanationVi: 'Còn 15 phút nữa là đến 9 giờ: 9 giờ kém 15 phút.',
  },

  // Phase 2 (Calendar & Days)
  {
    id: 'boss_time_p2_g2_week',
    phaseIndex: 2,
    gradeLevel: 'grade-2',
    spellNameVi: 'Bão Tố Thất Nhật',
    bossDialogueVi: 'Nếu hôm nay là Thứ Bảy, thì ngày mai ngươi có được nghỉ tiếp không?',
    questionTextVi: 'Hôm nay là Thứ Bảy, ngày mai là thứ mấy trong tuần?',
    options: ['Chủ Nhật', 'Thứ Hai', 'Thứ Sáu', 'Thứ Năm'],
    correctAnswer: 'Chủ Nhật',
    damage: 120,
    explanationVi: 'Liền sau Thứ Bảy là Chủ Nhật (ngày cuối tuần).',
  },
  {
    id: 'boss_time_p2_g3_leap',
    phaseIndex: 2,
    gradeLevel: 'grade-3',
    spellNameVi: 'Huyễn Ảnh Năm Nhuận',
    bossDialogueVi: 'Tháng 2 năm 2024 có bao nhiêu ngày? Trả lời sai ngươi sẽ bị kẹt lại vĩnh viễn!',
    questionTextVi: 'Năm 2024 là năm nhuận, hỏi tháng 2 năm 2024 có bao nhiêu ngày?',
    options: ['29 ngày', '28 ngày', '30 ngày', '31 ngày'],
    correctAnswer: '29 ngày',
    damage: 120,
    explanationVi: 'Năm nhuận tháng 2 có 29 ngày.',
  },

  // Phase 3 (Duration & Ultimate Timeline)
  {
    id: 'boss_time_p3_g2_dur',
    phaseIndex: 3,
    gradeLevel: 'grade-2',
    spellNameVi: 'Thời Gian Vút Bay',
    bossDialogueVi: 'Ngươi chiến đấu từ 9 giờ đến 11 giờ. Thời gian ngươi bỏ ra là bao lâu?',
    questionTextVi: 'Từ 9 giờ sáng đến 11 giờ trưa là bao nhiêu giờ?',
    options: ['2 giờ (11 - 9 = 2)', '1 giờ', '3 giờ', '4 giờ'],
    correctAnswer: '2 giờ (11 - 9 = 2)',
    damage: 150,
    explanationVi: '11 - 9 = 2 giờ.',
  },
  {
    id: 'boss_time_p3_g3_dur_gate',
    phaseIndex: 3,
    gradeLevel: 'grade-3',
    spellNameVi: 'Ánh Sáng Khắc Kỷ Tối Thượng',
    bossDialogueVi: '10:15 xuất phát, hành trình mất 45 phút. Ngươi sẽ chạm đích lúc mấy giờ?',
    questionTextVi: 'Khởi hành lúc 10 giờ 15 phút, đi mất 45 phút. Thời điểm đến là:',
    options: ['11 giờ 00 phút (10:15 + 45p = 11:00)', '10 giờ 45 phút', '11 giờ 15 phút', '10 giờ 50 phút'],
    correctAnswer: '11 giờ 00 phút (10:15 + 45p = 11:00)',
    damage: 150,
    explanationVi: '10:15 + 45 phút = 11:00 tròn. Dòng thời gian được khai thông!',
  },
];

import type { Campaign } from '@/types';
import { GRADE_2_KINGDOMS } from './data/kingdoms';

export const Grade2Config: Campaign = {
  id: 'grade-2',
  title: 'THE LITTLE HERO',
  subtitle: 'Math Adventure for Grade 2',
  heroTitle: 'Chiến Binh Khám Phá (The Little Hero)',
  grade: 2,
  description: 'Hành trình khởi nguyên: Cùng Tony mặc chiến giáp bạc kết hợp xanh lục dấn thân vào rừng thiêng và thảo nguyên rộng lớn, chinh phục toán học Lớp 2.',
  lore: 'Tại thế giới Seven Kingdoms thanh bình, thế lực bóng tối đã phong ấn 7 Viên Ngọc Tri Thức. Tony – Chiến binh Khám Phá dũng cảm với giáp bạc xanh lục và thanh kiếm Ánh Sáng Tập Sự bước vào cuộc phiêu lưu giải cứu muôn loài.',
  heroDescription: 'Chiến binh trẻ mặc giáp bạc kết hợp xanh lục, phong cách chiến binh khám phá, dũng cảm và hiếu học.',
  heroBadge: 'GRADE 2 • THE LITTLE HERO',
  theme: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    glow: 'rgba(16, 185, 129, 0.5)',
    backgroundGradient: 'linear-gradient(135deg, #041f17 0%, #063124 50%, #0b4a37 100%)',
    bannerGradient: 'linear-gradient(90deg, rgba(5,150,105,0.85) 0%, rgba(16,185,129,0.3) 100%)',
    badgeBg: 'rgba(16, 185, 129, 0.18)',
    cardBorder: 'rgba(16, 185, 129, 0.45)',
  },
  mathScope: [
    'Cộng, trừ có nhớ trong phạm vi 1.000',
    'Bảng nhân 2 & Bảng nhân 5',
    'Bảng chia 2 & Bảng chia 5 (Một phần mấy)',
    'Xem đồng hồ chính xác đến 5 phút & Đọc lịch',
    'Đo lường: cm, dm, m, km, kg, lít',
    'Hình học: Đoạn thẳng, đường gấp khúc, tam giác, tứ giác',
  ],
  kingdoms: GRADE_2_KINGDOMS,
  difficultyConfig: {
    baseHeroHp: 150,
    baseMonsterHp: 100,
    timeLimitPerQuestionSeconds: 45,
    expMultiplier: 1.0,
    goldMultiplier: 1.0,
  },
  unlockRequirement: {
    minLevel: 1,
    recommendedAge: '7 - 8 tuổi (Lớp 2)',
  },
};

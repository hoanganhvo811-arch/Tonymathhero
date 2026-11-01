import type { Campaign } from '@/types';
import { GRADE_3_KINGDOMS } from './data/kingdoms';

export const Grade3Config: Campaign = {
  id: 'grade-3',
  title: 'THE LEGENDARY HERO',
  subtitle: 'Math Adventure for Grade 3',
  heroTitle: 'Đại Hiệp Sĩ Huyền Thoại (The Legendary Hero)',
  grade: 3,
  description: 'Hành trình huyền thoại: Tony khoác bộ giáp xanh lam kết hợp vàng kim uy nghi, chinh phục đỉnh núi cao và lâu đài huyền thoại, giải mã toán học Lớp 3.',
  lore: 'Trên đỉnh cao mây ngàn của Đỉnh Aethelgard và các tòa thành cổ, những câu đố vĩ đại về số 100.000 và hình học cổ xưa đang chờ đón Đại Hiệp Sĩ Tony trong bộ giáp xanh lam hoàng kim và thần kiếm Mặt Trời.',
  heroDescription: 'Chiến binh huyền thoại uy nghi, giáp xanh lam kết hợp vàng kim hoàng tộc, khí phách phi phàm.',
  heroBadge: 'GRADE 3 • THE LEGENDARY HERO',
  theme: {
    primary: '#0284c7',
    secondary: '#1e40af',
    accent: '#facc15',
    glow: 'rgba(56, 189, 248, 0.55)',
    backgroundGradient: 'linear-gradient(135deg, #071e3d 0%, #0c2d58 50%, #153e75 100%)',
    bannerGradient: 'linear-gradient(90deg, rgba(2,132,199,0.9) 0%, rgba(250,204,21,0.3) 100%)',
    badgeBg: 'rgba(2, 132, 199, 0.2)',
    cardBorder: 'rgba(250, 204, 21, 0.45)',
  },
  mathScope: [
    'Các số trong phạm vi 100.000 & Làm tròn số',
    'Bảng nhân & chia nâng cao (6, 7, 8, 9)',
    'Nhân, chia số có nhiều chữ số với số có một chữ số',
    'Chu vi & Diện tích hình chữ nhật, hình vuông',
    'Góc vuông, góc không vuông, tâm, bán kính hình tròn',
    'Giải bài toán bằng hai bước tính',
  ],
  kingdoms: GRADE_3_KINGDOMS,
  difficultyConfig: {
    baseHeroHp: 220,
    baseMonsterHp: 160,
    timeLimitPerQuestionSeconds: 40,
    expMultiplier: 1.3,
    goldMultiplier: 1.25,
  },
  unlockRequirement: {
    minLevel: 1,
    recommendedAge: '8 - 9 tuổi (Lớp 3)',
  },
};

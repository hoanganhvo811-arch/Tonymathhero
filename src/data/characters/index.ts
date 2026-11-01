import type { CampaignId } from '@/types';

export interface HeroModelSpec {
  id: string;
  name: string;
  campaignId: CampaignId;
  title: string;
  avatarSeed: string;
  tagline: string;
  armorType: string;
  weaponType: string;
  primaryColor: string;
  accentColor: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
}

export const HERO_SPECS: Record<CampaignId, HeroModelSpec> = {
  'grade-2': {
    id: 'hero-tony-g2',
    name: 'Tony',
    campaignId: 'grade-2',
    title: 'Tiểu Hiệp Sĩ Khởi Nguyên',
    avatarSeed: 'tony-grade-2-apprentice',
    tagline: 'Lòng dũng cảm và trí thông minh của tuổi thơ bắt đầu từ những con số nhiệm màu.',
    armorType: 'Giáp Bạc Ánh Sao Khảm Lam Ngọc',
    weaponType: 'Thanh Kiếm Tập Sự & Khiên Dũng Cảm',
    primaryColor: '#38bdf8',
    accentColor: '#facc15',
    baseHp: 150,
    baseAttack: 25,
    baseDefense: 15,
  },
  'grade-3': {
    id: 'hero-tony-g3',
    name: 'Tony',
    campaignId: 'grade-3',
    title: 'Đại Hiệp Sĩ Huyền Thoại',
    avatarSeed: 'tony-grade-3-legendary',
    tagline: 'Chiến binh bất khuất chinh phục vạn số học và thống lĩnh bảy vương quốc vĩ đại.',
    armorType: 'Chiến Giáp Huyết Kim Hoàng Gia Cổ Thái',
    weaponType: 'Thần Kiếm Mặt Trời & Thuẫn Cực Quang',
    primaryColor: '#ef4444',
    accentColor: '#f59e0b',
    baseHp: 240,
    baseAttack: 42,
    baseDefense: 28,
  },
};

import type { ArenaAchievement } from '@/types/advancedArena';

export const ARENA_ACHIEVEMENTS: ArenaAchievement[] = [
  {
    id: 'arena_challenger',
    titleVi: 'Đấu Sĩ Toàn Năng',
    descriptionVi: 'Hoàn thành lượt thi đấu thử thách tổng hợp đầu tiên kết nối kiến thức 7 vương quốc.',
    icon: '🎯',
    goldReward: 200,
    xpReward: 350,
  },
  {
    id: 'multi_step_master',
    titleVi: 'Bậc Thầy Toán Đa Bước',
    descriptionVi: 'Giải quyết xuất sắc các bài toán nhiều bước tính với lập luận chuẩn xác.',
    icon: '📜',
    goldReward: 250,
    xpReward: 400,
  },
  {
    id: 'strategy_guru',
    titleVi: 'Nhà Chiến Lược Tài Ba',
    descriptionVi: 'Khám phá và vận dụng linh hoạt nhiều phương pháp giải toán nhẩm thông minh.',
    icon: '💡',
    goldReward: 250,
    xpReward: 450,
  },
  {
    id: 'marathon_champion',
    titleVi: 'Nhà Vô Địch Đường Đua Toán',
    descriptionVi: 'Vượt qua ít nhất 3 trạm tiếp sức liên tiếp trong chế độ Math Marathon.',
    icon: '🏃',
    goldReward: 350,
    xpReward: 600,
  },
  {
    id: 'tower_climber',
    titleVi: 'Chinh Phục Tháp Thử Thách',
    descriptionVi: 'Vượt qua tầng 5 của Tháp Thử Thách và mở khóa cánh cổng Thượng Đài.',
    icon: '🏰',
    goldReward: 400,
    xpReward: 700,
  },
  {
    id: 'archmage_slayer',
    titleVi: 'Khắc Tinh Đại Pháp Sư Nexus',
    descriptionVi: 'Đánh bại cả 3 giai đoạn của Boss Archmage Nexus tại Đấu Trường Tối Thượng.',
    icon: '👑',
    goldReward: 600,
    xpReward: 1200,
  },
];

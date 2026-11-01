import type { MoneyAchievement } from '@/types/moneyShopping';

export const MONEY_ACHIEVEMENTS: MoneyAchievement[] = [
  {
    id: 'money_recognizer',
    titleVi: 'Chuyên Gia Nhận Diện Tiền Tệ',
    descriptionVi: 'Phân biệt chính xác tất cả các mệnh giá tiền Việt Nam từ 100đ đến 100.000đ.',
    icon: '💵',
    goldReward: 150,
    xpReward: 300,
  },
  {
    id: 'cash_counter',
    titleVi: 'Bậc Thầy Đếm Tiền Thần Tốc',
    descriptionVi: 'Đếm và phối hợp thành công các xấp tiền mà không phạm sai sót.',
    icon: '🧮',
    goldReward: 200,
    xpReward: 350,
  },
  {
    id: 'smart_shopper',
    titleVi: 'Người Tiêu Dùng Thông Thái',
    descriptionVi: 'Hoàn thành 5 lượt mua sắm hoàn hảo tại Tiệm Tạp Hóa Ma Thuật.',
    icon: '🛒',
    goldReward: 250,
    xpReward: 400,
  },
  {
    id: 'change_master',
    titleVi: 'Thần Sầu Tính Tiền Thừa',
    descriptionVi: 'Tính chính xác tiền trả lại cho khách hàng và người bán trong mọi tình huống.',
    icon: '💰',
    goldReward: 200,
    xpReward: 350,
  },
  {
    id: 'budget_guardian',
    titleVi: 'Bậc Thầy Quản Lý Ngân Sách',
    descriptionVi: 'Vượt qua tất cả các thử thách chi tiêu thông minh mà không bị bội chi ngân sách.',
    icon: '⚖️',
    goldReward: 300,
    xpReward: 500,
  },
  {
    id: 'merchant_boss_slayer',
    titleVi: 'Khắc Tinh Chúa Tể Gian Thương',
    descriptionVi: 'Đánh bại cả 3 giai đoạn của Dark Merchant Lord Malakor và mang lại sự công bằng.',
    icon: '👑',
    goldReward: 500,
    xpReward: 1000,
  },
];

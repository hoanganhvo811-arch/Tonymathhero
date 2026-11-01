import type { ShopItem } from '@/types/moneyShopping';

export const SHOP_ITEMS_CATALOG: ShopItem[] = [
  // --- GRADE 2 ITEMS (1.000đ - 10.000đ) ---
  // Food & Snacks
  {
    id: 'food_lollipop',
    nameVi: 'Kẹo Mút Trái Cây Phép Thuật',
    category: 'food',
    price: 1000,
    gradeLevel: 'grade-2',
    icon: '🍭',
    descriptionVi: 'Kẹo mút vị dâu ngọt ngào, giúp hồi phục 5 năng lượng.',
    popular: true,
  },
  {
    id: 'food_biscuit',
    nameVi: 'Bánh Quy Bơ Sao Băng',
    category: 'food',
    price: 2000,
    gradeLevel: 'grade-2',
    icon: '🍪',
    descriptionVi: 'Bánh quy thơm lừng hình ngôi sao may mắn.',
  },
  {
    id: 'food_apple',
    nameVi: 'Quả Táo Đỏ Rừng Tiên',
    category: 'food',
    price: 5000,
    gradeLevel: 'grade-2',
    icon: '🍎',
    descriptionVi: 'Quả táo đỏ mọng nước giàu vitamin từ Rừng Tiên.',
  },
  {
    id: 'food_milk',
    nameVi: 'Hộp Sữa Năng Lượng Siêu Cấp',
    category: 'food',
    price: 6000,
    gradeLevel: 'grade-2',
    icon: '🥛',
    descriptionVi: 'Sữa tươi béo ngậy giúp tăng cường sức mạnh trí tuệ.',
  },

  // School Supplies
  {
    id: 'school_pencil',
    nameVi: 'Bút Chì Hiệp Sĩ Gỗ Sồi',
    category: 'school',
    price: 3000,
    gradeLevel: 'grade-2',
    icon: '✏️',
    descriptionVi: 'Bút chì 2B nét vẽ sắc sảo, chống gãy ngòi.',
    popular: true,
  },
  {
    id: 'school_eraser',
    nameVi: 'Cục Tẩy Tinh Thể Trong Suốt',
    category: 'school',
    price: 2000,
    gradeLevel: 'grade-2',
    icon: '🧼',
    descriptionVi: 'Gôm tẩy dẻo dai giúp xóa sạch lỗi sai trong chớp mắt.',
  },
  {
    id: 'school_ruler',
    nameVi: 'Thước Kẻ Gỗ Rồng Con (20cm)',
    category: 'school',
    price: 5000,
    gradeLevel: 'grade-2',
    icon: '📏',
    descriptionVi: 'Thước đo thẳng tắp có vạch milimet rõ nét.',
  },
  {
    id: 'school_notebook',
    nameVi: 'Vở Ô Ly Toán Học Hoàng Gia',
    category: 'school',
    price: 8000,
    gradeLevel: 'grade-2',
    icon: '📓',
    descriptionVi: 'Tập vở 96 trang giấy trắng láng mịn, bìa in hình hiệp sĩ.',
    popular: true,
  },

  // Adventure Items
  {
    id: 'adv_water_bottle',
    nameVi: 'Bình Nước Dã Ngoại Bền Bỉ',
    category: 'adventure',
    price: 10000,
    gradeLevel: 'grade-2',
    icon: '🧴',
    descriptionVi: 'Bình đựng nước thể thao 500ml tiện lợi mang theo.',
  },
  {
    id: 'gear_badge',
    nameVi: 'Huy Hiệu Dũng Sĩ Nhỏ',
    category: 'gear',
    price: 4000,
    gradeLevel: 'grade-2',
    icon: '🎖️',
    descriptionVi: 'Huy hiệu đồng sáng bóng biểu tượng cho lòng dũng cảm.',
  },

  // --- GRADE 3 ITEMS (10.000đ - 90.000đ) ---
  // Food & Consumables
  {
    id: 'food_cake_box',
    nameVi: 'Hộp Bánh Kem Hoàng Gia 4 Vị',
    category: 'food',
    price: 25000,
    gradeLevel: 'grade-3',
    icon: '🎂',
    descriptionVi: 'Bánh kem tươi xốp thơm lừng cho cả đội phiêu lưu.',
  },
  {
    id: 'food_elixir',
    nameVi: 'Nước Thần Trí Tuệ Vô Tận',
    category: 'food',
    price: 35000,
    gradeLevel: 'grade-3',
    icon: '🧪',
    descriptionVi: 'Thần dược phát sáng xanh lơ tăng tốc độ tính nhẩm.',
  },

  // School Supplies
  {
    id: 'school_compass_set',
    nameVi: 'Bộ Compa & Eke Đo Góc Thần Kỳ',
    category: 'school',
    price: 15000,
    gradeLevel: 'grade-3',
    icon: '📐',
    descriptionVi: 'Bộ dụng cụ hình học bằng kim loại cao cấp.',
    popular: true,
  },
  {
    id: 'school_color_pens',
    nameVi: 'Hộp Bút Màu Sáp 24 Cây Rực Rỡ',
    category: 'school',
    price: 25000,
    gradeLevel: 'grade-3',
    icon: '🖍️',
    descriptionVi: 'Đủ 24 sắc màu vẽ nên những bức tranh tuyệt đẹp.',
  },
  {
    id: 'school_math_encyclopedia',
    nameVi: 'Bách Khoa Toàn Thư Toán Học 3D',
    category: 'school',
    price: 80000,
    gradeLevel: 'grade-3',
    icon: '📚',
    descriptionVi: 'Cuốn sách khổng lồ chứa bí mật của bảy vương quốc số.',
    popular: true,
  },

  // Adventure Items
  {
    id: 'adv_compass',
    nameVi: 'La Bàn Cổ Định Vị Kho Báu',
    category: 'adventure',
    price: 20000,
    gradeLevel: 'grade-3',
    icon: '🧭',
    descriptionVi: 'Kim nam châm luôn chỉ đúng hướng bắc huyền bí.',
  },
  {
    id: 'adv_flashlight',
    nameVi: 'Đèn Pin Pha Lê Chiếu Xa Ma Thuật',
    category: 'adventure',
    price: 30000,
    gradeLevel: 'grade-3',
    icon: '🔦',
    descriptionVi: 'Ánh sáng xuyên thấu màn đêm hầm ngục Lord Zero.',
  },
  {
    id: 'adv_telescope',
    nameVi: 'Kính Viễn Vọng Ngắm Bầu Trời Sao',
    category: 'adventure',
    price: 45000,
    gradeLevel: 'grade-3',
    icon: '🔭',
    descriptionVi: 'Kính ngắm thiên văn nhìn thấy cả các chòm sao xa xôi.',
  },

  // Gear & Equipment
  {
    id: 'gear_backpack',
    nameVi: 'Balo Thám Hiểm Chống Thấm Siêu Bền',
    category: 'gear',
    price: 50000,
    gradeLevel: 'grade-3',
    icon: '🎒',
    descriptionVi: 'Balo nhiều ngăn chứa được tất cả sách vở và trang bị.',
    popular: true,
  },
  {
    id: 'gear_boots',
    nameVi: 'Đôi Ủng Tốc Độ Gió Lốc',
    category: 'gear',
    price: 70000,
    gradeLevel: 'grade-3',
    icon: '👢',
    descriptionVi: 'Đôi ủng thần giúp di chuyển lanh lẹ vượt mọi địa hình.',
  },
  {
    id: 'gear_shield',
    nameVi: 'Khiên Ánh Sáng Titan Bảo Vệ',
    category: 'gear',
    price: 90000,
    gradeLevel: 'grade-3',
    icon: '🛡️',
    descriptionVi: 'Khiên bảo hộ kiên cố chống lại mọi đòn tấn công sai lệch.',
  },
];

export function getShopItemsByGrade(gradeLevel: 'grade-2' | 'grade-3', category?: string): ShopItem[] {
  let list = SHOP_ITEMS_CATALOG;
  if (gradeLevel === 'grade-2') {
    list = list.filter((i) => i.gradeLevel === 'grade-2');
  }
  if (category && category !== 'all') {
    list = list.filter((i) => i.category === category);
  }
  return list;
}

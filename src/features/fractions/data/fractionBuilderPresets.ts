import type { FractionShape } from '@/types/fractions';

export interface FractionBuilderPreset {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  shape: FractionShape;
  shapeNameVi: string;
  storyVi: string;
  targetNumerator: number;
  targetDenominator: number;
  allowedPartitions: number[];
  hintVi: string;
}

export const FRACTION_BUILDER_PRESETS: FractionBuilderPreset[] = [
  // Grade 2 Presets (2, 3, 4, 5 parts)
  {
    id: 'g2_preset_pizza_half',
    gradeLevel: 'grade-2',
    shape: 'circle_pizza',
    shapeNameVi: 'Bánh Pizza Nấm Phép Thuật',
    storyVi: 'Tony muốn chia đều chiếc bánh pizza cho mình và hiệp sĩ gác đền. Hãy chia bánh làm 2 phần và chọn 1 phần (1/2)!',
    targetNumerator: 1,
    targetDenominator: 2,
    allowedPartitions: [2, 3, 4, 5],
    hintVi: 'Kéo thanh chia về số 2 để chia đôi chiếc bánh, sau đó bấm vào 1 lát bánh để tô màu.',
  },
  {
    id: 'g2_preset_chocolate_third',
    gradeLevel: 'grade-2',
    shape: 'rectangle_chocolate',
    shapeNameVi: 'Thanh Sô-cô-la Rừng Xanh',
    storyVi: 'Tony cùng 2 chú sóc chia đều thanh sô-cô-la. Hãy chia làm 3 phần bằng nhau và lấy 1 phần (1/3)!',
    targetNumerator: 1,
    targetDenominator: 3,
    allowedPartitions: [2, 3, 4, 5],
    hintVi: 'Chọn chia làm 3 phần bằng nhau, sau đó nhấn chọn 1 ô sô-cô-la.',
  },
  {
    id: 'g2_preset_cake_fourth',
    gradeLevel: 'grade-2',
    shape: 'bar_cake',
    shapeNameVi: 'Bánh Kem Hoàng Gia 4 Tầng',
    storyVi: 'Lễ hội Vương quốc cần cắt chiếc bánh kem thành 4 phần bằng nhau. Hãy lấy 1 phần tư (1/4)!',
    targetNumerator: 1,
    targetDenominator: 4,
    allowedPartitions: [2, 3, 4, 5],
    hintVi: 'Chia bánh thành 4 phần bằng nhau và bấm chọn 1 miếng bánh.',
  },
  {
    id: 'g2_preset_gem_fifth',
    gradeLevel: 'grade-2',
    shape: 'gem_grid',
    shapeNameVi: 'Khay Ngọc Lục Bảo 5 Ngăn',
    storyVi: 'Chia khay ngọc làm 5 ngăn bằng nhau và thắp sáng 1 ngăn để kích hoạt phong ấn (1/5)!',
    targetNumerator: 1,
    targetDenominator: 5,
    allowedPartitions: [2, 3, 4, 5],
    hintVi: 'Chọn số phần là 5 và thắp sáng 1 viên ngọc.',
  },

  // Grade 3 Presets (Higher denominators & multi-part numerators)
  {
    id: 'g3_preset_pizza_three_fourths',
    gradeLevel: 'grade-3',
    shape: 'circle_pizza',
    shapeNameVi: 'Đại Tiệc Pizza Vương Triều',
    storyVi: 'Hãy chia pizza thành 4 phần bằng nhau và lấy 3 phần để tiếp sức cho đội hiệp sĩ (3/4)!',
    targetNumerator: 3,
    targetDenominator: 4,
    allowedPartitions: [3, 4, 6, 8],
    hintVi: 'Chia thành 4 phần bằng nhau, sau đó nhấp vào 3 lát bánh.',
  },
  {
    id: 'g3_preset_chocolate_two_fifths',
    gradeLevel: 'grade-3',
    shape: 'rectangle_chocolate',
    shapeNameVi: 'Khối Tinh Thể Năng Lượng 5 Ngăn',
    storyVi: 'Kích hoạt 2 phần năm (2/5) năng lượng của khối tinh thể để mở cổng dịch chuyển!',
    targetNumerator: 2,
    targetDenominator: 5,
    allowedPartitions: [4, 5, 6, 10],
    hintVi: 'Chia thành 5 phần bằng nhau và chọn 2 ô năng lượng.',
  },
  {
    id: 'g3_preset_cake_five_eighths',
    gradeLevel: 'grade-3',
    shape: 'bar_cake',
    shapeNameVi: 'Dải Băng Ma Thuật 8 Mảnh',
    storyVi: 'Thần hộ mệnh yêu cầu thắp sáng 5 phần tám (5/8) dải băng phép thuật!',
    targetNumerator: 5,
    targetDenominator: 8,
    allowedPartitions: [6, 8, 10],
    hintVi: 'Chia dải băng thành 8 mảnh bằng nhau rồi bấm chọn 5 mảnh.',
  },
  {
    id: 'g3_preset_gem_seven_tenths',
    gradeLevel: 'grade-3',
    shape: 'gem_grid',
    shapeNameVi: 'Hộp Ngọc Hoàng Kim 10 Ngăn',
    storyVi: 'Bơm đầy ánh sáng vào 7 phần mười (7/10) số ô ngọc để khôi phục Knowledge Crystal!',
    targetNumerator: 7,
    targetDenominator: 10,
    allowedPartitions: [5, 8, 10],
    hintVi: 'Chia thành 10 phần bằng nhau và chọn 7 ô sáng.',
  },
];

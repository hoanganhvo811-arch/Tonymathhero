import type { ShapePropertyInfo } from '../../../types/geometryMeasurement';

export const SHAPES_CATALOG: ShapePropertyInfo[] = [
  // ==========================================
  // 2D SHAPES (HÌNH PHẲNG)
  // ==========================================
  {
    id: 'shape_square',
    nameVi: 'Hình Vuông',
    dimension: '2D',
    gradeLevel: 'both',
    verticesCount: 4,
    edgesCount: 4,
    hasRightAngles: true,
    rightAnglesCount: 4,
    descriptionVi: 'Hình vuông có 4 đỉnh, 4 cạnh có độ dài bằng nhau và 4 góc vuông.',
    characteristicsVi: [
      'Có 4 đỉnh nhọn',
      'Có 4 cạnh dài bằng nhau hoàn toàn',
      'Có 4 góc vuông (dùng ê-ke để kiểm tra)',
    ],
    realWorldExamples: [
      { nameVi: 'Viên gạch lát sàn', emoji: '🟧', descriptionVi: 'Mỗi viên gạch lát nền lâu đài có 4 cạnh đều chằn chặn.' },
      { nameVi: 'Bàn cờ vua', emoji: '♟️', descriptionVi: 'Mặt bàn cờ vua hình vuông chia thành 64 ô nhỏ.' },
      { nameVi: 'Khăn tay hiệp sĩ', emoji: '🧣', descriptionVi: 'Chiếc khăn tay gấp gọn gàng thành hình vuông.' },
    ],
    speechIntroVi: 'Hình vuông có bốn đỉnh, bốn cạnh bằng nhau và bốn góc vuông.',
    color: '#38bdf8',
  },
  {
    id: 'shape_rectangle',
    nameVi: 'Hình Chữ Nhật',
    dimension: '2D',
    gradeLevel: 'both',
    verticesCount: 4,
    edgesCount: 4,
    hasRightAngles: true,
    rightAnglesCount: 4,
    descriptionVi: 'Hình chữ nhật có 4 đỉnh, 4 góc vuông, có 2 cạnh dài bằng nhau và 2 cạnh ngắn bằng nhau.',
    characteristicsVi: [
      'Có 4 đỉnh',
      'Có 2 cạnh dài (chiều dài) bằng nhau',
      'Có 2 cạnh ngắn (chiều rộng) bằng nhau',
      'Có 4 góc vuông',
    ],
    realWorldExamples: [
      { nameVi: 'Bìa sách phép thuật', emoji: '📖', descriptionVi: 'Bìa cuốn sách có chiều dài lớn hơn chiều rộng.' },
      { nameVi: 'Cánh cửa lâu đài', emoji: '🚪', descriptionVi: 'Cửa ra vào hình chữ nhật cao lớn uy nghiêm.' },
      { nameVi: 'Màn hình máy tính', emoji: '💻', descriptionVi: 'Màn hình hiển thị bản đồ thế giới.' },
    ],
    speechIntroVi: 'Hình chữ nhật có bốn đỉnh, bốn góc vuông, hai chiều dài bằng nhau và hai chiều rộng bằng nhau.',
    color: '#34d399',
  },
  {
    id: 'shape_triangle',
    nameVi: 'Hình Tam Giác',
    dimension: '2D',
    gradeLevel: 'both',
    verticesCount: 3,
    edgesCount: 3,
    hasRightAngles: false,
    descriptionVi: 'Hình tam giác có đúng 3 đỉnh và 3 cạnh thẳng khép kín.',
    characteristicsVi: [
      'Có chính xác 3 đỉnh',
      'Có 3 cạnh thẳng nối các đỉnh',
      'Có thể có 1 góc vuông (tam giác vuông) hoặc không có góc vuông',
    ],
    realWorldExamples: [
      { nameVi: 'Biển báo nguy hiểm', emoji: '⚠️', descriptionVi: 'Biển báo tam giác viền đỏ cảnh báo cạm bẫy.' },
      { nameVi: 'Miếng bánh pizza', emoji: '🍕', descriptionVi: 'Một lát bánh cắt chéo có dạng hình tam giác.' },
      { nameVi: 'Mái nhà gỗ', emoji: '⛺', descriptionVi: 'Mái lều trại của Tony nghiêng dốc giúp thoát nước mưa.' },
    ],
    speechIntroVi: 'Hình tam giác có ba đỉnh và ba cạnh nối liền nhau.',
    color: '#f59e0b',
  },
  {
    id: 'shape_circle',
    nameVi: 'Hình Tròn',
    dimension: '2D',
    gradeLevel: 'both',
    verticesCount: 0,
    edgesCount: 0,
    hasRightAngles: false,
    descriptionVi: 'Hình tròn là một đường cong tròn khép kín bao quanh tâm O. Khoảng cách từ tâm đến mọi điểm trên đường tròn đều bằng nhau (bán kính R).',
    characteristicsVi: [
      'Không có đỉnh góc nhọn nào (0 đỉnh)',
      'Được bao quanh bởi một đường cong khép kín (0 cạnh thẳng)',
      'Lớp 3: Có tâm O, bán kính R, đường kính D gấp đôi bán kính (D = 2 × R)',
    ],
    realWorldExamples: [
      { nameVi: 'Mặt đồng hồ thời gian', emoji: '⏰', descriptionVi: 'Đồng hồ tròn chỉ các con số từ 1 đến 12.' },
      { nameVi: 'Bánh xe cỗ xe ngựa', emoji: '⚙️', descriptionVi: 'Bánh xe tròn lăn đều êm ái trên đường đá.' },
      { nameVi: 'Đồng tiền vàng', emoji: '🪙', descriptionVi: 'Đồng tiền vàng sáng lấp lánh trong kho báu.' },
    ],
    speechIntroVi: 'Hình tròn có đường biên cong khép kín, không có đỉnh và không có cạnh thẳng. Hình tròn có tâm, bán kính và đường kính.',
    color: '#ec4899',
  },

  // ==========================================
  // 3D SHAPES / BLOCKS (KHỐI HÌNH HỌC KHÔNG GIAN)
  // ==========================================
  {
    id: 'shape_cube',
    nameVi: 'Khối Lập Phương',
    dimension: '3D',
    gradeLevel: 'both',
    verticesCount: 8,
    edgesCount: 12,
    facesCount: 6,
    hasRightAngles: true,
    descriptionVi: 'Khối lập phương có 8 đỉnh, 12 cạnh có độ dài bằng nhau và 6 mặt đều là các hình vuông bằng nhau.',
    characteristicsVi: [
      'Có 8 đỉnh',
      'Có 12 cạnh dài bằng nhau',
      'Có 6 mặt phẳng, tất cả các mặt đều là hình vuông',
    ],
    realWorldExamples: [
      { nameVi: 'Khối Rubik ma thuật', emoji: '🧊', descriptionVi: 'Mỗi mặt rubik gồm 9 ô vuông rực rỡ màu sắc.' },
      { nameVi: 'Hộp quà tặng', emoji: '🎁', descriptionVi: 'Hộp quà thắt nơ hình khối lập phương xinh xắn.' },
      { nameVi: 'Xúc xắc 6 mặt', emoji: '🎲', descriptionVi: 'Hạt xúc xắc có các chấm số từ 1 đến 6 trên 6 mặt vuông.' },
    ],
    speechIntroVi: 'Khối lập phương có tám đỉnh, mười hai cạnh bằng nhau và sáu mặt đều là hình vuông.',
    color: '#8b5cf6',
  },
  {
    id: 'shape_cuboid',
    nameVi: 'Khối Hộp Chữ Nhật',
    dimension: '3D',
    gradeLevel: 'both',
    verticesCount: 8,
    edgesCount: 12,
    facesCount: 6,
    hasRightAngles: true,
    descriptionVi: 'Khối hộp chữ nhật có 8 đỉnh, 12 cạnh và 6 mặt đều là các hình chữ nhật.',
    characteristicsVi: [
      'Có 8 đỉnh',
      'Có 12 cạnh chia thành các cặp đối diện bằng nhau',
      'Có 6 mặt, các mặt đối diện bằng nhau',
    ],
    realWorldExamples: [
      { nameVi: 'Hộp sữa tươi dinh dưỡng', emoji: '🧃', descriptionVi: 'Hộp sữa có các mặt trước, sau, trên, dưới là hình chữ nhật.' },
      { nameVi: 'Viên gạch xây tường', emoji: '🧱', descriptionVi: 'Viên gạch đất nung chắc chắn dùng dựng tường thành.' },
      { nameVi: 'Thùng rương kho báu', emoji: '📦', descriptionVi: 'Chiếc rương đựng đầy vàng ngọc và bảo vật.' },
    ],
    speechIntroVi: 'Khối hộp chữ nhật có tám đỉnh, mười hai cạnh và sáu mặt là các hình chữ nhật.',
    color: '#06b6d4',
  },
  {
    id: 'shape_cylinder',
    nameVi: 'Khối Trụ',
    dimension: '3D',
    gradeLevel: 'both',
    verticesCount: 0,
    edgesCount: 2, // 2 cạnh viền tròn
    facesCount: 3, // 2 mặt đáy phẳng hình tròn + 1 mặt cong
    hasRightAngles: false,
    descriptionVi: 'Khối trụ có 2 mặt đáy phẳng là hình tròn bằng nhau và 1 mặt cong bao quanh.',
    characteristicsVi: [
      'Có 2 mặt đáy phẳng là hình tròn bằng nhau',
      'Có 1 mặt xung quanh uốn cong',
      'Có thể lăn được khi đặt nằm ngang',
    ],
    realWorldExamples: [
      { nameVi: 'Lon nước trái cây', emoji: '🥤', descriptionVi: 'Lon nước hình trụ tròn trịa dễ cầm trên tay.' },
      { nameVi: 'Thân cột trụ lâu đài', emoji: '🏛️', descriptionVi: 'Cột đá chống đỡ vòm mái lâu đài hùng vĩ.' },
      { nameVi: 'Thùng gỗ ủ mật', emoji: '🪵', descriptionVi: 'Thùng gỗ hình trụ tròn chứa đầy mật ong rừng.' },
    ],
    speechIntroVi: 'Khối trụ có hai mặt đáy là hình tròn bằng nhau và một mặt xung quanh cong tròn.',
    color: '#10b981',
  },
  {
    id: 'shape_sphere',
    nameVi: 'Khối Cầu',
    dimension: '3D',
    gradeLevel: 'both',
    verticesCount: 0,
    edgesCount: 0,
    facesCount: 1, // 1 mặt cong khép kín
    hasRightAngles: false,
    descriptionVi: 'Khối cầu có bề mặt hoàn toàn cong tròn đều về mọi hướng, không có cạnh và không có đỉnh.',
    characteristicsVi: [
      'Không có đỉnh góc cạnh nào (0 đỉnh)',
      'Không có cạnh phẳng thẳng (0 cạnh)',
      'Lăn được dễ dàng theo mọi phương hướng',
    ],
    realWorldExamples: [
      { nameVi: 'Quả cầu pha lê', emoji: '🔮', descriptionVi: 'Viên cầu pha lê tiên tri phát ra ánh sáng tím diệu kỳ.' },
      { nameVi: 'Quả bóng thể thao', emoji: '⚽', descriptionVi: 'Bóng đá tròn lăn thoăn thoắt trên sân cỏ.' },
      { nameVi: 'Quả cam ngọt', emoji: '🍊', descriptionVi: 'Quả cam mọng nước hình khối cầu tròn xoe.' },
    ],
    speechIntroVi: 'Khối cầu có bề mặt hoàn toàn cong tròn, không có đỉnh và không có cạnh thẳng, lăn được về mọi hướng.',
    color: '#e11d48',
  },
];

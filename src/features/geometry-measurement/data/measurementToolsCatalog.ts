import type { MeasurementToolTask, SpatialMazeTask } from '../../../types/geometryMeasurement';

export const MEASUREMENT_TASKS: MeasurementToolTask[] = [
  // ==========================================
  // 1. VIRTUAL RULER (ĐO ĐỘ DÀI)
  // ==========================================
  {
    id: 'ruler_g2_pencil',
    type: 'length',
    gradeLevel: 'grade-2',
    title: 'Đo Chiều Dài Cây Bút Chì Ma Thuật',
    promptVi: 'Tony hãy đặt đầu cây bút chì trùng với vạch số 0 của thước, sau đó đọc xem đầu nhọn của bút chì chỉ đến vạch bao nhiêu xăng-ti-mét (cm)?',
    targetItemName: 'Cây Bút Chì Phép Thuật',
    targetItemEmoji: '✏️',
    targetValue: 8,
    targetUnit: 'cm',
    rulerConfig: {
      startOffsetCm: 0,
      itemLengthCm: 8,
      unitStep: 'cm',
      requiresZeroAlignment: true,
    },
    hintVi: 'Lưu ý sư phạm quan trọng: Đặt một đầu của vật trùng khít với vạch số 0 (không phải vạch số 1 hay mép thước gỗ). Nhìn đầu kia chỉ số 8, vậy bút dài 8 cm.',
  },
  {
    id: 'ruler_g2_ribbon',
    type: 'length',
    gradeLevel: 'grade-2',
    title: 'Đo Dải Ruy Băng Hiệp Sĩ',
    promptVi: 'Đo chiều dài dải ruy băng buộc huân chương danh dự của Tony. Hãy kéo thước căn chỉnh vạch 0 và đọc kết quả.',
    targetItemName: 'Dải Ruy Băng Xanh',
    targetItemEmoji: '🎗️',
    targetValue: 12,
    targetUnit: 'cm',
    rulerConfig: {
      startOffsetCm: 0,
      itemLengthCm: 12,
      unitStep: 'cm',
      requiresZeroAlignment: true,
    },
    hintVi: 'Đầu dải ruy băng ở vạch 0, đuôi ruy băng chạm vạch số 12. Độ dài là 12 cm.',
  },
  {
    id: 'ruler_g3_crystal_key',
    type: 'length',
    gradeLevel: 'grade-3',
    title: 'Đo Chìa Khóa Pha Lê Bằng Thước Mi-li-mét',
    promptVi: 'Chìa khóa mở rương cổ cần đo chính xác đến mi-li-mét (mm). 1 cm = 10 mm. Chiếc chìa khóa dài 6 cm 5 mm, tức là bao nhiêu mm?',
    targetItemName: 'Chìa Khóa Pha Lê',
    targetItemEmoji: '🗝️',
    targetValue: 65,
    targetUnit: 'mm',
    rulerConfig: {
      startOffsetCm: 0,
      itemLengthCm: 6.5,
      unitStep: 'mm',
      requiresZeroAlignment: true,
    },
    hintVi: 'Đổi: 6 cm = 60 mm. 60 mm + 5 mm = 65 mm.',
  },
  {
    id: 'ruler_g3_misaligned_test',
    type: 'length',
    gradeLevel: 'grade-3',
    title: 'Phát Hiện Thước Bị Đặt Lệch Vạch Số 0',
    promptVi: 'Bác thợ rèn đặt thanh sắt từ vạch 2 cm đến vạch 9 cm. Hỏi thanh sắt thực sự dài bao nhiêu cm?',
    targetItemName: 'Thanh Sắt Tinh Luyện',
    targetItemEmoji: '🗡️',
    targetValue: 7,
    targetUnit: 'cm',
    rulerConfig: {
      startOffsetCm: 2,
      itemLengthCm: 7,
      unitStep: 'cm',
      requiresZeroAlignment: false,
    },
    hintVi: 'Khi vật không bắt đầu từ vạch 0: Chiều dài thực tế = Vạch kết thúc (9) - Vạch bắt đầu (2) = 7 cm.',
  },

  // ==========================================
  // 2. VIRTUAL SCALE (ĐO KHỐI LƯỢNG)
  // ==========================================
  {
    id: 'scale_g2_watermelon',
    type: 'mass',
    gradeLevel: 'grade-2',
    title: 'Cân Trái Dưa Hấu Nông Trại Bằng Quả Cân Ki-lô-gam',
    promptVi: 'Đặt quả dưa hấu lên đĩa cân bên trái. Đĩa cân bên phải cần bao nhiêu quả cân 1 kg và 2 kg để hai đĩa cân thăng bằng thau tháu?',
    targetItemName: 'Trái Dưa Hấu Khổng Lồ',
    targetItemEmoji: '🍉',
    targetValue: 3,
    targetUnit: 'kg',
    scaleConfig: {
      itemWeightGrams: 3000,
      availableWeights: [
        { weight: 1000, label: '1 kg', count: 3 },
        { weight: 2000, label: '2 kg', count: 2 },
      ],
    },
    hintVi: 'Khi kim ở chính giữa, 2 đĩa cân thăng bằng: Quả dưa hấu nặng đúng bằng tổng khối lượng các quả cân (1 kg + 2 kg = 3 kg).',
  },
  {
    id: 'scale_g3_gold_gem',
    type: 'mass',
    gradeLevel: 'grade-3',
    title: 'Cân Viên Đá Ma Thuật Bằng Gam (g)',
    promptVi: 'Biết 1 kg = 1000 g. Viên đá ma thuật nặng 750 g. Tony hãy chọn các quả cân 500 g, 200 g và 50 g để cân thăng bằng.',
    targetItemName: 'Viên Đá Ma Thuật',
    targetItemEmoji: '💎',
    targetValue: 750,
    targetUnit: 'g',
    scaleConfig: {
      itemWeightGrams: 750,
      availableWeights: [
        { weight: 500, label: '500 g', count: 1 },
        { weight: 200, label: '200 g', count: 2 },
        { weight: 50, label: '50 g', count: 2 },
      ],
    },
    hintVi: 'Tính nhẩm: 500 g + 200 g + 50 g = 750 g.',
  },

  // ==========================================
  // 3. VIRTUAL BEAKER (ĐO DUNG TÍCH)
  // ==========================================
  {
    id: 'beaker_g2_water_jug',
    type: 'capacity',
    gradeLevel: 'grade-2',
    title: 'Đong Nước Uống Cho Đội Kỵ Binh Bằng Ca 1 Lít',
    promptVi: 'Tony cần đong đủ 4 lít (l) nước tinh khiết vào bình chứa. Hãy bấm nút rót từng ca 1 lít cho đến khi mực nước đạt vạch 4 l.',
    targetItemName: 'Nước Suối Tinh Khiết',
    targetItemEmoji: '💧',
    targetValue: 4,
    targetUnit: 'l',
    beakerConfig: {
      targetCapacityMl: 4000,
      maxCapacityMl: 6000,
      stepMl: 1000,
    },
    hintVi: 'Rót 4 ca nước (mỗi ca 1 lít), mực nước sẽ chạm đúng vạch số 4 trên thân bình.',
  },
  {
    id: 'beaker_g3_healing_potion',
    type: 'capacity',
    gradeLevel: 'grade-3',
    title: 'Pha Chế Thuốc Hồi Máu 600 Mi-li-lít (ml)',
    promptVi: 'Biết 1 l = 1000 ml. Ống nghiệm ma thuật có vạch chia mỗi bước 100 ml. Hãy đong chính xác 600 ml dung dịch thảo dược!',
    targetItemName: 'Dược Thảo Hồi Máu',
    targetItemEmoji: '🧪',
    targetValue: 600,
    targetUnit: 'ml',
    beakerConfig: {
      targetCapacityMl: 600,
      maxCapacityMl: 1000,
      stepMl: 100,
    },
    hintVi: 'Bấm nút rót 6 lần (mỗi lần 100 ml): 100 × 6 = 600 ml.',
  },

  // ==========================================
  // 4. INTERACTIVE CLOCK (ĐỌC & CHỈNH ĐỒNG HỒ)
  // ==========================================
  {
    id: 'clock_g2_exact_hour',
    type: 'time',
    gradeLevel: 'grade-2',
    title: 'Luyện Tập: Đọc Giờ Đúng Trên Tháp Thời Gian',
    promptVi: 'Quan sát mặt đồng hồ tháp: Kim ngắn (kim giờ) chỉ số 8, kim dài (kim phút) chỉ số 12. Đồng hồ đang chỉ mấy giờ?',
    targetItemName: 'Đồng Hồ Cổ Tháp Chuông',
    targetItemEmoji: '🕰️',
    targetValue: 8,
    targetUnit: 'giờ',
    clockConfig: {
      targetHour: 8,
      targetMinute: 0,
      allowOClockOnly: true,
      explanationVi: 'Khi kim phút chỉ đúng số 12 và kim giờ chỉ số 8, đó là 8 giờ đúng.',
    },
    hintVi: 'Kim ngắn chỉ giờ, kim dài chỉ phút. Kim dài chỉ số 12 là giờ tròn (đúng).',
  },
  {
    id: 'clock_g2_half_hour',
    type: 'time',
    gradeLevel: 'grade-2',
    title: 'Luyện Tập: Đọc Giờ Rưỡi (30 phút)',
    promptVi: 'Kim giờ nằm giữa số 2 và số 3, kim phút chỉ thẳng số 6. Đồng hồ đang chỉ mấy giờ?',
    targetItemName: 'Đồng Hồ Lều Trại',
    targetItemEmoji: '⏰',
    targetValue: 2.5, // 2 giờ 30 phút
    targetUnit: 'giờ rưỡi',
    clockConfig: {
      targetHour: 2,
      targetMinute: 30,
      allowOClockOnly: false,
      explanationVi: 'Kim phút chỉ số 6 là 30 phút (giờ rưỡi). Kim giờ qua số 2, vậy là 2 giờ 30 phút hay 2 giờ rưỡi.',
    },
    hintVi: 'Số 6 trên mặt đồng hồ ứng với 30 phút, còn gọi là "giờ rưỡi".',
  },
  {
    id: 'clock_g3_exact_minutes',
    type: 'time',
    gradeLevel: 'grade-3',
    title: 'Đọc Giờ Chính Xác Đến Từng 5 Phút & Giờ Kém',
    promptVi: 'Đồng hồ chỉ kim giờ gần số 9, kim phút chỉ số 9 (45 phút). Cách đọc giờ này là bao nhiêu?',
    targetItemName: 'Đồng Hồ Cung Điện',
    targetItemEmoji: '⏱️',
    targetValue: 8.75, // 8 giờ 45 phút = 9 giờ kém 15 phút
    targetUnit: '8 giờ 45 phút hoặc 9 giờ kém 15 phút',
    clockConfig: {
      targetHour: 8,
      targetMinute: 45,
      explanationVi: '8 giờ 45 phút còn có cách gọi là 9 giờ kém 15 phút (vì còn 15 phút nữa là đến 9 giờ).',
    },
    hintVi: 'Mỗi khoảng số từ 1 đến 12 là 5 phút. Kim dài chỉ số 9 tức là: 5 × 9 = 45 phút. Đọc là 8 giờ 45 phút hoặc 9 giờ kém 15 phút.',
  },
];

export const SPATIAL_MAZE_TASKS: SpatialMazeTask[] = [
  {
    id: 'maze_g2_treasure_key',
    gradeLevel: 'grade-2',
    title: 'Định Hướng Tìm Chìa Khóa Trong Mê Cung',
    promptVi: 'Tony đang ở vị trí bắt đầu 🧙‍♂️. Để đến được vị trí chìa khóa vàng 🗝️, Tony cần di chuyển theo thứ tự phương hướng nào?',
    gridSize: { rows: 4, cols: 4 },
    startPos: { x: 0, y: 0 },
    targetPos: { x: 2, y: 2 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 1 },
    ],
    solutionCommands: ['DOWN', 'RIGHT', 'DOWN', 'RIGHT'],
    hintVi: 'Di chuyển xuống dưới 1 bước, rẽ phải 1 bước, xuống dưới 1 bước, rồi rẽ phải 1 bước để lấy chìa khóa!',
  },
  {
    id: 'maze_g3_crystal_chamber',
    gradeLevel: 'grade-3',
    title: 'Vượt Mê Cung Không Gian Pha Lê 3D',
    promptVi: 'Dẫn đường cho Tony vượt qua mê cung đá thần: tránh bẫy gai 🪨 và đi tới cổng dịch chuyển 🌀.',
    gridSize: { rows: 5, cols: 5 },
    startPos: { x: 0, y: 0 },
    targetPos: { x: 4, y: 3 },
    obstacles: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    solutionCommands: ['RIGHT', 'RIGHT', 'RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'DOWN'],
    hintVi: 'Đi hết hàng trên sang bên phải (4 bước RIGHT), rồi đi thẳng xuống 3 bước (DOWN) đến cổng dịch chuyển!',
  },
];

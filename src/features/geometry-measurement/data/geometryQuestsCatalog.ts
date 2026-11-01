export interface RealLifeGeometryQuest {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3' | 'both';
  title: string;
  category: 'bridge' | 'house' | 'treasure' | 'time' | 'maze';
  icon: string;
  storyIntroVi: string;
  objectiveVi: string;
  taskSteps: {
    step: number;
    descriptionVi: string;
    targetAction: string;
    correctAnswer: string | number;
    options?: (string | number)[];
  }[];
  rewardXp: number;
  rewardGold: number;
}

export const REAL_LIFE_GEOMETRY_QUESTS: RealLifeGeometryQuest[] = [
  {
    id: 'quest_bridge_builder',
    gradeLevel: 'both',
    title: 'Xây Dựng Cây Cầu Đá Qua Vực Thẳm',
    category: 'bridge',
    icon: '🌉',
    storyIntroVi: 'Dòng suối thác lũ chảy xiết đã cuốn trôi cây cầu gỗ nối vào Lâu Đài Hình Học. Tony cần dùng thước đo khoảng cách và chọn các khối đá hình chữ nhật có kích thước chuẩn để bắc lại cây cầu!',
    objectiveVi: 'Đo độ dài nhịp cầu và chọn 3 khối đá chữ nhật dài 4 mét ghép lại.',
    taskSteps: [
      {
        step: 1,
        descriptionVi: 'Dùng thước đo laser đo khoảng cách giữa 2 bờ vực:',
        targetAction: 'Xác định độ dài nhịp cầu',
        correctAnswer: '12 mét',
        options: ['8 mét', '12 mét', '15 mét', '20 mét'],
      },
      {
        step: 2,
        descriptionVi: 'Cần bao nhiêu khối đá hình chữ nhật dài 4 mét để bắc vừa khít 12 mét cầu? (12 : 4 = ?)',
        targetAction: 'Tính số khối đá',
        correctAnswer: 3,
        options: [2, 3, 4, 5],
      },
    ],
    rewardXp: 150,
    rewardGold: 75,
  },
  {
    id: 'quest_house_builder',
    gradeLevel: 'both',
    title: 'Thiết Kế Ngôi Nhà Pháp Sư',
    category: 'house',
    icon: '🏡',
    storyIntroVi: 'Pháp sư Merlin muốn dựng một ngôi nhà mới bảo vệ vương quốc. Ngôi nhà cần cấu trúc vững chắc từ các hình học cơ bản.',
    objectiveVi: 'Lựa chọn hình học phù hợp cho mái nhà, tường nhà và cánh cửa sổ.',
    taskSteps: [
      {
        step: 1,
        descriptionVi: 'Mái nhà giúp thoát nước mưa tốt nhất nên được ghép từ hình gì?',
        targetAction: 'Chọn hình cho mái nhà',
        correctAnswer: 'Hình tam giác',
        options: ['Hình tròn', 'Hình tam giác', 'Hình bầu dục', 'Hình thang cân'],
      },
      {
        step: 2,
        descriptionVi: 'Bốn bức tường chính bao quanh ngôi nhà vững chãi nên xây theo khối hình gì?',
        targetAction: 'Chọn khối hình cho thân nhà',
        correctAnswer: 'Khối hộp chữ nhật',
        options: ['Khối cầu', 'Khối nón', 'Khối hộp chữ nhật', 'Khối trụ nằm ngang'],
      },
    ],
    rewardXp: 180,
    rewardGold: 90,
  },
  {
    id: 'quest_treasure_scale',
    gradeLevel: 'both',
    title: 'Cân Kho Báu Mở Cánh Cổng Bí Mật',
    category: 'treasure',
    icon: '⚖️',
    storyIntroVi: 'Cánh cổng đá cổ xưa của Đền Thờ Tri Thức chỉ mở khi đặt lên đĩa cân cổ một khối đá quý nặng đúng 5 kg.',
    objectiveVi: 'Sử dụng các quả cân để tìm viên ngọc nặng đúng 5 kg.',
    taskSteps: [
      {
        step: 1,
        descriptionVi: 'Trên đĩa cân bên phải có hai quả cân 2 kg và một quả cân 1 kg. Tổng khối lượng là bao nhiêu?',
        targetAction: 'Tính tổng quả cân',
        correctAnswer: '5 kg',
        options: ['3 kg', '4 kg', '5 kg', '6 kg'],
      },
      {
        step: 2,
        descriptionVi: 'Khi đặt viên ngọc xanh lên đĩa trái, kim chỉ cân thăng bằng chính giữa. Vậy viên ngọc nặng bao nhiêu kg?',
        targetAction: 'Kết luận khối lượng viên ngọc',
        correctAnswer: '5 kg',
        options: ['4 kg', '5 kg', '6 kg', '10 kg'],
      },
    ],
    rewardXp: 200,
    rewardGold: 100,
  },
  {
    id: 'quest_time_gate',
    gradeLevel: 'both',
    title: 'Thời Khắc Đóng Cổng Thành Thời Gian',
    category: 'time',
    icon: '⏰',
    storyIntroVi: 'Mỗi buổi chiều, cổng thành Ánh Sáng sẽ đóng lại đúng lúc 5 giờ 30 chiều (5 giờ rưỡi). Tony cần canh giờ chuẩn xác để trở về an toàn!',
    objectiveVi: 'Đọc đồng hồ Tháp Thời Gian và tính thời gian còn lại.',
    taskSteps: [
      {
        step: 1,
        descriptionVi: 'Đồng hồ chỉ kim giờ chỉ số 5, kim phút chỉ số 6. Đó là mấy giờ?',
        targetAction: 'Đọc giờ chiều',
        correctAnswer: '5 giờ rưỡi (5 giờ 30 phút)',
        options: ['5 giờ 6 phút', '6 giờ 5 phút', '5 giờ rưỡi (5 giờ 30 phút)', '6 giờ đúng'],
      },
      {
        step: 2,
        descriptionVi: 'Hiện tại là 4 giờ 30 phút. Còn bao nhiêu tiếng nữa thì đến 5 giờ 30 phút?',
        targetAction: 'Tính khoảng thời gian',
        correctAnswer: '1 giờ',
        options: ['30 phút', '1 giờ', '2 giờ', '3 giờ'],
      },
    ],
    rewardXp: 160,
    rewardGold: 80,
  },
];

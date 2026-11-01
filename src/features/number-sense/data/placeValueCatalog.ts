import type { PlaceValueTask } from '../../../types/numberSense';

export const PLACE_VALUE_TASKS: PlaceValueTask[] = [
  // ==========================================
  // GRADE 2 - NUMBERS WITHIN 1,000
  // ==========================================
  {
    id: 'pv_g2_356',
    gradeLevel: 'grade-2',
    targetNumber: 356,
    promptVi: 'Tony hãy ghép các khối số để tạo thành con số 356 (Ba trăm năm mươi sáu).',
    expectedBlocks: {
      thousands: 0,
      hundreds: 3,
      tens: 5,
      ones: 6,
    },
    explanationVi: 'Số 356 gồm 3 trăm, 5 chục và 6 đơn vị: 300 + 50 + 6 = 356.',
    hintVi: 'Chữ số hàng trăm là 3 (3 khối trăm), hàng chục là 5 (5 thanh chục), hàng đơn vị là 6 (6 khối đơn vị).',
  },
  {
    id: 'pv_g2_420',
    gradeLevel: 'grade-2',
    targetNumber: 420,
    promptVi: 'Ghép các khối số để tạo thành số 420 (Bốn trăm hai mươi). Chú ý hàng đơn vị là 0!',
    expectedBlocks: {
      thousands: 0,
      hundreds: 4,
      tens: 2,
      ones: 0,
    },
    explanationVi: 'Số 420 gồm 4 trăm, 2 chục và 0 đơn vị: 400 + 20 = 420.',
    hintVi: 'Hàng đơn vị là chữ số 0, nên không cần đặt khối đơn vị nào.',
  },
  {
    id: 'pv_g2_708',
    gradeLevel: 'grade-2',
    targetNumber: 708,
    promptVi: 'Ghép các khối số để tạo thành số 708 (Bảy trăm linh tám). Chú ý hàng chục là 0!',
    expectedBlocks: {
      thousands: 0,
      hundreds: 7,
      tens: 0,
      ones: 8,
    },
    explanationVi: 'Số 708 gồm 7 trăm, 0 chục và 8 đơn vị: 700 + 8 = 708.',
    hintVi: 'Có 7 khối trăm và 8 khối đơn vị, hàng chục để trống (0 thanh).',
  },
  {
    id: 'pv_g2_999',
    gradeLevel: 'grade-2',
    targetNumber: 999,
    promptVi: 'Tạo thành số có 3 chữ số lớn nhất: 999 (Chín trăm chín mươi chín).',
    expectedBlocks: {
      thousands: 0,
      hundreds: 9,
      tens: 9,
      ones: 9,
    },
    explanationVi: 'Số 999 gồm 9 trăm, 9 chục và 9 đơn vị: 900 + 90 + 9 = 999.',
    hintVi: 'Lấy tối đa 9 khối ở mỗi hàng trăm, chục và đơn vị.',
  },

  // ==========================================
  // GRADE 3 - NUMBERS WITHIN 10,000
  // ==========================================
  {
    id: 'pv_g3_2450',
    gradeLevel: 'grade-3',
    targetNumber: 2450,
    promptVi: 'Tony hãy ghép các khối số để tạo thành con số 2450 (Hai nghìn bốn trăm năm mươi).',
    expectedBlocks: {
      thousands: 2,
      hundreds: 4,
      tens: 5,
      ones: 0,
    },
    explanationVi: 'Số 2450 gồm 2 nghìn, 4 trăm, 5 chục và 0 đơn vị: 2000 + 400 + 50 = 2450.',
    hintVi: 'Dùng 2 khối lập phương lớn hàng nghìn, 4 khối trăm, 5 thanh chục.',
  },
  {
    id: 'pv_g3_3085',
    gradeLevel: 'grade-3',
    targetNumber: 3085,
    promptVi: 'Tạo thành số 3085 (Ba nghìn không trăm tám mươi lăm). Chú ý hàng trăm là chữ số 0!',
    expectedBlocks: {
      thousands: 3,
      hundreds: 0,
      tens: 8,
      ones: 5,
    },
    explanationVi: 'Số 3085 gồm 3 nghìn, 0 trăm, 8 chục và 5 đơn vị: 3000 + 80 + 5 = 3085.',
    hintVi: 'Hàng trăm là 0 nên không cần đặt khối trăm nào.',
  },
  {
    id: 'pv_g3_5600',
    gradeLevel: 'grade-3',
    targetNumber: 5600,
    promptVi: 'Tạo thành số tròn trăm 5600 (Năm nghìn sáu trăm).',
    expectedBlocks: {
      thousands: 5,
      hundreds: 6,
      tens: 0,
      ones: 0,
    },
    explanationVi: 'Số 5600 gồm 5 nghìn, 6 trăm, 0 chục và 0 đơn vị: 5000 + 600 = 5600.',
    hintVi: 'Chỉ cần dùng 5 khối nghìn và 6 khối trăm.',
  },
  {
    id: 'pv_g3_7824',
    gradeLevel: 'grade-3',
    targetNumber: 7824,
    promptVi: 'Tạo thành số 7824 (Bảy nghìn tám trăm hai mươi tư) đầy đủ cả 4 hàng.',
    expectedBlocks: {
      thousands: 7,
      hundreds: 8,
      tens: 2,
      ones: 4,
    },
    explanationVi: 'Số 7824 gồm 7 nghìn, 8 trăm, 2 chục và 4 đơn vị: 7000 + 800 + 20 + 4 = 7824.',
    hintVi: '7 khối nghìn + 8 khối trăm + 2 thanh chục + 4 khối đơn vị.',
  },
];

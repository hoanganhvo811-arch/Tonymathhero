import type { MathQuestion } from '@/types/math';

export interface Grade3Topic {
  id: string;
  nameVi: string;
  descriptionVi: string;
  defaultDifficulty: 'easy' | 'normal' | 'hard';
  generate: () => MathQuestion;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createUniqueOptions(correct: number, distractors: number[], unit = ''): { options: string[]; correctIndex: number } {
  const set = new Set<number>();
  set.add(correct);
  for (const d of distractors) {
    if (d > 0 && d !== correct) {
      set.add(d);
    }
  }
  let offset = 1;
  while (set.size < 4) {
    set.add(correct + offset);
    if (set.size < 4 && correct - offset > 0) {
      set.add(correct - offset);
    }
    offset++;
  }

  const rawOptions = Array.from(set).slice(0, 4);
  const shuffled = shuffleArray(rawOptions);
  const correctIndex = shuffled.indexOf(correct);
  const options = shuffled.map((v) => (unit ? `${v} ${unit}` : `${v}`));

  return { options, correctIndex };
}

export const GRADE_3_TOPICS: Record<string, Grade3Topic> = {
  // 1. Bảng nhân 6, 7, 8, 9
  multiplication_tables_6_9: {
    id: 'multiplication_tables_6_9',
    nameVi: 'Bảng nhân 6, 7, 8, 9',
    descriptionVi: 'Phép nhân trong phạm vi bảng nhân nâng cao lớp 3',
    defaultDifficulty: 'easy',
    generate: () => {
      const bases = [6, 7, 8, 9];
      const base = bases[Math.floor(Math.random() * bases.length)];
      const multiplier = Math.floor(Math.random() * 8) + 3; // 3 to 10
      const correct = base * multiplier;

      const { options, correctIndex } = createUniqueOptions(correct, [
        base * (multiplier - 1),
        base * (multiplier + 1),
        base + multiplier,
      ]);

      const id = `g3-mul-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-3',
        kingdomId: 'g3-k1-numeria',
        grade: 'grade-3' as const,
        topic: 'multiplication_tables_6_9',
        topicNameVi: 'Bảng nhân 6, 7, 8, 9',
        subtopic: `Bảng nhân ${base}`,
        difficulty: 'easy',
        questionType: 'multiple_choice',
        questionText: `Hãy tìm kết quả của phép nhân: ${base} × ${multiplier} = ?`,
        visualPrompt: `⚔️ Hiệp Sĩ Tony thi triển kiếm khí ${base} luồng, lập lại qua ${multiplier} đợt xung kích.`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${correct}`,
        hint: `Nhẩm lại bảng nhân ${base}: ${base} × ${multiplier - 1} = ${base * (multiplier - 1)}, thêm ${base} là được kết quả!`,
        explanation: `Theo bảng nhân ${base}:\n${base} × ${multiplier} = ${correct}.`,
        stepByStepSolution: [
          `Nhẩm bảng nhân ${base}:`,
          `Ta có ${base} nhân ${multiplier} bằng ${correct}.`,
          `Đáp số: ${correct}.`,
        ],
        expReward: 30,
        goldReward: 20,
        timeLimitSeconds: 30,
      };
    },
  },

  // 2. Nhân số có 2, 3 chữ số với số có 1 chữ số
  multi_digit_multiplication: {
    id: 'multi_digit_multiplication',
    nameVi: 'Nhân số có nhiều chữ số với số có một chữ số',
    descriptionVi: 'Nhân số có 2 hoặc 3 chữ số với một số tự nhiên từ 2 đến 9',
    defaultDifficulty: 'normal',
    generate: () => {
      const is3Digit = Math.random() < 0.5;
      const factor = Math.floor(Math.random() * 6) + 2; // 2 to 7
      const multiDigit = is3Digit
        ? Math.floor(Math.random() * 200) + 120 // 120 to 320
        : Math.floor(Math.random() * 50) + 25; // 25 to 75
      const correct = multiDigit * factor;

      const { options, correctIndex } = createUniqueOptions(correct, [
        correct + 10,
        correct - 10,
        (multiDigit + factor) * 2,
      ]);

      const id = `g3-mdm-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-3',
        kingdomId: 'g3-k1-numeria',
        grade: 'grade-3' as const,
        topic: 'multi_digit_multiplication',
        topicNameVi: 'Phép nhân nhiều chữ số',
        subtopic: is3Digit ? 'Nhân số có 3 chữ số' : 'Nhân số có 2 chữ số',
        difficulty: 'normal',
        questionType: 'multiple_choice',
        questionText: `Tính kết quả của phép nhân: ${multiDigit} × ${factor} = ?`,
        visualPrompt: `  ${multiDigit}\n×   ${factor}\n------\n  ????`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${correct}`,
        hint: `Nhân lần lượt từ phải sang trái: nhân hàng đơn vị, rồi nhân hàng chục, sau đó là hàng trăm (nếu có nhớ thì cộng thêm vào).`,
        explanation: `Đặt tính rồi tính nhân từ phải sang trái:\n${multiDigit} × ${factor} = ${correct}.`,
        stepByStepSolution: [
          `Nhân chữ số hàng đơn vị: ${(multiDigit % 10)} × ${factor}.`,
          `Nhân chữ số hàng chục và cộng số nhớ nếu có.`,
          `Nhân chữ số hàng trăm (nếu có) và cộng số nhớ.`,
          `Kết quả: ${correct}.`,
        ],
        expReward: 35,
        goldReward: 25,
        timeLimitSeconds: 45,
      };
    },
  },

  // 3. Chu vi và diện tích hình vuông, hình chữ nhật
  geometry_perimeter_area: {
    id: 'geometry_perimeter_area',
    nameVi: 'Chu vi và Diện tích hình vuông, hình chữ nhật',
    descriptionVi: 'Tính chu vi và diện tích của hình vuông và hình chữ nhật',
    defaultDifficulty: 'normal',
    generate: () => {
      const isRectangle = Math.random() < 0.5;
      const isArea = Math.random() < 0.5;

      if (isRectangle) {
        const width = Math.floor(Math.random() * 6) + 4; // 4 to 9
        const length = width + Math.floor(Math.random() * 6) + 2; // length > width
        const correct = isArea ? length * width : (length + width) * 2;
        const unit = isArea ? 'cm²' : 'cm';

        const { options, correctIndex } = createUniqueOptions(
          correct,
          isArea ? [(length + width) * 2, (length + 1) * width, length * (width - 1)] : [length * width, length + width, (length + width) * 4],
          unit
        );

        return {
          id: `g3-geo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          campaignId: 'grade-3',
          kingdomId: 'g3-k3-planimetria',
          grade: 'grade-3' as const,
          topic: 'geometry_perimeter_area',
          topicNameVi: 'Chu vi & Diện tích hình chữ nhật',
          subtopic: isArea ? 'Diện tích hình chữ nhật' : 'Chu vi hình chữ nhật',
          difficulty: 'normal',
          questionType: 'geometry',
          questionText: isArea
            ? `Một tấm khiên ma thuật hình chữ nhật có chiều dài ${length} cm và chiều rộng ${width} cm. Hãy tính diện tích của tấm khiên?`
            : `Một khu vườn thần hình chữ nhật có chiều dài ${length} cm và chiều rộng ${width} cm. Chu vi của khu vườn là bao nhiêu?`,
          visualPrompt: `┌──────────── ${length} cm ────────────┐\n│                                  │ ${width} cm\n└──────────────────────────────────┘`,
          options,
          correctOptionIndex: correctIndex,
          correctAnswerText: `${correct} ${unit}`,
          hint: isArea
            ? `Muốn tính diện tích hình chữ nhật, ta lấy chiều dài nhân với chiều rộng (cùng đơn vị đo).`
            : `Muốn tính chu vi hình chữ nhật, ta lấy (chiều dài + chiều rộng) rồi nhân với 2.`,
          explanation: isArea
            ? `Diện tích hình chữ nhật là:\n${length} × ${width} = ${correct} (${unit}).`
            : `Chu vi hình chữ nhật là:\n(${length} + ${width}) × 2 = ${correct} (${unit}).`,
          stepByStepSolution: [
            isArea ? `Công thức diện tích: S = chiều dài × chiều rộng.` : `Công thức chu vi: P = (chiều dài + chiều rộng) × 2.`,
            isArea ? `Tính: ${length} × ${width} = ${correct}.` : `Tính trong ngoặc: ${length} + ${width} = ${length + width}; sau đó nhân 2: ${(length + width) * 2}.`,
            `Đáp số: ${correct} ${unit}.`,
          ],
          expReward: 35,
          goldReward: 25,
          timeLimitSeconds: 45,
        };
      } else {
        const side = Math.floor(Math.random() * 7) + 4; // 4 to 10
        const correct = isArea ? side * side : side * 4;
        const unit = isArea ? 'cm²' : 'cm';

        const { options, correctIndex } = createUniqueOptions(
          correct,
          isArea ? [side * 4, side * (side - 1), (side + 1) * side] : [side * side, side * 2, side * 3],
          unit
        );

        return {
          id: `g3-geo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          campaignId: 'grade-3',
          kingdomId: 'g3-k3-planimetria',
          grade: 'grade-3' as const,
          topic: 'geometry_perimeter_area',
          topicNameVi: 'Chu vi & Diện tích hình vuông',
          subtopic: isArea ? 'Diện tích hình vuông' : 'Chu vi hình vuông',
          difficulty: 'normal',
          questionType: 'geometry',
          questionText: isArea
            ? `Một viên Ngọc Tri Thức hình vuông có cạnh dài ${side} cm. Diện tích của viên ngọc là bao nhiêu?`
            : `Một viên đá phong ấn hình vuông có cạnh dài ${side} cm. Chu vi của viên đá phong ấn là bao nhiêu?`,
          visualPrompt: `┌────── ${side} cm ──────┐\n│                     │\n│       HÌNH          │ ${side} cm\n│       VUÔNG         │\n└─────────────────────┘`,
          options,
          correctOptionIndex: correctIndex,
          correctAnswerText: `${correct} ${unit}`,
          hint: isArea
            ? `Muốn tính diện tích hình vuông, ta lấy độ dài cạnh nhân với chính nó: S = cạnh × cạnh.`
            : `Muốn tính chu vi hình vuông, ta lấy độ dài một cạnh nhân với 4: P = cạnh × 4.`,
          explanation: isArea
            ? `Diện tích hình vuông là:\n${side} × ${side} = ${correct} (${unit}).`
            : `Chu vi hình vuông là:\n${side} × 4 = ${correct} (${unit}).`,
          stepByStepSolution: [
            isArea ? `Công thức diện tích hình vuông: S = a × a.` : `Công thức chu vi hình vuông: P = a × 4.`,
            isArea ? `Tính: ${side} × ${side} = ${correct}.` : `Tính: ${side} × 4 = ${correct}.`,
            `Đáp số: ${correct} ${unit}.`,
          ],
          expReward: 35,
          goldReward: 25,
          timeLimitSeconds: 40,
        };
      }
    },
  },

  // 4. Giải bài toán bằng hai phép tính
  two_step_word_problems: {
    id: 'two_step_word_problems',
    nameVi: 'Giải bài toán bằng hai phép tính',
    descriptionVi: 'Bài toán lời văn nâng cao đòi hỏi tìm bước trung gian rồi mới tính kết quả chung',
    defaultDifficulty: 'hard',
    generate: () => {
      const team1 = Math.floor(Math.random() * 20) + 25; // 25 to 44
      const diff = Math.floor(Math.random() * 10) + 6; // 6 to 15
      const team2 = team1 + diff;
      const total = team1 + team2;

      const { options, correctIndex } = createUniqueOptions(total, [
        team2, // student forgot to add team 1 to total
        team1 * 2, // forgot difference
        total - 5,
      ], 'cây');

      const id = `g3-wp2-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-3',
        kingdomId: 'g3-k1-numeria',
        grade: 'grade-3' as const,
        topic: 'two_step_word_problems',
        topicNameVi: 'Giải toán bằng hai bước tính',
        subtopic: 'Tìm tổng của hai đại lượng',
        difficulty: 'hard',
        questionType: 'word_problem',
        questionText: `Đội Hiệp Sĩ thứ nhất trồng được ${team1} Cây Ánh Sáng. Đội Hiệp Sĩ thứ hai trồng nhiều hơn Đội thứ nhất ${diff} cây. Hỏi cả hai đội trồng được tất cả bao nhiêu Cây Ánh Sáng?`,
        visualPrompt: `Đội 1: [--- ${team1} cây ---]\nĐội 2: [--- ${team1} cây ---][+ ${diff} cây]\nCả 2 đội: ? cây`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${total} cây`,
        hint: `Đây là bài toán 2 bước tính: Bước 1 tìm số cây Đội hai trồng (${team1} + ${diff}). Bước 2 cộng số cây của cả hai đội!`,
        explanation: `Bước 1: Số cây Đội thứ hai trồng được là:\n${team1} + ${diff} = ${team2} (cây).\nBước 2: Cả hai đội trồng được tất cả là:\n${team1} + ${team2} = ${total} (cây).`,
        stepByStepSolution: [
          `Bước 1: Tìm số cây Đội thứ hai trồng: ${team1} + ${diff} = ${team2} (cây).`,
          `Bước 2: Tìm tổng số cây của cả hai đội: ${team1} + ${team2} = ${total} (cây).`,
          `Đáp số: ${total} cây.`,
        ],
        expReward: 45,
        goldReward: 30,
        timeLimitSeconds: 60,
      };
    },
  },

  // 5. Số có 4, 5 chữ số và làm tròn số
  numbers_up_to_100000: {
    id: 'numbers_up_to_100000',
    nameVi: 'Số trong phạm vi 100 000 và Làm tròn số',
    descriptionVi: 'Cấu tạo số, giá trị hàng, so sánh và làm tròn số đến hàng nghìn, chục nghìn',
    defaultDifficulty: 'easy',
    generate: () => {
      const num = (Math.floor(Math.random() * 70) + 12) * 100 + Math.floor(Math.random() * 90) + 10; // e.g. 1256 to 8289
      const roundTo = 100;
      const rounded = Math.round(num / roundTo) * roundTo;

      const { options, correctIndex } = createUniqueOptions(rounded, [
        Math.floor(num / roundTo) * roundTo,
        Math.ceil(num / roundTo) * roundTo + 100,
        rounded + 50,
      ]);

      const id = `g3-num-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-3',
        kingdomId: 'g3-k1-numeria',
        grade: 'grade-3' as const,
        topic: 'numbers_up_to_100000',
        topicNameVi: 'Làm tròn số lớp 3',
        subtopic: 'Làm tròn đến hàng trăm',
        difficulty: 'easy',
        questionType: 'multiple_choice',
        questionText: `Khi làm tròn số ${num} đến hàng trăm, ta được số nào?`,
        visualPrompt: `Số ban đầu: ${num} ===> Làm tròn đến [HÀNG TRĂM] ???`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${rounded}`,
        hint: `Xét chữ số hàng chục của ${num} là ${Math.floor((num % 100) / 10)}. Nếu từ 5 trở lên thì làm tròn lên, nếu nhỏ hơn 5 thì làm tròn xuống!`,
        explanation: `Chữ số hàng chục của số ${num} là ${Math.floor((num % 100) / 10)}.\n${
          Math.floor((num % 100) / 10) >= 5
            ? `Vì ${Math.floor((num % 100) / 10)} ≥ 5 nên ta làm tròn lên thành ${rounded}.`
            : `Vì ${Math.floor((num % 100) / 10)} < 5 nên ta làm tròn xuống thành ${rounded}.`
        }`,
        stepByStepSolution: [
          `Nhìn vào chữ số hàng chục: ${Math.floor((num % 100) / 10)}.`,
          Math.floor((num % 100) / 10) >= 5 ? `Chữ số hàng chục ≥ 5, ta tăng chữ số hàng trăm lên 1.` : `Chữ số hàng chục < 5, ta giữ nguyên chữ số hàng trăm.`,
          `Các chữ số sau hàng làm tròn thay bằng số 0.`,
          `Kết quả: ${rounded}.`,
        ],
        expReward: 30,
        goldReward: 20,
        timeLimitSeconds: 35,
      };
    },
  },
};

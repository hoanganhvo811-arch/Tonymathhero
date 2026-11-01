import type { MathQuestion } from '@/types/math';

export interface CurriculumTopic {
  id: string;
  nameVi: string;
  descriptionVi: string;
  defaultDifficulty: 'easy' | 'normal' | 'hard';
  generate: () => MathQuestion;
}

// Utility to shuffle an array
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Utility to create unique distractors
function createUniqueOptions(correct: number, distractors: number[], unit = ''): { options: string[]; correctIndex: number } {
  const set = new Set<number>();
  set.add(correct);
  for (const d of distractors) {
    if (d > 0 && d !== correct) {
      set.add(d);
    }
  }
  // Fill if fewer than 4
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

export const GRADE_2_TOPICS: Record<string, CurriculumTopic> = {
  // 1. Phép cộng có nhớ trong phạm vi 100
  addition_with_regrouping_100: {
    id: 'addition_with_regrouping_100',
    nameVi: 'Phép cộng có nhớ trong phạm vi 100',
    descriptionVi: 'Cộng hai số có hai chữ số với số nhớ hàng chục',
    defaultDifficulty: 'easy',
    generate: () => {
      // Pick a tens and ones such that ones1 + ones2 >= 10
      const ones1 = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const ones2 = Math.floor(Math.random() * (9 - (10 - ones1) + 1)) + (10 - ones1); // ensure sum >= 10
      const tens1 = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const tens2 = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const a = tens1 * 10 + ones1;
      const b = tens2 * 10 + ones2;
      const correct = a + b;

      // Realistic distractors:
      // distractor 1: forgot carry
      const forgotCarry = (tens1 + tens2) * 10 + ((ones1 + ones2) % 10);
      // distractor 2: added extra 2 carry
      const extraCarry = correct + 10;
      // distractor 3: subtraction error or calculation mistake
      const mathError = correct - 2;

      const { options, correctIndex } = createUniqueOptions(correct, [forgotCarry, extraCarry, mathError]);

      const id = `g2-add-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-2',
        kingdomId: 'g2-k1-arithmia',
        grade: 'grade-2' as const,
        topic: 'addition_with_regrouping_100',
        topicNameVi: 'Phép cộng có nhớ trong phạm vi 100',
        subtopic: 'Cộng hai số có hai chữ số',
        difficulty: 'easy',
        questionType: 'multiple_choice',
        questionText: `Hãy tính kết quả của phép tính: ${a} + ${b} = ?`,
        visualPrompt: `  ${a}\n+ ${b}\n----\n  ???`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${correct}`,
        hint: `Cộng hàng đơn vị trước: ${ones1} + ${ones2} = ${ones1 + ones2}. Viết ${(ones1 + ones2) % 10}, nhớ 1 sang hàng chục!`,
        explanation: `Bước 1: Tính hàng đơn vị: ${ones1} + ${ones2} = ${ones1 + ones2}. Viết ${(ones1 + ones2) % 10}, nhớ 1.\nBước 2: Tính hàng chục: ${tens1} + ${tens2} = ${tens1 + tens2}, thêm 1 bằng ${tens1 + tens2 + 1}.\nVậy: ${a} + ${b} = ${correct}.`,
        stepByStepSolution: [
          `Cộng hàng đơn vị: ${ones1} + ${ones2} = ${ones1 + ones2} (viết ${(ones1 + ones2) % 10}, nhớ 1).`,
          `Cộng hàng chục: ${tens1} + ${tens2} = ${tens1 + tens2}, thêm 1 đã nhớ được ${tens1 + tens2 + 1}.`,
          `Kết quả cuối cùng là: ${correct}.`,
        ],
        expReward: 25,
        goldReward: 15,
        timeLimitSeconds: 45,
      };
    },
  },

  // 2. Phép trừ có nhớ trong phạm vi 100
  subtraction_with_regrouping_100: {
    id: 'subtraction_with_regrouping_100',
    nameVi: 'Phép trừ có nhớ trong phạm vi 100',
    descriptionVi: 'Trừ hai số có hai chữ số mượn 1 chục',
    defaultDifficulty: 'normal',
    generate: () => {
      // Pick ones1 < ones2 to force borrowing
      const ones1 = Math.floor(Math.random() * 6); // 0 to 5
      const ones2 = Math.floor(Math.random() * (9 - ones1)) + ones1 + 1; // ones2 > ones1
      const tens1 = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const tens2 = Math.floor(Math.random() * (tens1 - 1)) + 1; // tens2 < tens1
      const a = tens1 * 10 + ones1;
      const b = tens2 * 10 + ones2;
      const correct = a - b;

      // Realistic distractors:
      // distractor 1: subtracted smaller from bigger without borrowing
      const subtractedUpsideDown = (tens1 - tens2) * 10 + (ones2 - ones1);
      // distractor 2: forgot to subtract the borrowed 1 from tens
      const forgotSubBorrow = (tens1 - tens2) * 10 + (10 + ones1 - ones2);
      // distractor 3: miscalculated
      const diffError = correct + 2;

      const { options, correctIndex } = createUniqueOptions(correct, [
        subtractedUpsideDown,
        forgotSubBorrow,
        diffError,
      ]);

      const id = `g2-sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-2',
        kingdomId: 'g2-k1-arithmia',
        grade: 'grade-2' as const,
        topic: 'subtraction_with_regrouping_100',
        topicNameVi: 'Phép trừ có nhớ trong phạm vi 100',
        subtopic: 'Trừ hai số có hai chữ số',
        difficulty: 'normal',
        questionType: 'multiple_choice',
        questionText: `Hãy tìm hiệu của phép tính: ${a} - ${b} = ?`,
        visualPrompt: `  ${a}\n- ${b}\n----\n  ???`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${correct}`,
        hint: `Vì ${ones1} nhỏ hơn ${ones2}, ta mượn 1 chục: lấy 1${ones1} - ${ones2} = ${10 + ones1 - ones2}. Nhớ trả 1 vào hàng chục của số trừ!`,
        explanation: `Bước 1: Hàng đơn vị: ${ones1} không trừ được ${ones2}, lấy 1${ones1} - ${ones2} = ${10 + ones1 - ones2}, viết ${10 + ones1 - ones2}, nhớ 1.\nBước 2: Hàng chục: ${tens2} thêm 1 bằng ${tens2 + 1}; lấy ${tens1} - ${tens2 + 1} = ${tens1 - (tens2 + 1)}.\nVậy: ${a} - ${b} = ${correct}.`,
        stepByStepSolution: [
          `Mượn 1 chục: 1${ones1} - ${ones2} = ${10 + ones1 - ones2} (viết ${10 + ones1 - ones2}, nhớ 1).`,
          `Trả 1 vào hàng chục: ${tens2} + 1 = ${tens2 + 1}.`,
          `Trừ hàng chục: ${tens1} - ${tens2 + 1} = ${tens1 - tens2 - 1}.`,
          `Kết quả: ${correct}.`,
        ],
        expReward: 30,
        goldReward: 20,
        timeLimitSeconds: 45,
      };
    },
  },

  // 3. Bảng nhân 2 và Bảng nhân 5
  multiplication_table_2_5: {
    id: 'multiplication_table_2_5',
    nameVi: 'Bảng nhân 2 và Bảng nhân 5',
    descriptionVi: 'Phép nhân trong phạm vi bảng nhân 2 và bảng nhân 5',
    defaultDifficulty: 'easy',
    generate: () => {
      const base = Math.random() < 0.5 ? 2 : 5;
      const multiplier = Math.floor(Math.random() * 9) + 2; // 2 to 10
      const correct = base * multiplier;

      // Realistic distractors:
      // distractor 1: addition instead of multiplication
      const addError = base + multiplier;
      // distractor 2: off by 1 step in times table
      const offByStep = base * (multiplier - 1);
      // distractor 3: other step
      const otherStep = base * (multiplier + 1);

      const { options, correctIndex } = createUniqueOptions(correct, [addError, offByStep, otherStep]);

      const id = `g2-mul-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-2',
        kingdomId: 'g2-k3-multiplex',
        grade: 'grade-2' as const,
        topic: 'multiplication_table_2_5',
        topicNameVi: 'Bảng nhân 2 và Bảng nhân 5',
        subtopic: `Bảng nhân ${base}`,
        difficulty: 'easy',
        questionType: 'multiple_choice',
        questionText: `Hãy tính tích của phép nhân: ${base} × ${multiplier} = ?`,
        visualPrompt: `🌱 Có ${multiplier} nhóm, mỗi nhóm có ${base} viên ngọc tri thức.`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${correct}`,
        hint: `Đọc nhẩm bảng nhân ${base}: ${base} nhân ${multiplier} bằng bao nhiêu?`,
        explanation: `Theo bảng nhân ${base}:\n${base} × ${multiplier} = ${correct}. Ta cũng có thể hiểu là lấy ${multiplier} lần số ${base} cộng lại với nhau.`,
        stepByStepSolution: [
          `Nhớ lại bảng nhân ${base}:`,
          `${base} × ${multiplier} nghĩa là lấy ${base} cộng liên tiếp ${multiplier} lần.`,
          `Kết quả là: ${correct}.`,
        ],
        expReward: 25,
        goldReward: 15,
        timeLimitSeconds: 30,
      };
    },
  },

  // 4. Bảng chia 2 và Bảng chia 5
  division_table_2_5: {
    id: 'division_table_2_5',
    nameVi: 'Bảng chia 2 và Bảng chia 5',
    descriptionVi: 'Phép chia trong bảng chia 2 và bảng chia 5',
    defaultDifficulty: 'normal',
    generate: () => {
      const divisor = Math.random() < 0.5 ? 2 : 5;
      const quotient = Math.floor(Math.random() * 9) + 2; // 2 to 10
      const dividend = divisor * quotient;
      const correct = quotient;

      const { options, correctIndex } = createUniqueOptions(correct, [
        correct + 1,
        correct - 1 > 0 ? correct - 1 : correct + 2,
        correct + 3,
      ]);

      const id = `g2-div-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-2',
        kingdomId: 'g2-k3-multiplex',
        grade: 'grade-2' as const,
        topic: 'division_table_2_5',
        topicNameVi: 'Bảng chia 2 và Bảng chia 5',
        subtopic: `Bảng chia ${divisor}`,
        difficulty: 'normal',
        questionType: 'multiple_choice',
        questionText: `Tìm thương của phép chia: ${dividend} : ${divisor} = ?`,
        visualPrompt: `📦 Chia đều ${dividend} quả táo vào ${divisor} chiếc giỏ ma thuật.`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${correct}`,
        hint: `Hỏi: ${divisor} nhân mấy thì bằng ${dividend}?`,
        explanation: `Vì ${divisor} × ${quotient} = ${dividend}, nên ta có ${dividend} : ${divisor} = ${quotient}.`,
        stepByStepSolution: [
          `Phép chia là phép tính ngược của phép nhân.`,
          `Ta có: ${divisor} × ${quotient} = ${dividend}.`,
          `Do đó: ${dividend} : ${divisor} = ${correct}.`,
        ],
        expReward: 30,
        goldReward: 20,
        timeLimitSeconds: 30,
      };
    },
  },

  // 5. Đơn vị đo độ dài và dung tích (cm, m, km, l, kg)
  measurements_g2: {
    id: 'measurements_g2',
    nameVi: 'Đơn vị đo độ dài, khối lượng, dung tích',
    descriptionVi: 'Tính toán với các đơn vị cm, dm, m, kg, lít',
    defaultDifficulty: 'easy',
    generate: () => {
      const types = ['length_cm', 'capacity_liter', 'weight_kg'];
      const chosen = types[Math.floor(Math.random() * types.length)];

      if (chosen === 'length_cm') {
        const a = Math.floor(Math.random() * 40) + 15;
        const b = Math.floor(Math.random() * 35) + 12;
        const correct = a + b;
        const { options, correctIndex } = createUniqueOptions(correct, [correct - 10, correct + 5, a + b - 1], 'cm');

        return {
          id: `g2-meas-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          campaignId: 'grade-2',
          kingdomId: 'g2-k4-mensura',
          grade: 'grade-2' as const,
          topic: 'measurements_g2',
          topicNameVi: 'Đo lường độ dài',
          subtopic: 'Cộng đoạn thẳng cm',
          difficulty: 'easy',
          questionType: 'multiple_choice',
          questionText: `Thanh kiếm gỗ của Tony dài ${a} cm, phần chuôi kiếm dài ${b} cm. Tổng chiều dài thanh kiếm là bao nhiêu?`,
          visualPrompt: `[=== Thân kiếm: ${a} cm ===][ Chuôi: ${b} cm ]`,
          options,
          correctOptionIndex: correctIndex,
          correctAnswerText: `${correct} cm`,
          hint: `Thực hiện phép cộng hai số: ${a} + ${b} rồi giữ nguyên đơn vị cm.`,
          explanation: `Chiều dài thanh kiếm là:\n${a} cm + ${b} cm = ${correct} cm.`,
          stepByStepSolution: [
            `Lấy số đo thân kiếm cộng số đo chuôi kiếm: ${a} + ${b}.`,
            `Hàng đơn vị: ${(a % 10) + (b % 10)}. Hàng chục: ${Math.floor(a / 10) + Math.floor(b / 10)}.`,
            `Kết quả: ${correct} cm.`,
          ],
          expReward: 25,
          goldReward: 15,
        };
      } else if (chosen === 'capacity_liter') {
        const a = Math.floor(Math.random() * 30) + 25;
        const b = Math.floor(Math.random() * 15) + 6;
        const correct = a - b;
        const { options, correctIndex } = createUniqueOptions(correct, [correct + 10, correct - 5, a - b + 2], 'lít');

        return {
          id: `g2-meas-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          campaignId: 'grade-2',
          kingdomId: 'g2-k4-mensura',
          grade: 'grade-2' as const,
          topic: 'measurements_g2',
          topicNameVi: 'Đo lường dung tích',
          subtopic: 'Tính toán với đơn vị Lít',
          difficulty: 'easy',
          questionType: 'multiple_choice',
          questionText: `Bình nước thần của làng có ${a} lít nước ma thuật. Tony đã dùng ${b} lít để tưới Thần Thụ. Trong bình còn lại bao nhiêu lít nước?`,
          visualPrompt: `🧪 Bình nước: ${a} lít --> Đã dùng: ${b} lít`,
          options,
          correctOptionIndex: correctIndex,
          correctAnswerText: `${correct} lít`,
          hint: `Lấy tổng số lít ban đầu trừ đi số lít đã dùng: ${a} - ${b}.`,
          explanation: `Số lít nước còn lại trong bình là:\n${a} - ${b} = ${correct} (lít).`,
          stepByStepSolution: [
            `Số nước còn lại = Tổng số nước ban đầu - Số nước đã dùng.`,
            `Thực hiện phép trừ: ${a} - ${b} = ${correct}.`,
            `Đáp số: ${correct} lít.`,
          ],
          expReward: 25,
          goldReward: 15,
        };
      } else {
        const a = Math.floor(Math.random() * 30) + 20;
        const b = Math.floor(Math.random() * 25) + 15;
        const correct = a + b;
        const { options, correctIndex } = createUniqueOptions(correct, [correct - 10, correct + 10, correct - 1], 'kg');

        return {
          id: `g2-meas-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          campaignId: 'grade-2',
          kingdomId: 'g2-k4-mensura',
          grade: 'grade-2' as const,
          topic: 'measurements_g2',
          topicNameVi: 'Đo lường khối lượng',
          subtopic: 'Tính toán với đơn vị Ki-lô-gam (kg)',
          difficulty: 'easy',
          questionType: 'multiple_choice',
          questionText: `Một bao đá pha lê nặng ${a} kg, một bao đá quặng nặng ${b} kg. Cả hai bao nặng tất cả bao nhiêu ki-lô-gam?`,
          visualPrompt: `⚖️ Bao 1: ${a} kg + Bao 2: ${b} kg = ? kg`,
          options,
          correctOptionIndex: correctIndex,
          correctAnswerText: `${correct} kg`,
          hint: `Cộng khối lượng hai bao đá lại với nhau: ${a} + ${b}.`,
          explanation: `Cả hai bao nặng tất cả:\n${a} + ${b} = ${correct} (kg).`,
          stepByStepSolution: [
            `Tính tổng khối lượng của hai bao.`,
            `Phép tính: ${a} + ${b} = ${correct}.`,
            `Đáp số: ${correct} kg.`,
          ],
          expReward: 25,
          goldReward: 15,
        };
      }
    },
  },

  // 6. Hình học: Độ dài đường gấp khúc, hình tam giác, hình tứ giác
  geometry_g2: {
    id: 'geometry_g2',
    nameVi: 'Hình học và Đo lường độ dài đường gấp khúc',
    descriptionVi: 'Tính độ dài đường gấp khúc, nhận diện hình tam giác, tứ giác',
    defaultDifficulty: 'normal',
    generate: () => {
      const d1 = Math.floor(Math.random() * 15) + 10;
      const d2 = Math.floor(Math.random() * 15) + 10;
      const d3 = Math.floor(Math.random() * 15) + 10;
      const correct = d1 + d2 + d3;

      const { options, correctIndex } = createUniqueOptions(correct, [correct - 5, correct + 10, d1 + d2], 'cm');

      const id = `g2-geo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-2',
        kingdomId: 'g2-k5-geometria',
        grade: 'grade-2' as const,
        topic: 'geometry_g2',
        topicNameVi: 'Hình học lớp 2',
        subtopic: 'Độ dài đường gấp khúc',
        difficulty: 'normal',
        questionType: 'geometry',
        questionText: `Đường gấp khúc ma thuật gồm 3 đoạn thẳng có độ dài lần lượt là: ${d1} cm, ${d2} cm và ${d3} cm. Độ dài của đường gấp khúc đó là bao nhiêu?`,
        visualPrompt: `A ──(${d1}cm)── B ╲(${d2}cm)╲ C ──(${d3}cm)── D`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${correct} cm`,
        hint: `Độ dài đường gấp khúc bằng tổng độ dài các đoạn thẳng thành phần cộng lại.`,
        explanation: `Độ dài đường gấp khúc là:\n${d1} + ${d2} + ${d3} = ${correct} (cm).`,
        stepByStepSolution: [
          `Độ dài đường gấp khúc = Đoạn 1 + Đoạn 2 + Đoạn 3.`,
          `Thực hiện cộng: ${d1} + ${d2} = ${d1 + d2}.`,
          `Lấy ${d1 + d2} + ${d3} = ${correct}.`,
          `Đáp số: ${correct} cm.`,
        ],
        expReward: 30,
        goldReward: 20,
        timeLimitSeconds: 45,
      };
    },
  },

  // 7. Giải toán có lời văn (nhiều hơn, ít hơn, tất cả)
  word_problems_g2: {
    id: 'word_problems_g2',
    nameVi: 'Giải bài toán có lời văn một bước tính',
    descriptionVi: 'Bài toán về nhiều hơn, ít hơn hoặc tìm tất cả',
    defaultDifficulty: 'hard',
    generate: () => {
      const isMore = Math.random() < 0.5;
      const baseNum = Math.floor(Math.random() * 25) + 20; // 20 to 45
      const diffNum = Math.floor(Math.random() * 15) + 8; // 8 to 22
      const correct = isMore ? baseNum + diffNum : baseNum - diffNum;

      const { options, correctIndex } = createUniqueOptions(
        correct,
        isMore ? [baseNum - diffNum, correct + 5, correct - 1] : [baseNum + diffNum, correct + 10, correct - 2],
        'người'
      );

      const id = `g2-wp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        id,
        campaignId: 'grade-2',
        kingdomId: 'g2-k1-arithmia',
        grade: 'grade-2' as const,
        topic: 'word_problems_g2',
        topicNameVi: 'Giải bài toán có lời văn',
        subtopic: isMore ? 'Bài toán nhiều hơn' : 'Bài toán ít hơn',
        difficulty: 'hard',
        questionType: 'word_problem',
        questionText: isMore
          ? `Ngôi làng Arithmia có ${baseNum} người thợ rèn. Số người thợ mộc nhiều hơn số người thợ rèn là ${diffNum} người. Hỏi ngôi làng có bao nhiêu người thợ mộc?`
          : `Đội kỵ sĩ có ${baseNum} người. Đội cung thủ ít hơn đội kỵ sĩ ${diffNum} người. Hỏi đội cung thủ có bao nhiêu người?`,
        visualPrompt: isMore
          ? `Thợ rèn: [${baseNum} người]\nThợ mộc: [${baseNum} người] + [${diffNum} người] = ?`
          : `Kỵ sĩ:   [${baseNum} người]\nCung thủ: [${baseNum} - ${diffNum} người] = ?`,
        options,
        correctOptionIndex: correctIndex,
        correctAnswerText: `${correct} người`,
        hint: isMore
          ? `Bài toán "nhiều hơn" ta dùng phép tính cộng: ${baseNum} + ${diffNum}.`
          : `Bài toán "ít hơn" ta dùng phép tính trừ: ${baseNum} - ${diffNum}.`,
        explanation: isMore
          ? `Số người thợ mộc của ngôi làng là:\n${baseNum} + ${diffNum} = ${correct} (người).`
          : `Số người của đội cung thủ là:\n${baseNum} - ${diffNum} = ${correct} (người).`,
        stepByStepSolution: [
          isMore ? `Nhận biết dạng toán nhiều hơn: lấy số bé cộng với phần chênh lệch.` : `Nhận biết dạng toán ít hơn: lấy số lớn trừ đi phần chênh lệch.`,
          `Phép tính: ${baseNum} ${isMore ? '+' : '-'} ${diffNum} = ${correct}.`,
          `Đáp số: ${correct} người.`,
        ],
        expReward: 35,
        goldReward: 25,
        timeLimitSeconds: 50,
      };
    },
  },
};

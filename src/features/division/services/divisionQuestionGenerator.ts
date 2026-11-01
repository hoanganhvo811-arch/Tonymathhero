import type { DivisionFact, DivisionQuestion, DivisionQuestionType } from '../../../types/division';
import { DIVISION_FACTS } from '../data/divisionCatalog';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate 3 distinct plausible distractors for a division quotient
 */
function generateQuotientDistractors(correct: number, maxQuotient: number = 10): number[] {
  const distractors = new Set<number>();
  const deltas = [-2, -1, 1, 2, 3, -3];

  for (const delta of deltas) {
    const candidate = correct + delta;
    if (candidate > 0 && candidate <= Math.max(12, maxQuotient + 2) && candidate !== correct) {
      distractors.add(candidate);
      if (distractors.size === 3) break;
    }
  }

  // Fallback if needed
  let fill = 1;
  while (distractors.size < 3) {
    if (fill !== correct && !distractors.has(fill)) {
      distractors.add(fill);
    }
    fill++;
  }

  return Array.from(distractors);
}

export function generateDivisionQuestion(
  fact: DivisionFact,
  forcedType?: DivisionQuestionType
): DivisionQuestion {
  const types: DivisionQuestionType[] = [
    'MULTIPLE_CHOICE',
    'FILL_QUOTIENT',
    'FILL_MISSING',
    'FIND_EQUATION',
    'INVERSE_MULTIPLICATION',
    'WORD_PROBLEM',
    'REAL_WORLD',
  ];
  const type = forcedType || types[Math.floor(Math.random() * types.length)];
  const { dividend, divisor, quotient } = fact;

  switch (type) {
    case 'MULTIPLE_CHOICE': {
      const distractors = generateQuotientDistractors(quotient);
      const options = shuffle([quotient, ...distractors]);
      return {
        id: `q_mc_${fact.id}_${Date.now()}_${Math.random()}`,
        type,
        factId: fact.id,
        prompt: `Tính kết quả của phép chia: ${dividend} ÷ ${divisor} = ?`,
        options,
        correctAnswer: quotient,
        formulaDisplay: `${dividend} ÷ ${divisor} = ?`,
        explanation: `Ta có: ${divisor} × ${quotient} = ${dividend}. Do đó ${dividend} ÷ ${divisor} = ${quotient}.`,
        hint: `Hãy nhẩm bảng nhân ${divisor}: mấy nhân ${divisor} thì bằng ${dividend}?`,
        visualContext: {
          totalItems: dividend,
          groups: divisor,
          itemsPerGroup: quotient,
          itemIcon: '💎',
          label: `${dividend} viên đá chia đều cho ${divisor} cột`,
        },
        relatedMultiplicationFact: {
          factorA: divisor,
          factorB: quotient,
          product: dividend,
          formula: `${divisor} × ${quotient} = ${dividend}`,
        },
      };
    }

    case 'FILL_QUOTIENT': {
      return {
        id: `q_fq_${fact.id}_${Date.now()}_${Math.random()}`,
        type,
        factId: fact.id,
        prompt: `Điền kết quả thích hợp vào chỗ trống: ${dividend} ÷ ${divisor} = ___`,
        correctAnswer: quotient,
        formulaDisplay: `${dividend} ÷ ${divisor} = ___`,
        explanation: `Chính xác! ${dividend} ÷ ${divisor} = ${quotient} (vì ${divisor} × ${quotient} = ${dividend}).`,
        hint: `Nhẩm: ${divisor} nhân với mấy thì bằng ${dividend}?`,
        relatedMultiplicationFact: {
          factorA: divisor,
          factorB: quotient,
          product: dividend,
          formula: `${divisor} × ${quotient} = ${dividend}`,
        },
      };
    }

    case 'FILL_MISSING': {
      const missingDividend = Math.random() < 0.5;
      if (missingDividend) {
        // ___ ÷ B = C
        const distractors = generateQuotientDistractors(dividend, dividend + 10)
          .map((d) => d * divisor)
          .filter((d) => d !== dividend);
        const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 3);
        let fillOffset = 1;
        while (uniqueDistractors.length < 3 && fillOffset < 20) {
          const fake = (quotient + fillOffset) * divisor;
          if (fake !== dividend && !uniqueDistractors.includes(fake)) {
            uniqueDistractors.push(fake);
          }
          fillOffset++;
        }
        const options = shuffle([dividend, ...uniqueDistractors]);

        return {
          id: `q_fm_d_${fact.id}_${Date.now()}_${Math.random()}`,
          type,
          factId: fact.id,
          prompt: `Tìm số bị chia thích hợp: ___ ÷ ${divisor} = ${quotient}`,
          options,
          correctAnswer: dividend,
          formulaDisplay: `___ ÷ ${divisor} = ${quotient}`,
          explanation: `Muốn tìm số bị chia, ta lấy thương nhân với số chia: ${quotient} × ${divisor} = ${dividend}.`,
          hint: `Lấy ${quotient} nhân với ${divisor} để tìm số ban đầu nhé!`,
          relatedMultiplicationFact: {
            factorA: divisor,
            factorB: quotient,
            product: dividend,
            formula: `${divisor} × ${quotient} = ${dividend}`,
          },
        };
      } else {
        // A ÷ ___ = C
        const distractors = generateQuotientDistractors(divisor);
        const options = shuffle([divisor, ...distractors]);
        return {
          id: `q_fm_v_${fact.id}_${Date.now()}_${Math.random()}`,
          type,
          factId: fact.id,
          prompt: `Tìm số chia thích hợp: ${dividend} ÷ ___ = ${quotient}`,
          options,
          correctAnswer: divisor,
          formulaDisplay: `${dividend} ÷ ___ = ${quotient}`,
          explanation: `Muốn tìm số chia, ta lấy số bị chia chia cho thương: ${dividend} ÷ ${quotient} = ${divisor}.`,
          hint: `Số nào nhân với ${quotient} sẽ bằng ${dividend}?`,
          relatedMultiplicationFact: {
            factorA: divisor,
            factorB: quotient,
            product: dividend,
            formula: `${divisor} × ${quotient} = ${dividend}`,
          },
        };
      }
    }

    case 'FIND_EQUATION': {
      const correctEq = `${dividend} ÷ ${divisor} = ${quotient}`;
      const wrongEq1 = `${dividend} ÷ ${divisor} = ${quotient + 1}`;
      const wrongEq2 = `${dividend + divisor} ÷ ${divisor} = ${quotient}`;
      const wrongEq3 = `${dividend} ÷ ${Math.max(1, divisor - 1)} = ${quotient}`;
      const options = shuffle([correctEq, wrongEq1, wrongEq2, wrongEq3]);

      return {
        id: `q_fe_${fact.id}_${Date.now()}_${Math.random()}`,
        type,
        factId: fact.id,
        prompt: `Phép tính chia nào dưới đây là ĐÚNG?`,
        options,
        correctAnswer: correctEq,
        formulaDisplay: `Chọn phép tính đúng`,
        explanation: `Phép tính đúng là: ${correctEq}. Vì ${divisor} × ${quotient} = ${dividend}.`,
        hint: `Hãy kiểm tra lại bằng cách lấy số chia nhân với thương xem có bằng số bị chia không.`,
        relatedMultiplicationFact: {
          factorA: divisor,
          factorB: quotient,
          product: dividend,
          formula: `${divisor} × ${quotient} = ${dividend}`,
        },
      };
    }

    case 'INVERSE_MULTIPLICATION': {
      const multFormula = `${divisor} × ${quotient} = ${dividend}`;
      const correctDiv = `${dividend} ÷ ${divisor} = ${quotient}`;
      const wrongDiv1 = `${dividend} ÷ ${quotient + 1} = ${divisor}`;
      const wrongDiv2 = `${dividend + 2} ÷ ${divisor} = ${quotient}`;
      const wrongDiv3 = `${dividend} ÷ ${divisor} = ${quotient + 2}`;
      const options = shuffle([correctDiv, wrongDiv1, wrongDiv2, wrongDiv3]);

      return {
        id: `q_inv_${fact.id}_${Date.now()}_${Math.random()}`,
        type,
        factId: fact.id,
        prompt: `Biết phép nhân: ${multFormula}. Phép chia tương ứng chính xác là gì?`,
        options,
        correctAnswer: correctDiv,
        formulaDisplay: `${multFormula}  ➜  ?`,
        explanation: `Phép nhân và phép chia là hai phép tính ngược nhau. Từ ${multFormula}, ta suy ra ngay ${correctDiv} và ${dividend} ÷ ${quotient} = ${divisor}.`,
        hint: `Tích chia cho một thừa số sẽ bằng thừa số còn lại!`,
        relatedMultiplicationFact: {
          factorA: divisor,
          factorB: quotient,
          product: dividend,
          formula: multFormula,
        },
      };
    }

    case 'WORD_PROBLEM': {
      const contexts = [
        {
          item: 'quả táo thần',
          receiver: 'hiệp sĩ',
          verb: 'chia đều cho',
          unit: 'quả táo',
        },
        {
          item: 'viên kẹo năng lượng',
          receiver: 'chú sóc nhỏ',
          verb: 'chia đều vào',
          unit: 'viên kẹo',
        },
        {
          item: 'đồng tiền vàng',
          receiver: 'chiếc rương bảo vật',
          verb: 'chia đều vào',
          unit: 'đồng vàng',
        },
      ];
      const ctx = contexts[Math.floor(Math.random() * contexts.length)];
      const distractors = generateQuotientDistractors(quotient);
      const options = shuffle([
        `${quotient} ${ctx.unit}`,
        `${distractors[0]} ${ctx.unit}`,
        `${distractors[1]} ${ctx.unit}`,
        `${distractors[2]} ${ctx.unit}`,
      ]);

      return {
        id: `q_wp_${fact.id}_${Date.now()}_${Math.random()}`,
        type,
        factId: fact.id,
        prompt: `Tony có ${dividend} ${ctx.item} mang ${ctx.verb} ${divisor} ${ctx.receiver}. Hỏi mỗi ${ctx.receiver} nhận được bao nhiêu ${ctx.unit}?`,
        options,
        correctAnswer: `${quotient} ${ctx.unit}`,
        formulaDisplay: `${dividend} ÷ ${divisor} = ? (${ctx.unit})`,
        explanation: `Mỗi ${ctx.receiver} nhận được số ${ctx.unit} là: ${dividend} ÷ ${divisor} = ${quotient} (${ctx.unit}).`,
        hint: `Đây là bài toán chia đều: Lấy tổng số ${ctx.item} (${dividend}) chia cho số ${ctx.receiver} (${divisor}).`,
        relatedMultiplicationFact: {
          factorA: divisor,
          factorB: quotient,
          product: dividend,
          formula: `${divisor} × ${quotient} = ${dividend}`,
        },
      };
    }

    case 'REAL_WORLD':
    default: {
      const items = ['chiếc bánh quy ma thuật', 'cuốn sách cổ', 'bông hoa pha lê'];
      const containers = ['chiếc hộp bí mật', 'ngăn kệ sách', 'chiếc lọ thủy tinh'];
      const item = items[Math.floor(Math.random() * items.length)];
      const container = containers[Math.floor(Math.random() * containers.length)];
      const distractors = generateQuotientDistractors(quotient);
      const options = shuffle([
        `${quotient} ${container}`,
        `${distractors[0]} ${container}`,
        `${distractors[1]} ${container}`,
        `${distractors[2]} ${container}`,
      ]);

      return {
        id: `q_rw_${fact.id}_${Date.now()}_${Math.random()}`,
        type: 'REAL_WORLD',
        factId: fact.id,
        prompt: `Trong kho báu có ${dividend} ${item}. Người thủ thư xếp vào mỗi ${container} ${divisor} ${item}. Hỏi cần bao nhiêu ${container}?`,
        options,
        correctAnswer: `${quotient} ${container}`,
        formulaDisplay: `${dividend} ÷ ${divisor} = ? (${container})`,
        explanation: `Số ${container} cần dùng là: ${dividend} ÷ ${divisor} = ${quotient} (${container}).`,
        hint: `Đây là dạng toán chia theo nhóm: Lấy tổng số đồ vật chia cho số đồ vật trong mỗi nhóm.`,
        relatedMultiplicationFact: {
          factorA: divisor,
          factorB: quotient,
          product: dividend,
          formula: `${divisor} × ${quotient} = ${dividend}`,
        },
      };
    }
  }
}

/**
 * Generate a list of questions for a practice or challenge session
 */
export function generateDivisionQuestionsBatch(
  facts: DivisionFact[],
  count: number,
  options?: {
    includeInverse?: boolean;
    includeWordProblems?: boolean;
  }
): DivisionQuestion[] {
  const result: DivisionQuestion[] = [];
  const pool = [...facts];
  let recentFactIds: string[] = [];

  for (let i = 0; i < count; i++) {
    // Pick fact trying to avoid immediate repeats
    let available = pool.filter((f) => !recentFactIds.slice(-2).includes(f.id));
    if (available.length === 0) available = pool;

    const fact = available[Math.floor(Math.random() * available.length)];
    recentFactIds.push(fact.id);
    if (recentFactIds.length > 4) recentFactIds.shift();

    const allowedTypes: DivisionQuestionType[] = ['MULTIPLE_CHOICE', 'FILL_QUOTIENT', 'FILL_MISSING'];
    if (options?.includeInverse) {
      allowedTypes.push('INVERSE_MULTIPLICATION');
      allowedTypes.push('FIND_EQUATION');
    }
    if (options?.includeWordProblems) {
      allowedTypes.push('WORD_PROBLEM');
      allowedTypes.push('REAL_WORLD');
    }

    const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    result.push(generateDivisionQuestion(fact, type));
  }

  return result;
}

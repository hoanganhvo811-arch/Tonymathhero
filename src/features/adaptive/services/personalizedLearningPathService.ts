import type { CampaignId, LearningPathNode, MasteryLevel } from '../../../types';
import { AdaptiveDifficultyEngine } from './adaptiveDifficultyEngine';
import {
  GRADE_2_TOPIC_REGISTRY,
  GRADE_3_TOPIC_REGISTRY,
} from '../../learning/services/learningAnalyticsService';

const GRADE_2_PATH_CONFIG: Omit<LearningPathNode, 'status' | 'accuracy' | 'completedQuestionsCount' | 'recommendedDifficulty'>[] = [
  {
    topicId: 'addition_with_regrouping_100',
    topicNameVi: 'Phép cộng có nhớ trong phạm vi 100',
    descriptionVi: 'Nền tảng tính toán hai chữ số với số nhớ hàng chục',
    prerequisites: [],
    orderIndex: 1,
    category: 'arithmetic',
  },
  {
    topicId: 'subtraction_with_regrouping_100',
    topicNameVi: 'Phép trừ có nhớ trong phạm vi 100',
    descriptionVi: 'Trừ hai chữ số có mượn hàng chục',
    prerequisites: ['addition_with_regrouping_100'],
    orderIndex: 2,
    category: 'arithmetic',
  },
  {
    topicId: 'multiplication_table_2_5',
    topicNameVi: 'Bảng nhân 2 và nhân 5',
    descriptionVi: 'Làm quen bảng cửu chương cơ bản',
    prerequisites: ['addition_with_regrouping_100'],
    orderIndex: 3,
    category: 'arithmetic',
  },
  {
    topicId: 'division_table_2_5',
    topicNameVi: 'Bảng chia 2 và chia 5',
    descriptionVi: 'Phép chia tương ứng với bảng nhân 2 và 5',
    prerequisites: ['multiplication_table_2_5'],
    orderIndex: 4,
    category: 'arithmetic',
  },
  {
    topicId: 'measurements_g2',
    topicNameVi: 'Đại lượng đo lường (dm, m, km, kg, l)',
    descriptionVi: 'Nhận biết và đổi đơn vị đo lường',
    prerequisites: ['addition_with_regrouping_100'],
    orderIndex: 5,
    category: 'measurement',
  },
  {
    topicId: 'geometry_g2',
    topicNameVi: 'Hình học & Đoạn gấp khúc',
    descriptionVi: 'Nhận diện hình học, tính độ dài đoạn gấp khúc',
    prerequisites: ['measurements_g2'],
    orderIndex: 6,
    category: 'geometry',
  },
  {
    topicId: 'word_problems_g2',
    topicNameVi: 'Giải toán có lời văn một bước',
    descriptionVi: 'Phân tích tóm tắt và giải toán có lời văn',
    prerequisites: ['subtraction_with_regrouping_100'],
    orderIndex: 7,
    category: 'word_problem',
  },
];

const GRADE_3_PATH_CONFIG: Omit<LearningPathNode, 'status' | 'accuracy' | 'completedQuestionsCount' | 'recommendedDifficulty'>[] = [
  {
    topicId: 'numbers_up_to_100000',
    topicNameVi: 'Các số trong phạm vi 100.000 & Làm tròn số',
    descriptionVi: 'Đọc, viết, làm tròn và so sánh số có 5 chữ số',
    prerequisites: [],
    orderIndex: 1,
    category: 'arithmetic',
  },
  {
    topicId: 'multiplication_tables_6_9',
    topicNameVi: 'Bảng nhân và bảng chia 6, 7, 8, 9',
    descriptionVi: 'Hoàn thiện bảng cửu chương nâng cao',
    prerequisites: ['numbers_up_to_100000'],
    orderIndex: 2,
    category: 'arithmetic',
  },
  {
    topicId: 'multi_digit_multiplication',
    topicNameVi: 'Nhân số có nhiều chữ số',
    descriptionVi: 'Đặt tính rồi tính nhân có nhớ trong phạm vi 100.000',
    prerequisites: ['multiplication_tables_6_9'],
    orderIndex: 3,
    category: 'arithmetic',
  },
  {
    topicId: 'division_with_remainder',
    topicNameVi: 'Phép chia hết và phép chia có dư',
    descriptionVi: 'Thực hiện phép chia một chữ số và xác định số dư',
    prerequisites: ['multiplication_tables_6_9'],
    orderIndex: 4,
    category: 'arithmetic',
  },
  {
    topicId: 'geometry_perimeter_area',
    topicNameVi: 'Chu vi & Diện tích hình chữ nhật, hình vuông',
    descriptionVi: 'Công thức tính chu vi và diện tích với đơn vị cm², m²',
    prerequisites: ['multi_digit_multiplication'],
    orderIndex: 5,
    category: 'geometry',
  },
  {
    topicId: 'two_step_word_problems',
    topicNameVi: 'Giải toán có lời văn hai bước',
    descriptionVi: 'Phân tích bài toán hai phép tính liên hoàn',
    prerequisites: ['division_with_remainder'],
    orderIndex: 6,
    category: 'word_problem',
  },
  {
    topicId: 'fractions_intro',
    topicNameVi: 'Làm quen với phân số (1/2, 1/3, 1/4, 1/5)',
    descriptionVi: 'Khái niệm một phần mấy của một hình hoặc tập hợp',
    prerequisites: ['division_with_remainder'],
    orderIndex: 7,
    category: 'arithmetic',
  },
];

export class PersonalizedLearningPathService {
  /**
   * Evaluate the complete learning roadmap for Tony
   */
  public static async evaluatePath(
    studentId: string,
    campaignId: CampaignId
  ): Promise<{
    nodes: LearningPathNode[];
    activeNode: LearningPathNode;
    nextRecommendedTopic: LearningPathNode;
    masteredCount: number;
    totalCount: number;
  }> {
    const states = await AdaptiveDifficultyEngine.getTopicStates(studentId, campaignId);
    const configs = campaignId === 'grade-2' ? GRADE_2_PATH_CONFIG : GRADE_3_PATH_CONFIG;

    const nodes: LearningPathNode[] = [];
    let masteredCount = 0;

    for (const cfg of configs) {
      const state = states[cfg.topicId];
      const status: MasteryLevel = state ? state.masteryLevel : 'NOT_STARTED';
      if (status === 'MASTERED') masteredCount++;

      const totalQ = state ? state.recentAttempts.length : 0;
      const correctQ = state ? state.recentAttempts.filter(Boolean).length : 0;
      const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;

      nodes.push({
        ...cfg,
        status,
        accuracy,
        completedQuestionsCount: totalQ,
        recommendedDifficulty: state ? state.currentDifficulty : 'LEVEL_2_NORMAL',
      });
    }

    // Determine active / next node:
    // First node that is not mastered and whose prerequisites are met
    let activeNode = nodes[0];
    for (const node of nodes) {
      const prereqsMet = node.prerequisites.every((prereqId) => {
        const prereqNode = nodes.find((n) => n.topicId === prereqId);
        return prereqNode && (prereqNode.status === 'DEVELOPING' || prereqNode.status === 'MASTERED');
      });

      if (prereqsMet && node.status !== 'MASTERED') {
        activeNode = node;
        break;
      }
    }

    const nextRecommendedTopic = activeNode;

    return {
      nodes,
      activeNode,
      nextRecommendedTopic,
      masteredCount,
      totalCount: nodes.length,
    };
  }
}

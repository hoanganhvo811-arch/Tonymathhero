import type { CampaignGrade, MathQuestion, QuestionDifficulty } from '@/types';
import { GRADE_2_TOPICS } from './data/grade2Curriculum';
import { GRADE_3_TOPICS } from './data/grade3Curriculum';

// Session cache to prevent immediate repeats
const recentQuestionFingerprints: string[] = [];
const MAX_RECENT_CACHE = 15;

export interface GenerateQuestionOptions {
  grade: CampaignGrade;
  difficulty?: QuestionDifficulty;
  topicId?: string;
  kingdomId?: string;
}

export function generateQuestion(options: GenerateQuestionOptions): MathQuestion {
  const { grade, topicId, kingdomId } = options;

  let question: MathQuestion;
  let attempts = 0;

  do {
    if (grade === 'grade-2') {
      const topicKeys = Object.keys(GRADE_2_TOPICS);
      const selectedKey = topicId && GRADE_2_TOPICS[topicId] ? topicId : topicKeys[Math.floor(Math.random() * topicKeys.length)];
      const topicDef = GRADE_2_TOPICS[selectedKey];
      question = topicDef.generate();
    } else {
      const topicKeys = Object.keys(GRADE_3_TOPICS);
      const selectedKey = topicId && GRADE_3_TOPICS[topicId] ? topicId : topicKeys[Math.floor(Math.random() * topicKeys.length)];
      const topicDef = GRADE_3_TOPICS[selectedKey];
      question = topicDef.generate();
    }

    if (kingdomId) {
      question.kingdomId = kingdomId;
    }

    attempts++;
  } while (attempts < 5 && recentQuestionFingerprints.includes(question.questionText));

  // Store in recent buffer
  recentQuestionFingerprints.push(question.questionText);
  if (recentQuestionFingerprints.length > MAX_RECENT_CACHE) {
    recentQuestionFingerprints.shift();
  }

  return question;
}

export function getTopicsForGrade(grade: CampaignGrade) {
  if (grade === 'grade-2') {
    return Object.values(GRADE_2_TOPICS).map((t) => ({
      id: t.id,
      nameVi: t.nameVi,
      descriptionVi: t.descriptionVi,
      defaultDifficulty: t.defaultDifficulty,
    }));
  } else {
    return Object.values(GRADE_3_TOPICS).map((t) => ({
      id: t.id,
      nameVi: t.nameVi,
      descriptionVi: t.descriptionVi,
      defaultDifficulty: t.defaultDifficulty,
    }));
  }
}

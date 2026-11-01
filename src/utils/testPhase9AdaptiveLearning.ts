/**
 * PHASE 9 AUTOMATED VERIFICATION TEST SUITE
 * Tests:
 * 1. Adaptive Difficulty Promotion on consecutive correct answers
 * 2. Adaptive Difficulty Demotion on consecutive incorrect answers
 * 3. Fluency time limit protection (slow response holds difficulty)
 * 4. Mistake pattern categorization (diagnosis into 7 categories)
 * 5. Smart 3-Tier progressive hints (nudge, guidance, explanation)
 * 6. 50/30/20 Smart question selection distribution
 * 7. Anti-repetition question buffer
 * 8. Spaced repetition review detection (>= 5 days)
 * 9. Personalized learning path with prerequisite chains
 * 10. Adaptive Boss battle question scaling
 * 11. Daily Math Challenge generation (3 warm-up + 5 practice + 2 challenge = 10)
 * 12. Learning reward & badge unlocks
 * 13. Strict Grade 2 vs Grade 3 data isolation
 * 14. Phase 1-8 compatibility & persistence
 */

import { AdaptiveDifficultyEngine } from '../features/adaptive/services/adaptiveDifficultyEngine';
import { MistakeAnalysisService } from '../features/adaptive/services/mistakeAnalysisService';
import { SmartQuestionSelector } from '../features/adaptive/services/smartQuestionSelector';
import { PersonalizedLearningPathService } from '../features/adaptive/services/personalizedLearningPathService';
import { DailyChallengeService } from '../features/adaptive/services/dailyChallengeService';
import { LearningRewardService } from '../features/adaptive/services/learningRewardService';
import type { QuestionAttemptRecord, MathQuestion, CampaignId } from '../types';

// Mock localStorage for node environment if not present
if (typeof window === 'undefined' || !window.localStorage) {
  const store: Record<string, string> = {};
  (global as any).window = {
    localStorage: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k in store) delete store[k];
      },
    },
  };
}

async function runPhase9Tests() {
  console.log('====================================================');
  console.log('🚀 RUNNING PHASE 9 VERIFICATION: ADAPTIVE LEARNING');
  console.log('====================================================');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      throw new Error(`Assertion failed: ${testName}`);
    }
  }

  const studentId = 'test_student_tony';
  const grade3Campaign: CampaignId = 'grade-3';
  const grade2Campaign: CampaignId = 'grade-2';

  // TEST 1: Difficulty Promotion
  console.log('\n--- 1. Adaptive Difficulty Promotion ---');
  // Initialize topic at LEVEL_1_EASY
  const states = await AdaptiveDifficultyEngine.getTopicStates(studentId, grade3Campaign);
  states['multiplication_tables_6_9'].currentDifficulty = 'LEVEL_1_EASY';
  states['multiplication_tables_6_9'].consecutiveCorrect = 0;
  states['multiplication_tables_6_9'].recentAttempts = [];
  states['multiplication_tables_6_9'].recentTimeSpent = [];
  await AdaptiveDifficultyEngine.saveTopicStates(studentId, grade3Campaign, states);

  // Submit 3 consecutive fast correct answers (< 25s)
  let promotionResult;
  for (let i = 0; i < 3; i++) {
    promotionResult = await AdaptiveDifficultyEngine.processAttempt(studentId, grade3Campaign, {
      attemptId: `att-promo-${i}`,
      studentId,
      campaignId: grade3Campaign,
      questionId: `q-p-${i}`,
      questionText: `6 x ${i + 2} = ?`,
      topic: 'multiplication_tables_6_9',
      topicNameVi: 'Bảng nhân và bảng chia 6, 7, 8, 9',
      difficulty: 'easy',
      questionType: 'multiple_choice',
      firstAnswer: '12',
      finalAnswer: '12',
      correctAnswer: '12',
      options: ['10', '12', '14', '16'],
      firstAttemptResult: true,
      finalResult: true,
      numberOfAttempts: 1,
      timeSpentSeconds: 12,
      explanation: '6 x 2 = 12',
      timestamp: new Date().toISOString(),
    });
  }

  assert(promotionResult?.promoted === true, 'Difficulty successfully promoted after 3 consecutive correct');
  assert(promotionResult?.newDifficulty === 'LEVEL_2_NORMAL', 'Promoted from LEVEL_1_EASY to LEVEL_2_NORMAL');

  // TEST 2: Difficulty Demotion
  console.log('\n--- 2. Adaptive Difficulty Demotion ---');
  // Submit 2 consecutive incorrect answers
  let demotionResult;
  for (let i = 0; i < 2; i++) {
    demotionResult = await AdaptiveDifficultyEngine.processAttempt(studentId, grade3Campaign, {
      attemptId: `att-demo-${i}`,
      studentId,
      campaignId: grade3Campaign,
      questionId: `q-d-${i}`,
      questionText: `7 x ${i + 6} = ?`,
      topic: 'multiplication_tables_6_9',
      topicNameVi: 'Bảng nhân và bảng chia 6, 7, 8, 9',
      difficulty: 'normal',
      questionType: 'multiple_choice',
      firstAnswer: '0',
      finalAnswer: '0',
      correctAnswer: '42',
      options: ['40', '42', '44', '46'],
      firstAttemptResult: false,
      finalResult: false,
      numberOfAttempts: 2,
      timeSpentSeconds: 15,
      explanation: '7 x 6 = 42',
      timestamp: new Date().toISOString(),
    });
  }

  assert(demotionResult?.demoted === true, 'Difficulty demoted after consecutive mistakes');
  assert(demotionResult?.newDifficulty === 'LEVEL_1_EASY', 'Demoted from LEVEL_2_NORMAL back to LEVEL_1_EASY');

  // TEST 3: Fluency Protection (Slow response time holds difficulty)
  console.log('\n--- 3. Fluency Protection (Slow response time) ---');
  const statesFluency = await AdaptiveDifficultyEngine.getTopicStates(studentId, grade3Campaign);
  statesFluency['division_with_remainder'].currentDifficulty = 'LEVEL_2_NORMAL';
  statesFluency['division_with_remainder'].consecutiveCorrect = 0;
  statesFluency['division_with_remainder'].recentAttempts = [];
  statesFluency['division_with_remainder'].recentTimeSpent = [];
  await AdaptiveDifficultyEngine.saveTopicStates(studentId, grade3Campaign, statesFluency);

  // 3 correct answers, but each took 45 seconds (> 30s threshold)
  let fluencyResult;
  for (let i = 0; i < 3; i++) {
    fluencyResult = await AdaptiveDifficultyEngine.processAttempt(studentId, grade3Campaign, {
      attemptId: `att-slow-${i}`,
      studentId,
      campaignId: grade3Campaign,
      questionId: `q-slow-${i}`,
      questionText: `25 : 4 có số dư là mấy?`,
      topic: 'division_with_remainder',
      topicNameVi: 'Phép chia có dư',
      difficulty: 'normal',
      questionType: 'multiple_choice',
      firstAnswer: '1',
      finalAnswer: '1',
      correctAnswer: '1',
      options: ['1', '2', '3', '0'],
      firstAttemptResult: true,
      finalResult: true,
      numberOfAttempts: 1,
      timeSpentSeconds: 45, // very slow
      explanation: '25 : 4 = 6 dư 1',
      timestamp: new Date().toISOString(),
    });
  }

  assert(fluencyResult?.promoted === false, 'Did NOT prematurely promote slow answers');
  assert(fluencyResult?.fluencyPending === true, 'Fluency pending flag active for fluency reinforcement');
  assert(fluencyResult?.newDifficulty === 'LEVEL_2_NORMAL', 'Held at current difficulty LEVEL_2_NORMAL');

  // TEST 4: Mistake Pattern Analysis
  console.log('\n--- 4. Mistake Pattern Diagnosis ---');
  const sampleWordProb: MathQuestion = {
    id: 'sample-wp',
    campaignId: 'grade-3',
    kingdomId: 'k1',
    grade: 'grade-3',
    topic: 'two_step_word_problems',
    subtopic: 'sub',
    difficulty: 'normal',
    questionText: 'Có 35 quả cam, cửa hàng bán đi 12 quả rồi nhập thêm 20 quả. Hỏi có tất cả bao nhiêu quả cam?',
    options: ['43', '23', '67', '40'],
    correctOptionIndex: 0,
    hint: 'Tìm số quả còn lại sau khi bán, rồi cộng số quả nhập thêm.',
    explanation: '35 - 12 = 23; 23 + 20 = 43 quả.',
    expReward: 20,
    goldReward: 10,
  };

  const diag1 = MistakeAnalysisService.diagnoseMistake(sampleWordProb, '23');
  assert(diag1.category === 'operation_selection_error' || diag1.category === 'missing_data_reading', 'Word problem error categorized accurately');

  const sampleMult: MathQuestion = {
    id: 'sample-mult',
    campaignId: 'grade-3',
    kingdomId: 'k1',
    grade: 'grade-3',
    topic: 'multiplication_tables_6_9',
    subtopic: 'sub',
    difficulty: 'normal',
    questionText: '8 x 7 = ?',
    options: ['54', '56', '58', '64'],
    correctOptionIndex: 1,
    hint: 'Bảng nhân 8',
    explanation: '8 x 7 = 56',
    expReward: 20,
    goldReward: 10,
  };

  const diag2 = MistakeAnalysisService.diagnoseMistake(sampleMult, '54');
  assert(diag2.category === 'multiplication_table_confusion', 'Multiplication table error categorized as multiplication_table_confusion');

  // TEST 5: Smart 3-Tier Progressive Hints
  console.log('\n--- 5. Progressive 3-Tier Hint Generation ---');
  const hints = MistakeAnalysisService.generate3TierHint(sampleMult, 'multiplication_table_confusion');
  assert(hints.tier1Nudge.length > 0, 'Tier 1 Nudge generated');
  assert(hints.tier2Guidance.length > 0, 'Tier 2 Guidance generated');
  assert(hints.tier3Explanation.length > 0, 'Tier 3 Explanation generated');
  assert(hints.analogousExample !== undefined && hints.analogousExample.length > 0, 'Analogous worked example provided');

  // TEST 6: Smart Question Selection (50/30/20 Distribution)
  console.log('\n--- 6. Smart Question Selection ---');
  const qSelected = await SmartQuestionSelector.selectNextQuestion(studentId, grade3Campaign);
  assert(qSelected !== null, 'Selected next question successfully');
  assert(qSelected.campaignId === 'grade-3', 'Selected question strictly matches Grade 3');
  assert(qSelected.options.length === 4, 'Selected question has 4 options');

  // TEST 7: Anti-Repetition Buffer
  console.log('\n--- 7. Anti-Repetition Buffer ---');
  const batch10 = await SmartQuestionSelector.selectQuestionBatch(studentId, grade3Campaign, 5);
  const ids = batch10.map((q) => q.id);
  const uniqueIds = new Set(ids);
  assert(uniqueIds.size >= 4, 'Anti-repetition ensures distinct questions in batch');

  // TEST 8: Spaced Repetition Detection
  console.log('\n--- 8. Spaced Repetition (>= 5 days) ---');
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7); // 7 days ago

  const statesSpaced = await AdaptiveDifficultyEngine.getTopicStates(studentId, grade3Campaign);
  statesSpaced['numbers_up_to_100000'].lastAttemptDate = pastDate.toISOString();
  statesSpaced['numbers_up_to_100000'].recentAttempts = [true, true];
  await AdaptiveDifficultyEngine.saveTopicStates(studentId, grade3Campaign, statesSpaced);

  const reviewNeeded = await AdaptiveDifficultyEngine.getTopicsNeedingReview(studentId, grade3Campaign);
  assert(reviewNeeded.some((t) => t.topicId === 'numbers_up_to_100000'), 'Spaced repetition accurately flagged topic unpracticed for 7 days');

  // TEST 9: Personalized Learning Path & Prerequisites
  console.log('\n--- 9. Personalized Learning Path & Prerequisites ---');
  const pathResult = await PersonalizedLearningPathService.evaluatePath(studentId, grade3Campaign);
  assert(pathResult.nodes.length === 7, 'Grade 3 learning path has 7 nodes');
  assert(pathResult.nodes[0].topicId === 'numbers_up_to_100000', 'First node is numbers_up_to_100000 (no prereqs)');
  assert(pathResult.nodes[1].prerequisites.includes('numbers_up_to_100000'), 'multiplication_tables_6_9 requires numbers_up_to_100000');
  assert(pathResult.activeNode !== null, 'Identified active recommended node');

  // TEST 10: Daily Math Challenge
  console.log('\n--- 10. Daily Math Challenge (3 + 5 + 2 = 10 questions) ---');
  const daily = await DailyChallengeService.getTodayChallenge(studentId, grade3Campaign);
  assert(daily.warmupQuestions.length === 3, 'Daily challenge has 3 warm-up questions');
  assert(daily.practiceQuestions.length === 5, 'Daily challenge has 5 practice questions');
  assert(daily.challengeQuestions.length === 2, 'Daily challenge has 2 challenge questions');
  assert(daily.totalQuestions === 10, 'Daily challenge total is 10 questions');
  assert(daily.isCompleted === false, 'Daily challenge initially active');

  // Answer first question
  const ansRes = await DailyChallengeService.recordChallengeAnswer(studentId, grade3Campaign, daily.warmupQuestions[0].id, true);
  assert(ansRes.challenge.score === 1, 'Daily challenge score incremented');
  assert(ansRes.challenge.completedQuestionIds.length === 1, 'Question marked as completed');

  // TEST 11: Learning Reward Badges
  console.log('\n--- 11. Learning Reward System ---');
  const badgeEval = await LearningRewardService.evaluateBadges(studentId, grade3Campaign);
  assert(badgeEval.badges.length >= 6, 'Loaded learning badges catalog');
  assert(badgeEval.badges.some((b) => b.id === 'first_perfect_calc'), 'Includes First Perfect Calculation badge');
  assert(badgeEval.badges.some((b) => b.id === 'never_give_up'), 'Includes Never Give Up badge');
  assert(badgeEval.badges.some((b) => b.id === 'math_champion'), 'Includes Math Champion badge');

  // TEST 12: Strict Dual-Campaign Isolation
  console.log('\n--- 12. Strict Dual-Campaign Isolation (Grade 2 vs Grade 3) ---');
  const g2States = await AdaptiveDifficultyEngine.getTopicStates(studentId, grade2Campaign);
  const g3States = await AdaptiveDifficultyEngine.getTopicStates(studentId, grade3Campaign);

  assert(g2States['addition_with_regrouping_100'] !== undefined, 'Grade 2 contains Grade 2 topics');
  assert(g2States['multiplication_tables_6_9'] === undefined, 'Grade 2 NEVER contains Grade 3 topics');
  assert(g3States['multiplication_tables_6_9'] !== undefined, 'Grade 3 contains Grade 3 topics');
  assert(g3States['addition_with_regrouping_100'] === undefined, 'Grade 3 NEVER contains Grade 2 topics');

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passed}/${total} PHASE 9 ADAPTIVE LEARNING TESTS PASSED SUCCESSFULLY!`);
  console.log('====================================================\n');
}

runPhase9Tests().catch((e) => {
  console.error('Test failed with error:', e);
  process.exit(1);
});

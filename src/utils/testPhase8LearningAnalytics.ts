/**
 * PHASE 8 AUTOMATED VERIFICATION SCRIPT
 * Tests:
 * 1. Multi-student profile creation, listing, switching
 * 2. Authentic attempt recording
 * 3. 10 Core Educational Metrics computation
 * 4. 4-Tier Topic Mastery evaluation (NOT_STARTED, LEARNING, DEVELOPING, MASTERED)
 * 5. Strengths & Needs Practice pedagogical categorization
 * 6. History filtering (topic, difficulty, result, time range, search)
 * 7. Actionable practice recommendation generator
 * 8. Strict Dual-Campaign Isolation (Grade 2 vs Grade 3)
 */

import { LearningAnalyticsService } from '../features/learning/services/learningAnalyticsService';
import type { QuestionAttemptRecord, CampaignId, QuestionDifficulty } from '../types';

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

async function runPhase8Tests() {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 8 VERIFICATION: LEARNING ANALYTICS');
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

  // TEST 1: Student Profiles
  console.log('\n--- 1. Multi-Student Profile Management ---');
  const initialProfiles = await LearningAnalyticsService.getAllProfiles();
  assert(initialProfiles.length >= 1, 'Default student profile exists');
  assert(initialProfiles[0].displayName.includes('Tony'), 'Default student is Tony');

  const newStudent = await LearningAnalyticsService.createProfile('Bảo Long', 'grade-2');
  assert(newStudent.displayName === 'Bảo Long', 'Created student Bảo Long');
  assert(newStudent.grade === 'grade-2', 'Student grade is grade-2');

  const active = await LearningAnalyticsService.getActiveProfile();
  assert(active.id === newStudent.id, 'Active profile switched to newly created student');

  await LearningAnalyticsService.setActiveProfile(initialProfiles[0].id);
  const reverted = await LearningAnalyticsService.getActiveProfile();
  assert(reverted.id === initialProfiles[0].id, 'Successfully switched back to Tony');

  // TEST 2: Recording Attempts for Grade 3
  console.log('\n--- 2. Question Attempt Recording & History ---');
  const studentTony = initialProfiles[0].id;
  const grade3Campaign: CampaignId = 'grade-3';

  // Create 12 attempts for multiplication_tables_6_9 (11 correct, 1 wrong) -> should be MASTERED (>=85% and >=10 attempts)
  for (let i = 0; i < 12; i++) {
    const isCorrect = i !== 3; // 11 correct
    await LearningAnalyticsService.recordQuestionAttempt({
      studentId: studentTony,
      campaignId: grade3Campaign,
      questionId: `q-mult-test-${i}`,
      questionText: `7 x ${i + 1} = ?`,
      topic: 'multiplication_tables_6_9',
      topicNameVi: 'Bảng nhân và bảng chia 6, 7, 8, 9',
      difficulty: 'normal',
      questionType: 'multiple_choice',
      firstAnswer: isCorrect ? `${7 * (i + 1)}` : '0',
      finalAnswer: `${7 * (i + 1)}`,
      correctAnswer: `${7 * (i + 1)}`,
      options: [`${7 * (i + 1)}`, '20', '30', '40'],
      firstAttemptResult: isCorrect,
      finalResult: true,
      numberOfAttempts: isCorrect ? 1 : 2,
      timeSpentSeconds: 12,
      explanation: `Bảng nhân 7: 7 x ${i + 1} = ${7 * (i + 1)}`,
      stepByStepSolution: [`Đếm nhảy 7 bước`, `Đáp số là ${7 * (i + 1)}`],
    });
  }

  // Create 5 attempts for division_with_remainder (2 correct, 3 wrong) -> LEARNING (<60%)
  for (let i = 0; i < 5; i++) {
    const isCorrect = i < 2; // 40% accuracy
    await LearningAnalyticsService.recordQuestionAttempt({
      studentId: studentTony,
      campaignId: grade3Campaign,
      questionId: `q-div-test-${i}`,
      questionText: `17 : 3 có số dư là mấy?`,
      topic: 'division_with_remainder',
      topicNameVi: 'Phép chia hết và phép chia có dư',
      difficulty: 'normal',
      questionType: 'multiple_choice',
      firstAnswer: isCorrect ? '2' : '3',
      finalAnswer: '2',
      correctAnswer: '2',
      options: ['1', '2', '3', '0'],
      firstAttemptResult: isCorrect,
      finalResult: true,
      numberOfAttempts: isCorrect ? 1 : 2,
      timeSpentSeconds: 20,
      explanation: '17 chia 3 được 5 dư 2 (vì 3 x 5 = 15, 17 - 15 = 2)',
      stepByStepSolution: ['Tìm bội gần nhất của 3 nhỏ hơn 17: là 15', '17 - 15 = 2. Số dư là 2'],
    });
  }

  // TEST 3: History Retrieval & Filtering
  console.log('\n--- 3. History Retrieval & Filtering ---');
  const allAttempts = await LearningAnalyticsService.getAttempts(studentTony, grade3Campaign);
  assert(allAttempts.length === 17, `Recorded exactly 17 attempts (found ${allAttempts.length})`);

  const multFiltered = await LearningAnalyticsService.getAttempts(studentTony, grade3Campaign, {
    topic: 'multiplication_tables_6_9',
  });
  assert(multFiltered.length === 12, 'Filtered by topic multiplication_tables_6_9 returns 12');

  const incorrectFiltered = await LearningAnalyticsService.getAttempts(studentTony, grade3Campaign, {
    result: 'incorrect',
  });
  assert(incorrectFiltered.length === 4, `Filtered by incorrect returns 4 (found ${incorrectFiltered.length})`);

  const searchFiltered = await LearningAnalyticsService.getAttempts(studentTony, grade3Campaign, {
    searchQuery: 'số dư',
  });
  assert(searchFiltered.length === 5, 'Search query "số dư" returns 5 attempts');

  // TEST 4: 10 Core Metrics in Dashboard Summary
  console.log('\n--- 4. Ten Core Educational Metrics ---');
  const summary = await LearningAnalyticsService.calculateDashboardSummary(
    studentTony,
    grade3Campaign,
    { completedQuestsCount: 8, kingdomsRestoredCount: 3 }
  );

  assert(summary.totalQuestions === 17, `Total questions: 17`);
  assert(summary.firstAttemptCorrect === 13, `First attempt correct: 13 (found ${summary.firstAttemptCorrect})`);
  assert(summary.firstAttemptIncorrect === 4, `First attempt incorrect: 4 (found ${summary.firstAttemptIncorrect})`);
  assert(summary.firstAttemptAccuracy === Math.round((13 / 17) * 100), `First attempt accuracy %: ${summary.firstAttemptAccuracy}%`);
  assert(summary.finalAccuracy === 100, `Final accuracy %: 100%`);
  assert(summary.totalLearningTimeMinutes >= 4, `Total learning time in minutes computed`);
  assert(summary.topicsPracticed === 2, `Topics practiced: 2`);
  assert(summary.topicsMastered === 1, `Topics mastered: 1 (multiplication_tables_6_9)`);
  assert(summary.learningStreakDays >= 1, `Streak days >= 1`);
  assert(summary.completedQuestsCount === 8, `Quests completed: 8`);
  assert(summary.kingdomsRestoredCount === 3, `Kingdoms restored: 3`);

  // TEST 5: 4-Tier Mastery Evaluation
  console.log('\n--- 5. 4-Tier Mastery Level Evaluation ---');
  const multTopic = summary.topicBreakdown['multiplication_tables_6_9'];
  assert(multTopic !== undefined, 'multiplication_tables_6_9 is present in breakdown');
  assert(multTopic.masteryLevel === 'MASTERED', `multiplication_tables_6_9 is MASTERED (found ${multTopic.masteryLevel})`);

  const divTopic = summary.topicBreakdown['division_with_remainder'];
  assert(divTopic !== undefined, 'division_with_remainder is present in breakdown');
  assert(divTopic.masteryLevel === 'LEARNING', `division_with_remainder is LEARNING (found ${divTopic.masteryLevel})`);

  const unattemptedTopic = summary.topicBreakdown['fractions_intro'];
  assert(unattemptedTopic !== undefined, 'fractions_intro is present in breakdown');
  assert(unattemptedTopic.masteryLevel === 'NOT_STARTED', `fractions_intro is NOT_STARTED`);

  // TEST 6: Pedagogical Strengths & Needs Practice
  console.log('\n--- 6. Strengths & Needs Practice Phrasing ---');
  assert(summary.strengths.length >= 1, 'Identified at least 1 strength');
  assert(summary.strengths[0].topicId === 'multiplication_tables_6_9', 'Top strength is multiplication_tables_6_9');
  assert(summary.needsPractice.length >= 1, 'Identified topics needing practice');
  assert(summary.needsPractice[0].topicId === 'division_with_remainder', 'Needs practice topic is division_with_remainder');

  // TEST 7: Recommended Practice Generator
  console.log('\n--- 7. Recommended Practice Actionable Generator ---');
  const recommendations = await LearningAnalyticsService.getRecommendedPractices(studentTony, grade3Campaign);
  assert(recommendations.length > 0, `Generated ${recommendations.length} recommended practice items`);
  const firstRec = recommendations[0];
  assert(firstRec.topicId === 'division_with_remainder', 'First recommendation targets weakest topic division_with_remainder');
  assert(firstRec.suggestedQuestionsCount === 5, 'Suggested questions count is 5');

  // TEST 8: Strict Dual-Campaign Isolation
  console.log('\n--- 8. Strict Dual-Campaign Isolation (Grade 2 vs Grade 3) ---');
  // Record 1 attempt in Grade 2 for Tony
  await LearningAnalyticsService.recordQuestionAttempt({
    studentId: studentTony,
    campaignId: 'grade-2',
    questionId: 'q-g2-test-1',
    questionText: '25 + 18 = ?',
    topic: 'addition_with_regrouping_100',
    topicNameVi: 'Phép cộng có nhớ trong phạm vi 100',
    difficulty: 'easy',
    questionType: 'multiple_choice',
    firstAnswer: '43',
    finalAnswer: '43',
    correctAnswer: '43',
    options: ['41', '42', '43', '44'],
    firstAttemptResult: true,
    finalResult: true,
    numberOfAttempts: 1,
    timeSpentSeconds: 10,
    explanation: '5 + 8 = 13 viết 3 nhớ 1; 2 + 1 = 3 thêm 1 bằng 4. Kết quả là 43',
  });

  const g2Attempts = await LearningAnalyticsService.getAttempts(studentTony, 'grade-2');
  const g3Attempts = await LearningAnalyticsService.getAttempts(studentTony, 'grade-3');

  assert(g2Attempts.length === 1, `Grade 2 has exactly 1 attempt (found ${g2Attempts.length})`);
  assert(g3Attempts.length === 17, `Grade 3 has exactly 17 attempts (found ${g3Attempts.length})`);

  const g2Summary = await LearningAnalyticsService.calculateDashboardSummary(studentTony, 'grade-2');
  assert(g2Summary.totalQuestions === 1, 'Grade 2 summary total questions is 1');
  assert(g2Summary.topicBreakdown['addition_with_regrouping_100'] !== undefined, 'Grade 2 contains Grade 2 topics');
  assert(g2Summary.topicBreakdown['multiplication_tables_6_9'] === undefined, 'Grade 2 summary NEVER contains Grade 3 topics');

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passed}/${total} PHASE 8 VERIFICATION TESTS PASSED SUCCESSFULLY!`);
  console.log('====================================================\n');
}

runPhase8Tests().catch((e) => {
  console.error('Test failed with error:', e);
  process.exit(1);
});

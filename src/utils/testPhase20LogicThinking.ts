import { PATTERN_TASKS_CATALOG } from '../features/logic-thinking/data/patternTasksCatalog';
import { NUMBER_LOGIC_CATALOG } from '../features/logic-thinking/data/numberLogicCatalog';
import { SHAPE_LOGIC_CATALOG } from '../features/logic-thinking/data/shapeLogicCatalog';
import { MAZE_LEVELS_CATALOG } from '../features/logic-thinking/data/mazeLevelsCatalog';
import { DEDUCTIVE_MYSTERY_CATALOG } from '../features/logic-thinking/data/deductiveMysteryCatalog';
import { NUMBER_CODE_CATALOG } from '../features/logic-thinking/data/numberCodeCatalog';
import { LOGIC_GUARDIAN_PHASES, LOGIC_GUARDIAN_SPELLS } from '../features/logic-thinking/data/logicGuardianCatalog';
import { LOGIC_ACHIEVEMENTS_CATALOG } from '../features/logic-thinking/data/logicAchievementsCatalog';
import { LogicAdaptiveEngine } from '../features/logic-thinking/services/logicAdaptiveEngine';
import { useLogicThinkingStore } from '../features/logic-thinking/useLogicThinkingStore';
import { LogicAttemptRecord } from '../types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('🧪 Starting Phase 20 (Logic & Critical Thinking) Test Suite...\n');

// 1. Test Pattern Recognition Catalog
console.log('Test 1: Pattern Recognition Catalog & Grade Isolation');
assert(PATTERN_TASKS_CATALOG.length === 12, `Expected 12 pattern tasks, got ${PATTERN_TASKS_CATALOG.length}`);
const g2Patterns = PATTERN_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3Patterns = PATTERN_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
assert(g2Patterns.length === 6, `Expected 6 Grade 2 pattern tasks, got ${g2Patterns.length}`);
assert(g3Patterns.length === 6, `Expected 6 Grade 3 pattern tasks, got ${g3Patterns.length}`);
PATTERN_TASKS_CATALOG.forEach((task) => {
  assert(task.options.length >= 2, `Task ${task.id} has invalid options length`);
  assert(task.correctIndex >= 0 && task.correctIndex < task.options.length, `Task ${task.id} invalid correctIndex`);
  assert(task.sequenceElements.length > 0, `Task ${task.id} empty sequenceElements`);
});
console.log('✅ Passed Test 1: Pattern Recognition Catalog verified.\n');

// 2. Test Number Logic Catalog
console.log('Test 2: Number Logic Catalog & Formats');
assert(NUMBER_LOGIC_CATALOG.length === 12, `Expected 12 number logic tasks, got ${NUMBER_LOGIC_CATALOG.length}`);
const g2NumLogic = NUMBER_LOGIC_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3NumLogic = NUMBER_LOGIC_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
assert(g2NumLogic.length === 6, `Expected 6 Grade 2 number logic tasks, got ${g2NumLogic.length}`);
assert(g3NumLogic.length === 6, `Expected 6 Grade 3 number logic tasks, got ${g3NumLogic.length}`);
NUMBER_LOGIC_CATALOG.forEach((task) => {
  assert(task.options.length >= 2, `Task ${task.id} options invalid`);
  assert(task.correctIndex >= 0 && task.correctIndex < task.options.length, `Task ${task.id} invalid correctIndex`);
  assert(task.targetSkill === 'number_logic', `Task ${task.id} wrong targetSkill`);
});
console.log('✅ Passed Test 2: Number Logic Catalog verified.\n');

// 3. Test Shape Logic Catalog
console.log('Test 3: Shape Logic Catalog');
assert(SHAPE_LOGIC_CATALOG.length === 12, `Expected 12 shape logic tasks, got ${SHAPE_LOGIC_CATALOG.length}`);
const g2ShapeLogic = SHAPE_LOGIC_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3ShapeLogic = SHAPE_LOGIC_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
assert(g2ShapeLogic.length === 6, `Expected 6 Grade 2 shape logic tasks, got ${g2ShapeLogic.length}`);
assert(g3ShapeLogic.length === 6, `Expected 6 Grade 3 shape logic tasks, got ${g3ShapeLogic.length}`);
SHAPE_LOGIC_CATALOG.forEach((task) => {
  assert(task.shapesData.length > 0, `Task ${task.id} missing shapesData`);
  assert(task.correctIndex >= 0 && task.correctIndex < task.options.length, `Task ${task.id} invalid correctIndex`);
});
console.log('✅ Passed Test 3: Shape Logic Catalog verified.\n');

// 4. Test Solvable Interactive Mazes
console.log('Test 4: Interactive Maze Layouts & Mechanics');
assert(MAZE_LEVELS_CATALOG.length === 6, `Expected 6 maze levels, got ${MAZE_LEVELS_CATALOG.length}`);
const g2Mazes = MAZE_LEVELS_CATALOG.filter((m) => m.gradeLevel === 'grade-2');
const g3Mazes = MAZE_LEVELS_CATALOG.filter((m) => m.gradeLevel === 'grade-3');
assert(g2Mazes.length === 3, `Expected 3 Grade 2 mazes, got ${g2Mazes.length}`);
assert(g3Mazes.length === 3, `Expected 3 Grade 3 mazes, got ${g3Mazes.length}`);

MAZE_LEVELS_CATALOG.forEach((maze) => {
  assert(maze.gridSize.rows === maze.layout.length, `Maze ${maze.id} rows mismatch`);
  assert(maze.layout[maze.playerStart.row][maze.playerStart.col] === 'S', `Maze ${maze.id} start tile not S`);
  assert(maze.layout[maze.exitPos.row][maze.exitPos.col] === 'E', `Maze ${maze.id} exit tile not E`);
  // Ensure contains key and door
  const flatLayout = maze.layout.join('');
  assert(flatLayout.includes('K'), `Maze ${maze.id} missing Key (K)`);
  assert(flatLayout.includes('D'), `Maze ${maze.id} missing Door (D)`);
});
console.log('✅ Passed Test 4: All 6 Mazes contain valid Start, Key, Door, and Exit.\n');

// 5. Test Deductive Mystery Catalog
console.log('Test 5: Deductive Detective Mystery Puzzles');
assert(DEDUCTIVE_MYSTERY_CATALOG.length === 12, `Expected 12 detective tasks, got ${DEDUCTIVE_MYSTERY_CATALOG.length}`);
DEDUCTIVE_MYSTERY_CATALOG.forEach((task) => {
  assert(task.clues.length >= 2, `Task ${task.id} has fewer than 2 clues`);
  assert(task.entities.length >= 3, `Task ${task.id} has fewer than 3 entities`);
  assert(task.correctIndex >= 0 && task.correctIndex < task.options.length, `Task ${task.id} invalid correctIndex`);
});
console.log('✅ Passed Test 5: Deductive Mystery Puzzles verified.\n');

// 6. Test Number Code Breaker Levels
console.log('Test 6: Number Code Breaker Levels');
assert(NUMBER_CODE_CATALOG.length === 6, `Expected 6 code breaker levels, got ${NUMBER_CODE_CATALOG.length}`);
NUMBER_CODE_CATALOG.forEach((level) => {
  assert(level.secretCode.length === level.digitCount, `Level ${level.id} secretCode length mismatch`);
  assert(level.clues.length >= 2, `Level ${level.id} has fewer than 2 clues`);
  assert(level.options[level.correctIndex] === level.secretCode, `Level ${level.id} correct option does not match secretCode`);
});
console.log('✅ Passed Test 6: Number Code Breaker verified.\n');

// 7. Test Boss Battle Sphinx of Zero (Malakor)
console.log('Test 7: Sphinx of Zero (Malakor) Boss Catalog & Mechanics');
assert(LOGIC_GUARDIAN_PHASES.length === 3, `Expected 3 Boss phases, got ${LOGIC_GUARDIAN_PHASES.length}`);
assert(LOGIC_GUARDIAN_PHASES[0].maxHp === 380, `Expected Phase 1 HP 380`);
assert(LOGIC_GUARDIAN_PHASES[1].maxHp === 420, `Expected Phase 2 HP 420`);
assert(LOGIC_GUARDIAN_PHASES[2].maxHp === 480, `Expected Phase 3 HP 480`);
assert(LOGIC_GUARDIAN_SPELLS.length === 12, `Expected 12 Boss Spells, got ${LOGIC_GUARDIAN_SPELLS.length}`);
console.log('✅ Passed Test 7: Boss Battle Sphinx of Zero verified.\n');

// 8. Test Logic Adaptive Engine & Error Diagnosis
console.log('Test 8: Logic Adaptive Engine & Error Diagnosis');
const err1 = LogicAdaptiveEngine.diagnoseError('pattern', 'pattern_recognition', '14', '15');
assert(err1 === 'PATTERN_MISINTERPRETATION', `Expected PATTERN_MISINTERPRETATION, got ${err1}`);

const err2 = LogicAdaptiveEngine.diagnoseError('number_code', 'multi_step_problem_solving', '74', '47');
assert(err2 === 'ORDER_CONFUSION', `Expected ORDER_CONFUSION, got ${err2}`);

const sampleAttempts: LogicAttemptRecord[] = [
  {
    id: 'att1',
    taskId: 'p1',
    category: 'pattern',
    targetSkill: 'pattern_recognition',
    isSuccess: true,
    selectedAnswer: '15',
    correctAnswer: '15',
    timestamp: Date.now(),
  },
  {
    id: 'att2',
    taskId: 'p2',
    category: 'pattern',
    targetSkill: 'pattern_recognition',
    isSuccess: true,
    selectedAnswer: '48',
    correctAnswer: '48',
    timestamp: Date.now(),
  },
  {
    id: 'att3',
    taskId: 'm1',
    category: 'maze',
    targetSkill: 'spatial_reasoning',
    isSuccess: false,
    selectedAnswer: 'Blocked',
    correctAnswer: 'Exit',
    errorType: 'SPATIAL_ORIENTATION_ERROR',
    timestamp: Date.now(),
  },
];

const breakdowns = LogicAdaptiveEngine.computeSkillBreakdowns(sampleAttempts);
assert(breakdowns.length === 7, `Expected 7 skill breakdowns, got ${breakdowns.length}`);
const patternSkill = breakdowns.find((b) => b.skillId === 'pattern_recognition')!;
assert(patternSkill.score === 100, `Expected 100% pattern recognition, got ${patternSkill.score}`);
assert(patternSkill.status === 'mastered', `Expected pattern_recognition to be mastered`);

const advice = LogicAdaptiveEngine.generateAdvice(breakdowns);
assert(advice.length > 0, `Expected non-empty advice array`);
console.log('✅ Passed Test 8: Logic Adaptive Engine & Error Diagnosis verified.\n');

// 9. Test Achievements Catalog
console.log('Test 9: Logic Achievements Catalog');
assert(LOGIC_ACHIEVEMENTS_CATALOG.length === 6, `Expected 6 logic achievements, got ${LOGIC_ACHIEVEMENTS_CATALOG.length}`);
LOGIC_ACHIEVEMENTS_CATALOG.forEach((ach) => {
  assert(ach.goldReward > 0, `Achievement ${ach.id} goldReward should be > 0`);
  assert(ach.xpReward > 0, `Achievement ${ach.id} xpReward should be > 0`);
});
console.log('✅ Passed Test 9: Achievements verified.\n');

console.log('🎉 ALL 9/9 PHASE 20 TEST SUITES PASSED FLAWLESSLY! 🎉');

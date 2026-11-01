/**
 * Phase 14 - Geometry & Measurement Kingdom Test Suite
 * TONY MATH HERO - THE LEGEND OF SEVEN KINGDOMS
 */

import { SHAPES_CATALOG } from '../features/geometry-measurement/data/shapesCatalog';
import { MEASUREMENT_TASKS, SPATIAL_MAZE_TASKS } from '../features/geometry-measurement/data/measurementToolsCatalog';
import { GEOMETRY_PUZZLES_CATALOG } from '../features/geometry-measurement/data/geometryPuzzlesCatalog';
import { REAL_LIFE_GEOMETRY_QUESTS } from '../features/geometry-measurement/data/geometryQuestsCatalog';
import { INITIAL_GEOMETRY_ACHIEVEMENTS } from '../features/geometry-measurement/data/geometryAchievementsCatalog';
import { GeometryAdaptiveEngine } from '../features/geometry-measurement/services/geometryAdaptiveEngine';
import type { GeometryAttemptRecord } from '../types/geometryMeasurement';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

let passedCount = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passedCount++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name} -> ${err.message}`);
    throw err;
  }
}

console.log('================================================================');
console.log('🧪 RUNNING PHASE 14 GEOMETRY & MEASUREMENT KINGDOM TEST SUITE');
console.log('================================================================\n');

// 1. Shapes Catalog & Properties
test('Shapes Catalog contains 8 shapes with exact geometric properties', () => {
  assert(SHAPES_CATALOG.length === 8, `Expected 8 shapes, got ${SHAPES_CATALOG.length}`);

  const square = SHAPES_CATALOG.find((s) => s.id === 'shape_square')!;
  assert(square.verticesCount === 4 && square.edgesCount === 4 && square.hasRightAngles, 'Square properties invalid');

  const rectangle = SHAPES_CATALOG.find((s) => s.id === 'shape_rectangle')!;
  assert(rectangle.verticesCount === 4 && rectangle.edgesCount === 4 && rectangle.hasRightAngles, 'Rectangle properties invalid');

  const triangle = SHAPES_CATALOG.find((s) => s.id === 'shape_triangle')!;
  assert(triangle.verticesCount === 3 && triangle.edgesCount === 3, 'Triangle properties invalid');

  const circle = SHAPES_CATALOG.find((s) => s.id === 'shape_circle')!;
  assert(circle.verticesCount === 0 && circle.edgesCount === 0, 'Circle properties invalid');

  const cube = SHAPES_CATALOG.find((s) => s.id === 'shape_cube')!;
  assert(cube.verticesCount === 8 && cube.edgesCount === 12 && cube.facesCount === 6, 'Cube properties invalid');

  const cuboid = SHAPES_CATALOG.find((s) => s.id === 'shape_cuboid')!;
  assert(cuboid.verticesCount === 8 && cuboid.edgesCount === 12 && cuboid.facesCount === 6, 'Cuboid properties invalid');

  const cylinder = SHAPES_CATALOG.find((s) => s.id === 'shape_cylinder')!;
  assert(cylinder.verticesCount === 0 && cylinder.facesCount === 3, 'Cylinder properties invalid');

  const sphere = SHAPES_CATALOG.find((s) => s.id === 'shape_sphere')!;
  assert(sphere.verticesCount === 0 && sphere.edgesCount === 0 && sphere.facesCount === 1, 'Sphere properties invalid');

  for (const s of SHAPES_CATALOG) {
    assert(s.nameVi.length > 0, 'Shape name must not be empty');
    assert(s.characteristicsVi.length >= 2, 'Shape must have at least 2 characteristics');
    assert(s.realWorldExamples.length >= 2, 'Shape must have real world examples');
    assert(s.speechIntroVi.length > 10, 'Shape must have speech intro');
  }
});

// 2. Measurement Tasks
test('Measurement Tasks cover length, mass, capacity, and time', () => {
  assert(MEASUREMENT_TASKS.length >= 8, `Expected at least 8 tasks, got ${MEASUREMENT_TASKS.length}`);

  const types = new Set(MEASUREMENT_TASKS.map((t) => t.type));
  assert(types.has('length'), 'Missing length tasks');
  assert(types.has('mass'), 'Missing mass tasks');
  assert(types.has('capacity'), 'Missing capacity tasks');
  assert(types.has('time'), 'Missing time tasks');

  for (const t of MEASUREMENT_TASKS) {
    assert(t.promptVi.length > 10, `Task ${t.id} prompt must be detailed`);
    assert(t.targetValue > 0, `Task ${t.id} targetValue must be positive`);
    assert(t.targetUnit.length > 0, `Task ${t.id} targetUnit must be set`);
  }
});

// 3. Spatial Maze Tasks
test('Spatial Maze Tasks have solvable paths within grid bounds', () => {
  assert(SPATIAL_MAZE_TASKS.length >= 2, `Expected at least 2 mazes, got ${SPATIAL_MAZE_TASKS.length}`);

  for (const m of SPATIAL_MAZE_TASKS) {
    let curX = m.startPos.x;
    let curY = m.startPos.y;

    for (const cmd of m.solutionCommands) {
      if (cmd === 'UP') curY--;
      else if (cmd === 'DOWN') curY++;
      else if (cmd === 'LEFT') curX--;
      else if (cmd === 'RIGHT') curX++;

      assert(curX >= 0 && curX < m.gridSize.cols, `Command went out of bounds on X in maze ${m.id}`);
      assert(curY >= 0 && curY < m.gridSize.rows, `Command went out of bounds on Y in maze ${m.id}`);

      const hitObstacle = m.obstacles.some((o) => o.x === curX && o.y === curY);
      assert(!hitObstacle, `Solution path hit obstacle at (${curX}, ${curY}) in maze ${m.id}`);
    }

    assert(
      curX === m.targetPos.x && curY === m.targetPos.y,
      `Solution commands do not reach target position in maze ${m.id}`
    );
  }
});

// 4. Grade 2 vs Grade 3 Curriculum Isolation in Puzzles
test('Puzzles Catalog strictly separates Grade 2 and Grade 3 curriculum', () => {
  assert(GEOMETRY_PUZZLES_CATALOG.length === 20, `Expected 20 puzzles, got ${GEOMETRY_PUZZLES_CATALOG.length}`);

  const g2Puzzles = GEOMETRY_PUZZLES_CATALOG.filter((p) => p.gradeLevel === 'grade-2');
  const g3Puzzles = GEOMETRY_PUZZLES_CATALOG.filter((p) => p.gradeLevel === 'grade-3');

  assert(g2Puzzles.length === 10, `Expected 10 Grade 2 puzzles, got ${g2Puzzles.length}`);
  assert(g3Puzzles.length === 10, `Expected 10 Grade 3 puzzles, got ${g3Puzzles.length}`);

  // Grade 2 topics: basic shapes, dm/cm, kg, liter, o'clock & half past
  for (const p of g2Puzzles) {
    assert(p.options.includes(p.correctAnswer), `G2 Puzzle ${p.id} correctAnswer must be in options`);
    assert(p.options.length === 4, `G2 Puzzle ${p.id} must have 4 options`);
    assert(p.explanationVi.length > 5, `G2 Puzzle ${p.id} explanation must exist`);
  }

  // Grade 3 topics: right angles (eke), circle diameter D = 2R, mm, km, g, ml, elapsed time, top-view
  for (const p of g3Puzzles) {
    assert(p.options.includes(p.correctAnswer), `G3 Puzzle ${p.id} correctAnswer must be in options`);
    assert(p.options.length === 4, `G3 Puzzle ${p.id} must have 4 options`);
    assert(p.explanationVi.length > 5, `G3 Puzzle ${p.id} explanation must exist`);
  }
});

// 5. Adaptive Diagnostics - Ruler Alignment Detection
test('Adaptive Engine detects RULER_ALIGNMENT_ERROR when object not aligned to 0', () => {
  // Target length: 8 cm, start offset: 2 cm. User enters 10 cm (8 + 2, reading end mark without subtracting offset)
  const diag = GeometryAdaptiveEngine.diagnoseRulerAttempt(8, 2, 10);
  assert(diag.isSuccess === false, 'Attempt should fail');
  assert(diag.errorType === 'RULER_ALIGNMENT_ERROR', `Expected RULER_ALIGNMENT_ERROR, got ${diag.errorType}`);

  // Properly measured: 8 cm when start offset is 0
  const diagOk = GeometryAdaptiveEngine.diagnoseRulerAttempt(8, 0, 8);
  assert(diagOk.isSuccess === true, 'Attempt should succeed');
  assert(diagOk.errorType === 'NONE', 'Error type should be NONE');
});

// 6. Adaptive Diagnostics - Balance Scale, Beaker, and Clock
test('Adaptive Engine detects SCALE_UNBALANCED, BEAKER error, and CLOCK_HAND_CONFUSION', () => {
  // Scale
  const scaleFail = GeometryAdaptiveEngine.diagnoseScaleAttempt(3000, 2500);
  assert(scaleFail.isSuccess === false && scaleFail.errorType === 'SCALE_UNBALANCED', 'Scale fail diagnosis wrong');
  const scalePass = GeometryAdaptiveEngine.diagnoseScaleAttempt(3000, 3000);
  assert(scalePass.isSuccess === true && scalePass.errorType === 'NONE', 'Scale pass diagnosis wrong');

  // Beaker
  const beakerFail = GeometryAdaptiveEngine.diagnoseBeakerAttempt(600, 500);
  assert(beakerFail.isSuccess === false && beakerFail.errorType === 'BEAKER_OVERFLOW_OR_UNDER', 'Beaker fail diagnosis wrong');
  const beakerPass = GeometryAdaptiveEngine.diagnoseBeakerAttempt(600, 600);
  assert(beakerPass.isSuccess === true && beakerPass.errorType === 'NONE', 'Beaker pass diagnosis wrong');

  // Clock: User swaps hour and minute hands (target: 8:12, user inputs 12:08 or 12:8)
  const clockConfuse = GeometryAdaptiveEngine.diagnoseClockAttempt(8, 12, 12, 8);
  assert(clockConfuse.isSuccess === false && clockConfuse.errorType === 'CLOCK_HAND_CONFUSION', 'Clock hand confusion diagnosis wrong');
  const clockPass = GeometryAdaptiveEngine.diagnoseClockAttempt(8, 30, 8, 30);
  assert(clockPass.isSuccess === true && clockPass.errorType === 'NONE', 'Clock pass diagnosis wrong');
});

// 7. Skill Breakdown Calculation
test('Skill Breakdown calculates all 8 competencies', () => {
  const mockAttempts: GeometryAttemptRecord[] = [
    {
      id: 'att_1',
      taskId: 'ruler_g2_pencil',
      category: 'measurement',
      timestamp: new Date().toISOString(),
      gradeLevel: 'grade-2',
      isSuccess: true,
      errorType: 'NONE',
      timeSpentSeconds: 15,
    },
    {
      id: 'att_2',
      taskId: 'scale_g2_watermelon',
      category: 'measurement',
      timestamp: new Date().toISOString(),
      gradeLevel: 'grade-2',
      isSuccess: false,
      errorType: 'SCALE_UNBALANCED',
      timeSpentSeconds: 20,
    },
  ];

  const breakdown = GeometryAdaptiveEngine.calculateSkillBreakdown(mockAttempts);
  assert(breakdown.lengthMeasurementScore === 100, 'Length score should be 100%');
  assert(breakdown.massMeasurementScore === 0, 'Mass score should be 0% since it failed');
  assert(breakdown.shapeRecognitionScore === 100, 'Unattempted shape score should default to 100%');
});

// 8. Real-Life Quests
test('Real-Life Quests have structured steps and positive rewards', () => {
  assert(REAL_LIFE_GEOMETRY_QUESTS.length >= 4, `Expected at least 4 quests, got ${REAL_LIFE_GEOMETRY_QUESTS.length}`);
  for (const q of REAL_LIFE_GEOMETRY_QUESTS) {
    assert(q.title.length > 0, `Quest ${q.id} title empty`);
    assert(q.taskSteps.length >= 2, `Quest ${q.id} must have at least 2 steps`);
    assert(q.rewardXp > 0, `Quest ${q.id} EXP reward must be positive`);
    assert(q.rewardGold > 0, `Quest ${q.id} Gold reward must be positive`);
  }
});

// 9. Achievements Configuration
test('Achievements Catalog contains 6 achievements with valid parameters', () => {
  assert(INITIAL_GEOMETRY_ACHIEVEMENTS.length === 6, 'Must have 6 achievements');
  const ids = INITIAL_GEOMETRY_ACHIEVEMENTS.map((a) => a.id);
  assert(ids.includes('geo_shape_master'), 'Missing geo_shape_master');
  assert(ids.includes('geo_precision_ruler'), 'Missing geo_precision_ruler');
  assert(ids.includes('geo_balance_expert'), 'Missing geo_balance_expert');
  assert(ids.includes('geo_time_keeper'), 'Missing geo_time_keeper');
  assert(ids.includes('geo_maze_navigator'), 'Missing geo_maze_navigator');
  assert(ids.includes('geo_arena_champion'), 'Missing geo_arena_champion');

  for (const a of INITIAL_GEOMETRY_ACHIEVEMENTS) {
    assert(a.maxProgress > 0, `Achievement ${a.id} maxProgress must be > 0`);
    assert(a.rewardXp > 0, `Achievement ${a.id} rewardXp must be > 0`);
    assert(a.rewardGold > 0, `Achievement ${a.id} rewardGold must be > 0`);
  }
});

console.log(`\n================================================================`);
console.log(`🎉 ALL ${passedCount} PHASE 14 GEOMETRY & MEASUREMENT TESTS PASSED!`);
console.log(`================================================================\n`);

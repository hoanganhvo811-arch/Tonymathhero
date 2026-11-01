export type LogicZone =
  | 'pattern'
  | 'number_logic'
  | 'shape_logic'
  | 'spatial_maze'
  | 'deductive'
  | 'number_code'
  | 'boss_battle'
  | 'analytics';

export type LogicSkillId =
  | 'pattern_recognition' // Nhận diện quy luật dãy số & hình ảnh
  | 'number_logic' // Logic số học, ma trận số & cân bằng
  | 'shape_logic' // Logic hình học, xoay & tìm mảnh còn thiếu
  | 'spatial_reasoning' // Tư duy không gian & định hướng mê cung
  | 'deductive_reasoning' // Suy luận từ dữ kiện & manh mối logic
  | 'elimination_strategy' // Chiến lược loại trừ thông minh
  | 'multi_step_problem_solving'; // Giải quyết vấn đề đa bước

export type LogicErrorType =
  | 'NONE'
  | 'PATTERN_MISINTERPRETATION' // Nhầm quy luật cộng dồn, nhân, lặp hoặc xoay
  | 'ORDER_CONFUSION' // Nhầm thứ tự trước sau, đối xứng hoặc trái phải
  | 'PREMISE_OVERLOOKED' // Bỏ sót một trong các dữ kiện/manh mối đã cho
  | 'INVALID_DEDUCTION' // Suy luận vội vàng khi chưa đủ thông tin loại trừ
  | 'SPATIAL_ORIENTATION_ERROR'; // Đi sai hướng hoặc chạm tường cạm bẫy trong mê cung

export interface PatternElement {
  type: 'number' | 'text' | 'shape';
  value: string;
  color?: string;
  bgGradient?: string;
  shapeType?: 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'hexagon';
  rotationDeg?: number;
}

export interface PatternTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  patternType: 'number_sequence' | 'shape_sequence' | 'color_pattern' | 'odd_one_out';
  titleVi: string;
  promptVi: string;
  sequenceElements: PatternElement[];
  missingIndex: number;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  ruleExplanationVi: string;
  hintVi: string;
  targetSkill: LogicSkillId;
}

export interface NumberLogicTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  taskType: 'magic_triangle' | 'number_matrix' | 'condition_detective' | 'balance_scale';
  titleVi: string;
  promptVi: string;
  visualData?: {
    matrix?: (number | string)[][];
    conditions?: string[];
    scaleLeft?: string;
    scaleRight?: string;
  };
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: LogicSkillId;
}

export interface ShapeLogicElement {
  id: string;
  svgType: 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'hexagon';
  color: string;
  rotationDeg?: number;
  specialFeature?: string;
  label?: string;
}

export interface ShapeLogicTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  taskType: 'odd_shape_out' | 'shape_rotation' | 'missing_matrix_piece' | 'tangram_match';
  titleVi: string;
  promptVi: string;
  shapesData: ShapeLogicElement[];
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: LogicSkillId;
}

export interface MazeLevel {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  storyVi: string;
  gridSize: { rows: number; cols: number };
  layout: string[]; // 'S...W.K', 'WW.WW.W', '...D..E'
  playerStart: { row: number; col: number };
  exitPos: { row: number; col: number };
  requiredKeys: number;
  optimalSteps: number;
  hintVi: string;
}

export interface DeductiveMysteryTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  storyScenarioVi: string;
  clues: string[];
  entities: { name: string; icon: string }[];
  questionVi: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: LogicSkillId;
}

export interface NumberCodeClue {
  guess: string;
  correctWellPlaced: number;
  correctWrongPlace: number;
  clueTextVi: string;
}

export interface NumberCodeLevel {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  digitCount: number;
  secretCode: string;
  clues: NumberCodeClue[];
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
}

export interface LogicGuardianPhase {
  phaseIndex: number;
  phaseNameVi: string;
  bossNameVi: string;
  maxHp: number;
  themeVi: string;
  focusTopicsVi: string;
  descriptionVi: string;
}

export interface LogicGuardianSpellQuestion {
  id: string;
  phaseIndex: number;
  gradeLevel: 'grade-2' | 'grade-3';
  spellNameVi: string;
  bossDialogueVi: string;
  challengeTextVi: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  damage: number;
  targetSkill: LogicSkillId;
}

export interface LogicAchievement {
  id: string;
  titleVi: string;
  descriptionVi: string;
  icon: string;
  goldReward: number;
  xpReward: number;
}

export interface LogicAttemptRecord {
  id: string;
  taskId: string;
  category: 'pattern' | 'number_logic' | 'shape_logic' | 'maze' | 'deductive' | 'number_code' | 'boss';
  targetSkill: LogicSkillId;
  isSuccess: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  errorType?: LogicErrorType;
  timestamp: number;
}

export interface LogicSkillBreakdown {
  skillId: LogicSkillId;
  nameVi: string;
  score: number;
  attempts: number;
  correct: number;
  status: 'mastered' | 'learning' | 'struggling';
}

export interface LogicKingdomProgress {
  completedTasks: string[];
  clearedMazeLevels: string[];
  crackedCodes: string[];
  bossDefeatedPhases: number[];
  unlockedAchievements: string[];
  totalPuzzlesSolved: number;
  totalMazesSolved: number;
}

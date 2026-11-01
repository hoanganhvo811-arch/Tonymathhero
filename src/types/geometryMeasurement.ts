import type { CampaignGrade } from './campaign';

export type ShapeDimension = '2D' | '3D';

export type ShapeCategory =
  | 'square' // Hình vuông
  | 'rectangle' // Hình chữ nhật
  | 'triangle' // Hình tam giác
  | 'circle' // Hình tròn
  | 'cube' // Khối lập phương
  | 'cuboid' // Khối hộp chữ nhật
  | 'cylinder' // Khối trụ
  | 'sphere'; // Khối cầu

export interface ShapePropertyInfo {
  id: string;
  nameVi: string;
  dimension: ShapeDimension;
  gradeLevel: 'grade-2' | 'grade-3' | 'both';
  verticesCount: number; // Số đỉnh (0 for circle/sphere)
  edgesCount: number; // Số cạnh
  facesCount?: number; // Số mặt (for 3D shapes)
  hasRightAngles: boolean;
  rightAnglesCount?: number;
  descriptionVi: string;
  characteristicsVi: string[];
  realWorldExamples: {
    nameVi: string;
    emoji: string;
    descriptionVi: string;
  }[];
  speechIntroVi: string;
  color: string;
}

export type MeasurementType = 'length' | 'mass' | 'capacity' | 'time';

export type LengthUnit = 'mm' | 'cm' | 'dm' | 'm' | 'km';
export type MassUnit = 'g' | 'kg';
export type CapacityUnit = 'ml' | 'l';

export interface MeasurementToolTask {
  id: string;
  type: MeasurementType;
  gradeLevel: 'grade-2' | 'grade-3';
  title: string;
  promptVi: string;
  targetItemName: string;
  targetItemEmoji: string;
  targetValue: number;
  targetUnit: string;
  rulerConfig?: {
    startOffsetCm: number; // e.g. 0 if aligned properly, >0 if misplaced
    itemLengthCm: number;
    unitStep: 'cm' | 'mm';
    requiresZeroAlignment: boolean;
  };
  scaleConfig?: {
    itemWeightGrams: number;
    availableWeights: { weight: number; label: string; count: number }[];
  };
  beakerConfig?: {
    targetCapacityMl: number;
    maxCapacityMl: number;
    stepMl: number;
  };
  clockConfig?: {
    targetHour: number;
    targetMinute: number;
    allowOClockOnly?: boolean; // For Grade 2 (giờ đúng, giờ rưỡi)
    explanationVi: string;
  };
  hintVi: string;
}

export type SpatialDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'FORWARD' | 'BACKWARD';

export interface SpatialMazeTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  title: string;
  promptVi: string;
  gridSize: { rows: number; cols: number };
  startPos: { x: number; y: number };
  targetPos: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  solutionCommands: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[];
  hintVi: string;
}

export type GeometryErrorType =
  | 'NONE'
  | 'WRONG_SHAPE_IDENTIFIED'
  | 'WRONG_PROPERTY_COUNT'
  | 'RULER_ALIGNMENT_ERROR' // Học sinh không đặt từ vạch số 0
  | 'RULER_READING_ERROR'
  | 'SCALE_UNBALANCED'
  | 'BEAKER_OVERFLOW_OR_UNDER'
  | 'CLOCK_HAND_CONFUSION' // Nhầm kim giờ và kim phút
  | 'CLOCK_READING_ERROR'
  | 'SPATIAL_DIRECTION_MISMATCH'
  | 'UNIT_CONVERSION_ERROR';

export interface GeometrySkillBreakdown {
  shapeRecognitionScore: number; // 0 - 100%
  shapePropertiesScore: number;
  spatialOrientationScore: number;
  lengthMeasurementScore: number;
  massMeasurementScore: number;
  capacityMeasurementScore: number;
  timeReadingScore: number;
  wordProblemReasoningScore: number;
}

export interface GeometryAttemptRecord {
  id: string;
  taskId: string;
  category: 'shape' | 'measurement' | 'spatial' | 'puzzle';
  timestamp: string;
  gradeLevel: 'grade-2' | 'grade-3';
  isSuccess: boolean;
  errorType: GeometryErrorType;
  timeSpentSeconds: number;
  details?: string;
}

export interface GeometryAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rewardXp: number;
  rewardGold: number;
  progress: number;
  maxProgress: number;
}

export interface GeometryMeasurementKingdomProgress {
  playerId: string;
  campaignId: CampaignGrade;
  currentZone: 'castle' | 'garden' | 'lab' | 'tower' | 'space' | 'arena';
  exploredShapes: string[];
  solvedTasks: string[];
  solvedPuzzleIds: string[];
  defeatedBosses: string[];
  attempts: GeometryAttemptRecord[];
  achievements: GeometryAchievement[];
  totalExpEarned: number;
  totalGoldEarned: number;
  lastUpdated: string;
}

export interface PlayerStats {
  mathAccuracy: number; // 0 - 100 percentage
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  battlesWon: number;
  gemsCollected: number;
  playTimeMinutes: number;
}

export interface Player {
  id: string;
  name: string;
  title: string;
  avatarId: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  stats: PlayerStats;
}

export interface Name {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  description: string;
  audioFile: string;
}

export interface NameProgress {
  status: "new" | "learning" | "memorized";
  interval: number;
  nextReview: string;
  consecutiveCorrect: number;
  lastReviewed: string;
}

export interface UserProgress {
  names: Record<number, NameProgress>;
  streak: { current: number; lastStudyDate: string };
  quizHistory: QuizResult[];
  settings: { audioEnabled: boolean; newNamesPerSession: number };
}

export interface QuizResult {
  date: string;
  score: number;
  total: number;
}

export interface RecitationTimestamp {
  nameId: number;
  startTime: number;
  endTime: number;
}

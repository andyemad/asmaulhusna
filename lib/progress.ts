import { UserProgress, NameProgress } from "./types";

const STORAGE_KEY = "asma-ul-husna-progress";

const DEFAULT_NAME_PROGRESS: NameProgress = {
  status: "new",
  interval: 0,
  nextReview: "",
  consecutiveCorrect: 0,
  lastReviewed: "",
};

function getDefaultProgress(): UserProgress {
  return {
    names: {},
    streak: { current: 0, lastStudyDate: "" },
    quizHistory: [],
    settings: { audioEnabled: true, newNamesPerSession: 3 },
  };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw) as UserProgress;
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getNameProgress(
  progress: UserProgress,
  nameId: number
): NameProgress {
  return progress.names[nameId] || DEFAULT_NAME_PROGRESS;
}

export function updateNameProgress(
  progress: UserProgress,
  nameId: number,
  update: Partial<NameProgress>
): UserProgress {
  return {
    ...progress,
    names: {
      ...progress.names,
      [nameId]: { ...getNameProgress(progress, nameId), ...update },
    },
  };
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  if (progress.streak.lastStudyDate === today) return progress;

  const newStreak =
    progress.streak.lastStudyDate === yesterday
      ? progress.streak.current + 1
      : 1;

  return {
    ...progress,
    streak: { current: newStreak, lastStudyDate: today },
  };
}

export function getMemorizedCount(progress: UserProgress): number {
  return Object.values(progress.names).filter(
    (n) => n.status === "memorized"
  ).length;
}

export function getLearningCount(progress: UserProgress): number {
  return Object.values(progress.names).filter(
    (n) => n.status === "learning"
  ).length;
}

export function getEncounteredNames(progress: UserProgress): number[] {
  return Object.entries(progress.names)
    .filter(([, p]) => p.status !== "new")
    .map(([id]) => Number(id));
}

export function getAccuracy(progress: UserProgress): number {
  if (progress.quizHistory.length === 0) return 0;
  const total = progress.quizHistory.reduce((a, q) => a + q.total, 0);
  const correct = progress.quizHistory.reduce((a, q) => a + q.score, 0);
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

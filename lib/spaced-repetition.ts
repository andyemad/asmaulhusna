import { NameProgress } from "./types";
import { addLocalDays, formatLocalDate } from "./date";

const INTERVAL_STEPS = [1, 3, 7, 14, 30, 60];

function todayStr(): string {
  return formatLocalDate();
}

export function markGotIt(current: NameProgress): NameProgress {
  const today = todayStr();
  const newConsecutive = current.consecutiveCorrect + 1;
  const stepIndex = Math.min(newConsecutive - 1, INTERVAL_STEPS.length - 1);
  const newInterval = INTERVAL_STEPS[stepIndex];
  const newStatus = newConsecutive >= 3 ? "memorized" : "learning";

  return {
    status: newStatus,
    interval: newInterval,
    nextReview: addLocalDays(today, newInterval),
    consecutiveCorrect: newConsecutive,
    lastReviewed: today,
  };
}

export function markStillLearning(current: NameProgress): NameProgress {
  const today = todayStr();
  const lastReviewed = current.lastReviewed === today ? current.lastReviewed : today;

  return {
    status: "learning",
    interval: 1,
    nextReview: addLocalDays(today, 1),
    consecutiveCorrect: 0,
    lastReviewed,
  };
}

export function markMemorized(current: NameProgress): NameProgress {
  const today = todayStr();
  const interval = current.interval > 0 ? Math.max(current.interval, 30) : 30;

  return {
    status: "memorized",
    interval,
    nextReview: addLocalDays(today, interval),
    consecutiveCorrect: Math.max(current.consecutiveCorrect, 3),
    lastReviewed: today,
  };
}

export function markLearning(current: NameProgress): NameProgress {
  const today = todayStr();

  return {
    status: "learning",
    interval: 1,
    nextReview: addLocalDays(today, 1),
    consecutiveCorrect: Math.min(current.consecutiveCorrect, 1),
    lastReviewed: today,
  };
}

export function getDueNames(
  namesProgress: Record<number, NameProgress>
): number[] {
  const today = todayStr();
  return Object.entries(namesProgress)
    .filter(
      ([, p]) => p.status !== "new" && p.nextReview !== "" && p.nextReview <= today
    )
    .sort(([, a], [, b]) => a.nextReview.localeCompare(b.nextReview))
    .map(([id]) => Number(id));
}

export function getNewNames(
  namesProgress: Record<number, NameProgress>,
  totalNames: number,
  limit: number
): number[] {
  const result: number[] = [];
  for (let id = 1; id <= totalNames; id++) {
    if (!namesProgress[id] || namesProgress[id].status === "new") {
      result.push(id);
      if (result.length >= limit) break;
    }
  }
  return result;
}

export function buildSessionQueue(
  namesProgress: Record<number, NameProgress>,
  totalNames: number,
  newPerSession: number
): number[] {
  const due = getDueNames(namesProgress);
  const fresh = getNewNames(namesProgress, totalNames, newPerSession);
  const queue = Array.from(new Set([...due, ...fresh]));

  if (queue.length > 0) return queue;

  return Object.entries(namesProgress)
    .filter(([, progress]) => progress.status !== "new")
    .sort(([, a], [, b]) => {
      if (a.status !== b.status) {
        return a.status === "learning" ? -1 : 1;
      }
      if (a.consecutiveCorrect !== b.consecutiveCorrect) {
        return a.consecutiveCorrect - b.consecutiveCorrect;
      }
      return a.lastReviewed.localeCompare(b.lastReviewed);
    })
    .map(([id]) => Number(id))
    .slice(0, Math.max(newPerSession, 3));
}

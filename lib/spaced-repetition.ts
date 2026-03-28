import { NameProgress } from "./types";

const INTERVAL_STEPS = [1, 3, 7, 14, 30, 60];

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
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
    nextReview: addDays(today, newInterval),
    consecutiveCorrect: newConsecutive,
    lastReviewed: today,
  };
}

export function markStillLearning(current: NameProgress): NameProgress {
  const today = todayStr();
  return {
    status: current.status === "new" ? "learning" : current.status,
    interval: 1,
    nextReview: addDays(today, 1),
    consecutiveCorrect: 0,
    lastReviewed: today,
  };
}

export function getDueNames(
  namesProgress: Record<number, NameProgress>
): number[] {
  const today = todayStr();
  return Object.entries(namesProgress)
    .filter(([, p]) => p.status !== "new" && p.nextReview <= today)
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
  return [...due, ...fresh];
}

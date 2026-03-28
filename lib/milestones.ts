import { UserProgress } from "./types";
import { getMemorizedCount } from "./progress";

const NAME_MILESTONES = [1, 10, 25, 50, 75, 99];
const STREAK_MILESTONES = [7, 30, 50, 100];

const SEEN_KEY = "asma-milestones-seen";

function getSeenMilestones(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}

function markMilestoneSeen(key: string): void {
  const seen = getSeenMilestones();
  seen.push(key);
  localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
}

export interface Milestone {
  key: string;
  title: string;
  subtitle: string;
  emoji: string;
  isCompletion: boolean;
}

export function checkMilestones(
  progress: UserProgress
): Milestone | null {
  const seen = getSeenMilestones();
  const memorized = getMemorizedCount(progress);
  const streak = progress.streak.current;

  for (const m of NAME_MILESTONES) {
    const key = `names-${m}`;
    if (memorized >= m && !seen.includes(key)) {
      markMilestoneSeen(key);
      if (m === 99) {
        return {
          key,
          title: "All 99 Names Memorized!",
          subtitle:
            "You have memorized all the Beautiful Names of Allah",
          emoji: "🏆",
          isCompletion: true,
        };
      }
      return {
        key,
        title: `${m} Names Memorized!`,
        subtitle: `You've memorized ${m} of the 99 Beautiful Names of Allah`,
        emoji: m === 1 ? "🌱" : "🌟",
        isCompletion: false,
      };
    }
  }

  for (const s of STREAK_MILESTONES) {
    const key = `streak-${s}`;
    if (streak >= s && !seen.includes(key)) {
      markMilestoneSeen(key);
      return {
        key,
        title: `${s} Day Streak!`,
        subtitle: `You've studied for ${s} days in a row`,
        emoji: "🔥",
        isCompletion: false,
      };
    }
  }

  return null;
}

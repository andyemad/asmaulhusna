"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressRing from "@/components/ProgressRing";
import NameOfTheDay from "@/components/NameOfTheDay";
import ShareCard from "@/components/ShareCard";
import MilestoneModal from "@/components/MilestoneModal";
import {
  loadProgress,
  getMemorizedCount,
  getAccuracy,
} from "@/lib/progress";
import { getDueNames } from "@/lib/spaced-repetition";
import { shareText } from "@/lib/share";
import { checkMilestones, Milestone } from "@/lib/milestones";
import { UserProgress } from "@/lib/types";

export default function Home() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    const m = checkMilestones(p);
    if (m) setMilestone(m);
  }, []);

  const memorized = progress ? getMemorizedCount(progress) : 0;
  const dueToday = progress ? getDueNames(progress.names).length : 0;
  const accuracy = progress ? getAccuracy(progress) : 0;
  const streak = progress?.streak.current ?? 0;

  return (
    <div className="relative flex flex-col items-center px-6 pt-12">
      {/* Share button */}
      <div className="absolute top-12 right-6">
        <ShareCard memorized={memorized} streak={streak} />
      </div>

      {/* Title */}
      <p className="text-text-muted text-[11px] tracking-[4px] uppercase">
        Asma ul Husna
      </p>
      <h1 className="font-arabic text-4xl mt-2">أسماء الله الحسنى</h1>
      <p className="text-text-secondary text-sm mt-1">
        The 99 Beautiful Names of Allah
      </p>

      {/* Progress Ring */}
      <div className="mt-8">
        <ProgressRing value={memorized} max={99} />
      </div>

      {/* Name of the Day */}
      <div className="w-full mt-8">
        <NameOfTheDay />
      </div>

      {/* CTAs */}
      <div className="flex gap-3 mt-8 w-full">
        <Link
          href="/flashcards"
          className="flex-1 bg-accent text-white text-center py-3 rounded-xl font-semibold text-sm"
        >
          ▶ Continue Learning
        </Link>
        <Link
          href="/browse"
          className="flex-1 bg-surface border border-white/10 text-white text-center py-3 rounded-xl text-sm"
        >
          📖 Browse All
        </Link>
      </div>

      {/* Stats Row */}
      <div className="flex gap-6 mt-8 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-accent">{streak}</p>
          <p className="text-[10px] text-text-muted tracking-wider">
            DAY STREAK
          </p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="text-lg font-bold text-accent">{dueToday}</p>
          <p className="text-[10px] text-text-muted tracking-wider">
            DUE TODAY
          </p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="text-lg font-bold text-accent">{accuracy}%</p>
          <p className="text-[10px] text-text-muted tracking-wider">
            ACCURACY
          </p>
        </div>
      </div>

      {/* Challenge a Friend */}
      <button
        onClick={() =>
          shareText(
            `Can you memorize all 99 Names of Allah? I'm on day ${streak}!`,
            "https://asma-ul-husna.vercel.app"
          )
        }
        className="w-full bg-surface border border-white/10 text-text-secondary py-3 rounded-xl text-sm mb-8"
      >
        🤝 Challenge a Friend
      </button>

      {/* Milestone Modal */}
      {milestone && (
        <MilestoneModal
          milestone={milestone}
          memorized={memorized}
          streak={streak}
          onClose={() => setMilestone(null)}
        />
      )}
    </div>
  );
}

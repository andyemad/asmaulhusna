"use client";

import Link from "next/link";
import { useState } from "react";
import { generateProgressImage, shareImage } from "@/lib/share";
import { loadProgress, getMemorizedCount } from "@/lib/progress";

interface SessionCompleteProps {
  reviewed: number;
  newLearned: number;
  gotItCount: number;
  total: number;
  onContinue: () => void;
}

export default function SessionComplete({
  reviewed,
  newLearned,
  gotItCount,
  total,
  onContinue,
}: SessionCompleteProps) {
  const [sharing, setSharing] = useState(false);
  const accuracy = total > 0 ? Math.round((gotItCount / total) * 100) : 0;
  const message =
    accuracy >= 85
      ? "Strong session. Your review pace is really settling in."
      : accuracy >= 60
        ? "Solid progress. Another short pass will help lock the tougher names in."
        : "Good effort. A focused review round will make the next session feel much easier.";

  const handleShare = async () => {
    setSharing(true);
    try {
      const progress = loadProgress();
      const memorized = getMemorizedCount(progress);
      const blob = await generateProgressImage(memorized, progress.streak.current);
      await shareImage(blob, `Session complete! Reviewed ${total} names.`);
    } catch {}
    setSharing(false);
  };

  return (
    <div className="px-6 py-10">
      <div className="app-panel-strong rounded-[2rem] p-8 text-center">
        <p className="section-kicker">Session complete</p>
        <h2 className="mt-4 font-display text-4xl text-white">
          Strong work today
        </h2>
        <p className="mt-3 text-base text-text-secondary">
          You reviewed {reviewed} names and learned {newLearned} new ones.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
          {message}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="stat-card">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total cards</span>
          </div>
        </div>

        <button
          onClick={handleShare}
          disabled={sharing}
          className="secondary-button mt-6 w-full"
        >
          {sharing ? "Preparing share card..." : "Share Progress"}
        </button>

        <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="secondary-button flex-1"
        >
          Back to Home
        </Link>
        <button
          type="button"
          onClick={onContinue}
          className="primary-button flex-1"
        >
          Continue Learning
        </button>
        </div>
      </div>
    </div>
  );
}

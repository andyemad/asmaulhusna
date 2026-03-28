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
}

export default function SessionComplete({
  reviewed,
  newLearned,
  gotItCount,
  total,
}: SessionCompleteProps) {
  const [sharing, setSharing] = useState(false);
  const accuracy = total > 0 ? Math.round((gotItCount / total) * 100) : 0;

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-3xl mb-4">🎉</p>
      <h2 className="text-xl font-bold text-white">Session Complete!</h2>
      <p className="text-text-secondary mt-2">
        You reviewed {reviewed} names and learned {newLearned} new ones.
      </p>

      <div className="flex gap-6 mt-6">
        <div className="text-center">
          <p className="text-lg font-bold text-accent">{accuracy}%</p>
          <p className="text-[10px] text-text-muted tracking-wider">
            ACCURACY
          </p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="text-lg font-bold text-accent">{total}</p>
          <p className="text-[10px] text-text-muted tracking-wider">
            TOTAL CARDS
          </p>
        </div>
      </div>

      <button
        onClick={handleShare}
        disabled={sharing}
        className="mt-5 bg-accent/15 text-accent px-6 py-2 rounded-full text-sm"
      >
        {sharing ? "Sharing..." : "📤 Share Progress"}
      </button>

      <div className="flex gap-3 mt-6 w-full">
        <Link
          href="/"
          className="flex-1 bg-surface border border-white/10 text-white text-center py-3 rounded-xl text-sm"
        >
          Back to Home
        </Link>
        <Link
          href="/flashcards?bonus=1"
          className="flex-1 bg-accent text-white text-center py-3 rounded-xl font-semibold text-sm"
        >
          Keep Practicing
        </Link>
      </div>
    </div>
  );
}

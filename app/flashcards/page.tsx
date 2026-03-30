"use client";

import { useEffect, useState, useCallback } from "react";
import { names } from "@/lib/names";
import {
  loadProgress,
  saveProgress,
  getNameProgress,
  updateNameProgress,
  updateStreak,
} from "@/lib/progress";
import {
  buildSessionQueue,
  markGotIt,
  markMemorized,
  markStillLearning,
} from "@/lib/spaced-repetition";
import { UserProgress } from "@/lib/types";
import FlashCard from "@/components/FlashCard";
import SessionComplete from "@/components/SessionComplete";

export default function FlashcardsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({
    reviewed: 0,
    newLearned: 0,
    gotIt: 0,
    total: 0,
  });

  const startSession = useCallback((nextProgress: UserProgress) => {
    const nextQueue = buildSessionQueue(
      nextProgress.names,
      99,
      nextProgress.settings.newNamesPerSession
    );

    setProgress(nextProgress);
    setQueue(nextQueue.length > 0 ? nextQueue : names.map((n) => n.id).slice(0, 3));
    setCurrentIndex(0);
    setStats({
      reviewed: 0,
      newLearned: 0,
      gotIt: 0,
      total: 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const p = loadProgress();
    const updated = updateStreak(p);
    saveProgress(updated);
    startSession(updated);
  }, [startSession]);

  const handleGotIt = useCallback(() => {
    if (!progress || currentIndex >= queue.length) return;
    const nameId = queue[currentIndex];
    const current = getNameProgress(progress, nameId);
    const wasNew = current.status === "new";
    const updated = updateNameProgress(
      progress,
      nameId,
      markGotIt(current)
    );
    saveProgress(updated);
    setProgress(updated);
    setStats((s) => ({
      reviewed: s.reviewed + (wasNew ? 0 : 1),
      newLearned: s.newLearned + (wasNew ? 1 : 0),
      gotIt: s.gotIt + 1,
      total: s.total + 1,
    }));
    setCurrentIndex((i) => i + 1);
  }, [progress, currentIndex, queue]);

  const handleStillLearning = useCallback(() => {
    if (!progress || currentIndex >= queue.length) return;
    const nameId = queue[currentIndex];
    const current = getNameProgress(progress, nameId);
    const wasNew = current.status === "new";
    const updated = updateNameProgress(
      progress,
      nameId,
      markStillLearning(current)
    );
    saveProgress(updated);
    setProgress(updated);
    setStats((s) => ({
      ...s,
      reviewed: s.reviewed + (wasNew ? 0 : 1),
      newLearned: s.newLearned + (wasNew ? 1 : 0),
      total: s.total + 1,
    }));
    setCurrentIndex((i) => i + 1);
  }, [progress, currentIndex, queue]);

  const handleMarkMemorized = useCallback(() => {
    if (!progress || currentIndex >= queue.length) return;
    const nameId = queue[currentIndex];
    const current = getNameProgress(progress, nameId);
    const wasNew = current.status === "new";
    const updated = updateNameProgress(progress, nameId, markMemorized(current));
    saveProgress(updated);
    setProgress(updated);
    setStats((s) => ({
      reviewed: s.reviewed + (wasNew ? 0 : 1),
      newLearned: s.newLearned + (wasNew ? 1 : 0),
      gotIt: s.gotIt + 1,
      total: s.total + 1,
    }));
    setCurrentIndex((i) => i + 1);
  }, [progress, currentIndex, queue]);

  if (!progress) return null;

  if (currentIndex >= queue.length) {
    return (
      <SessionComplete
        reviewed={stats.reviewed}
        newLearned={stats.newLearned}
        gotItCount={stats.gotIt}
        total={stats.total}
        onContinue={() => startSession(loadProgress())}
      />
    );
  }

  const nameId = queue[currentIndex];
  const name = names.find((n) => n.id === nameId)!;

  return (
    <div className="px-6 pt-8 pb-8">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text-secondary transition hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-20"
            aria-label="Previous card"
          >
            ←
          </button>
          <p className="section-kicker">
            Flashcard {currentIndex + 1} of {queue.length}
          </p>
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(queue.length - 1, i + 1))
            }
            disabled={currentIndex >= queue.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text-secondary transition hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-20"
            aria-label="Next card"
          >
            →
          </button>
        </div>
        <h1 className="mt-3 font-display text-3xl text-white">
          One name at a time
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Flip the card, listen once, then decide whether to review or advance.
        </p>
      </div>
      <FlashCard
        key={nameId}
        name={name}
        number={nameId}
        onGotIt={handleGotIt}
        onMemorized={handleMarkMemorized}
        onStillLearning={handleStillLearning}
      />
    </div>
  );
}

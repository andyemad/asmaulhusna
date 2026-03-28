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

  useEffect(() => {
    const p = loadProgress();
    const updated = updateStreak(p);
    saveProgress(updated);
    setProgress(updated);

    const q = buildSessionQueue(
      updated.names,
      99,
      updated.settings.newNamesPerSession
    );
    setQueue(q.length > 0 ? q : names.map((n) => n.id).slice(0, 3));
  }, []);

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

  if (!progress) return null;

  if (currentIndex >= queue.length) {
    return <SessionComplete reviewed={stats.reviewed} newLearned={stats.newLearned} gotItCount={stats.gotIt} total={stats.total} />;
  }

  const nameId = queue[currentIndex];
  const name = names.find((n) => n.id === nameId)!;

  return (
    <div className="px-6 pt-8">
      <p className="text-center text-text-muted text-[10px] tracking-[2px] mb-6">
        FLASHCARD {currentIndex + 1} OF {queue.length}
      </p>
      <FlashCard
        key={nameId}
        name={name}
        number={nameId}
        onGotIt={handleGotIt}
        onStillLearning={handleStillLearning}
      />
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="text-text-muted text-sm disabled:opacity-30"
        >
          ← Previous
        </button>
        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(queue.length - 1, i + 1))
          }
          disabled={currentIndex >= queue.length - 1}
          className="text-text-muted text-sm disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

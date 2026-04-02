"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { names } from "@/lib/names";
import {
  getEncounteredNames,
  getNameProgress,
  loadProgress,
  saveProgress,
  updateNameProgress,
  updateStreak,
} from "@/lib/progress";
import {
  buildSessionQueue,
  markMemorized,
  markStillLearning,
} from "@/lib/spaced-repetition";
import { UserProgress } from "@/lib/types";
import FlashCard from "@/components/FlashCard";
import SessionComplete from "@/components/SessionComplete";

const SESSION_STORAGE_KEY = "asma-ul-husna-flashcards-session";

type FlashcardStats = {
  reviewed: number;
  newLearned: number;
  gotIt: number;
  total: number;
};

type FlashcardSessionState = {
  queue: number[];
  currentQueueIndex: number;
  displayNameId: number;
  currentTargetInitialStatus: "new" | "learning" | "memorized";
  stats: FlashcardStats;
};

const EMPTY_STATS: FlashcardStats = {
  reviewed: 0,
  newLearned: 0,
  gotIt: 0,
  total: 0,
};

function loadSessionState(): FlashcardSessionState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<FlashcardSessionState>;
    if (!Array.isArray(parsed.queue) || parsed.queue.length === 0) return null;

    return {
      queue: parsed.queue.filter((id): id is number => Number.isInteger(id)),
      currentQueueIndex: Math.max(0, parsed.currentQueueIndex ?? 0),
      displayNameId: Math.max(1, parsed.displayNameId ?? parsed.queue[0] ?? 1),
      currentTargetInitialStatus:
        parsed.currentTargetInitialStatus === "learning" ||
        parsed.currentTargetInitialStatus === "memorized"
          ? parsed.currentTargetInitialStatus
          : "new",
      stats: {
        reviewed: parsed.stats?.reviewed ?? 0,
        newLearned: parsed.stats?.newLearned ?? 0,
        gotIt: parsed.stats?.gotIt ?? 0,
        total: parsed.stats?.total ?? 0,
      },
    };
  } catch {
    return null;
  }
}

function saveSessionState(session: FlashcardSessionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSessionState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function buildNavigationIds(
  progress: UserProgress,
  currentTargetId: number
): number[] {
  return Array.from(
    new Set([...getEncounteredNames(progress), currentTargetId])
  ).sort((a, b) => a - b);
}

export default function FlashcardsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayNameId, setDisplayNameId] = useState(1);
  const [currentTargetInitialStatus, setCurrentTargetInitialStatus] =
    useState<"new" | "learning" | "memorized">("new");
  const [stats, setStats] = useState<FlashcardStats>(EMPTY_STATS);

  const startSession = useCallback(
    (nextProgress: UserProgress, resumeExisting: boolean) => {
      const builtQueue = buildSessionQueue(
        nextProgress.names,
        99,
        nextProgress.settings.newNamesPerSession
      );
      const freshQueue =
        builtQueue.length > 0
          ? builtQueue
          : names.map((name) => name.id).slice(0, 3);
      const savedSession = resumeExisting ? loadSessionState() : null;
      const hasUsableSavedSession =
        savedSession &&
        savedSession.queue.length > 0 &&
        savedSession.currentQueueIndex < savedSession.queue.length;
      const nextQueue = hasUsableSavedSession ? savedSession.queue : freshQueue;
      const nextCurrentIndex = hasUsableSavedSession
        ? savedSession.currentQueueIndex
        : 0;
      const currentTargetId = nextQueue[nextCurrentIndex] ?? freshQueue[0] ?? 1;
      const navigationIds = buildNavigationIds(nextProgress, currentTargetId);
      const nextDisplayNameId =
        hasUsableSavedSession &&
        navigationIds.includes(savedSession.displayNameId)
          ? savedSession.displayNameId
          : currentTargetId;
      const nextTargetInitialStatus = hasUsableSavedSession
        ? savedSession.currentTargetInitialStatus
        : getNameProgress(nextProgress, currentTargetId).status;

      setProgress(nextProgress);
      setQueue(nextQueue);
      setCurrentIndex(nextCurrentIndex);
      setDisplayNameId(nextDisplayNameId);
      setCurrentTargetInitialStatus(nextTargetInitialStatus);
      setStats(hasUsableSavedSession ? savedSession.stats : EMPTY_STATS);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  useEffect(() => {
    const initialProgress = loadProgress();
    const updated = updateStreak(initialProgress);
    saveProgress(updated);
    startSession(updated, true);
  }, [startSession]);

  const currentTargetId = queue[currentIndex];
  const navigationIds = useMemo(() => {
    if (!progress || !currentTargetId) return [];
    return buildNavigationIds(progress, currentTargetId);
  }, [progress, currentTargetId]);
  const displayIndex = navigationIds.indexOf(displayNameId);

  useEffect(() => {
    if (!progress || queue.length === 0) return;

    if (currentIndex >= queue.length) {
      clearSessionState();
      return;
    }

    saveSessionState({
      queue,
      currentQueueIndex: currentIndex,
      displayNameId,
      currentTargetInitialStatus,
      stats,
    });
  }, [progress, queue, currentIndex, displayNameId, currentTargetInitialStatus, stats]);

  useEffect(() => {
    if (navigationIds.length === 0 || navigationIds.includes(displayNameId)) {
      return;
    }

    setDisplayNameId(currentTargetId);
  }, [navigationIds, displayNameId, currentTargetId]);

  const goToPreviousCard = useCallback(() => {
    if (displayIndex <= 0) return;
    setDisplayNameId(navigationIds[displayIndex - 1]);
  }, [displayIndex, navigationIds]);

  const goToNextCard = useCallback(() => {
    const nextId = navigationIds[displayIndex + 1];
    if (nextId) {
      setDisplayNameId(nextId);
    }
  }, [displayIndex, navigationIds]);

  const advanceSession = useCallback(() => {
    const nextQueueIndex = currentIndex + 1;
    const nextTargetId = queue[nextQueueIndex];

    setCurrentIndex(nextQueueIndex);
    if (nextTargetId) {
      setDisplayNameId(nextTargetId);
      setCurrentTargetInitialStatus(getNameProgress(progress!, nextTargetId).status);
    }
  }, [currentIndex, progress, queue]);

  const updateDisplayedStatus = useCallback(
    (nextStatus: "learning" | "memorized") => {
      if (!progress) return;

      const current = getNameProgress(progress, displayNameId);
      const updated = updateNameProgress(
        progress,
        displayNameId,
        nextStatus === "memorized"
          ? markMemorized(current)
          : markStillLearning(current)
      );

      saveProgress(updated);
      setProgress(updated);
    },
    [displayNameId, progress]
  );

  const handleStillLearning = useCallback(() => {
    updateDisplayedStatus("learning");
  }, [updateDisplayedStatus]);

  const handleMarkMemorized = useCallback(() => {
    updateDisplayedStatus("memorized");
  }, [updateDisplayedStatus]);

  const handleNextCard = useCallback(() => {
    if (!progress || currentIndex >= queue.length) return;

    if (displayNameId !== currentTargetId) {
      goToNextCard();
      return;
    }

    const current = getNameProgress(progress, displayNameId);
    if (current.status === "new") return;

    setStats((existing) => ({
      reviewed: existing.reviewed + (currentTargetInitialStatus === "new" ? 0 : 1),
      newLearned:
        existing.newLearned + (currentTargetInitialStatus === "new" ? 1 : 0),
      gotIt: existing.gotIt + (current.status === "memorized" ? 1 : 0),
      total: existing.total + 1,
    }));
    advanceSession();
  }, [
    progress,
    currentIndex,
    queue.length,
    displayNameId,
    currentTargetId,
    goToNextCard,
    currentTargetInitialStatus,
    advanceSession,
  ]);

  if (!progress) return null;

  if (currentIndex >= queue.length) {
    return (
      <SessionComplete
        reviewed={stats.reviewed}
        newLearned={stats.newLearned}
        gotItCount={stats.gotIt}
        total={stats.total}
        onContinue={() => startSession(loadProgress(), false)}
      />
    );
  }

  const name = names.find((entry) => entry.id === displayNameId)!;
  const status = getNameProgress(progress, displayNameId).status;
  const canAdvance =
    displayNameId === currentTargetId
      ? status !== "new"
      : displayIndex > -1 && displayIndex < navigationIds.length - 1;

  return (
    <div className="px-6 pt-8 pb-8">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousCard}
            disabled={displayIndex <= 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text-secondary transition hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-20"
            aria-label="Previous card"
          >
            ←
          </button>
          <p className="section-kicker">
            Flashcard {Math.max(displayIndex + 1, 1)} of {navigationIds.length}
          </p>
          <button
            onClick={goToNextCard}
            disabled={displayIndex === -1 || displayIndex >= navigationIds.length - 1}
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
          Flip the card, choose a status, then move to the next card.
        </p>
      </div>
      <FlashCard
        key={displayNameId}
        name={name}
        number={displayNameId}
        status={status}
        canAdvance={canAdvance}
        onNextCard={handleNextCard}
        onSetMemorized={handleMarkMemorized}
        onSetStillLearning={handleStillLearning}
      />
    </div>
  );
}

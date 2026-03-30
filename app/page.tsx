"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArabicText from "@/components/ArabicText";
import MilestoneModal from "@/components/MilestoneModal";
import NameOfTheDay from "@/components/NameOfTheDay";
import ProgressRing from "@/components/ProgressRing";
import ShareCard from "@/components/ShareCard";
import { checkMilestones, Milestone } from "@/lib/milestones";
import {
  getAccuracy,
  getLearningCount,
  getMemorizedCount,
  loadProgress,
} from "@/lib/progress";
import { shareText } from "@/lib/share";
import { getDueNames } from "@/lib/spaced-repetition";
import { UserProgress } from "@/lib/types";

export default function Home() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const loadedProgress = loadProgress();
    setProgress(loadedProgress);

    const nextMilestone = checkMilestones(loadedProgress);
    if (nextMilestone) setMilestone(nextMilestone);
  }, []);

  const memorized = progress ? getMemorizedCount(progress) : 0;
  const learning = progress ? getLearningCount(progress) : 0;
  const dueToday = progress ? getDueNames(progress.names).length : 0;
  const accuracy = progress ? getAccuracy(progress) : 0;
  const streak = progress?.streak.current ?? 0;
  const completion = Math.round((memorized / 99) * 100);
  const newCount = Math.max(99 - memorized - learning, 0);

  const nextStepLabel =
    dueToday > 0
      ? "Review Due Names"
      : memorized === 0
        ? "Begin Study"
        : learning > 0
          ? "Continue Review"
          : "Learn New Names";
  const nextStepHint =
    dueToday > 0
      ? `${dueToday} ${dueToday === 1 ? "name is" : "names are"} due today.`
      : learning > 0
        ? `${learning} ${learning === 1 ? "name is" : "names are"} still in review.`
        : memorized > 0
          ? "No reviews are due right now, so this is a good time to add a few new names."
          : "Start with a short flashcard session and build a steady routine.";

  return (
    <div className="px-5 pt-8 pb-10">
      <section className="app-panel-strong overflow-hidden rounded-[2.2rem] px-6 py-7 text-center">
        <div className="flex items-start justify-between gap-4">
          <p className="section-kicker text-left">Asma ul Husna</p>
          <ShareCard memorized={memorized} streak={streak} />
        </div>

        <ArabicText className="mt-8 text-5xl leading-[1.55] text-white sm:text-6xl">
          أسماء الله الحسنى
        </ArabicText>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          The 99 Beautiful Names of Allah
        </p>
        <h1 className="mx-auto mt-5 max-w-xl font-display text-4xl text-white sm:text-5xl">
          A simple daily practice
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
          Study, review, and listen at a steady pace.
        </p>

        <div className="mt-8 flex justify-center">
          <ProgressRing value={memorized} max={99} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/browse?status=memorized"
            className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-accent/30 hover:bg-accent/5"
          >
            <p className="font-display text-3xl text-white">{memorized}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-text-muted">
              Memorized
            </p>
          </Link>
          <Link
            href="/browse?status=learning"
            className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-accent/30 hover:bg-accent/5"
          >
            <p className="font-display text-3xl text-white">{learning}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-text-muted">
              Learning
            </p>
          </Link>
          <Link
            href="/browse?status=new"
            className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:border-accent/30 hover:bg-accent/5"
          >
            <p className="font-display text-3xl text-white">{newCount}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-text-muted">
              New
            </p>
          </Link>
        </div>

        <p className="mt-5 text-sm text-text-muted">
          {accuracy > 0 ? `Quiz score: ${accuracy}%` : `${streak}-day streak`}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/flashcards" className="primary-button flex-1">
            Flashcards
          </Link>
          <Link href="/quiz" className="secondary-button flex-1">
            Quiz
          </Link>
        </div>
      </section>

      <section className="app-panel mt-5 rounded-[2rem] px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Today</p>
            <h2 className="mt-3 font-display text-3xl text-white">
              {nextStepLabel}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
              {nextStepHint}
            </p>
          </div>
          <div className="rounded-[1.3rem] border border-accent/20 bg-accent/10 px-4 py-3 text-right">
            <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">
              Completion
            </p>
            <p className="mt-2 font-display text-3xl text-white">
              {completion}%
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/flashcards" className="primary-button flex-1">
            {dueToday > 0 ? "Open Flashcards" : "Start Flashcards"}
          </Link>
          <Link href="/quiz" className="secondary-button flex-1">
            Open Quiz
          </Link>
        </div>
      </section>

      <div className="mt-5">
        <NameOfTheDay />
      </div>

      <section className="app-panel mt-5 rounded-[2rem] px-6 py-6">
        <p className="section-kicker">Library</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/browse" className="secondary-button min-h-[5.4rem] flex-col">
            <span className="font-display text-2xl">Browse</span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
              All 99 names
            </span>
          </Link>
          <Link
            href="/recitation"
            className="secondary-button min-h-[5.4rem] flex-col"
          >
            <span className="font-display text-2xl">Recite</span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
              Guided listening
            </span>
          </Link>
          <button
            type="button"
            onClick={() =>
              shareText(
                `I’m memorizing the 99 Names of Allah in Asma ul Husna. I’ve memorized ${memorized}/99 so far and I’m on a ${streak}-day streak.`,
                "https://asma-ul-husna.vercel.app"
              )
            }
            className="secondary-button min-h-[5.4rem] flex-col"
          >
            <span className="font-display text-2xl">Share</span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
              Progress
            </span>
          </button>
        </div>
      </section>

      {milestone ? (
        <MilestoneModal
          milestone={milestone}
          memorized={memorized}
          streak={streak}
          onClose={() => setMilestone(null)}
        />
      ) : null}
    </div>
  );
}

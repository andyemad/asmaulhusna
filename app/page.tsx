"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ArabicText from "@/components/ArabicText";
import MilestoneModal from "@/components/MilestoneModal";
import NameOfTheDay from "@/components/NameOfTheDay";
import ProgressRing from "@/components/ProgressRing";
import ShareCard from "@/components/ShareCard";
import ShareSheet from "@/components/ShareSheet";
import { changelogEntries, changelogSummary } from "@/lib/changelog";
import { checkMilestones, Milestone } from "@/lib/milestones";
import {
  getAccuracy,
  getLearningCount,
  getMemorizedCount,
  loadProgress,
} from "@/lib/progress";
import {
  buildProgressShareText,
  buildProgressShareUrl,
  buildShareTargets,
  copyShareLink,
  downloadBlob,
  generateProgressImage,
  shareImage,
} from "@/lib/share";
import { getDueNames } from "@/lib/spaced-repetition";
import { UserProgress } from "@/lib/types";

const INSPIRATION_VIDEO_URL =
  "https://youtu.be/Ehna_-dkvNU?si=gzkaJjdTOxwSJ4XI";
const INSPIRATION_EMBED_URL =
  "https://www.youtube-nocookie.com/embed/Ehna_-dkvNU?rel=0";

export default function Home() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
  const progressShareUrl = useMemo(
    () =>
      buildProgressShareUrl({
        memorized,
        learning,
        streak,
        accuracy,
      }),
    [accuracy, learning, memorized, streak]
  );
  const progressShareText = useMemo(
    () =>
      buildProgressShareText({
        memorized,
        learning,
        streak,
        accuracy,
      }),
    [accuracy, learning, memorized, streak]
  );
  const progressShareTargets = useMemo(
    () =>
      buildShareTargets(
        progressShareText,
        progressShareUrl,
        "My Asma ul Husna progress"
      ),
    [progressShareText, progressShareUrl]
  );

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
  const libraryCardClass =
    "app-panel group flex min-h-[12rem] flex-col items-center justify-center rounded-[1.8rem] px-6 py-6 text-center transition hover:border-accent/30 hover:bg-accent/5";
  const latestChange = changelogEntries[0];

  useEffect(() => {
    if (!shareStatus) return;
    const timeout = window.setTimeout(() => setShareStatus(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const openProgressShare = useCallback(() => {
    setShareSheetOpen(true);
  }, []);

  const handleNativeShare = useCallback(async () => {
    setSharing(true);
    try {
      const blob = await generateProgressImage(memorized, streak);
      await shareImage(
        blob,
        progressShareText,
        progressShareUrl,
        "asma-ul-husna-progress.png"
      );
      setShareStatus("Progress ready to share.");
    } catch {
      setShareStatus("Share cancelled.");
    } finally {
      setSharing(false);
      setShareSheetOpen(false);
    }
  }, [memorized, progressShareText, progressShareUrl, streak]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await generateProgressImage(memorized, streak);
      downloadBlob(blob, "asma-ul-husna-progress.png");
      setShareStatus("Progress card downloaded.");
      setShareSheetOpen(false);
    } catch {
      setShareStatus("Could not create the share card.");
    } finally {
      setDownloading(false);
    }
  }, [memorized, streak]);

  const handleCopyLink = useCallback(async () => {
    try {
      await copyShareLink(progressShareUrl);
      setShareStatus("Share link copied.");
      setShareSheetOpen(false);
    } catch {
      setShareStatus("Could not copy the link.");
    }
  }, [progressShareUrl]);

  return (
    <>
      <div className="px-5 pt-8 pb-10">
        <section className="app-panel-strong overflow-hidden rounded-[2.2rem] px-4 py-4 sm:px-5 sm:py-5">
          <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/35 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="aspect-video">
              <iframe
                src={INSPIRATION_EMBED_URL}
                title="Maher Zain - Asma Allah Al Husna"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>
          </div>

          <div className="px-1 pb-2 pt-5 sm:px-2">
            <p className="section-kicker">Start Here</p>
            <h1 className="mt-3 font-display text-4xl leading-[0.98] text-white sm:text-5xl">
              Listen First
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-[0.95rem]">
              A beautiful place to begin. Listen once, let the Names settle in,
              then come back and learn them one by one.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={INSPIRATION_VIDEO_URL}
                target="_blank"
                rel="noreferrer"
                className="secondary-button flex-1"
              >
                Watch On YouTube
              </a>
              <Link href="/flashcards" className="primary-button flex-1">
                Begin Learning
              </Link>
            </div>
          </div>
        </section>

        <section className="app-panel-strong mt-5 overflow-hidden rounded-[2.2rem] px-6 py-7 text-center">
          <div className="flex items-start justify-between gap-4">
            <p className="section-kicker text-left">Asma ul Husna</p>
            <ShareCard
              memorized={memorized}
              streak={streak}
              onClick={openProgressShare}
            />
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
            <Link href="/browse" className={libraryCardClass}>
              <span className="font-display text-[2.8rem] leading-[0.92] text-white">
                Browse
              </span>
              <span className="mt-4 max-w-[10rem] text-sm font-medium leading-[1.4] text-text-secondary">
                All 99 Names
              </span>
            </Link>
            <Link href="/recitation" className={libraryCardClass}>
              <span className="font-display text-[2.8rem] leading-[0.92] text-white">
                Recite
              </span>
              <span className="mt-4 max-w-[10rem] text-sm font-medium leading-[1.4] text-text-secondary">
                Guided listening
              </span>
            </Link>
            <button
              type="button"
              onClick={openProgressShare}
              className={libraryCardClass}
            >
              <span className="font-display text-[2.8rem] leading-[0.92] text-white">
                Share
              </span>
              <span className="mt-4 max-w-[10rem] text-sm font-medium leading-[1.4] text-text-secondary">
                Share progress
              </span>
            </button>
          </div>
          <div aria-live="polite" className="mt-4 min-h-6 text-center">
            {shareStatus ? (
              <p className="text-sm text-accent">{shareStatus}</p>
            ) : null}
          </div>
        </section>

        <section className="app-panel mt-5 rounded-[2rem] px-6 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">Changelog</p>
              <h2 className="mt-3 font-display text-3xl text-white">
                See what changed
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                The full update history now lives in one place, including the
                refined renderings of the Names and the latest study-flow
                changes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/changelog" className="primary-button">
                Open Changelog
              </Link>
              <a
                href={changelogSummary.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                View GitHub
              </a>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
            <Link
              href="/changelog"
              className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-5 transition hover:border-accent/30 hover:bg-accent/5"
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">
                Latest update
              </p>
              <h3 className="mt-3 font-display text-2xl text-white">
                {latestChange.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {latestChange.summary}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-accent">
                {latestChange.date}
              </p>
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <div className="stat-card text-left">
                <span className="stat-value">
                  {changelogSummary.releaseCount}
                </span>
                <span className="stat-label">Major updates</span>
              </div>
              <div className="stat-card text-left">
                <span className="stat-value">
                  {changelogSummary.correctedNameCount}
                </span>
                <span className="stat-label">Corrected names</span>
              </div>
            </div>
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

      <ShareSheet
        open={shareSheetOpen}
        title="Share your progress"
        subtitle="Share your current memorization progress with its own preview card."
        actions={[
          {
            label: sharing ? "Preparing..." : "Share Image",
            hint: "Use the native share sheet with the progress card attached.",
            onClick: handleNativeShare,
          },
          {
            label: downloading ? "Creating..." : "Download Card",
            hint: "Save the progress image for any platform.",
            onClick: handleDownload,
          },
          {
            label: "Copy Link",
            hint: "Copy the direct progress share page.",
            onClick: handleCopyLink,
          },
          {
            label: "Share on X",
            hint: "Open a prefilled X post with your progress.",
            href: progressShareTargets.x,
          },
          {
            label: "Email",
            hint: "Send your progress through email.",
            href: progressShareTargets.email,
          },
          {
            label: "WhatsApp",
            hint: "Share your progress in chat.",
            href: progressShareTargets.whatsapp,
          },
          {
            label: "Telegram",
            hint: "Post the app link in Telegram.",
            href: progressShareTargets.telegram,
          },
        ]}
        onClose={() => setShareSheetOpen(false)}
      />
    </>
  );
}

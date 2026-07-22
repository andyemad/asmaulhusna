"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import ArabicText from "@/components/ArabicText";
import MilestoneModal from "@/components/MilestoneModal";
import NameOfTheDay from "@/components/NameOfTheDay";
import ShareSheet from "@/components/ShareSheet";
import { changelogEntries } from "@/lib/changelog";
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

const methods = [
  {
    href: "/browse",
    number: "01",
    title: "Contemplate",
    description: "Read every Name, its meaning, and a concise explanation.",
    action: "Browse all Names",
  },
  {
    href: "/recitation",
    number: "02",
    title: "Listen",
    description: "Hear the Names in sequence and follow at a peaceful pace.",
    action: "Begin recitation",
  },
  {
    href: "/quiz",
    number: "03",
    title: "Remember",
    description: "Strengthen recall with a focused, adaptive quiz.",
    action: "Test your recall",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

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
  const latestChange = changelogEntries[0];

  const progressShareUrl = useMemo(
    () => buildProgressShareUrl({ memorized, learning, streak, accuracy }),
    [accuracy, learning, memorized, streak]
  );
  const progressShareText = useMemo(
    () => buildProgressShareText({ memorized, learning, streak, accuracy }),
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
      ? "Review what is due"
      : memorized === 0
        ? "Meet your first Names"
        : learning > 0
          ? "Continue your review"
          : "Learn new Names";
  const nextStepHint =
    dueToday > 0
      ? `${dueToday} ${dueToday === 1 ? "Name is" : "Names are"} ready for review.`
      : learning > 0
        ? `${learning} ${learning === 1 ? "Name is" : "Names are"} still taking root.`
        : memorized > 0
          ? "Your reviews are clear. Add a few new Names when you are ready."
          : "Begin with a short session. Attention matters more than speed.";

  useEffect(() => {
    if (!shareStatus) return;
    const timeout = window.setTimeout(() => setShareStatus(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

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
      <div className="px-3 pb-12 pt-3 sm:px-5 sm:pt-5">
        <section className="sanctuary-hero flex flex-col px-6 pb-28 pt-7 sm:px-12 sm:pb-28 sm:pt-9">
          <div className="hero-starfield" aria-hidden="true" />
          <div className="relative z-10 flex items-center justify-between gap-5">
            <div>
              <p className="section-kicker">Asma ul Husna</p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-text-muted">
                A contemplative study companion
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShareSheetOpen(true)}
              aria-label="Share your memorization progress"
              className="grid h-10 w-10 place-items-center border border-white/10 text-text-secondary transition hover:border-accent/50 hover:text-accent"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="2.5" />
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
              </svg>
            </button>
          </div>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-5 text-center">
            <div className="celestial-seal">
              <span className="seal-diamond" aria-hidden="true" />
              <div className="relative z-10 px-6">
                <ArabicText className="glow-arabic text-[3.35rem] leading-[1.35] text-white sm:text-[4.5rem]">
                  أسماء الله الحسنى
                </ArabicText>
                <div className="ornament-rule mx-auto mt-3 max-w-[12rem] text-[9px]">
                  <span>◆</span>
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                  The Beautiful Names
                </p>
              </div>
            </div>

            <h1 className="mt-2 max-w-lg font-display text-[2.65rem] leading-[0.96] text-white sm:text-6xl">
              Learn slowly.
              <br />
              Remember deeply.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-text-secondary">
              Study the Names of Allah through meaning, listening, and steady
              remembrance.
            </p>
          </div>

          <div className="relative z-10 grid gap-3 sm:grid-cols-2">
            <Link href="/flashcards" className="primary-button">
              Begin today&apos;s practice <span aria-hidden="true">→</span>
            </Link>
            <Link href="/browse" className="secondary-button">
              Explore all 99 Names
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-8 px-3 sm:grid-cols-[10rem_1fr] sm:items-center sm:px-6">
          <div className="progress-orbit mx-auto">
            <div className="relative z-10 text-center">
              <p className="font-display text-4xl leading-none text-white">
                {memorized}
                <span className="ml-1 text-sm text-text-muted">/99</span>
              </p>
              <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted">
                Remembered
              </p>
            </div>
          </div>

          <div>
            <p className="section-kicker">Your journey</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl">
              A little, every day.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-text-secondary">
              Your progress stays on this device. Return when you can; continue
              where you left off.
            </p>
            <div className="mt-6 grid grid-cols-3">
              <Link href="/browse?status=learning" className="stat-card">
                <span className="stat-value">{learning}</span>
                <span className="stat-label">Learning</span>
              </Link>
              <div className="stat-card">
                <span className="stat-value">{streak}</span>
                <span className="stat-label">Day streak</span>
              </div>
              <Link href="/browse?status=new" className="stat-card">
                <span className="stat-value">{newCount}</span>
                <span className="stat-label">New</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="app-panel-strong mt-16 p-6 sm:p-9">
          <div className="grid gap-7 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="section-kicker">Today&apos;s path</p>
              <h2 className="mt-4 max-w-md font-display text-4xl leading-none text-white sm:text-5xl">
                {nextStepLabel}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-text-secondary">
                {nextStepHint}
              </p>
            </div>
            <div className="border-l border-accent/25 pl-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-text-muted">
                Complete
              </p>
              <p className="mt-2 font-display text-4xl text-white">
                {completion}%
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/flashcards" className="primary-button">
              {dueToday > 0 ? "Review due Names" : "Start a short session"}
            </Link>
            <Link href="/quiz" className="secondary-button">
              Practice with a quiz
            </Link>
          </div>
        </section>

        <div className="mt-16">
          <NameOfTheDay />
        </div>

        <section className="mt-20 px-3 sm:px-6">
          <div className="max-w-lg">
            <p className="section-kicker">Three ways to study</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] text-white sm:text-6xl">
              Read. Listen. Remember.
            </h2>
          </div>
          <div className="mt-10 grid border-b border-white/10 sm:grid-cols-3">
            {methods.map((method) => (
              <Link
                key={method.href}
                href={method.href}
                className="method-link flex flex-col justify-between p-6 sm:border-r sm:border-white/10 sm:last:border-r-0"
              >
                <span className="text-[10px] font-bold tracking-[0.22em] text-accent">
                  {method.number}
                </span>
                <div className="relative z-10 mt-10">
                  <h3 className="font-display text-4xl text-white">
                    {method.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    {method.description}
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-accent-start">
                    {method.action} <Arrow />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-8 border-y border-accent/15 px-5 py-10 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8">
          <div>
            <p className="section-kicker">Begin by listening</p>
            <h2 className="mt-3 font-display text-4xl text-white">
              Let the Names settle in the heart.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-text-secondary">
              Listen once without testing yourself. Then return to learn them one
              by one.
            </p>
          </div>
          <a
            href={INSPIRATION_VIDEO_URL}
            target="_blank"
            rel="noreferrer"
            className="secondary-button whitespace-nowrap"
          >
            Watch the recitation <Arrow />
          </a>
        </section>

        <div className="mt-12 flex flex-col gap-4 px-3 text-[11px] text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p aria-live="polite" className="min-h-5 text-accent">
            {shareStatus}
          </p>
          <Link
            href="/changelog"
            className="flex items-center gap-3 uppercase tracking-[0.14em] transition hover:text-accent"
          >
            Updated {latestChange.date} <span aria-hidden="true">→</span>
          </Link>
        </div>

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

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ArabicText from "@/components/ArabicText";
import QuizOption from "@/components/QuizOption";
import ShareSheet from "@/components/ShareSheet";
import { names } from "@/lib/names";
import { formatLocalDate } from "@/lib/date";
import {
  copyShareLink,
  buildQuizShareText,
  buildQuizShareUrl,
  buildShareTargets,
  downloadBlob,
  generateQuizResultImage,
  shareImage,
} from "@/lib/share";
import {
  getEncounteredNames,
  loadProgress,
  saveProgress,
} from "@/lib/progress";
import { generateQuiz, QuizQuestion } from "@/lib/quiz";
import { QuizResult } from "@/lib/types";

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [encounteredIds, setEncounteredIds] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [missedNames, setMissedNames] = useState<string[]>([]);
  const [missedIds, setMissedIds] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [tooFew, setTooFew] = useState(false);
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const startQuiz = useCallback((poolIds: number[], count: number) => {
    setQuestions(generateQuiz(names, poolIds, count));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setMissedNames([]);
    setMissedIds([]);
    setFinished(false);
    setShareSheetOpen(false);
    setShareStatus(null);
  }, []);

  useEffect(() => {
    if (questionCount === null) return;

    const progress = loadProgress();
    const encountered = getEncounteredNames(progress);
    setEncounteredIds(encountered);

    if (encountered.length < 4) {
      setTooFew(true);
      return;
    }

    setTooFew(false);
    startQuiz(encountered, questionCount);
  }, [questionCount, startQuiz]);

  useEffect(() => {
    if (!shareStatus) return;
    const timeout = window.setTimeout(() => setShareStatus(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (selected !== null || finished) return;

      const q = questions[current];
      const isCorrect = q.options[optionIndex].id === q.correctName.id;

      if (isCorrect) {
        setScore((previous) => previous + 1);
      } else {
        setMissedNames((previous) => [
          ...previous,
          `${q.correctName.transliteration} — ${q.correctName.meaning}`,
        ]);
        setMissedIds((previous) =>
          previous.includes(q.correctName.id)
            ? previous
            : [...previous, q.correctName.id]
        );
      }

      setSelected(optionIndex);

      window.setTimeout(() => {
        if (current + 1 >= questions.length) {
          const progress = loadProgress();
          const result: QuizResult = {
            date: formatLocalDate(),
            score: score + (isCorrect ? 1 : 0),
            total: questions.length,
          };

          progress.quizHistory.push(result);
          saveProgress(progress);
          setFinished(true);
        } else {
          setCurrent((previous) => previous + 1);
          setSelected(null);
        }
      }, 900);
    },
    [current, finished, questions, score, selected]
  );

  const accuracy =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const resultPayload = useMemo(
    () => ({
      score,
      total: questions.length,
      accuracy,
      missedCount: missedIds.length,
    }),
    [accuracy, missedIds.length, questions.length, score]
  );
  const shareText = useMemo(
    () => buildQuizShareText(resultPayload),
    [resultPayload]
  );
  const shareUrl = useMemo(
    () => buildQuizShareUrl(resultPayload),
    [resultPayload]
  );
  const shareTargets = useMemo(
    () => buildShareTargets(shareText, shareUrl),
    [shareText, shareUrl]
  );

  const handleNativeShare = useCallback(async () => {
    setSharing(true);
    try {
      const blob = await generateQuizResultImage(resultPayload);
      await shareImage(
        blob,
        shareText,
        shareUrl,
        "asma-ul-husna-quiz-result.png"
      );
      setShareStatus("Quiz result ready to post.");
    } catch {
      setShareStatus("Share cancelled.");
    } finally {
      setSharing(false);
      setShareSheetOpen(false);
    }
  }, [resultPayload, shareText, shareUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await copyShareLink(shareUrl);
      setShareStatus("Share link copied.");
      setShareSheetOpen(false);
    } catch {
      setShareStatus("Could not copy the link.");
    }
  }, [shareUrl]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await generateQuizResultImage(resultPayload);
      downloadBlob(blob, "asma-ul-husna-quiz-result.png");
      setShareStatus("Share card downloaded.");
      setShareSheetOpen(false);
    } catch {
      setShareStatus("Could not generate the share card.");
    } finally {
      setDownloading(false);
    }
  }, [resultPayload]);

  if (questionCount === null) {
    const roundOptions = [
      {
        count: 5,
        label: "Short",
        hint: "A brief round.",
      },
      {
        count: 10,
        label: "Standard",
        hint: "A balanced round.",
      },
      {
        count: 20,
        label: "Long",
        hint: "A longer review.",
      },
    ] as const;

    return (
      <div className="px-5 pt-10">
        <section className="app-panel-strong rounded-[2rem] px-6 py-8 text-center">
          <p className="section-kicker">Quiz Mode</p>
          <h1 className="mt-4 font-display text-4xl text-white">
            Select A Round
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-secondary">
            Your round stays in step with your flashcards, pulling only from
            the names you&apos;ve already reached.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {roundOptions.map((option) => (
              <button
                key={option.count}
                type="button"
                onClick={() => setQuestionCount(option.count)}
                className={
                  option.count === 10
                    ? "primary-button min-h-[9.5rem] flex-col rounded-[1.6rem] px-5 py-5"
                    : "secondary-button min-h-[9.5rem] flex-col rounded-[1.6rem] px-5 py-5"
                }
              >
                <span className="font-display text-4xl leading-none">
                  {option.count}
                </span>
                <span className="mt-3 text-[10px] uppercase tracking-[0.26em]">
                  Questions
                </span>
                <span className="mt-4 font-display text-2xl normal-case tracking-normal">
                  {option.label}
                </span>
                <span className="mt-2 max-w-[14rem] text-center text-sm leading-relaxed text-current/80">
                  {option.hint}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-text-muted">
            10 questions is a balanced place to start.
          </p>
        </section>
      </div>
    );
  }

  if (tooFew) {
    return (
      <div className="px-5 pt-10">
        <section className="app-panel-strong rounded-[2rem] px-6 py-8 text-center">
          <p className="section-kicker">Build The Pool</p>
          <h1 className="mt-4 font-display text-4xl text-white">
            Learn A Few Names First
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            The quiz opens once you have studied at least four names in
            flashcards, so the choices are drawn from names you have already
            seen.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/flashcards" className="primary-button flex-1">
              Start Learning
            </Link>
            <button
              type="button"
              onClick={() => setQuestionCount(null)}
              className="secondary-button flex-1"
            >
              Choose Another Mode
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (finished) {
    const summaryLabel =
      missedIds.length > 0 ? "Names to review" : "No names to review";
    const summaryText =
      missedIds.length > 0
        ? "Review these names next."
        : "This round is complete.";

    return (
      <>
        <div className="px-5 pt-8 pb-10">
          <section className="app-panel-strong overflow-hidden rounded-[2rem] px-6 py-8">
            <div className="text-center">
              <p className="section-kicker">Quiz Complete</p>
              <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">
                {score}/{questions.length}
              </h1>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                {accuracy}% accuracy
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
                {summaryText}
              </p>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-black/20 px-5 py-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-display text-3xl text-white">{score}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-text-muted">
                    Correct
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl text-white">{missedIds.length}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-text-muted">
                    Review
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl text-white">{questionCount}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-text-muted">
                    Questions
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/8 pt-6">
                <p className="section-kicker">{summaryLabel}</p>
                {missedNames.length > 0 ? (
                  <div className="mt-4 divide-y divide-white/6 rounded-[1.2rem] border border-white/6 bg-white/[0.03]">
                    {missedNames.map((name) => (
                      <p
                        key={name}
                        className="px-4 py-3 text-sm leading-relaxed text-text-secondary"
                      >
                        {name}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    No missed names in this round.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShareSheetOpen(true)}
                className="primary-button w-full"
              >
                {sharing ? "Preparing..." : "Share Result"}
              </button>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    missedIds.length > 0
                      ? startQuiz(missedIds, missedIds.length)
                      : questionCount !== null && encounteredIds.length > 0
                        ? startQuiz(encounteredIds, questionCount)
                        : setQuestionCount(null)
                  }
                  className="secondary-button"
                >
                  {missedIds.length > 0 ? "Retry Missed" : "New Quiz"}
                </button>
                <Link href="/" className="secondary-button">
                  Back To Home
                </Link>
              </div>
            </div>

            <div aria-live="polite" className="mt-4 min-h-6 text-center">
              {shareStatus ? (
                <p className="text-sm text-accent">{shareStatus}</p>
              ) : null}
            </div>
          </section>
        </div>

        <ShareSheet
          open={shareSheetOpen}
          title="Share your quiz result"
          subtitle="Save the result card, copy the link, or send it through another app."
          actions={[
            {
              label: sharing ? "Preparing..." : "Share Image",
              hint: "Use the native share sheet with the result card attached.",
              onClick: handleNativeShare,
            },
            {
              label: downloading ? "Creating..." : "Download Card",
              hint: "Save the polished result image for any platform.",
              onClick: handleDownload,
            },
            {
              label: "Copy Link",
              hint: "Grab the preview-ready result link.",
              onClick: handleCopyLink,
            },
            {
              label: "Share on X",
              hint: "Open a prefilled X post with the result link.",
              href: shareTargets.x,
            },
            {
              label: "Email",
              hint: "Send the result through your mail app.",
              href: shareTargets.email,
            },
            {
              label: "WhatsApp",
              hint: "Share the result link in chat.",
              href: shareTargets.whatsapp,
            },
            {
              label: "Telegram",
              hint: "Post the result link in Telegram.",
              href: shareTargets.telegram,
            },
          ]}
          onClose={() => setShareSheetOpen(false)}
        />
      </>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[current];
  const correctIndex = q.options.findIndex(
    (option) => option.id === q.correctName.id
  );

  return (
    <div className="px-5 pt-8 pb-8">
      <section className="app-panel-strong rounded-[2rem] px-6 py-7">
        <div className="flex items-center justify-between gap-4">
          <p className="section-kicker">
            Question {current + 1} of {questions.length}
          </p>
          <p className="text-xs text-text-muted">
            {Math.round(((current + 1) / questions.length) * 100)}% through
          </p>
        </div>

        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-white/5"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={current + 1}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-start via-accent-mid to-accent transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="section-kicker">
            {q.type === "arabic-to-meaning"
              ? "Meaning Challenge"
              : "Name Challenge"}
          </p>
          <p className="mt-4 text-base text-text-secondary">
            {q.type === "arabic-to-meaning"
              ? "What is the meaning of this name?"
              : "Which Arabic name matches this meaning?"}
          </p>

          {q.type === "arabic-to-meaning" ? (
            <div className="mx-auto mt-5 max-w-sm rounded-[1.8rem] border border-white/10 bg-black/20 px-6 py-7">
              <ArabicText className="text-5xl leading-[1.45] text-white">
                {q.correctName.arabic}
              </ArabicText>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                {q.correctName.transliteration}
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-5 max-w-md rounded-[1.8rem] border border-white/10 bg-black/20 px-6 py-7">
              <p className="font-display text-4xl text-white">
                {q.correctName.meaning}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.28em] text-text-muted">
                Choose the Arabic name below
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {q.options.map((option, index) => {
            let state: "default" | "correct" | "wrong" = "default";

            if (selected !== null) {
              if (index === correctIndex) state = "correct";
              else if (index === selected) state = "wrong";
            }

            return (
              <QuizOption
                key={option.id}
                name={option}
                displayField={
                  q.type === "arabic-to-meaning" ? "meaning" : "arabic"
                }
                state={state}
                disabled={selected !== null}
                onClick={() => handleSelect(index)}
              />
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm leading-relaxed text-text-muted">
          {q.type === "arabic-to-meaning"
            ? "Read the Arabic first, then pick the meaning without rushing the diacritics."
            : "Choose the Arabic and transliteration that match the meaning above."}
        </p>
      </section>
    </div>
  );
}

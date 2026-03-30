import type { Metadata } from "next";
import Link from "next/link";
import {
  buildQuizShareImageUrlForServer,
  buildQuizShareText,
  buildQuizShareUrlForServer,
  parseQuizSharePayload,
} from "@/lib/share";

type SharePageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ searchParams }: SharePageProps): Metadata {
  const payload = parseQuizSharePayload(searchParams);
  const title =
    payload.accuracy >= 90
      ? `I scored ${payload.score}/${payload.total} on the 99 Names quiz`
      : `My 99 Names quiz result: ${payload.score}/${payload.total}`;
  const description = buildQuizShareText(payload);
  const url = buildQuizShareUrlForServer(payload);
  const image = buildQuizShareImageUrlForServer(payload);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function QuizSharePage({ searchParams }: SharePageProps) {
  const payload = parseQuizSharePayload(searchParams);

  return (
    <div className="px-5 py-10">
      <section className="app-panel-strong overflow-hidden rounded-[2.2rem] px-6 py-8 text-center">
        <p className="section-kicker">Asma ul Husna</p>
        <h1 className="mt-4 font-display text-4xl text-white">
          99 Names Quiz Result
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
          {buildQuizShareText(payload)}
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-[2rem] border border-accent/20 bg-black/20 px-6 py-7">
          <p className="section-kicker">Shared Score</p>
          <p className="mt-4 font-display text-6xl leading-none text-white">
            {payload.score}/{payload.total}
          </p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            {payload.accuracy}% accuracy
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-start via-accent-mid to-accent"
              style={{ width: `${payload.accuracy}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="stat-card">
              <span className="stat-value">{payload.score}</span>
              <span className="stat-label">Correct</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{payload.missedCount}</span>
              <span className="stat-label">To review</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{payload.total}</span>
              <span className="stat-label">Question round</span>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
          Study the Names with flashcards, review, recitation, and quizzes.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/quiz" className="primary-button flex-1">
            Take Your Own Quiz
          </Link>
          <Link href="/" className="secondary-button flex-1">
            Open The App
          </Link>
        </div>
      </section>
    </div>
  );
}

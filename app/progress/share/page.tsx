import type { Metadata } from "next";
import Link from "next/link";
import {
  buildProgressShareImageUrlForServer,
  buildProgressShareText,
  buildProgressShareUrlForServer,
  parseProgressSharePayload,
} from "@/lib/share";

type ProgressSharePageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function getSharedProgress(
  searchParams: Record<string, string | string[] | undefined>
) {
  return parseProgressSharePayload(searchParams);
}

export function generateMetadata({
  searchParams,
}: ProgressSharePageProps): Metadata {
  const payload = getSharedProgress(searchParams);
  const title =
    payload.memorized > 0
      ? `My 99 Names progress: ${payload.memorized}/99 memorized`
      : "My Asma ul Husna progress";
  const description = buildProgressShareText(payload);
  const url = buildProgressShareUrlForServer(payload);
  const image = buildProgressShareImageUrlForServer(payload);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
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

export default function ProgressSharePage({
  searchParams,
}: ProgressSharePageProps) {
  const payload = getSharedProgress(searchParams);
  const completion = Math.round((payload.memorized / 99) * 100);

  return (
    <div className="px-5 py-10">
      <section className="app-panel-strong overflow-hidden rounded-[2.2rem] px-6 py-8 text-center">
        <p className="section-kicker">Asma ul Husna</p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">
          Memorization Progress
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
          {buildProgressShareText(payload)}
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-accent/15 bg-black/20 px-6 py-7">
          <p className="section-kicker">Shared Progress</p>
          <p className="mt-4 font-display text-6xl leading-none text-white sm:text-7xl">
            {payload.memorized}
            <span className="ml-2 text-2xl text-text-muted sm:text-3xl">
              /99
            </span>
          </p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            Memorized
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-start via-accent-mid to-accent"
              style={{ width: `${completion}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="stat-card">
              <span className="stat-value">{payload.memorized}</span>
              <span className="stat-label">Memorized</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{payload.learning}</span>
              <span className="stat-label">Learning</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{payload.accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{payload.streak}</span>
              <span className="stat-label">Day streak</span>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
          Learn through flashcards, recitation, and review at a steady pace.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="primary-button flex-1">
            Open The App
          </Link>
          <Link href="/flashcards" className="secondary-button flex-1">
            Begin Learning
          </Link>
        </div>
      </section>
    </div>
  );
}

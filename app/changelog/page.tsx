import type { Metadata } from "next";
import Link from "next/link";
import {
  changelogEntries,
  changelogSummary,
  nameCorrections,
} from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog | Asma ul Husna",
  description:
    "A record of the major updates to the Asma ul Husna study app, including the corrected names list.",
};

export default function ChangelogPage() {
  return (
    <div className="px-5 pb-12 pt-8">
      <section className="app-panel-strong rounded-[2.2rem] px-6 py-7 sm:px-8 sm:py-8">
        <p className="section-kicker">Changelog</p>
        <h1 className="mt-4 max-w-[12ch] font-display text-[2.85rem] leading-[0.92] text-white sm:max-w-none sm:text-[3.6rem]">
          The app&apos;s full revision history
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-[0.95rem]">
          A cleaner record of what changed, when it changed, and which names
          were corrected in the latest scholarly alignment pass.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="stat-card text-left sm:text-center">
            <span className="stat-value">{changelogSummary.releaseCount}</span>
            <span className="stat-label">Major updates</span>
          </div>
          <div className="stat-card text-left sm:text-center">
            <span className="stat-value">
              {changelogSummary.correctedNameCount}
            </span>
            <span className="stat-label">Corrected names</span>
          </div>
          <a
            href={changelogSummary.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="stat-card items-start justify-center text-left transition hover:border-accent/30 hover:bg-accent/5 sm:items-center sm:text-center"
          >
            <span className="stat-value text-[1.45rem]">GitHub</span>
            <span className="stat-label">Open repo</span>
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="secondary-button">
            Back Home
          </Link>
          <a
            href={changelogSummary.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="primary-button"
          >
            View Source
          </a>
        </div>
      </section>

      <section className="mt-5 app-panel rounded-[2rem] px-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker">Latest alignment</p>
            <h2 className="mt-3 font-display text-3xl text-white">
              Corrected renderings of the Names
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              These entries now drive browse, flashcards, quiz prompts, name
              detail screens, and all share pages.
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-accent/20 bg-accent/10 px-4 py-3 text-left sm:text-right">
            <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">
              Scope
            </p>
            <p className="mt-2 font-display text-3xl text-white">
              {nameCorrections.length}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              entries refined
            </p>
          </div>
        </div>

        <details className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.03]">
          <summary className="cursor-pointer list-none px-5 py-4 text-left">
            <span className="block text-[10px] uppercase tracking-[0.24em] text-text-muted">
              Full correction list
            </span>
            <span className="mt-2 block font-display text-2xl text-white">
              View all {nameCorrections.length} corrected entries
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-text-secondary">
              Open the complete before-and-after list used for the updated names
              data.
            </span>
          </summary>

          <div className="border-t border-white/8 px-5 py-5">
            <div className="grid max-h-[42rem] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
              {nameCorrections.map((correction) => (
                <article
                  key={correction.id}
                  className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                    Name {String(correction.id).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {correction.before}
                  </p>
                  <div className="mt-3 h-px bg-white/8" />
                  <p className="mt-3 text-sm leading-relaxed text-white">
                    {correction.after}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </details>
      </section>

      <section className="mt-5 app-panel rounded-[2rem] px-6 py-6">
        <p className="section-kicker">Timeline</p>
        <div className="relative mt-5 pl-6 before:absolute before:left-1 before:top-1 before:h-[calc(100%-0.5rem)] before:w-px before:bg-white/10 before:content-['']">
          {changelogEntries.map((entry) => (
            <article
              key={`${entry.date}-${entry.title}`}
              className="relative mb-5 rounded-[1.7rem] border border-white/8 bg-white/[0.03] px-5 py-5 last:mb-0"
            >
              <span className="absolute -left-[1.62rem] top-6 h-3 w-3 rounded-full border border-accent/50 bg-accent shadow-[0_0_18px_rgba(244,221,154,0.3)]" />
              <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">
                {entry.date}
              </p>
              <h2 className="mt-3 font-display text-3xl text-white">
                {entry.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
                {entry.summary}
              </p>

              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-text-secondary">
                {entry.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-[0.35rem] h-1.5 w-1.5 rounded-full bg-accent/80" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

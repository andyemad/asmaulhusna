"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ArabicText from "@/components/ArabicText";
import NameDetailModal from "@/components/NameDetailModal";
import { searchNames } from "@/lib/names";
import {
  getLearningCount,
  getMemorizedCount,
  getNameProgress,
  loadProgress,
} from "@/lib/progress";
import { Name, UserProgress } from "@/lib/types";

type SortBy = "number" | "status" | "alpha";
type StatusFilter = "all" | "memorized" | "learning" | "new";

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowsePageSkeleton />}>
      <BrowsePageContent />
    </Suspense>
  );
}

function BrowsePageContent() {
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("number");
  const [selectedName, setSelectedName] = useState<Name | null>(null);

  const statusFilter = useMemo<StatusFilter>(() => {
    const raw = searchParams.get("status");
    return raw === "memorized" || raw === "learning" || raw === "new"
      ? raw
      : "all";
  }, [searchParams]);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const filtered = useMemo(() => {
    let result = searchNames(query);

    if (progress && statusFilter !== "all") {
      result = result.filter(
        (name) => getNameProgress(progress, name.id).status === statusFilter
      );
    }

    if (sortBy === "alpha") {
      result = [...result].sort((a, b) =>
        a.transliteration.localeCompare(b.transliteration)
      );
    } else if (sortBy === "status" && progress) {
      const order = { memorized: 0, learning: 1, new: 2 };
      result = [...result].sort(
        (a, b) =>
          order[getNameProgress(progress, a.id).status] -
          order[getNameProgress(progress, b.id).status]
      );
    }

    return result;
  }, [progress, query, sortBy, statusFilter]);

  const memorizedCount = progress ? getMemorizedCount(progress) : 0;
  const learningCount = progress ? getLearningCount(progress) : 0;
  const getStatus = (nameId: number) =>
    progress ? getNameProgress(progress, nameId).status : "new";
  const filterLabel =
    statusFilter === "memorized"
      ? "Memorized Names"
      : statusFilter === "learning"
        ? "Learning Names"
        : statusFilter === "new"
          ? "New Names"
          : "Explore All 99 Names";

  const statusBadge = (nameId: number) => {
    const status = getStatus(nameId);

    if (status === "memorized") {
      return (
        <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-success">
          Memorized
        </span>
      );
    }

    if (status === "learning") {
      return (
        <span className="rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-warning">
          Learning
        </span>
      );
    }

    return (
      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted">
        New
      </span>
    );
  };

  return (
    <div className="px-5 pt-8 pb-10">
      <section className="app-panel-strong rounded-[2rem] px-6 py-7">
        <p className="section-kicker">Browse The Collection</p>
        <h1 className="mt-4 font-display text-4xl text-white">
          {filterLabel}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Search by Arabic, transliteration, meaning, description, or number,
          then open any name for the full explanation and pronunciation.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="stat-card">
            <span className="stat-value">{filtered.length}</span>
            <span className="stat-label">Results</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{memorizedCount}</span>
            <span className="stat-label">Memorized</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{learningCount}</span>
            <span className="stat-label">Learning</span>
          </div>
        </div>

        <label className="mt-8 block">
          <span className="sr-only">Search the 99 Names of Allah</span>
          <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by Arabic, transliteration, meaning, description, or number"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-text-muted"
            />
          </div>
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "memorized", "learning", "new"] as StatusFilter[]).map(
            (value) => (
              <Link
                key={value}
                href={value === "all" ? "/browse" : `/browse?status=${value}`}
                className={
                  statusFilter === value
                    ? "rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent"
                    : "rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted transition hover:border-accent/25 hover:text-accent"
                }
              >
                {value === "all" ? "All" : value}
              </Link>
            )
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(["number", "status", "alpha"] as SortBy[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSortBy(value)}
              aria-pressed={sortBy === value}
              className={
                sortBy === value
                  ? "rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent"
                  : "rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted transition hover:border-accent/25 hover:text-accent"
              }
            >
              {value === "number"
                ? "By Number"
                : value === "status"
                  ? "By Status"
                  : "A to Z"}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        {filtered.length === 0 ? (
          <div className="app-panel rounded-[2rem] px-6 py-10 text-center">
            <p className="font-display text-3xl text-white">No matches found</p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Try a different transliteration, a meaning keyword, or the name
              number.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((name) => (
              <button
                key={name.id}
                type="button"
                onClick={() => setSelectedName(name)}
                className="app-panel rounded-[1.8rem] px-5 py-5 text-left transition hover:border-accent/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-kicker">
                      Name {String(name.id).padStart(2, "0")}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">
                      {name.meaning}
                    </p>
                  </div>
                  {statusBadge(name.id)}
                </div>

                <div className="mt-5 text-center">
                  <ArabicText className="text-4xl leading-[1.55] text-white">
                    {name.arabic}
                  </ArabicText>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                    {name.transliteration}
                  </p>
                </div>

                <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                  {name.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedName ? (
        <NameDetailModal
          name={selectedName}
          status={getStatus(selectedName.id)}
          onStatusChange={() => setProgress(loadProgress())}
          onClose={() => setSelectedName(null)}
        />
      ) : null}
    </div>
  );
}

function BrowsePageSkeleton() {
  return (
    <div className="px-5 pt-8 pb-10">
      <section className="app-panel-strong rounded-[2rem] px-6 py-7">
        <p className="section-kicker">Browse The Collection</p>
        <div className="mt-4 h-12 w-56 animate-pulse rounded-2xl bg-white/8" />
        <div className="mt-3 h-16 max-w-2xl animate-pulse rounded-2xl bg-white/6" />

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((value) => (
            <div
              key={value}
              className="stat-card min-h-[104px] animate-pulse bg-white/[0.04]"
            />
          ))}
        </div>

        <div className="mt-8 h-14 animate-pulse rounded-[1.4rem] bg-black/20" />

        <div className="mt-4 flex gap-2">
          {[0, 1, 2, 3].map((value) => (
            <div
              key={value}
              className="h-10 w-20 animate-pulse rounded-full bg-white/[0.05]"
            />
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          {[0, 1, 2].map((value) => (
            <div
              key={value}
              className="h-10 w-24 animate-pulse rounded-full bg-white/[0.05]"
            />
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-3">
        {[0, 1, 2].map((value) => (
          <div
            key={value}
            className="app-panel min-h-[220px] animate-pulse rounded-[1.8rem] bg-white/[0.03]"
          />
        ))}
      </section>
    </div>
  );
}

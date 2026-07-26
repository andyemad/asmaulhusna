"use client";

import { useEffect, useRef, useState } from "react";
import { names } from "@/lib/names";

const TOTAL_NAMES = names.length;

export type StatusFilter = "all" | "memorized" | "learning" | "new";
export type SortBy = "number" | "status" | "alpha";
export type ViewMode = "folio" | "index" | "mosaic";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "memorized", label: "Memorized" },
  { value: "learning", label: "Learning" },
  { value: "new", label: "New" },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "number", label: "Order" },
  { value: "status", label: "Status" },
  { value: "alpha", label: "A–Z" },
];

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "folio", label: "Folio" },
  { value: "index", label: "Index" },
  { value: "mosaic", label: "Mosaic" },
];

const HEADINGS: Record<StatusFilter, string> = {
  all: "The Ninety-Nine",
  memorized: "Memorized",
  learning: "Learning",
  new: "Not Yet Begun",
};

interface BrowseToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  view: ViewMode;
  onViewChange: (value: ViewMode) => void;
  resultCount: number;
  memorizedCount: number;
  learningCount: number;
}

function Segment<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="segment" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          data-active={value === option.value}
          aria-pressed={value === option.value}
          className="segment-item"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function BrowseToolbar({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  view,
  onViewChange,
  resultCount,
  memorizedCount,
  learningCount,
}: BrowseToolbarProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typingElsewhere =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if (event.key === "/" && !typingElsewhere) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        onQueryChange("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onQueryChange]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      <div className="browse-bar" data-stuck={stuck}>
        <div className="browse-bar-masthead">
          <div>
            <p className="section-kicker">Asma ul Husna</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <h1 className="font-display text-[2.1rem] leading-none text-white sm:text-4xl">
                {HEADINGS[statusFilter]}
              </h1>
              <p className="whitespace-nowrap pb-1 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-text-muted">
                <span className="text-accent">{memorizedCount}</span> of{" "}
                {TOTAL_NAMES} gilded
              </p>
            </div>
          </div>
        </div>

        <label className="folio-search">
          <span className="sr-only">Search the 99 Names of Allah</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px] shrink-0 text-text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Arabic, meaning, or number"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
              className="shrink-0 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-accent"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden shrink-0 border border-white/10 px-1.5 py-0.5 text-[0.58rem] font-bold tracking-[0.1em] text-text-muted sm:block">
              /
            </kbd>
          )}
        </label>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Segment
            label="Filter by status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusFilterChange}
          />
          <Segment
            label="Sort names"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={onSortByChange}
          />
          <Segment
            label="Change layout"
            options={VIEW_OPTIONS}
            value={view}
            onChange={onViewChange}
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="whitespace-nowrap text-[0.55rem] font-bold uppercase tracking-[0.22em] text-text-muted">
            {resultCount} shown
          </span>
          <div
            className="illumination-meter flex-1"
            role="img"
            aria-label={`${memorizedCount} memorized and ${learningCount} learning out of ${TOTAL_NAMES} Names`}
          >
            <span
              className="bg-accent"
              style={{ width: `${(memorizedCount / TOTAL_NAMES) * 100}%` }}
            />
            <span
              className="bg-success"
              style={{ width: `${(learningCount / TOTAL_NAMES) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

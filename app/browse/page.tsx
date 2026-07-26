"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import NameDetailModal from "@/components/NameDetailModal";
import BrowseToolbar, {
  SortBy,
  StatusFilter,
  ViewMode,
} from "@/components/browse/BrowseToolbar";
import {
  FolioTile,
  IndexRow,
  MosaicCell,
  NameCellProps,
  NameStatus,
} from "@/components/browse/NameCells";
import { alphabeticalNameKey, searchNames } from "@/lib/names";
import {
  getLearningCount,
  getMemorizedCount,
  getNameProgress,
  loadProgress,
} from "@/lib/progress";
import { Name, UserProgress } from "@/lib/types";

const VIEW_STORAGE_KEY = "asma-ul-husna-browse-view";
const SUGGESTIONS = ["Mercy", "Light", "Peace", "Forgiving", "40"];

const VIEW_LAYOUT: Record<
  ViewMode,
  { className: string; Cell: (props: NameCellProps) => JSX.Element }
> = {
  folio: { className: "grid gap-3 sm:grid-cols-2", Cell: FolioTile },
  index: { className: "app-panel overflow-hidden", Cell: IndexRow },
  mosaic: {
    className: "grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8",
    Cell: MosaicCell,
  },
};

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
  const [view, setView] = useState<ViewMode>("folio");
  const [selectedName, setSelectedName] = useState<Name | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => {
    const raw = searchParams.get("status");
    return raw === "memorized" || raw === "learning" || raw === "new" ? raw : "all";
  });

  useEffect(() => {
    setProgress(loadProgress());

    const storedView = localStorage.getItem(VIEW_STORAGE_KEY);
    if (storedView === "folio" || storedView === "index" || storedView === "mosaic") {
      setView(storedView);
    }
  }, []);

  const handleViewChange = useCallback((next: ViewMode) => {
    setView(next);
    localStorage.setItem(VIEW_STORAGE_KEY, next);
  }, []);

  // Keeps ?status= shareable without paying for a route transition on a
  // filter that is already resolved on the client.
  const handleStatusFilterChange = useCallback((next: StatusFilter) => {
    setStatusFilter(next);
    window.history.replaceState(
      null,
      "",
      next === "all" ? "/browse" : `/browse?status=${next}`
    );
  }, []);

  const getStatus = useCallback(
    (nameId: number): NameStatus =>
      progress ? getNameProgress(progress, nameId).status : "new",
    [progress]
  );

  const filtered = useMemo(() => {
    let result = searchNames(query);

    if (progress && statusFilter !== "all") {
      result = result.filter(
        (name) => getNameProgress(progress, name.id).status === statusFilter
      );
    }

    if (sortBy === "alpha") {
      result = [...result].sort((a, b) => {
        const byName = alphabeticalNameKey(a.transliteration).localeCompare(
          alphabeticalNameKey(b.transliteration)
        );
        return byName || a.transliteration.localeCompare(b.transliteration);
      });
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

  const cells = filtered.map((name, index) => ({
    name,
    status: getStatus(name.id),
    query,
    index,
    onOpen: () => setSelectedName(name),
  }));

  const { className: layoutClassName, Cell } = VIEW_LAYOUT[view];

  return (
    <div className="px-5 pb-12">
      <BrowseToolbar
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        view={view}
        onViewChange={handleViewChange}
        resultCount={filtered.length}
        memorizedCount={memorizedCount}
        learningCount={learningCount}
      />

      <section className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState query={query} onSuggestion={setQuery} />
        ) : (
          // Keying on view and ordering remounts the grid, which replays the
          // staggered reveal whenever the collection is re-cut. Deliberately
          // excludes `query` so the tiles do not flash on every keystroke.
          <div
            key={`${view}-${statusFilter}-${sortBy}`}
            className={layoutClassName}
          >
            {cells.map((cell) => (
              <Cell key={cell.name.id} {...cell} />
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

function EmptyState({
  query,
  onSuggestion,
}: {
  query: string;
  onSuggestion: (value: string) => void;
}) {
  return (
    <div className="app-panel px-6 py-12 text-center">
      <p className="font-display text-3xl text-white">
        Nothing matches &ldquo;{query}&rdquo;
      </p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
        Search runs across the Arabic, the transliteration, the meaning, the full
        description, and the Name&rsquo;s number.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestion(suggestion)}
            className="border border-accent/25 px-3.5 py-2 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent transition-colors hover:border-accent hover:bg-accent/10"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function BrowsePageSkeleton() {
  return (
    <div className="px-5 pb-12">
      <div className="browse-bar">
        <div className="browse-bar-masthead">
          <div>
            <p className="section-kicker">Asma ul Husna</p>
            <div className="mt-2 h-9 w-64 animate-pulse rounded bg-white/[0.06]" />
          </div>
        </div>
        <div className="h-[3.05rem] animate-pulse rounded-[0.4rem] bg-black/25" />
        <div className="mt-2.5 flex gap-2">
          {[0, 1, 2].map((value) => (
            <div
              key={value}
              className="h-[2.1rem] w-32 animate-pulse rounded-[0.4rem] bg-white/[0.04]"
            />
          ))}
        </div>
        <div className="illumination-meter mt-3" />
      </div>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((value) => (
          <div
            key={value}
            className="h-[19rem] animate-pulse rounded-[1rem] border border-[rgba(215,182,111,0.12)] bg-white/[0.03]"
          />
        ))}
      </section>
    </div>
  );
}

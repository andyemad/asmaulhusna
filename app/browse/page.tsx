"use client";

import { useState, useEffect, useMemo } from "react";
import { searchNames } from "@/lib/names";
import { loadProgress, getNameProgress } from "@/lib/progress";
import { Name, UserProgress } from "@/lib/types";
import NameDetailModal from "@/components/NameDetailModal";

type SortBy = "number" | "status" | "alpha";

export default function BrowsePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("number");
  const [selectedName, setSelectedName] = useState<Name | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const filtered = useMemo(() => {
    let result = searchNames(query);
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
  }, [query, sortBy, progress]);

  const statusBadge = (nameId: number) => {
    if (!progress) return null;
    const s = getNameProgress(progress, nameId).status;
    if (s === "memorized")
      return (
        <span className="text-[8px] text-success tracking-wider">
          ✓ MEMORIZED
        </span>
      );
    if (s === "learning")
      return (
        <span className="text-[8px] text-warning tracking-wider">
          LEARNING
        </span>
      );
    return (
      <span className="text-[8px] text-text-muted/50 tracking-wider">
        NEW
      </span>
    );
  };

  const getStatus = (nameId: number) =>
    progress ? getNameProgress(progress, nameId).status : "new";

  return (
    <div className="px-4 pt-8">
      <div className="bg-surface border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 mb-4">
        <span className="text-text-muted">🔍</span>
        <input
          type="text"
          placeholder="Search by name or meaning..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-text-muted"
        />
      </div>

      <div className="flex gap-2 mb-4">
        {(["number", "status", "alpha"] as SortBy[]).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              sortBy === s
                ? "bg-accent/20 text-accent"
                : "bg-surface text-text-muted"
            }`}
          >
            {s === "number" ? "#" : s === "status" ? "Status" : "A-Z"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {filtered.map((name) => (
          <button
            key={name.id}
            onClick={() => setSelectedName(name)}
            className="bg-surface border border-white/5 rounded-xl p-3 text-center hover:border-accent/20 transition-colors"
          >
            {statusBadge(name.id)}
            <p className="font-arabic text-xl text-white mt-1">
              {name.arabic}
            </p>
            <p className="text-accent text-[10px] mt-1">
              {name.transliteration}
            </p>
          </button>
        ))}
      </div>

      {selectedName && (
        <NameDetailModal
          name={selectedName}
          status={getStatus(selectedName.id)}
          onClose={() => setSelectedName(null)}
        />
      )}
    </div>
  );
}

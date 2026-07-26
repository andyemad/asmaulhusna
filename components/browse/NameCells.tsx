"use client";

import ArabicText from "@/components/ArabicText";
import { Name, NameProgress } from "@/lib/types";
import ListenButton from "./ListenButton";

export type NameStatus = NameProgress["status"];

export interface NameCellProps {
  name: Name;
  status: NameStatus;
  query: string;
  index: number;
  onOpen: () => void;
}

const STATUS_META: Record<NameStatus, { label: string; dot: string; text: string }> = {
  memorized: {
    label: "Memorized",
    dot: "bg-accent shadow-[0_0_8px_rgba(215,182,111,0.85)]",
    text: "text-accent",
  },
  learning: { label: "Learning", dot: "bg-success", text: "text-success" },
  new: { label: "New", dot: "bg-white/25", text: "text-text-muted" },
};

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const REVEAL_STEP_MS = 45;
const MAX_STAGGERED_CELLS = 12;

function toArabicNumeral(value: number): string {
  return String(value)
    .split("")
    .map((digit) => ARABIC_DIGITS[Number(digit)])
    .join("");
}

/** Staggers the entrance, but caps the delay so late rows never hang back. */
function revealDelay(index: number) {
  const step = Math.min(index, MAX_STAGGERED_CELLS - 1);
  return { animationDelay: `${step * REVEAL_STEP_MS}ms` };
}

/** Roughly how much description survives the two-line clamp. */
const CLAMPED_PREVIEW_CHARS = 60;
/** Context kept ahead of the match so it does not start on the hit itself. */
const EXCERPT_LEAD_CHARS = 40;

/**
 * Search also matches the description, so when the hit is buried deep in one
 * the excerpt slides to the match — otherwise the clamped preview would never
 * show why the Name came back.
 */
function excerptAround(text: string, query: string): string {
  const needle = query.trim();
  if (!needle) return text;

  const start = text.toLowerCase().indexOf(needle.toLowerCase());
  if (start <= CLAMPED_PREVIEW_CHARS) return text;

  // Snap to a word boundary so the excerpt never opens mid-word.
  const window = text.slice(start - EXCERPT_LEAD_CHARS);
  return `…${window.slice(window.indexOf(" ") + 1)}`;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle) return <>{text}</>;

  const start = text.toLowerCase().indexOf(needle.toLowerCase());
  if (start === -1) return <>{text}</>;

  const end = start + needle.length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="folio-mark">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

function StatusMark({ status }: { status: NameStatus }) {
  const meta = STATUS_META[status];

  return (
    <span className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      <span
        className={`text-[0.55rem] font-bold uppercase tracking-[0.24em] ${meta.text}`}
      >
        {meta.label}
      </span>
    </span>
  );
}

export function FolioTile({ name, status, query, index, onOpen }: NameCellProps) {
  return (
    <article
      className="folio-tile folio-reveal"
      data-status={status}
      style={revealDelay(index)}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-baseline gap-2">
          <span className="folio-numeral">{toArabicNumeral(name.id)}</span>
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.22em] text-text-muted">
            {String(name.id).padStart(2, "0")}
          </span>
        </span>
        <ListenButton src={name.audioFile} name={name.transliteration} />
      </div>

      <ArabicText className="glow-arabic mt-4 text-center text-[2.5rem] leading-[1.75] text-white">
        {name.arabic}
      </ArabicText>

      <button type="button" onClick={onOpen} className="folio-stretch mt-1 text-center">
        <span className="block text-[0.68rem] font-bold uppercase tracking-[0.3em] text-accent">
          <Highlight text={name.transliteration} query={query} />
        </span>
        <span className="mt-2 block font-display text-2xl leading-tight text-white">
          <Highlight text={name.meaning} query={query} />
        </span>
      </button>

      <p className="mt-4 line-clamp-2 text-[0.8rem] leading-relaxed text-text-secondary">
        <Highlight text={excerptAround(name.description, query)} query={query} />
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <StatusMark status={status} />
        <span className="text-[0.55rem] font-bold uppercase tracking-[0.22em] text-text-muted opacity-60">
          Open
        </span>
      </div>
    </article>
  );
}

export function IndexRow({ name, status, query, index, onOpen }: NameCellProps) {
  return (
    <div
      className="index-row folio-reveal"
      data-status={status}
      style={revealDelay(index)}
    >
      <span className="folio-numeral w-9 shrink-0 text-center text-[1.05rem]">
        {toArabicNumeral(name.id)}
      </span>

      <ArabicText className="w-[6.5rem] shrink-0 text-right text-[1.3rem] leading-[1.75] text-white sm:w-[9rem]">
        {name.arabic}
      </ArabicText>

      <button type="button" onClick={onOpen} className="folio-stretch min-w-0 flex-1 text-left">
        <span className="block truncate text-[0.66rem] font-bold uppercase tracking-[0.26em] text-accent">
          <Highlight text={name.transliteration} query={query} />
        </span>
        <span className="mt-1 block truncate text-[0.82rem] text-text-secondary">
          <Highlight text={name.meaning} query={query} />
        </span>
      </button>

      <span className="hidden shrink-0 sm:block">
        <StatusMark status={status} />
      </span>

      <ListenButton src={name.audioFile} name={name.transliteration} />
    </div>
  );
}

export function MosaicCell({ name, status, index, onOpen }: NameCellProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mosaic-cell folio-reveal"
      data-status={status}
      style={revealDelay(index)}
      title={`${name.transliteration} — ${name.meaning}`}
      aria-label={`${name.transliteration}, ${name.meaning}, ${STATUS_META[status].label}`}
    >
      <span className="font-arabic text-[1.3rem] leading-none text-white/90">
        {toArabicNumeral(name.id)}
      </span>
      <span className="max-w-full truncate text-[0.48rem] font-bold uppercase tracking-[0.1em] text-text-muted">
        {name.transliteration}
      </span>
    </button>
  );
}

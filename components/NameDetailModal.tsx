"use client";

import { useEffect, useRef, useState } from "react";
import ArabicText from "@/components/ArabicText";
import {
  buildNameShareText,
  buildNameShareUrl,
  buildShareTargets,
  copyShareLink,
} from "@/lib/share";
import { Name } from "@/lib/types";
import {
  getNameProgress,
  loadProgress,
  saveProgress,
  updateNameProgress,
} from "@/lib/progress";
import { markLearning, markMemorized } from "@/lib/spaced-repetition";
import AudioButton from "./AudioButton";
import ShareSheet from "./ShareSheet";

interface NameDetailModalProps {
  name: Name;
  status: "new" | "learning" | "memorized";
  onClose: () => void;
  onStatusChange?: (status: "learning" | "memorized") => void;
}

export default function NameDetailModal({
  name,
  status,
  onClose,
  onStatusChange,
}: NameDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const statusStyles = {
    new: "border-white/10 bg-white/[0.04] text-text-muted",
    learning: "border-warning/20 bg-warning/10 text-warning",
    memorized: "border-success/20 bg-success/10 text-success",
  };

  const statusLabels = {
    new: "New",
    learning: "Learning",
    memorized: "Memorized",
  };

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const getFocusableElements = () => {
      if (!dialogRef.current) return [];

      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (shareSheetOpen) return;

      if (event.key === "Escape") onClose();

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, shareSheetOpen]);

  useEffect(() => {
    if (!statusMessage) return;

    const timeout = window.setTimeout(() => setStatusMessage(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  const handleStatusUpdate = (nextStatus: "learning" | "memorized") => {
    setSaving(true);

    try {
      const progress = loadProgress();
      const current = getNameProgress(progress, name.id);
      const updated = updateNameProgress(
        progress,
        name.id,
        nextStatus === "memorized"
          ? markMemorized(current)
          : markLearning(current)
      );

      saveProgress(updated);
      onStatusChange?.(nextStatus);
      setStatusMessage(
        nextStatus === "memorized"
          ? "Marked memorized."
          : "Moved back to learning."
      );
    } finally {
      setSaving(false);
    }
  };

  const shareTitle = `${name.transliteration} — ${name.meaning}`;
  const shareText = buildNameShareText(name);
  const shareUrl = buildNameShareUrl(name.id);
  const shareTargets = buildShareTargets(shareText, shareUrl, shareTitle);

  const handleShare = async () => {
    const fallbackText = `${shareText}\n\n${shareUrl}`;

    setSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        setShareSheetOpen(false);
        return;
      }

      await navigator.clipboard.writeText(fallbackText);
      setStatusMessage("Share text copied.");
      setShareSheetOpen(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(fallbackText);
        setStatusMessage("Share text copied.");
        setShareSheetOpen(false);
      } catch {
        setStatusMessage("Unable to share right now.");
      }
    } finally {
      setSharing(false);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await copyShareLink(shareUrl);
      setStatusMessage("Share link copied.");
      setShareSheetOpen(false);
    } catch {
      setStatusMessage("Unable to copy link.");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-5 backdrop-blur-md"
        onClick={onClose}
      >
        <div className="mx-auto flex min-h-full max-w-lg items-center justify-center">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`name-detail-title-${name.id}`}
            aria-describedby={`name-detail-description-${name.id}`}
            className="app-panel-strong relative w-full rounded-[2rem] px-6 py-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">
                  Name {String(name.id).padStart(2, "0")}
                </p>
                <span
                  className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${statusStyles[status]}`}
                >
                  {statusLabels[status]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShareSheetOpen(true)}
                  className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-text-muted transition hover:border-accent/40 hover:text-accent"
                >
                  Share
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close name details"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg leading-none text-text-muted transition hover:border-accent/40 hover:text-accent"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <ArabicText
                as="h2"
                id={`name-detail-title-${name.id}`}
                className="text-5xl leading-[1.55] text-white"
              >
                {name.arabic}
              </ArabicText>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                {name.transliteration}
              </p>
              <p className="mt-5 font-display text-3xl text-white">
                {name.meaning}
              </p>
              <p
                id={`name-detail-description-${name.id}`}
                className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary"
              >
                {name.description}
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <AudioButton src={name.audioFile} />
            </div>

            <div className="mt-7">
              {status === "memorized" ? (
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("learning")}
                  disabled={saving}
                  className="secondary-button w-full border-warning/20 bg-warning/10 text-warning"
                >
                  {saving ? "Updating..." : "Move Back To Learning"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("memorized")}
                  disabled={saving}
                  className="primary-button w-full"
                >
                  {saving ? "Updating..." : "Mark Memorized"}
                </button>
              )}
              <div aria-live="polite" className="mt-3 min-h-5 text-center">
                {statusMessage ? (
                  <p className="text-sm text-accent">{statusMessage}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareSheet
        open={shareSheetOpen}
        title={name.transliteration}
        subtitle="Share this Name with its own preview card."
        onClose={() => setShareSheetOpen(false)}
        actions={[
          {
            label: sharing ? "Sharing..." : "Share Link",
            hint: "Open the system share sheet when available.",
            onClick: handleShare,
          },
          {
            label: "Copy Link",
            hint: "Copy the direct share page for this Name.",
            onClick: handleCopyShareLink,
          },
          {
            label: "X",
            hint: "Post this Name with its preview card.",
            href: shareTargets.x,
          },
          {
            label: "WhatsApp",
            hint: "Send the Name in chat with the preview.",
            href: shareTargets.whatsapp,
          },
          {
            label: "Telegram",
            hint: "Share the Name and preview in Telegram.",
            href: shareTargets.telegram,
          },
          {
            label: "Email",
            hint: "Send the Name with its dedicated link.",
            href: shareTargets.email,
          },
        ]}
      />
    </>
  );
}

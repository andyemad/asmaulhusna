"use client";

import { useEffect, useRef } from "react";

interface ShareAction {
  label: string;
  hint: string;
  onClick?: () => void;
  href?: string;
}

interface ShareSheetProps {
  open: boolean;
  title: string;
  subtitle: string;
  actions: ShareAction[];
  onClose: () => void;
}

export default function ShareSheet({
  open,
  title,
  subtitle,
  actions,
  onClose,
}: ShareSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="mx-auto flex min-h-full max-w-lg items-end justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-sheet-title"
          aria-describedby="share-sheet-subtitle"
          className="w-full rounded-[2rem] border border-white/10 bg-[rgba(8,11,18,0.96)] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Share</p>
              <h2
                id="share-sheet-title"
                className="mt-2 font-display text-3xl text-white"
              >
                {title}
              </h2>
              <p
                id="share-sheet-subtitle"
                className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary"
              >
                {subtitle}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              Close
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {actions.map((action) =>
              action.href ? (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-accent/40 hover:bg-accent/5"
                >
                  <span className="block text-sm font-semibold text-white">
                    {action.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-text-muted">
                    {action.hint}
                  </span>
                </a>
              ) : (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-accent/40 hover:bg-accent/5"
                >
                  <span className="block text-sm font-semibold text-white">
                    {action.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-text-muted">
                    {action.hint}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

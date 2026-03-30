"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Milestone } from "@/lib/milestones";
import {
  generateCertificateImage,
  generateProgressImage,
  shareImage,
} from "@/lib/share";

interface MilestoneModalProps {
  milestone: Milestone;
  memorized: number;
  streak: number;
  onClose: () => void;
}

export default function MilestoneModal({
  milestone,
  memorized,
  streak,
  onClose,
}: MilestoneModalProps) {
  const [sharing, setSharing] = useState(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    continueButtonRef.current?.focus();

    confetti({
      particleCount: 120,
      spread: 72,
      origin: { y: 0.58 },
      colors: ["#f4dd9a", "#d7b067", "#b38436", "#79c69a", "#fff8eb"],
    });

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
  }, [onClose]);

  const handleShare = async () => {
    setSharing(true);

    try {
      const blob = milestone.isCompletion
        ? await generateCertificateImage(new Date().toLocaleDateString(), streak)
        : await generateProgressImage(memorized, streak);

      await shareImage(
        blob,
        milestone.title,
        undefined,
        milestone.isCompletion
          ? "asma-ul-husna-certificate.png"
          : "asma-ul-husna-milestone.png"
      );
    } catch {}

    setSharing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 p-5 backdrop-blur-md">
      <div className="mx-auto flex min-h-full max-w-lg items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="milestone-title"
          aria-describedby="milestone-description"
          className="app-panel-strong w-full rounded-[2rem] px-6 py-8 text-center"
        >
          <p className="section-kicker">Milestone Reached</p>
          <p className="mt-4 text-5xl">{milestone.emoji}</p>
          <h2 id="milestone-title" className="mt-4 font-display text-4xl text-white">
            {milestone.title}
          </h2>
          <p
            id="milestone-description"
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary"
          >
            {milestone.subtitle}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="stat-card">
              <span className="stat-value">{memorized}</span>
              <span className="stat-label">Names memorized</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{streak}</span>
              <span className="stat-label">Day streak</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              className="primary-button flex-1"
            >
              {sharing ? "Preparing Share..." : "Share Milestone"}
            </button>
            <button
              ref={continueButtonRef}
              type="button"
              onClick={onClose}
              className="secondary-button flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

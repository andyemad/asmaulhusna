"use client";

import { useState } from "react";
import { Name } from "@/lib/types";
import AudioButton from "./AudioButton";
import ArabicText from "./ArabicText";

interface FlashCardProps {
  name: Name;
  number: number;
  status: "new" | "learning" | "memorized";
  canAdvance: boolean;
  onNextCard: () => void;
  onSetMemorized: () => void;
  onSetStillLearning: () => void;
}

export default function FlashCard({
  name,
  number,
  status,
  canAdvance,
  onNextCard,
  onSetMemorized,
  onSetStillLearning,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const instructionId = `flashcard-instructions-${name.id}`;
  const isLearning = status === "learning";
  const isMemorized = status === "memorized";
  const statusMessage =
    status === "memorized"
      ? "This Name is marked memorized."
      : status === "learning"
        ? "This Name is marked for continued review."
        : "Choose a status before moving to the next card.";

  return (
    <div className="w-full">
      <button
        type="button"
        className="relative block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
        style={{ perspective: "2500px" }}
        onClick={() => setFlipped(!flipped)}
        aria-expanded={flipped}
        aria-describedby={instructionId}
      >
        {/* easeInOutSine — sinusoidal acceleration, so there is no jerk at the
            ends the way the default cubic-bezier has. With the longer duration
            it cuts peak angular velocity roughly in half. */}
        <div
          className="relative min-h-[340px] w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.37,0,0.63,1)] sm:min-h-[380px]"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="app-panel-strong flex min-h-[340px] flex-col items-center justify-center p-8 text-center sm:min-h-[380px] sm:p-10"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="absolute right-5 top-5 border-b border-accent/35 px-1 py-1 text-sm font-semibold tracking-[0.22em] text-accent/80">
              {String(number).padStart(2, "0")}
            </span>
            <p className="section-kicker">Flashcard</p>
            <ArabicText className="mt-6 text-5xl leading-[1.5] text-white sm:text-6xl">
              {name.arabic}
            </ArabicText>
            <p className="mt-4 text-base font-semibold uppercase tracking-[0.24em] text-accent">
              {name.transliteration}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              Tap the card to turn it over and reveal the meaning.
            </p>
          </div>

          {/* Back */}
          <div
            className="app-panel-strong absolute inset-0 flex h-full flex-col overflow-hidden p-8 text-center sm:p-10"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="absolute right-5 top-5 border-b border-accent/35 px-1 py-1 text-sm font-semibold tracking-[0.22em] text-accent/80">
              {String(number).padStart(2, "0")}
            </span>
            <p className="section-kicker">Meaning</p>
            <ArabicText className="mt-5 text-4xl leading-[1.45] text-white">
              {name.arabic}
            </ArabicText>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
              {name.transliteration}
            </p>
            <div className="mt-5 flex-1 overflow-y-auto border-t border-accent/15 pt-5">
              <p className="font-display text-3xl text-white">{name.meaning}</p>
              <p className="mx-auto mt-3 max-w-[24rem] text-sm leading-relaxed text-text-secondary">
                {name.description}
              </p>
            </div>
          </div>
        </div>
      </button>

      <p
        id={instructionId}
        className="mt-4 text-center text-sm text-text-secondary"
      >
        {flipped
          ? "Choose a status, then continue when you're ready."
          : "Tap the card to reveal the meaning."}
      </p>

      <div className="mt-5 flex justify-center">
        <AudioButton src={name.audioFile} />
      </div>

      <div className="mt-6 border-y border-accent/20 py-4">
        <div className="flex items-center justify-between gap-3 px-1">
          <p className="section-kicker">Study Status</p>
          <p className="text-xs text-text-muted">{statusMessage}</p>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onSetStillLearning}
            aria-pressed={isLearning}
            aria-label={`Mark ${name.transliteration} as still learning`}
            className={`border px-5 py-4 text-base font-semibold transition ${
              isLearning
                ? "border-warning/30 bg-warning/12 text-warning shadow-[0_16px_35px_rgba(197,138,47,0.16)]"
                : "border-white/10 bg-white/[0.02] text-text-secondary hover:border-warning/20 hover:bg-warning/6 hover:text-warning"
            }`}
          >
            {isLearning ? "Still Learning ✓" : "Still Learning"}
          </button>
          <button
            type="button"
            onClick={onSetMemorized}
            aria-pressed={isMemorized}
            aria-label={`Mark ${name.transliteration} as memorized`}
            className={`border px-5 py-4 text-base font-semibold transition ${
              isMemorized
                ? "border-success/30 bg-success/12 text-success shadow-[0_16px_35px_rgba(49,164,125,0.16)]"
                : "border-white/10 bg-white/[0.02] text-text-secondary hover:border-success/20 hover:bg-success/6 hover:text-success"
            }`}
          >
            {isMemorized ? "Memorized ✓" : "Memorized"}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onNextCard}
          disabled={!canAdvance}
          aria-label={`Go to the next flashcard after reviewing ${name.transliteration}`}
          className={`primary-button w-full ${!canAdvance ? "pointer-events-none opacity-50" : ""}`}
        >
          {canAdvance ? "Next Card" : "Choose Status First"}
        </button>
      </div>
    </div>
  );
}

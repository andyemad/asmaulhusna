"use client";

import { useRef, useState } from "react";
import { Name } from "@/lib/types";
import AudioButton from "./AudioButton";
import ArabicText from "./ArabicText";

interface FlashCardProps {
  name: Name;
  number: number;
  onGotIt: () => void;
  onMemorized: () => void;
  onStillLearning: () => void;
}

export default function FlashCard({
  name,
  number,
  onGotIt,
  onMemorized,
  onStillLearning,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef(0);
  const instructionId = `flashcard-instructions-${name.id}`;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) onGotIt();
      else onStillLearning();
    }
  };

  return (
    <div
      className="w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        className="relative block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
        aria-expanded={flipped}
        aria-describedby={instructionId}
      >
        <div
          className="relative min-h-[340px] w-full transition-transform duration-500 sm:min-h-[380px]"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="app-panel-strong flex min-h-[340px] flex-col items-center justify-center rounded-[1.8rem] p-8 text-center sm:min-h-[380px] sm:p-10"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="absolute right-5 top-5 rounded-full border border-accent/10 bg-accent/10 px-3 py-1 text-sm font-semibold tracking-[0.22em] text-accent/80">
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
            className="app-panel-strong absolute inset-0 flex h-full flex-col overflow-hidden rounded-[1.8rem] p-8 text-center sm:p-10"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="absolute right-5 top-5 rounded-full border border-accent/10 bg-accent/10 px-3 py-1 text-sm font-semibold tracking-[0.22em] text-accent/80">
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
          ? "Swipe right if you know it or left if you want more practice."
          : "Tap the card to reveal the meaning."}
      </p>

      {/* Audio */}
      <div className="flex justify-center mt-5">
        <AudioButton src={name.audioFile} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={onStillLearning}
          aria-label={`Mark ${name.transliteration} as still learning`}
          className="secondary-button flex-1 border-warning/20 bg-warning/10 text-warning"
        >
          Still Learning
        </button>
        <button
          onClick={onGotIt}
          aria-label={`Mark ${name.transliteration} as understood`}
          className="secondary-button flex-1 border-success/20 bg-success/10 text-success"
        >
          Got It ✓
        </button>
      </div>

      <button
        onClick={onMemorized}
        aria-label={`Mark ${name.transliteration} as memorized`}
        className="primary-button mt-3 w-full"
      >
        Mark Memorized
      </button>
    </div>
  );
}

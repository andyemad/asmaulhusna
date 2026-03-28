"use client";

import { useState, useRef } from "react";
import { Name } from "@/lib/types";
import AudioButton from "./AudioButton";

interface FlashCardProps {
  name: Name;
  number: number;
  onGotIt: () => void;
  onStillLearning: () => void;
}

export default function FlashCard({
  name,
  number,
  onGotIt,
  onStillLearning,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef(0);

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
    <div className="w-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Card */}
      <div
        className="relative cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="bg-surface border border-accent/20 rounded-2xl p-10 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="absolute top-4 right-5 text-3xl font-extrabold text-accent/10">
              {String(number).padStart(2, "0")}
            </span>
            <p className="font-arabic text-5xl text-white leading-relaxed">
              {name.arabic}
            </p>
            <p className="text-accent font-semibold tracking-wider text-lg mt-3">
              {name.transliteration.toUpperCase()}
            </p>
            <p className="text-text-muted text-xs mt-6">
              Tap to reveal meaning
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-surface border border-accent/20 rounded-2xl p-10 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="absolute top-4 right-5 text-3xl font-extrabold text-accent/10">
              {String(number).padStart(2, "0")}
            </span>
            <p className="font-arabic text-4xl text-white leading-relaxed">
              {name.arabic}
            </p>
            <p className="text-accent font-semibold tracking-wider mt-2">
              {name.transliteration.toUpperCase()}
            </p>
            <div className="mt-5 pt-5 border-t border-accent/15">
              <p className="text-white text-lg">{name.meaning}</p>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">
                {name.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audio */}
      <div className="flex justify-center mt-5">
        <AudioButton src={name.audioFile} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={onStillLearning}
          className="flex-1 bg-warning/15 text-warning py-3 rounded-xl text-sm font-medium"
        >
          Still Learning
        </button>
        <button
          onClick={onGotIt}
          className="flex-1 bg-success/15 text-success py-3 rounded-xl text-sm font-medium"
        >
          Got It ✓
        </button>
      </div>
    </div>
  );
}

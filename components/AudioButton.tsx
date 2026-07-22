"use client";

import { useEffect, useState } from "react";
import { getAudioPlayer } from "@/lib/audio";

interface AudioButtonProps {
  src: string;
  className?: string;
}

function normalizeSource(src: string): string {
  if (typeof window === "undefined") return src;
  try {
    return new URL(src, window.location.origin).pathname;
  } catch {
    return src;
  }
}

export default function AudioButton({ src, className = "" }: AudioButtonProps) {
  const [status, setStatus] = useState<"idle" | "playing" | "error">("idle");

  useEffect(() => {
    const audio = getAudioPlayer();
    const ownSource = normalizeSource(src);
    const syncStatus = () => {
      const currentSource = normalizeSource(audio.currentSrc);
      if (currentSource !== ownSource) return setStatus("idle");
      if (audio.error) return setStatus("error");
      setStatus(audio.paused ? "idle" : "playing");
    };

    syncStatus();
    audio.addEventListener("play", syncStatus);
    audio.addEventListener("pause", syncStatus);
    audio.addEventListener("ended", syncStatus);
    audio.addEventListener("error", syncStatus);
    return () => {
      audio.removeEventListener("play", syncStatus);
      audio.removeEventListener("pause", syncStatus);
      audio.removeEventListener("ended", syncStatus);
      audio.removeEventListener("error", syncStatus);
    };
  }, [src]);

  const handlePlay = async () => {
    const audio = getAudioPlayer();
    const ownSource = normalizeSource(src);
    const currentSource = normalizeSource(audio.currentSrc);
    if (currentSource === ownSource && !audio.paused) {
      audio.pause();
      return;
    }
    audio.src = src;
    audio.currentTime = 0;
    try {
      await audio.play();
      setStatus("playing");
    } catch {
      setStatus("error");
    }
  };

  const isUnavailable = status === "error";
  const label = isUnavailable
    ? "Audio unavailable"
    : status === "playing"
      ? "Playing"
      : "Listen";

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={
        isUnavailable
          ? "Audio unavailable"
          : status === "playing"
            ? "Playing, pause audio"
            : "Listen, play audio"
      }
      className={`inline-flex min-h-10 items-center gap-2.5 border-b px-1 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
        isUnavailable
          ? "border-error/40 text-error"
          : "border-accent/40 text-accent hover:border-accent hover:text-accent-start"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        {isUnavailable ? (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5v5.5M12 16.5h.01" />
          </>
        ) : status === "playing" ? (
          <>
            <path d="M9.5 8v8M14.5 8v8" />
            <circle cx="12" cy="12" r="9" opacity=".35" />
          </>
        ) : (
          <>
            <path d="M10 9v6l5 3V6z" />
            <path d="M16 9.5a4 4 0 0 1 0 5" />
          </>
        )}
      </svg>
      {label}
    </button>
  );
}

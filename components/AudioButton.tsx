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
      if (currentSource !== ownSource) {
        setStatus("idle");
        return;
      }

      if (audio.error) {
        setStatus("error");
        return;
      }

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

  return (
    <button
      onClick={handlePlay}
      aria-label={
        isUnavailable
          ? "Audio unavailable"
          : status === "playing"
            ? "Pause audio"
            : "Play audio"
      }
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm transition-colors ${
        isUnavailable
          ? "border border-error/20 bg-error/10 text-error"
          : "border border-accent/20 bg-accent/10 text-accent hover:bg-accent/15"
      } ${className}`}
    >
      {isUnavailable ? "!" : status === "playing" ? "⏸" : "🔊"}{" "}
      {isUnavailable
        ? "Audio unavailable"
        : status === "playing"
          ? "Playing..."
          : "Listen"}
    </button>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { getAudioPlayer } from "./audio";

export type AudioStatus = "idle" | "playing" | "error";

function normalizeSource(src: string): string {
  if (typeof window === "undefined") return src;
  try {
    return new URL(src, window.location.origin).pathname;
  } catch {
    return src;
  }
}

const AUDIO_EVENTS = ["play", "pause", "ended", "error"] as const;

/**
 * Tracks the shared audio element against one source, so any number of play
 * controls can render the state of the single Name currently sounding.
 */
export function useAudioStatus(src: string) {
  const [status, setStatus] = useState<AudioStatus>("idle");

  useEffect(() => {
    const audio = getAudioPlayer();
    const ownSource = normalizeSource(src);

    const syncStatus = () => {
      if (normalizeSource(audio.currentSrc) !== ownSource) return setStatus("idle");
      if (audio.error) return setStatus("error");
      setStatus(audio.paused ? "idle" : "playing");
    };

    syncStatus();
    AUDIO_EVENTS.forEach((event) => audio.addEventListener(event, syncStatus));
    return () =>
      AUDIO_EVENTS.forEach((event) => audio.removeEventListener(event, syncStatus));
  }, [src]);

  const toggle = useCallback(async () => {
    const audio = getAudioPlayer();

    if (
      normalizeSource(audio.currentSrc) === normalizeSource(src) &&
      !audio.paused
    ) {
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
  }, [src]);

  return { status, toggle };
}

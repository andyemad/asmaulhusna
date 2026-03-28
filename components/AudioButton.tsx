"use client";

import { useState, useRef } from "react";

interface AudioButtonProps {
  src: string;
  className?: string;
}

export default function AudioButton({ src, className = "" }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("ended", () => setPlaying(false));
      audioRef.current.addEventListener("error", () => setPlaying(false));
    } else {
      audioRef.current.src = src;
    }

    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  return (
    <button
      onClick={handlePlay}
      className={`inline-flex items-center gap-2 bg-accent/15 text-accent px-5 py-2 rounded-full text-sm transition-colors hover:bg-accent/25 ${className}`}
    >
      {playing ? "⏸" : "🔊"} {playing ? "Playing..." : "Listen"}
    </button>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { names } from "@/lib/names";
import { RecitationTimestamp } from "@/lib/types";
import timestampsData from "@/data/recitation-timestamps.json";
import NameCard from "@/components/NameCard";

const timestamps: RecitationTimestamp[] =
  timestampsData as RecitationTimestamp[];

export default function RecitationPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const repeatRef = useRef(false);

  const currentName = names[currentNameIndex] || names[0];

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  useEffect(() => {
    const audio = new Audio("/audio/recitation.mp3");
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () =>
      setDuration(audio.duration)
    );
    audio.addEventListener("ended", () => {
      if (repeatRef.current) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setPlaying(false);
      }
    });

    return () => {
      audio.pause();
      audio.src = "";
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const syncLoop = useCallback(() => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setCurrentTime(t);

    if (timestamps.length > 0) {
      const idx = timestamps.findIndex(
        (ts) => t >= ts.startTime - 0.2 && t < ts.endTime + 0.2
      );
      if (idx !== -1) setCurrentNameIndex(idx);
    }

    rafRef.current = requestAnimationFrame(syncLoop);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      cancelAnimationFrame(rafRef.current);
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true);
        rafRef.current = requestAnimationFrame(syncLoop);
      });
    }
  };

  const skipPrev = () => {
    const newIndex = Math.max(0, currentNameIndex - 1);
    setCurrentNameIndex(newIndex);
    if (timestamps[newIndex] && audioRef.current) {
      audioRef.current.currentTime = timestamps[newIndex].startTime;
    }
  };

  const skipNext = () => {
    const newIndex = Math.min(names.length - 1, currentNameIndex + 1);
    setCurrentNameIndex(newIndex);
    if (timestamps[newIndex] && audioRef.current) {
      audioRef.current.currentTime = timestamps[newIndex].startTime;
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 pt-8">
      <p className="text-text-muted text-[10px] tracking-[3px] uppercase mb-6">
        NOW RECITING
      </p>

      <NameCard name={currentName} size="lg" />
      <p className="text-text-muted text-xs mt-1">
        {currentNameIndex + 1} of 99
      </p>

      <div className="flex items-center gap-2 w-full mt-8">
        <span className="text-[11px] text-text-muted">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-start to-accent rounded-full transition-all"
            style={{
              width:
                duration > 0
                  ? `${(currentTime / duration) * 100}%`
                  : "0%",
            }}
          />
        </div>
        <span className="text-[11px] text-text-muted">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center gap-8 mt-6">
        <button onClick={skipPrev} className="text-text-muted text-xl">
          ⏮
        </button>
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-accent flex items-center justify-center"
        >
          <span className="text-white text-2xl">
            {playing ? "⏸" : "▶"}
          </span>
        </button>
        <button onClick={skipNext} className="text-text-muted text-xl">
          ⏭
        </button>
      </div>

      <button
        onClick={() => setRepeat(!repeat)}
        className={`mt-4 text-xs px-4 py-1.5 rounded-full transition-colors ${
          repeat
            ? "bg-accent/15 text-accent"
            : "bg-surface text-text-muted"
        }`}
      >
        🔁 Repeat: {repeat ? "On" : "Off"}
      </button>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NameCard from "@/components/NameCard";
import { names } from "@/lib/names";
import { getAudioPlayer } from "@/lib/audio";

function PlayerIcon({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export default function RecitationPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentNameIndexRef = useRef(0);
  const playingRef = useRef(false);
  const repeatRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);

  const currentName = names[currentNameIndex] || names[0];

  useEffect(() => {
    currentNameIndexRef.current = currentNameIndex;
  }, [currentNameIndex]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  const loadTrack = useCallback(async (nextIndex: number, shouldAutoplay: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedIndex = Math.min(Math.max(nextIndex, 0), names.length - 1);
    const nextName = names[clampedIndex];

    audio.pause();
    audio.src = nextName.audioFile;
    audio.currentTime = 0;
    audio.load();

    setCurrentNameIndex(clampedIndex);
    setCurrentTime(0);
    setDuration(0);
    setAudioUnavailable(false);

    if (!shouldAutoplay) {
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setAudioUnavailable(true);
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const audio = getAudioPlayer();
    audio.pause();
    audio.preload = "metadata";
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioUnavailable(false);
    };

    const handleEnded = () => {
      if (currentNameIndexRef.current < names.length - 1) {
        void loadTrack(currentNameIndexRef.current + 1, true);
        return;
      }

      if (repeatRef.current) {
        void loadTrack(0, true);
      } else {
        setPlaying(false);
      }
    };

    const handleError = () => {
      setAudioUnavailable(true);
      setPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    void loadTrack(0, false);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [loadTrack]);

  const togglePlay = () => {
    if (!audioRef.current || audioUnavailable) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    audioRef.current
      .play()
      .then(() => {
        setPlaying(true);
        setAudioUnavailable(false);
      })
      .catch(() => setAudioUnavailable(true));
  };

  const jumpToIndex = (nextIndex: number) => {
    void loadTrack(nextIndex, playingRef.current);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const progressPercent =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <div className="px-5 pt-8 pb-10">
      <section className="app-panel-strong rounded-[2rem] px-6 py-7">
        <p className="section-kicker">Recitation</p>
        <h1 className="mt-4 font-display text-4xl text-white">
          Listen Through The Full Sequence
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
          Follow the continuous recitation while the currently spoken name
          stays in focus. Skip backward or forward when you want to repeat a
          section.
        </p>

        <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-black/20 px-5 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Current Name</p>
              <p className="mt-2 text-sm text-text-secondary">
                Name {currentNameIndex + 1} of 99
              </p>
            </div>
            <div className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {playing ? "Playing" : "Paused"}
            </div>
          </div>

          <div className="mt-5">
            <NameCard name={currentName} size="lg" />
          </div>

          {audioUnavailable ? (
            <div className="mt-5 rounded-[1.4rem] border border-error/20 bg-error/10 px-4 py-4">
              <p className="text-sm font-semibold text-error">
                Recitation audio is unavailable
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                The audio player could not load
                {" "}
                <span className="font-medium text-white">
                  {currentName.audioFile}
                </span>
                .
              </p>
            </div>
          ) : null}

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-4 text-xs text-text-muted">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white/5"
              role="progressbar"
              aria-label="Recitation playback progress"
              aria-valuemin={0}
              aria-valuemax={duration || 0}
              aria-valuenow={currentTime}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-start via-accent-mid to-accent transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => jumpToIndex(currentNameIndex - 1)}
              disabled={audioUnavailable}
              aria-label="Play the previous name"
              className="secondary-button h-14 w-14 rounded-full p-0 disabled:opacity-50"
            >
              <PlayerIcon path="M15 18 9 12l6-6M20 18l-6-6 6-6" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              disabled={audioUnavailable}
              aria-label={playing ? "Pause recitation" : "Play recitation"}
              className="primary-button h-16 w-16 rounded-full p-0 disabled:opacity-50"
            >
              {playing ? (
                <PlayerIcon path="M10 7v10M14 7v10" className="h-7 w-7" />
              ) : (
                <PlayerIcon path="m9 7 8 5-8 5z" className="h-7 w-7 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={() => jumpToIndex(currentNameIndex + 1)}
              disabled={audioUnavailable}
              aria-label="Play the next name"
              className="secondary-button h-14 w-14 rounded-full p-0 disabled:opacity-50"
            >
              <PlayerIcon path="m9 18 6-6-6-6M4 18l6-6-6-6" className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setRepeat((previous) => !previous)}
              disabled={audioUnavailable}
              aria-pressed={repeat}
              className={
                repeat
                  ? "rounded-full border border-accent/25 bg-accent/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent disabled:opacity-50"
                  : "rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-muted transition hover:border-accent/25 hover:text-accent disabled:opacity-50"
              }
            >
              Repeat {repeat ? "On" : "Off"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

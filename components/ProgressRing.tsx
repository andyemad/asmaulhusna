"use client";

import { useEffect, useState } from "react";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  value,
  max,
  size = 164,
  strokeWidth = 8,
}: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const inset = strokeWidth / 2 + 8;
  const radius = (size - inset * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = max > 0 ? animatedValue / max : 0;
  const offset = circumference - progress * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-white/[0.02] shadow-[0_24px_70px_rgba(0,0,0,0.24)]" />
      <div className="absolute inset-[10px] rounded-full border border-white/8 bg-[rgba(20,26,44,0.92)]" />
      <svg width={size} height={size} className="relative -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(244,221,154,0.12)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#d7b067"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold leading-none text-white">
          {value}
          <span className="ml-1 text-sm font-normal text-text-muted">/{max}</span>
        </span>
        <span className="mt-2 text-[10px] tracking-[0.28em] text-text-muted">
          MEMORIZED
        </span>
      </div>
    </div>
  );
}

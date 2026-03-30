"use client";

import { useState } from "react";
import { generateProgressImage, shareImage } from "@/lib/share";

interface ShareCardProps {
  memorized: number;
  streak: number;
}

export default function ShareCard({ memorized, streak }: ShareCardProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await generateProgressImage(memorized, streak);
      await shareImage(
        blob,
        `I've memorized ${memorized}/99 Names of Allah!`
      );
    } catch {}
    setSharing(false);
  };

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      aria-label="Share your memorization progress"
      title="Share your memorization progress"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary transition hover:border-accent/40 hover:text-accent"
    >
      {sharing ? "Sharing" : "Share"}
    </button>
  );
}

"use client";

import { useState } from "react";
import { generateProgressImage, shareImage } from "@/lib/share";

interface ShareCardProps {
  memorized: number;
  streak: number;
  onClick?: () => void;
}

export default function ShareCard({
  memorized,
  streak,
  onClick,
}: ShareCardProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (onClick) {
      onClick();
      return;
    }

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
      disabled={!onClick && sharing}
      aria-label="Share your memorization progress"
      title="Share your memorization progress"
      className="inline-flex items-center gap-2 border-b border-accent/40 px-1 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary transition hover:border-accent hover:text-accent"
    >
      {sharing ? "Sharing" : "Share"}
    </button>
  );
}

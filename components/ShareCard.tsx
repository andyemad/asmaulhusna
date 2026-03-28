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
      className="text-text-muted hover:text-accent transition-colors text-lg"
      title="Share progress"
    >
      {sharing ? "..." : "📤"}
    </button>
  );
}

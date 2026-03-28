"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Milestone } from "@/lib/milestones";
import {
  generateCertificateImage,
  generateProgressImage,
  shareImage,
} from "@/lib/share";

interface MilestoneModalProps {
  milestone: Milestone;
  memorized: number;
  streak: number;
  onClose: () => void;
}

export default function MilestoneModal({
  milestone,
  memorized,
  streak,
  onClose,
}: MilestoneModalProps) {
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#22c55e", "#eab308"],
    });
  }, []);

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = milestone.isCompletion
        ? await generateCertificateImage(
            new Date().toLocaleDateString(),
            streak
          )
        : await generateProgressImage(memorized, streak);
      await shareImage(blob, milestone.title);
    } catch {}
    setSharing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
      <div className="bg-[#111] border border-accent/20 rounded-2xl p-8 max-w-sm w-full text-center">
        <p className="text-5xl mb-4">{milestone.emoji}</p>
        <h2 className="text-xl font-bold text-white">
          {milestone.title}
        </h2>
        <p className="text-text-secondary text-sm mt-2">
          {milestone.subtitle}
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 bg-accent text-white py-3 rounded-xl text-sm font-semibold"
          >
            {sharing ? "Sharing..." : "📤 Share"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-surface border border-white/10 text-white py-3 rounded-xl text-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

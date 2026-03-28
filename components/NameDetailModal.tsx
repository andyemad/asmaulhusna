"use client";

import { Name } from "@/lib/types";
import AudioButton from "./AudioButton";

interface NameDetailModalProps {
  name: Name;
  status: "new" | "learning" | "memorized";
  onClose: () => void;
}

export default function NameDetailModal({
  name,
  status,
  onClose,
}: NameDetailModalProps) {
  const statusColors = {
    new: "text-text-muted bg-white/5",
    learning: "text-warning bg-warning/10",
    memorized: "text-success bg-success/10",
  };
  const statusLabels = {
    new: "New",
    learning: "Learning",
    memorized: "Memorized ✓",
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute top-4 right-5 text-3xl font-extrabold text-accent/10">
          {String(name.id).padStart(2, "0")}
        </span>
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full mb-4 ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
        <p className="font-arabic text-5xl text-white leading-relaxed">
          {name.arabic}
        </p>
        <p className="text-accent font-semibold tracking-wider text-lg mt-2">
          {name.transliteration.toUpperCase()}
        </p>
        <p className="text-white text-lg mt-4">{name.meaning}</p>
        <p className="text-text-muted text-sm mt-2 leading-relaxed">
          {name.description}
        </p>
        <div className="mt-5">
          <AudioButton src={name.audioFile} />
        </div>
        <button
          onClick={onClose}
          className="mt-5 text-text-muted text-sm hover:text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

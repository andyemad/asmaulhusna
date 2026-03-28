"use client";

import { getNameOfTheDay } from "@/lib/names";
import { shareText } from "@/lib/share";
import NameCard from "./NameCard";
import AudioButton from "./AudioButton";

export default function NameOfTheDay() {
  const name = getNameOfTheDay();

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5">
      <p className="text-[10px] text-text-muted tracking-[3px] uppercase text-center mb-3">
        Name of the Day
      </p>
      <NameCard name={name} size="md" />
      <p className="text-xs text-text-muted text-center mt-3 leading-relaxed">
        {name.description}
      </p>
      <div className="flex justify-center items-center mt-3">
        <AudioButton src={name.audioFile} />
        <button
          onClick={() =>
            shareText(
              `Today's Name of Allah: ${name.transliteration} (${name.arabic}) — ${name.meaning}`,
              "https://asma-ul-husna.vercel.app"
            )
          }
          className="text-text-muted hover:text-accent text-sm ml-2"
        >
          📤
        </button>
      </div>
    </div>
  );
}

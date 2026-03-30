"use client";

import { useEffect, useState } from "react";
import { getNameOfTheDay } from "@/lib/names";
import { shareText } from "@/lib/share";
import { Name } from "@/lib/types";
import NameCard from "./NameCard";
import AudioButton from "./AudioButton";

export default function NameOfTheDay() {
  const [name, setName] = useState<Name | null>(null);

  useEffect(() => {
    setName(getNameOfTheDay());
  }, []);

  if (!name) {
    return (
      <div className="app-panel rounded-[1.75rem] p-6">
        <p className="section-kicker text-center">
          Name of the Day
        </p>
        <div className="animate-pulse text-center">
          <div className="mx-auto h-10 w-40 rounded-full bg-white/5" />
          <div className="mx-auto mt-3 h-4 w-28 rounded-full bg-white/5" />
          <div className="mx-auto mt-4 h-16 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="app-panel rounded-[1.75rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">Name of the Day</p>
          <h2 className="mt-2 font-display text-3xl text-white">
            Today&apos;s name
          </h2>
        </div>
        <button
          onClick={() =>
            shareText(
              `Today's Name of Allah: ${name.transliteration} (${name.arabic}) — ${name.meaning}`,
              "https://asma-ul-husna.vercel.app"
            )
          }
          aria-label={`Share today's name: ${name.transliteration}`}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary transition hover:border-accent/40 hover:text-accent"
        >
          Share
        </button>
      </div>
      <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
        <NameCard name={name} size="md" className="mt-3" />
        <p className="mt-4 text-center text-sm leading-relaxed text-text-secondary">
          {name.description}
        </p>
        <div className="mt-5 flex justify-center">
          <AudioButton src={name.audioFile} />
        </div>
      </div>
    </div>
  );
}

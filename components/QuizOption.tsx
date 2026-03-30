"use client";

import ArabicText from "@/components/ArabicText";
import { Name } from "@/lib/types";

interface QuizOptionProps {
  name: Name;
  displayField: "meaning" | "arabic";
  state: "default" | "correct" | "wrong";
  disabled: boolean;
  onClick: () => void;
}

export default function QuizOption({
  name,
  displayField,
  state,
  disabled,
  onClick,
}: QuizOptionProps) {
  const containerStyles = {
    default:
      "border-white/10 bg-white/[0.03] text-white hover:border-accent/30 hover:bg-accent/5",
    correct: "border-success/30 bg-success/10 text-success",
    wrong: "border-error/30 bg-error/10 text-error",
  };

  const transliterationStyles = {
    default: "text-text-muted",
    correct: "text-success",
    wrong: "text-error",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-[1.45rem] border px-5 py-5 transition ${
        containerStyles[state]
      }`}
    >
      {displayField === "arabic" ? (
        <span className="flex flex-col items-center justify-center gap-2">
          <ArabicText className="text-4xl leading-[1.45] text-white">
            {name.arabic}
          </ArabicText>
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${
              transliterationStyles[state]
            }`}
          >
            {name.transliteration}
          </span>
        </span>
      ) : (
        <span className="flex items-center justify-between gap-4 text-left">
          <span className="max-w-[85%] text-lg leading-relaxed text-white">
            {name.meaning}
          </span>
          {state === "correct" ? (
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-success">
              Correct
            </span>
          ) : state === "wrong" ? (
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-error">
              Missed
            </span>
          ) : null}
        </span>
      )}
    </button>
  );
}

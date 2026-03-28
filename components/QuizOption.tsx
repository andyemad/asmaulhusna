"use client";

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
  const base =
    "w-full text-left px-5 py-4 rounded-xl text-[15px] transition-colors border";

  const styles = {
    default:
      "bg-surface border-white/10 text-white/80 hover:border-white/20",
    correct: "bg-success/10 border-success/40 text-success",
    wrong: "bg-error/10 border-error/40 text-error",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[state]}`}
    >
      {state === "correct" && "✓ "}
      {displayField === "arabic" ? (
        <span className="font-arabic text-lg">{name.arabic}</span>
      ) : (
        name.meaning
      )}
    </button>
  );
}

import { Name } from "@/lib/types";
import ArabicText from "./ArabicText";

interface NameCardProps {
  name: Name;
  showMeaning?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { arabic: "text-xl", trans: "text-xs", meaning: "text-xs" },
  md: { arabic: "text-3xl", trans: "text-sm", meaning: "text-sm" },
  lg: { arabic: "text-5xl", trans: "text-base", meaning: "text-base" },
};

export default function NameCard({
  name,
  showMeaning = true,
  size = "md",
  className = "",
}: NameCardProps) {
  const s = sizes[size];
  return (
    <div className={`text-center ${className}`}>
      <ArabicText
        className={`${s.arabic} leading-[1.45] text-white`}
      >
        {name.arabic}
      </ArabicText>
      <p
        className={`${s.trans} mt-2 font-semibold uppercase tracking-[0.22em] text-accent`}
      >
        {name.transliteration}
      </p>
      {showMeaning && (
        <p className={`${s.meaning} mt-2 text-text-secondary`}>
          {name.meaning}
        </p>
      )}
    </div>
  );
}

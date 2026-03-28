import { Name } from "@/lib/types";

interface NameCardProps {
  name: Name;
  showMeaning?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { arabic: "text-xl", trans: "text-xs", meaning: "text-xs" },
  md: { arabic: "text-3xl", trans: "text-sm", meaning: "text-sm" },
  lg: { arabic: "text-5xl", trans: "text-lg", meaning: "text-base" },
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
      <p className={`font-arabic ${s.arabic} text-white leading-relaxed`}>
        {name.arabic}
      </p>
      <p
        className={`${s.trans} text-accent font-semibold tracking-wider mt-1`}
      >
        {name.transliteration.toUpperCase()}
      </p>
      {showMeaning && (
        <p className={`${s.meaning} text-text-secondary mt-1`}>
          {name.meaning}
        </p>
      )}
    </div>
  );
}

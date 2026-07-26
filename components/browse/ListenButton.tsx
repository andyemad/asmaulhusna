"use client";

import { useAudioStatus } from "@/lib/use-audio-status";

interface ListenButtonProps {
  src: string;
  name: string;
}

/**
 * Icon-only pronunciation control for browse cells — hearing a Name should
 * not require opening its detail view.
 */
export default function ListenButton({ src, name }: ListenButtonProps) {
  const { status, toggle } = useAudioStatus(src);
  const isUnavailable = status === "error";

  return (
    <button
      type="button"
      onClick={toggle}
      data-playing={status === "playing"}
      data-unavailable={isUnavailable}
      aria-label={
        isUnavailable
          ? `Audio unavailable for ${name}`
          : status === "playing"
            ? `Pause ${name}`
            : `Hear ${name} pronounced`
      }
      className="folio-listen folio-above shrink-0"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[17px] w-[17px]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        {isUnavailable ? (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5v5.5M12 16.5h.01" />
          </>
        ) : status === "playing" ? (
          <path d="M9.5 8v8M14.5 8v8" />
        ) : (
          <>
            <path d="M10 9v6l5 3V6z" />
            <path d="M16 9.5a4 4 0 0 1 0 5" />
          </>
        )}
      </svg>
    </button>
  );
}

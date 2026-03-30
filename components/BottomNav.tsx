"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
  {
    href: "/flashcards",
    label: "Cards",
    icon: (
      <>
        <rect
          x="5"
          y="6"
          width="11"
          height="13"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="9"
          y="4"
          width="10"
          height="13"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </>
    ),
  },
  {
    href: "/quiz",
    label: "Quiz",
    icon: (
      <path
        d="M9.2 9a2.8 2.8 0 1 1 4.8 2c-.9.9-1.8 1.5-1.8 3M12 18.2h.01"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    ),
  },
  {
    href: "/browse",
    label: "Browse",
    icon: (
      <>
        <path
          d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v15H7.5A2.5 2.5 0 0 0 5 21z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </>
    ),
  },
  {
    href: "/recitation",
    label: "Listen",
    icon: (
      <>
        <path
          d="M10 9v6l5 3V6z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M15.5 9.5a4 4 0 0 1 0 5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.25rem)] max-w-xl -translate-x-1/2 rounded-[1.75rem] border border-white/10 bg-[rgba(8,11,18,0.88)] shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="mx-auto flex justify-around px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-[60px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] transition-colors ${
                active
                  ? "bg-accent/10 text-accent shadow-[inset_0_0_0_1px_rgba(244,221,154,0.18)]"
                  : "text-text-muted hover:text-white"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.03]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  {tab.icon}
                </svg>
              </span>
              <span className="tracking-[0.16em] uppercase">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

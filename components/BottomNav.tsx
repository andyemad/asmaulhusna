"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    path: <path d="M4.5 11.5 12 5l7.5 6.5V20h-5v-5h-5v5h-5z" />,
  },
  {
    href: "/flashcards",
    label: "Study",
    path: (
      <>
        <rect x="5" y="6" width="11" height="13" rx="1.5" />
        <path d="M9 6V4h10v13h-3" />
      </>
    ),
  },
  {
    href: "/quiz",
    label: "Quiz",
    path: (
      <>
        <path d="M9.3 9.2a2.7 2.7 0 1 1 4.7 1.9c-.9.9-1.8 1.5-1.8 2.9" />
        <path d="M12 18.3h.01" />
      </>
    ),
  },
  {
    href: "/browse",
    label: "Names",
    path: (
      <>
        <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v15H7.5A2.5 2.5 0 0 0 5 21z" />
        <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19" />
      </>
    ),
  },
  {
    href: "/recitation",
    label: "Listen",
    path: (
      <>
        <path d="M9.5 9v6l5 3V6z" />
        <path d="M16 9.5a4 4 0 0 1 0 5" />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-1rem)] max-w-[42rem] -translate-x-1/2 border border-accent/20 bg-[rgba(4,13,18,0.9)] shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:bottom-auto lg:left-[calc(50%+25rem)] lg:top-1/2 lg:w-[4.5rem] lg:translate-x-0 lg:-translate-y-1/2"
    >
      <div className="mx-auto grid grid-cols-5 px-1 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-1 lg:grid-cols-1 lg:pb-1">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-[3.7rem] flex-col items-center justify-center gap-1 px-1 text-[9px] font-bold uppercase tracking-[0.16em] transition-colors ${
                active ? "text-accent-start" : "text-text-muted hover:text-white"
              }`}
            >
              {active ? (
                <span className="absolute inset-x-3 top-0 h-px bg-accent shadow-[0_0_12px_rgba(215,182,111,0.75)] lg:inset-y-2 lg:left-0 lg:right-auto lg:h-auto lg:w-px" />
              ) : null}
              <svg
                viewBox="0 0 24 24"
                className="h-[19px] w-[19px]"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.45"
              >
                {tab.path}
              </svg>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

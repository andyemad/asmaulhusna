import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Manrope,
  Noto_Naskh_Arabic,
} from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const arabicFont = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asma ul Husna — 99 Names of Allah",
  description:
    "Memorize the 99 Beautiful Names of Allah with flashcards, quizzes, and spaced repetition.",
  applicationName: "Asma ul Husna",
  manifest: "/manifest.json",
  keywords: [
    "99 Names of Allah",
    "Asma ul Husna",
    "Islamic study app",
    "memorization app",
    "flashcards",
  ],
  openGraph: {
    title: "Asma ul Husna — 99 Names of Allah",
    description:
      "Memorize the 99 Beautiful Names of Allah with flashcards, quizzes, and spaced repetition.",
    type: "website",
    siteName: "Asma ul Husna",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asma ul Husna — 99 Names of Allah",
    description:
      "Memorize the 99 Beautiful Names of Allah with flashcards, quizzes, and spaced repetition.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${arabicFont.variable} ${displayFont.variable} ${bodyFont.variable}`}
    >
      <body className="min-h-screen bg-[#050816] font-sans text-text-primary antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <main id="main-content" className="pb-32 max-w-xl mx-auto">
          {children}
        </main>
        <BottomNav />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}

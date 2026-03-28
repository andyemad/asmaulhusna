import type { Metadata, Viewport } from "next";
import { Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const arabicFont = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asma ul Husna — 99 Names of Allah",
  description:
    "Memorize the 99 Beautiful Names of Allah with flashcards, quizzes, and spaced repetition.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={arabicFont.variable}>
      <body className="bg-[#0a0a0a] text-white min-h-screen antialiased">
        <main className="pb-20 max-w-lg mx-auto">{children}</main>
        <BottomNav />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}

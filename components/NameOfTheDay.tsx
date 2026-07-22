"use client";

import { useEffect, useState } from "react";
import { getNameOfTheDay } from "@/lib/names";
import {
  buildNameShareText,
  buildNameShareUrl,
  buildShareTargets,
  copyShareLink,
} from "@/lib/share";
import { Name } from "@/lib/types";
import AudioButton from "./AudioButton";
import NameCard from "./NameCard";
import ShareSheet from "./ShareSheet";

export default function NameOfTheDay() {
  const [name, setName] = useState<Name | null>(null);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => setName(getNameOfTheDay()), []);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = window.setTimeout(() => setStatusMessage(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  if (!name) {
    return (
      <div className="app-panel min-h-[28rem] p-8">
        <p className="section-kicker text-center">Name of the day</p>
        <div className="animate-pulse pt-24 text-center">
          <div className="mx-auto h-16 w-48 bg-white/5" />
          <div className="mx-auto mt-4 h-4 w-28 bg-white/5" />
        </div>
      </div>
    );
  }

  const shareTitle = `${name.transliteration} — ${name.meaning}`;
  const shareText = buildNameShareText(name);
  const shareUrl = buildNameShareUrl(name.id);
  const shareTargets = buildShareTargets(
    shareText,
    shareUrl,
    `Today's Name of Allah: ${shareTitle}`
  );

  const handleShare = async () => {
    const fallbackText = `${shareText}\n\n${shareUrl}`;
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShareSheetOpen(false);
        return;
      }
      await navigator.clipboard.writeText(fallbackText);
      setStatusMessage("Share text copied.");
      setShareSheetOpen(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(fallbackText);
        setStatusMessage("Share text copied.");
        setShareSheetOpen(false);
      } catch {
        setStatusMessage("Unable to share right now.");
      }
    } finally {
      setSharing(false);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await copyShareLink(shareUrl);
      setStatusMessage("Share link copied.");
      setShareSheetOpen(false);
    } catch {
      setStatusMessage("Unable to copy link.");
    }
  };

  return (
    <>
      <section className="app-panel-strong px-6 py-8 sm:px-10 sm:py-11">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Name of the day</p>
            <p className="mt-2 text-xs text-text-muted">A moment for contemplation</p>
          </div>
          <button
            type="button"
            onClick={() => setShareSheetOpen(true)}
            aria-label={`Share today's name: ${name.transliteration}`}
            className="border-b border-accent/35 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary transition hover:border-accent hover:text-accent"
          >
            Share
          </button>
        </div>

        <div className="relative mx-auto my-10 max-w-lg py-8 text-center sm:my-14">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10 shadow-[0_0_80px_rgba(215,182,111,0.06)]"
          />
          <div className="relative z-10">
            <NameCard name={name} size="lg" />
          </div>
        </div>

        <div className="ornament-rule text-[8px]">
          <span>◆</span>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center font-display text-xl leading-8 text-text-secondary sm:text-2xl sm:leading-9">
          {name.description}
        </p>
        <div className="mt-7 flex justify-center">
          <AudioButton src={name.audioFile} />
        </div>
        <div aria-live="polite" className="mt-4 min-h-5 text-center">
          {statusMessage ? (
            <p className="text-xs text-accent">{statusMessage}</p>
          ) : null}
        </div>
      </section>

      <ShareSheet
        open={shareSheetOpen}
        title={name.transliteration}
        subtitle="Share today's Name with its own preview card."
        onClose={() => setShareSheetOpen(false)}
        actions={[
          {
            label: sharing ? "Sharing..." : "Share Name",
            hint: "Open the system share sheet with this Name's page.",
            onClick: handleShare,
          },
          {
            label: "Copy Link",
            hint: "Copy the direct share page for today's Name.",
            onClick: handleCopyShareLink,
          },
          {
            label: "X",
            hint: "Post this Name with its preview card.",
            href: shareTargets.x,
          },
          {
            label: "WhatsApp",
            hint: "Send today's Name in chat with the preview.",
            href: shareTargets.whatsapp,
          },
          {
            label: "Telegram",
            hint: "Share the Name and preview in Telegram.",
            href: shareTargets.telegram,
          },
          {
            label: "Email",
            hint: "Send today's Name with its dedicated link.",
            href: shareTargets.email,
          },
        ]}
      />
    </>
  );
}

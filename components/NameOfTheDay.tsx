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
import NameCard from "./NameCard";
import AudioButton from "./AudioButton";
import ShareSheet from "./ShareSheet";

export default function NameOfTheDay() {
  const [name, setName] = useState<Name | null>(null);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(getNameOfTheDay());
  }, []);

  useEffect(() => {
    if (!statusMessage) return;

    const timeout = window.setTimeout(() => setStatusMessage(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  if (!name) {
    return (
      <div className="app-panel rounded-[1.75rem] p-6">
        <p className="section-kicker text-center">
          Name of the Day
        </p>
        <div className="animate-pulse text-center">
          <div className="mx-auto h-10 w-40 rounded-full bg-white/5" />
          <div className="mx-auto mt-3 h-4 w-28 rounded-full bg-white/5" />
          <div className="mx-auto mt-4 h-16 w-full rounded-2xl bg-white/5" />
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
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

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
      <div className="app-panel rounded-[1.75rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Name of the Day</p>
            <h2 className="mt-2 font-display text-3xl text-white">
              Today&apos;s name
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShareSheetOpen(true)}
            aria-label={`Share today's name: ${name.transliteration}`}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary transition hover:border-accent/40 hover:text-accent"
          >
            Share
          </button>
        </div>
        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
          <NameCard name={name} size="md" className="mt-3" />
          <p className="mt-4 text-center text-sm leading-relaxed text-text-secondary">
            {name.description}
          </p>
          <div className="mt-5 flex justify-center">
            <AudioButton src={name.audioFile} />
          </div>
        </div>
        <div aria-live="polite" className="mt-4 min-h-5 text-center">
          {statusMessage ? (
            <p className="text-sm text-accent">{statusMessage}</p>
          ) : null}
        </div>
      </div>

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

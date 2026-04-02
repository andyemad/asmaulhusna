import type { Metadata } from "next";
import Link from "next/link";
import ArabicText from "@/components/ArabicText";
import { getNameById } from "@/lib/names";
import {
  buildNameShareImageUrlForServer,
  buildNameShareText,
  buildNameShareUrlForServer,
  parseNameSharePayload,
} from "@/lib/share";

type NameSharePageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function getSharedName(
  searchParams: Record<string, string | string[] | undefined>
) {
  const { id } = parseNameSharePayload(searchParams);
  return getNameById(id) ?? getNameById(1)!;
}

export function generateMetadata({
  searchParams,
}: NameSharePageProps): Metadata {
  const name = getSharedName(searchParams);
  const title = `${name.transliteration} — ${name.meaning}`;
  const description = buildNameShareText(name);
  const url = buildNameShareUrlForServer(name.id);
  const image = buildNameShareImageUrlForServer(name.id);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function NameSharePage({ searchParams }: NameSharePageProps) {
  const name = getSharedName(searchParams);

  return (
    <div className="px-5 py-10">
      <section className="app-panel-strong overflow-hidden rounded-[2.2rem] px-6 py-8 text-center">
        <p className="section-kicker">Asma ul Husna</p>

        <div className="mt-8">
          <ArabicText
            as="h1"
            className="text-6xl leading-[1.4] text-white sm:text-7xl"
          >
            {name.arabic}
          </ArabicText>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.26em] text-accent">
            {name.transliteration}
          </p>
          <p className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl">
            {name.meaning}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-accent/15 bg-black/20 px-6 py-6">
          <p className="section-kicker">
            Name {String(name.id).padStart(2, "0")} of 99
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
            {name.description}
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
          One of the 99 Beautiful Names of Allah.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="primary-button flex-1">
            Open The App
          </Link>
          <Link href="/browse" className="secondary-button flex-1">
            Browse All Names
          </Link>
        </div>
      </section>
    </div>
  );
}

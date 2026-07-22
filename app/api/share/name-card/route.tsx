import { readFile } from "fs/promises";
import { join } from "path";
import { Resvg } from "@resvg/resvg-js";
import { getNameById } from "@/lib/names";
import { parseNameSharePayload } from "@/lib/share";

export const runtime = "nodejs";

const arabicFontPath = join(
  process.cwd(),
  "public/fonts/NotoNaskhArabic-Variable.ttf"
);

const arabicFontDataUrlPromise = readFile(arabicFontPath).then(
  (fontBuffer) => `data:font/ttf;base64,${fontBuffer.toString("base64")}`
);

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { id } = parseNameSharePayload(searchParams);
  const name = getNameById(id) ?? getNameById(1)!;
  const arabicFontDataUrl = await arabicFontDataUrlPromise;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <radialGradient id="glow" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stop-color="rgba(215,182,111,0.22)" />
          <stop offset="100%" stop-color="rgba(215,182,111,0)" />
        </radialGradient>
        <linearGradient id="panel" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(16,39,46,0.96)" />
          <stop offset="100%" stop-color="rgba(4,13,18,0.96)" />
        </linearGradient>
        <style>
          @font-face {
            font-family: 'Noto Naskh Arabic';
            src: url('${arabicFontDataUrl}') format('truetype');
            font-weight: 400 700;
          }
        </style>
      </defs>
      <rect width="1200" height="630" fill="#03090d" />
      <rect width="1200" height="630" fill="url(#glow)" />
      <rect x="48" y="48" width="1104" height="534" rx="18" fill="url(#panel)" stroke="rgba(215,182,111,0.24)" />
      <rect x="68" y="68" width="1064" height="494" rx="10" fill="none" stroke="rgba(120,152,180,0.16)" />
      <circle cx="600" cy="310" r="190" fill="none" stroke="rgba(215,182,111,0.12)" />
      <rect x="455" y="165" width="290" height="290" fill="none" stroke="rgba(120,152,180,0.12)" transform="rotate(45 600 310)" />
      <text x="88" y="100" fill="rgba(216,208,189,0.62)" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="24" font-weight="600" letter-spacing="0.32em">ASMA UL HUSNA</text>
      <text x="1112" y="100" text-anchor="end" fill="rgba(216,208,189,0.62)" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="24" font-weight="600" letter-spacing="0.32em">${String(name.id).padStart(2, "0")} / 99</text>
      <text x="600" y="284" text-anchor="middle" direction="rtl" unicode-bidi="bidi-override" fill="#f4eddc" font-family="'Noto Naskh Arabic', serif" font-size="132" font-weight="700">${escapeXml(name.arabic)}</text>
      <text x="600" y="366" text-anchor="middle" fill="#f0d99c" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="30" font-weight="700" letter-spacing="0.28em">${escapeXml(name.transliteration.toUpperCase())}</text>
      <text x="600" y="458" text-anchor="middle" fill="#f4eddc" font-family="Georgia, 'Times New Roman', serif" font-size="68" font-weight="700">${escapeXml(name.meaning)}</text>
      <text x="88" y="540" fill="rgba(216,208,189,0.72)" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="500">One of the 99 Beautiful Names of Allah</text>
      <text x="1112" y="540" text-anchor="end" fill="rgba(216,208,189,0.72)" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="500">Asma ul Husna</text>
    </svg>
  `;
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
    font: {
      loadSystemFonts: true,
      fontFiles: [arabicFontPath],
    },
  });
  const pngData = resvg.render().asPng();

  return new Response(new Uint8Array(pngData), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

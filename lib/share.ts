const DEFAULT_SHARE_ORIGIN = "https://asma-ul-husna.vercel.app";

export const APP_SHARE_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  DEFAULT_SHARE_ORIGIN;

export interface QuizSharePayload {
  score: number;
  total: number;
  accuracy: number;
  missedCount: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getShareOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return APP_SHARE_ORIGIN;
}

export function getShareOriginForServer(): string {
  return APP_SHARE_ORIGIN;
}

export function buildAbsoluteUrl(pathname: string): string {
  return new URL(pathname, getShareOrigin()).toString();
}

export function buildAbsoluteUrlForServer(pathname: string): string {
  return new URL(pathname, APP_SHARE_ORIGIN).toString();
}

export function buildQuizShareText({
  score,
  total,
  accuracy,
}: QuizSharePayload): string {
  return `I completed a 99 Names of Allah quiz in Asma ul Husna: ${score}/${total} (${accuracy}%).`;
}

export function buildQuizShareUrl(payload: QuizSharePayload): string {
  const url = new URL("/quiz/share", getShareOrigin());
  url.searchParams.set("score", String(payload.score));
  url.searchParams.set("total", String(payload.total));
  url.searchParams.set("accuracy", String(payload.accuracy));
  url.searchParams.set("missed", String(payload.missedCount));
  return url.toString();
}

export function buildQuizShareUrlForServer(payload: QuizSharePayload): string {
  const url = new URL("/quiz/share", APP_SHARE_ORIGIN);
  url.searchParams.set("score", String(payload.score));
  url.searchParams.set("total", String(payload.total));
  url.searchParams.set("accuracy", String(payload.accuracy));
  url.searchParams.set("missed", String(payload.missedCount));
  return url.toString();
}

export function buildQuizShareImageUrlForServer(
  payload: QuizSharePayload
): string {
  const url = new URL("/api/share/quiz-card", APP_SHARE_ORIGIN);
  url.searchParams.set("score", String(payload.score));
  url.searchParams.set("total", String(payload.total));
  url.searchParams.set("accuracy", String(payload.accuracy));
  url.searchParams.set("missed", String(payload.missedCount));
  return url.toString();
}

export function parseQuizSharePayload(
  source:
    | URLSearchParams
    | Record<string, string | string[] | undefined>
): QuizSharePayload {
  const getValue = (key: string) => {
    if (source instanceof URLSearchParams) return source.get(key) ?? undefined;
    const raw = source[key];
    return Array.isArray(raw) ? raw[0] : raw;
  };

  const total = clamp(Number(getValue("total") ?? 10) || 10, 1, 99);
  const score = clamp(Number(getValue("score") ?? 0) || 0, 0, total);
  const accuracy = clamp(
    Number(getValue("accuracy") ?? Math.round((score / total) * 100)) ||
      Math.round((score / total) * 100),
    0,
    100
  );
  const missedCount = clamp(
    Number(getValue("missed") ?? Math.max(total - score, 0)) ||
      Math.max(total - score, 0),
    0,
    total
  );

  return { score, total, accuracy, missedCount };
}

export function buildShareTargets(text: string, url: string) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  return {
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(
      "My 99 Names of Allah quiz result"
    )}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  };
}

export async function copyShareLink(url: string): Promise<void> {
  await navigator.clipboard.writeText(url);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function generateProgressImage(
  memorized: number,
  streak: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 540;
  canvas.height = 540;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#080b12";
  ctx.fillRect(0, 0, 540, 540);

  const glow = ctx.createRadialGradient(270, 80, 20, 270, 80, 300);
  glow.addColorStop(0, "rgba(240,205,131,0.22)");
  glow.addColorStop(1, "rgba(8,11,18,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 540, 540);

  // Border accent
  const gradient = ctx.createLinearGradient(0, 0, 540, 0);
  gradient.addColorStop(0, "#f4dd9a");
  gradient.addColorStop(0.5, "#d3aa60");
  gradient.addColorStop(1, "#b38436");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 500, 500);

  // Title
  ctx.fillStyle = "rgba(233,223,198,0.58)";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ASMA UL HUSNA", 270, 120);

  // Count
  ctx.fillStyle = "#fff8eb";
  ctx.font = "bold 72px sans-serif";
  ctx.fillText(`${memorized}/99`, 270, 260);

  // Label
  ctx.fillStyle = "rgba(233,223,198,0.72)";
  ctx.font = "16px sans-serif";
  ctx.fillText("Names Memorized", 270, 300);

  // Progress bar
  const barWidth = 300;
  const barX = (540 - barWidth) / 2;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(barX, 340, barWidth, 8, 4);
  ctx.fill();

  ctx.fillStyle = "#d7b067";
  ctx.beginPath();
  ctx.roundRect(barX, 340, barWidth * (memorized / 99), 8, 4);
  ctx.fill();

  // Streak
  if (streak > 0) {
    ctx.fillStyle = "#d7b067";
    ctx.font = "14px sans-serif";
    ctx.fillText(`${streak} day streak`, 270, 400);
  }

  // Branding
  ctx.fillStyle = "rgba(233,223,198,0.28)";
  ctx.font = "12px sans-serif";
  ctx.fillText("asma-ul-husna.vercel.app", 270, 480);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export async function generateCertificateImage(
  completionDate: string,
  totalDays: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 540;
  canvas.height = 960;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#080b12";
  ctx.fillRect(0, 0, 540, 960);

  // Decorative double border
  const gradient = ctx.createLinearGradient(0, 0, 540, 960);
  gradient.addColorStop(0, "#f4dd9a");
  gradient.addColorStop(0.5, "#d3aa60");
  gradient.addColorStop(1, "#b38436");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 480, 900);
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 460, 880);

  // Certificate label
  ctx.fillStyle = "#d7b067";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICATE OF COMPLETION", 270, 120);

  // Main text
  ctx.fillStyle = "rgba(241,234,220,0.76)";
  ctx.font = "16px sans-serif";
  ctx.fillText("I have memorized the", 270, 340);
  ctx.fillStyle = "#d7b067";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("99 Beautiful Names", 270, 385);
  ctx.fillStyle = "rgba(241,234,220,0.76)";
  ctx.font = "16px sans-serif";
  ctx.fillText("of Allah", 270, 420);

  // Date
  ctx.fillStyle = "rgba(233,223,198,0.46)";
  ctx.font = "13px sans-serif";
  ctx.fillText(`Completed on ${completionDate}`, 270, 520);
  ctx.fillText(`${totalDays} days of dedication`, 270, 545);

  // Branding
  ctx.fillStyle = "rgba(233,223,198,0.24)";
  ctx.font = "11px sans-serif";
  ctx.fillText("asma-ul-husna.vercel.app", 270, 890);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export async function shareImage(
  blob: Blob,
  text: string,
  url?: string,
  filename = "progress.png"
): Promise<void> {
  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ text, url, files: [file] });
  } else if (navigator.share) {
    await navigator.share({ text, url });
  } else {
    downloadBlob(blob, filename);
  }
}

export async function generateQuizResultImage({
  score,
  total,
  accuracy,
  missedCount,
}: QuizSharePayload): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#080b12";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(540, 120, 40, 540, 120, 520);
  glow.addColorStop(0, "rgba(244,221,154,0.28)");
  glow.addColorStop(1, "rgba(8,11,18,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cardGradient = ctx.createLinearGradient(140, 180, 940, 1100);
  cardGradient.addColorStop(0, "rgba(20,26,44,0.96)");
  cardGradient.addColorStop(1, "rgba(10,14,25,0.96)");
  ctx.fillStyle = cardGradient;
  ctx.beginPath();
  ctx.roundRect(110, 150, 860, 1020, 42);
  ctx.fill();

  ctx.strokeStyle = "rgba(244,221,154,0.26)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(110, 150, 860, 1020, 42);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(233,223,198,0.68)";
  ctx.font = "600 26px sans-serif";
  ctx.fillText("ASMA UL HUSNA", 540, 250);

  ctx.fillStyle = "#fff8eb";
  ctx.font = "700 86px sans-serif";
  ctx.fillText(`${score}/${total}`, 540, 470);

  ctx.fillStyle = "#d7b067";
  ctx.font = "700 42px sans-serif";
  ctx.fillText(`${accuracy}% accuracy`, 540, 540);

  ctx.fillStyle = "rgba(241,234,220,0.82)";
  ctx.font = "500 30px sans-serif";
  ctx.fillText("99 Names of Allah Quiz", 540, 610);

  ctx.fillStyle = "rgba(233,223,198,0.64)";
  ctx.font = "500 24px sans-serif";
  ctx.fillText(
    missedCount > 0
      ? `${missedCount} name${missedCount === 1 ? "" : "s"} to review next`
      : "Perfect round. No names missed.",
    540,
    680
  );

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(250, 770, 580, 16, 8);
  ctx.fill();

  ctx.fillStyle = "#d7b067";
  ctx.beginPath();
  ctx.roundRect(250, 770, 580 * (accuracy / 100), 16, 8);
  ctx.fill();

  ctx.fillStyle = "rgba(233,223,198,0.46)";
  ctx.font = "500 20px sans-serif";
  ctx.fillText("Memorize with flashcards, quizzes, and daily review", 540, 930);

  ctx.fillStyle = "rgba(233,223,198,0.28)";
  ctx.font = "500 18px sans-serif";
  ctx.fillText("asma-ul-husna.vercel.app", 540, 1080);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export async function shareText(
  text: string,
  url: string
): Promise<void> {
  if (navigator.share) {
    await navigator.share({ text, url });
  } else {
    await navigator.clipboard.writeText(`${text} ${url}`);
  }
}

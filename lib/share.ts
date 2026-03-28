export async function generateProgressImage(
  memorized: number,
  streak: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 540;
  canvas.height = 540;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, 540, 540);

  // Border accent
  const gradient = ctx.createLinearGradient(0, 0, 540, 0);
  gradient.addColorStop(0, "#6366f1");
  gradient.addColorStop(0.5, "#8b5cf6");
  gradient.addColorStop(1, "#a78bfa");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 500, 500);

  // Title
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ASMA UL HUSNA", 270, 120);

  // Count
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px sans-serif";
  ctx.fillText(`${memorized}/99`, 270, 260);

  // Label
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "16px sans-serif";
  ctx.fillText("Names Memorized", 270, 300);

  // Progress bar
  const barWidth = 300;
  const barX = (540 - barWidth) / 2;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(barX, 340, barWidth, 8, 4);
  ctx.fill();

  ctx.fillStyle = "#a78bfa";
  ctx.beginPath();
  ctx.roundRect(barX, 340, barWidth * (memorized / 99), 8, 4);
  ctx.fill();

  // Streak
  if (streak > 0) {
    ctx.fillStyle = "#a78bfa";
    ctx.font = "14px sans-serif";
    ctx.fillText(`${streak} day streak`, 270, 400);
  }

  // Branding
  ctx.fillStyle = "rgba(255,255,255,0.2)";
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
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, 540, 960);

  // Decorative double border
  const gradient = ctx.createLinearGradient(0, 0, 540, 960);
  gradient.addColorStop(0, "#6366f1");
  gradient.addColorStop(0.5, "#a78bfa");
  gradient.addColorStop(1, "#6366f1");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 480, 900);
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 460, 880);

  // Certificate label
  ctx.fillStyle = "#a78bfa";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICATE OF COMPLETION", 270, 120);

  // Main text
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "16px sans-serif";
  ctx.fillText("I have memorized the", 270, 340);
  ctx.fillStyle = "#a78bfa";
  ctx.font = "bold 32px sans-serif";
  ctx.fillText("99 Beautiful Names", 270, 385);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "16px sans-serif";
  ctx.fillText("of Allah", 270, 420);

  // Date
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "13px sans-serif";
  ctx.fillText(`Completed on ${completionDate}`, 270, 520);
  ctx.fillText(`${totalDays} days of dedication`, 270, 545);

  // Branding
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "11px sans-serif";
  ctx.fillText("asma-ul-husna.vercel.app", 270, 890);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export async function shareImage(
  blob: Blob,
  text: string
): Promise<void> {
  const file = new File([blob], "progress.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ text, files: [file] });
  } else {
    // Fallback: download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "asma-ul-husna-progress.png";
    a.click();
    URL.revokeObjectURL(url);
  }
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

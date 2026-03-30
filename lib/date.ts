export function formatLocalDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addLocalDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

export function getLocalDayOfYear(date = new Date()): number {
  const today = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12
  );
  const start = new Date(date.getFullYear(), 0, 0, 12);
  return Math.floor((today.getTime() - start.getTime()) / 86400000);
}

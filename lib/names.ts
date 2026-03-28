import namesData from "@/data/names.json";
import { Name } from "./types";

export const names: Name[] = namesData as Name[];

export function getNameById(id: number): Name | undefined {
  return names.find((n) => n.id === id);
}

export function getNameOfTheDay(): Name {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % 99;
  return names[index];
}

export function searchNames(query: string): Name[] {
  const q = query.toLowerCase().trim();
  if (!q) return names;
  return names.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(q) ||
      n.meaning.toLowerCase().includes(q)
  );
}

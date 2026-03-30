import namesData from "@/data/names.json";
import { Name } from "./types";
import { getLocalDayOfYear } from "./date";

export const names: Name[] = namesData as Name[];

export function getNameById(id: number): Name | undefined {
  return names.find((n) => n.id === id);
}

export function getNameOfTheDay(date = new Date()): Name {
  const dayOfYear = getLocalDayOfYear(date);
  const index = (dayOfYear - 1 + names.length) % names.length;
  return names[index] ?? names[0];
}

function normalizeSearchValue(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchNames(query: string): Name[] {
  const q = normalizeSearchValue(query);
  if (!q) return names;
  return names.filter(
    (n) =>
      [
        String(n.id),
        n.transliteration,
        n.meaning,
        n.description,
        n.arabic,
      ]
        .map(normalizeSearchValue)
        .some((value) => value.includes(q))
  );
}

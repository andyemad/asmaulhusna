import { Name } from "./types";

export interface QuizQuestion {
  type: "arabic-to-meaning" | "meaning-to-arabic";
  correctName: Name;
  options: Name[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuiz(
  allNames: Name[],
  encounteredIds: number[],
  count: number
): QuizQuestion[] {
  const encountered = allNames.filter((n) => encounteredIds.includes(n.id));
  if (encountered.length < 4) return [];

  const selected = shuffle(encountered).slice(0, count);

  return selected.map((correctName) => {
    const type: QuizQuestion["type"] =
      Math.random() > 0.5 ? "arabic-to-meaning" : "meaning-to-arabic";

    const pool = encountered.filter((n) => n.id !== correctName.id);
    let distractors = shuffle(pool).slice(0, 3);

    if (distractors.length < 3) {
      const remaining = allNames.filter(
        (n) =>
          n.id !== correctName.id &&
          !distractors.find((d) => d.id === n.id)
      );
      distractors = [...distractors, ...shuffle(remaining)].slice(0, 3);
    }

    const options = shuffle([correctName, ...distractors]);

    return { type, correctName, options };
  });
}

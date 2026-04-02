export interface ChangeLogEntry {
  date: string;
  title: string;
  summary: string;
  bullets: string[];
  tags: string[];
  showNameCorrections?: boolean;
}

export interface NameCorrection {
  id: number;
  before: string;
  after: string;
}

export const nameCorrections: NameCorrection[] = [
  { id: 1, before: "Ar-Rahman — The Most Gracious", after: "Ar-Rahman — The Entirely Merciful" },
  { id: 2, before: "Ar-Rahim — The Most Merciful", after: "Ar-Rahim — The Especially Merciful" },
  { id: 3, before: "Al-Malik — The King", after: "Al-Malik — The Sovereign King" },
  { id: 4, before: "Al-Quddus — The Most Pure", after: "Al-Quddus — The Absolutely Pure" },
  { id: 6, before: "Al-Mu'min — The Guardian of Faith", after: "Al-Mu'min — The Granter of Security" },
  { id: 7, before: "Al-Muhaymin — The Protector", after: "Al-Muhaymin — The Guardian, the Overseer" },
  { id: 8, before: "Al-Aziz — The Almighty", after: "Al-Aziz — The All-Mighty" },
  { id: 10, before: "Al-Mutakabbir — The Supreme", after: "Al-Mutakabbir — The Supremely Great" },
  { id: 13, before: "Al-Musawwir — The Fashioner", after: "Al-Musawwir — The Fashioner of Forms" },
  { id: 14, before: "Al-Ghaffar — The Ever-Forgiving", after: "Al-Ghaffar — The Perpetual Forgiver" },
  { id: 15, before: "Al-Qahhar — The All-Prevailing", after: "Al-Qahhar — The Subduer" },
  { id: 18, before: "Al-Fattah — The Opener", after: "Al-Fattah — The Opener, the Judge" },
  { id: 19, before: "Al-'Alim — The All-Knowing", after: "Al-Alim — The All-Knowing" },
  { id: 22, before: "Al-Khafid — The Humbler", after: "Al-Khafid — The Humiliator" },
  { id: 29, before: "Al-'Adl — The Just", after: "Al-Adl — The Utterly Just" },
  { id: 30, before: "Al-Latif — The Subtle", after: "Al-Latif — The Subtly Gracious" },
  { id: 33, before: "Al-'Azim — The Magnificent", after: "Al-Azim — The Magnificent" },
  { id: 34, before: "Al-Ghafur — The Forgiving", after: "Al-Ghafur — The All-Forgiving" },
  { id: 36, before: "Al-'Ali — The Most High", after: "Al-Ali — The Most High" },
  { id: 37, before: "Al-Kabir — The Greatest", after: "Al-Kabir — The Most Great" },
  { id: 42, before: "Al-Karim — The Generous", after: "Al-Karim — The Most Generous" },
  { id: 48, before: "Al-Majid — The Glorious", after: "Al-Majid — The All-Glorious" },
  { id: 53, before: "Al-Qawi — The All-Powerful", after: "Al-Qawiyy — The All-Strong" },
  { id: 55, before: "Al-Wali — The Protecting Friend", after: "Al-Waliyy — The Protecting Friend" },
  { id: 57, before: "Al-Muhsi — The Enumerator", after: "Al-Muhsi — The Counter of All Things" },
  { id: 61, before: "Al-Mumit — The Taker of Life", after: "Al-Mumit — The Causer of Death" },
  { id: 65, before: "Al-Majid — The Noble", after: "Al-Majid — The Illustrious" },
  { id: 67, before: "Al-Ahad — The Unique", after: "Al-Ahad — The Unique, the Indivisible" },
  { id: 68, before: "As-Samad — The Eternal", after: "As-Samad — The Eternal Refuge" },
  { id: 69, before: "Al-Qadir — The Capable", after: "Al-Qadir — The All-Capable" },
  { id: 70, before: "Al-Muqtadir — The All-Determiner", after: "Al-Muqtadir — The All-Powerful" },
  { id: 78, before: "Al-Muta'ali — The Self-Exalted", after: "Al-Muta'ali — The Supremely Exalted" },
  { id: 79, before: "Al-Barr — The Source of Goodness", after: "Al-Barr — The Benevolent" },
  { id: 80, before: "At-Tawwab — The Accepter of Repentance", after: "At-Tawwab — The Acceptor of Repentance" },
  { id: 82, before: "Al-'Afuww — The Pardoner", after: "Al-Afuww — The Pardoner" },
  { id: 83, before: "Ar-Ra'uf — The Compassionate", after: "Ar-Ra'uf — The Clement" },
  { id: 84, before: "Malik-ul-Mulk — The Owner of All Sovereignty", after: "Malik al-Mulk — The Owner of All Sovereignty" },
  { id: 85, before: "Dhul-Jalali-wal-Ikram — Lord of Majesty and Generosity", after: "Dhu al-Jalal wal-Ikram — The Lord of Majesty and Generosity" },
  { id: 90, before: "Al-Mani' — The Preventer", after: "Al-Mani' — The Withholder" },
  { id: 91, before: "Ad-Darr — The Creator of Harm", after: "Ad-Darr — The Distresser" },
  { id: 92, before: "An-Nafi' — The Creator of Good", after: "An-Nafi' — The Benefactor" },
  { id: 95, before: "Al-Badi' — The Incomparable", after: "Al-Badi' — The Incomparable Originator" },
  { id: 96, before: "Al-Baqi — The Everlasting", after: "Al-Baqi — The Ever-Enduring" },
  { id: 97, before: "Al-Warith — The Inheritor", after: "Al-Warith — The Inheritor of All" },
  { id: 99, before: "As-Sabur — The Patient", after: "As-Sabur — The Forbearing" },
];

export const changelogEntries: ChangeLogEntry[] = [
  {
    date: "April 1, 2026",
    title: "Scholarly names alignment",
    summary:
      "The source list now matches the corrected renderings you supplied, and the changes flow through browse, flashcards, quiz prompts, name cards, and share pages.",
    bullets: [
      "Refined the live list with more precise transliterations and meanings rooted in the scholarly corrections you provided.",
      "Updated the places that surface the names publicly, including dedicated name share pages and metadata previews.",
      "Cleaned one broken detail sentence while syncing the names data.",
    ],
    tags: ["39 corrected entries", "Browse", "Flashcards", "Share cards"],
    showNameCorrections: true,
  },
  {
    date: "April 1, 2026",
    title: "Git-backed deployments",
    summary:
      "The project now lives in GitHub and Vercel is connected to the repository instead of depending on direct local CLI uploads.",
    bullets: [
      "Published the codebase to github.com/andyemad/asmaulhusna.",
      "Connected the existing Vercel project to the repository for normal main-branch deployments.",
      "Kept the production alias intact while switching the release flow over to Git.",
    ],
    tags: ["GitHub", "Vercel", "main branch"],
  },
  {
    date: "April 1, 2026",
    title: "Study flow, sharing, and audio refresh",
    summary:
      "The rough prototype was tightened into a more complete study tool with dedicated sharing, better quiz prompts, steadier flashcards, and working audio.",
    bullets: [
      "Added dedicated share pages and preview cards for single names, quiz results, and memorization progress.",
      "Imported the audio set and rebuilt recitation around the per-name playlist so listening works consistently.",
      "Reworked flashcard state so memorized and still-learning actions behave clearly, with better session continuity.",
    ],
    tags: ["Audio", "Share pages", "Quiz", "Flashcards"],
  },
  {
    date: "March 30, 2026",
    title: "Flashcard navigation cleanup",
    summary:
      "Mobile study sessions became easier to move through and less cluttered around the bottom navigation.",
    bullets: [
      "Moved flashcard navigation into the header.",
      "Stopped the bottom navigation from overlapping key study actions.",
      "Cleaned the card flow after session-complete and previous-card issues.",
    ],
    tags: ["Mobile", "Navigation", "Flashcards"],
  },
  {
    date: "March 28, 2026",
    title: "Memorization app foundation",
    summary:
      "The core study product landed as a PWA with browse, flashcards, quiz, review logic, and recitation.",
    bullets: [
      "Built the main memorization experience around the 99 Names of Allah.",
      "Added spaced repetition, progress tracking, and the initial learning routes.",
      "Shipped the first full app shell beyond the starter scaffold.",
    ],
    tags: ["PWA", "Spaced repetition", "Core app"],
  },
  {
    date: "March 28, 2026",
    title: "Project scaffold",
    summary:
      "The repository began as a clean Next.js app before the memorization experience was layered in.",
    bullets: [
      "Initialized the project structure and baseline tooling.",
      "Set up the first app-router shell that the current product grew from.",
    ],
    tags: ["Next.js", "Scaffold"],
  },
];

export const changelogSummary = {
  repositoryUrl: "https://github.com/andyemad/asmaulhusna",
  releaseCount: changelogEntries.length,
  correctedNameCount: nameCorrections.length,
};

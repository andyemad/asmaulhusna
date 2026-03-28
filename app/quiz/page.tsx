"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { names } from "@/lib/names";
import {
  loadProgress,
  saveProgress,
  getEncounteredNames,
} from "@/lib/progress";
import { generateQuiz, QuizQuestion } from "@/lib/quiz";
import { QuizResult } from "@/lib/types";
import QuizOption from "@/components/QuizOption";

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [missedNames, setMissedNames] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [tooFew, setTooFew] = useState(false);
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  useEffect(() => {
    if (questionCount === null) return;
    const progress = loadProgress();
    const encountered = getEncounteredNames(progress);
    if (encountered.length < 4) {
      setTooFew(true);
      return;
    }
    const q = generateQuiz(names, encountered, questionCount);
    setQuestions(q);
  }, [questionCount]);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (selected !== null || finished) return;
      const q = questions[current];
      const isCorrect = q.options[optionIndex].id === q.correctName.id;
      if (isCorrect) setScore((s) => s + 1);
      else setMissedNames((m) => [...m, `${q.correctName.transliteration} — ${q.correctName.meaning}`]);
      setSelected(optionIndex);

      setTimeout(() => {
        if (current + 1 >= questions.length) {
          const progress = loadProgress();
          const result: QuizResult = {
            date: new Date().toISOString().split("T")[0],
            score: score + (isCorrect ? 1 : 0),
            total: questions.length,
          };
          progress.quizHistory.push(result);
          saveProgress(progress);
          setFinished(true);
        } else {
          setCurrent((c) => c + 1);
          setSelected(null);
        }
      }, 1200);
    },
    [selected, current, questions, finished, score]
  );

  if (questionCount === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <p className="text-3xl mb-4">❓</p>
        <h2 className="text-lg font-bold text-white">How many questions?</h2>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setQuestionCount(10)} className="bg-accent text-white px-8 py-3 rounded-xl font-semibold">10</button>
          <button onClick={() => setQuestionCount(20)} className="bg-surface border border-white/10 text-white px-8 py-3 rounded-xl">20</button>
        </div>
      </div>
    );
  }

  if (tooFew) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <p className="text-3xl mb-4">📚</p>
        <h2 className="text-lg font-bold text-white">
          Not enough names yet!
        </h2>
        <p className="text-text-secondary text-sm mt-2">
          Learn at least 4 names in flashcard mode before taking a quiz.
        </p>
        <Link
          href="/flashcards"
          className="mt-6 bg-accent text-white px-6 py-3 rounded-xl text-sm font-semibold"
        >
          Start Learning
        </Link>
      </div>
    );
  }

  if (finished) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <p className="text-3xl mb-4">
          {accuracy >= 80 ? "🌟" : accuracy >= 50 ? "👍" : "💪"}
        </p>
        <h2 className="text-xl font-bold text-white">Quiz Complete!</h2>
        <p className="text-text-secondary mt-2">
          You scored {score}/{questions.length} ({accuracy}%)
        </p>
        {missedNames.length > 0 && (
          <div className="mt-4 w-full text-left bg-surface rounded-xl p-4">
            <p className="text-text-muted text-xs tracking-wider mb-2">NAMES TO REVIEW:</p>
            {missedNames.map((n, i) => (
              <p key={i} className="text-text-secondary text-sm py-1 border-b border-white/5 last:border-0">{n}</p>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-6 w-full">
          <Link
            href="/"
            className="flex-1 bg-surface border border-white/10 text-white text-center py-3 rounded-xl text-sm"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold text-sm"
          >
            {missedNames.length > 0 ? "Retry Missed" : "New Quiz"}
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[current];
  const correctIndex = q.options.findIndex(
    (o) => o.id === q.correctName.id
  );

  return (
    <div className="px-6 pt-8">
      <p className="text-center text-text-muted text-[10px] tracking-[2px] mb-4">
        QUESTION {current + 1} OF {questions.length}
      </p>

      <div className="bg-white/5 h-1 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-start via-accent-mid to-accent rounded-full transition-all duration-300"
          style={{
            width: `${((current + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="text-center mb-8">
        <p className="text-text-secondary text-sm mb-2">
          {q.type === "arabic-to-meaning"
            ? "What is the meaning of:"
            : "Which name means:"}
        </p>
        {q.type === "arabic-to-meaning" ? (
          <p className="font-arabic text-5xl text-white">
            {q.correctName.arabic}
          </p>
        ) : (
          <p className="text-2xl text-white font-medium">
            {q.correctName.meaning}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {q.options.map((option, i) => {
          let state: "default" | "correct" | "wrong" = "default";
          if (selected !== null) {
            if (i === correctIndex) state = "correct";
            else if (i === selected) state = "wrong";
          }
          return (
            <QuizOption
              key={option.id}
              name={option}
              displayField={
                q.type === "arabic-to-meaning" ? "meaning" : "arabic"
              }
              state={state}
              disabled={selected !== null}
              onClick={() => handleSelect(i)}
            />
          );
        })}
      </div>
    </div>
  );
}

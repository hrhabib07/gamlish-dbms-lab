"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuizData {
  lessonId: number;
  lessonTitle: string;
  questions: Array<{
    id: number;
    question: string;
    options: Array<{ id: number; optionText: string }>;
  }>;
}

export default function QuizPage() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api<QuizData>(`/student/lessons/${params.lessonId}/quiz`)
      .then(setQuiz)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, [params.lessonId]);

  const question = quiz?.questions[index];
  const total = quiz?.questions.length ?? 0;
  const selected = question ? answers[question.id] : undefined;
  const isLast = quiz ? index === quiz.questions.length - 1 : false;
  const percent = total === 0 ? 0 : Math.round((index / total) * 100);

  async function submitAll(): Promise<void> {
    if (!quiz) return;
    const payload = quiz.questions.map((item) => ({
      questionId: item.id,
      optionId: answers[item.id],
    }));
    if (payload.some((item) => item.optionId == null)) {
      setError("Answer this question to continue");
      return;
    }
    setLoading(true);
    try {
      await api(`/student/lessons/${params.lessonId}/quiz`, {
        method: "POST",
        body: JSON.stringify({ answers: payload }),
      });
      router.push(`/learn/${params.lessonId}/result`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  function goNext(): void {
    if (!question || selected == null) {
      setError("Pick an answer first");
      return;
    }
    setError(null);
    if (isLast) {
      void submitAll();
      return;
    }
    setIndex((value) => value + 1);
  }

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
          {quiz?.lessonTitle ?? "Quiz"}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <h1 className="text-2xl font-bold">Question {index + 1}</h1>
          <p className="text-sm font-semibold tabular-nums text-slate-500">
            {index + 1}/{total || 10}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

        {question ? (
          <Card className="mt-6 p-6">
            <p className="text-lg font-semibold leading-snug">{question.question}</p>
            <div className="mt-5 space-y-3">
              {question.options.map((option, optionIndex) => {
                const active = selected === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [question.id]: option.id }))
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition ${
                      active
                        ? "border-sky-500 bg-sky-50 text-sky-950"
                        : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                        active ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    {option.optionText}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex gap-3">
              {index > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1"
                  onClick={() => {
                    setError(null);
                    setIndex((value) => value - 1);
                  }}
                >
                  Back
                </Button>
              ) : null}
              <Button
                type="button"
                className="h-12 flex-1"
                disabled={loading || selected == null}
                onClick={goNext}
              >
                {loading ? "Saving..." : isLast ? "Finish mission" : "Next question"}
              </Button>
            </div>
          </Card>
        ) : null}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Trophy } from "lucide-react";
import { api } from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ResultData {
  lessonTitle: string;
  total: number;
  outOf: number;
  percent: number;
  answers: Array<{
    questionId: number;
    question: string;
    selectedOption: string | null;
    correctOption: string | null;
    score: number;
  }>;
}

export default function ResultPage() {
  const params = useParams<{ lessonId: string }>();
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<ResultData>(`/student/lessons/${params.lessonId}/result`)
      .then(setResult)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, [params.lessonId]);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        {error ? <p className="text-rose-600">{error}</p> : null}
        {result ? (
          <>
            <div className="mission-card overflow-hidden rounded-[1.6rem] border border-sky-300/25 p-6 text-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.7)]">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black text-amber-950">
                <Sparkles className="h-3.5 w-3.5" />
                Mission complete
              </p>
              <h1 className="mt-3 text-3xl font-bold">You scored {result.total}/{result.outOf}</h1>
              <p className="mt-2 text-sky-100">
                {result.percent}% on {result.lessonTitle}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/20">
                  <Trophy className="h-6 w-6 text-amber-300" />
                </span>
                <p className="text-sm text-slate-200">
                  {result.percent >= 80
                    ? "Strong run. Word order is sticking."
                    : "Good try. Replay the quiz and beat your score."}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {result.answers.map((row, index) => (
                <Card key={row.questionId} className="p-4">
                  <p className="text-sm font-semibold">
                    {index + 1}. {row.question}
                  </p>
                  <p className="mt-2 text-sm">
                    Your answer: {row.selectedOption ?? "-"}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      row.score === 1 ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {row.score === 1
                      ? "Correct · 1 point"
                      : `Correct was: ${row.correctOption ?? "-"}`}
                  </p>
                </Card>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="flex-1">
                <Button className="h-12 w-full">Back to map</Button>
              </Link>
              <Link href={`/learn/${params.lessonId}/quiz`} className="flex-1">
                <Button variant="outline" className="h-12 w-full">
                  Play again
                </Button>
              </Link>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

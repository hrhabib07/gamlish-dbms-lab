"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Play, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

interface DashboardData {
  user: { name: string };
  level: {
    title: string;
    lessons: Array<{
      id: number;
      title: string;
      questionCount: number;
      completed: boolean;
    }>;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<DashboardData>("/student/dashboard")
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, []);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          Your map
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {data ? `Hi, ${data.user.name}` : "Loading your mission"}
        </h1>
        <p className="mt-2 text-slate-600">
          Camp 01 is open. Play Mission 01 · Word Order.
        </p>
        {error ? <p className="mt-4 text-rose-600">{error}</p> : null}

        <div className="relative mt-10">
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-sky-400 to-slate-200" />
          {data?.level.lessons.map((lesson) => (
            <article
              key={lesson.id}
              className="mission-card relative overflow-hidden rounded-[1.6rem] border border-sky-300/25 p-5 shadow-[0_24px_50px_-28px_rgba(15,23,42,0.7)]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-400/20 blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
                    Mission 01
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-white">{lesson.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Video · Notes · {lesson.questionCount} questions
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/20 text-sky-100 ring-1 ring-sky-300/40">
                  {lesson.completed ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </span>
              </div>
              <div className="relative mt-5 flex flex-wrap items-center gap-2">
                <span className="reward-pill inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black">
                  <Sparkles className="h-3.5 w-3.5" />
                  {lesson.completed ? "Cleared" : "Ready"}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-sky-100">
                  {data.level.title}
                </span>
              </div>
              <Link href={`/learn/${lesson.id}`} className="relative mt-5 block">
                <Button className="h-12 w-full">
                  {lesson.completed ? "Play again" : "Start mission"}
                </Button>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

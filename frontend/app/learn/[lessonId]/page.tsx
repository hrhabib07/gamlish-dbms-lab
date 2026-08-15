"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Play, Trophy } from "lucide-react";
import { api } from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import { LessonVideo } from "@/components/LessonVideo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LessonData {
  id: number;
  title: string;
  videoUrl: string;
  lessonContent: string;
  questionCount: number;
  completed: boolean;
  level: { title: string };
}

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<LessonData>(`/student/lessons/${params.lessonId}`)
      .then(setLesson)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, [params.lessonId]);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {error ? <p className="text-rose-600">{error}</p> : null}
        {lesson ? (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
              {lesson.level.title}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{lesson.title}</h1>
            <p className="mt-2 text-slate-600">
              Watch, read, then play {lesson.questionCount} questions. One at a time.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Play, label: "1. Video" },
                { icon: BookOpen, label: "2. Notes" },
                { icon: Trophy, label: "3. Quiz" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"
                >
                  <item.icon className="h-4 w-4 text-sky-600" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <LessonVideo url={lesson.videoUrl} title={lesson.title} />
            </div>

            <Card className="mt-6">
              <h2 className="text-lg font-bold">Mission notes</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                {lesson.lessonContent.split("\n\n").map((block) => (
                  <p key={block} className="whitespace-pre-wrap">
                    {block}
                  </p>
                ))}
              </div>
            </Card>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={`/learn/${lesson.id}/quiz`} className="flex-1">
                <Button className="h-12 w-full">
                  Play the {lesson.questionCount}-question quiz
                </Button>
              </Link>
              {lesson.completed ? (
                <Link href={`/learn/${lesson.id}/result`} className="flex-1">
                  <Button variant="outline" className="h-12 w-full">
                    View last score
                  </Button>
                </Link>
              ) : null}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

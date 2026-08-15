"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OptionRow {
  id: number;
  optionText: string;
  isCorrect: boolean;
}

interface QuestionRow {
  id: number;
  question: string;
  lessonId: number;
  lesson: { id: number; title: string };
  options: OptionRow[];
}

interface LessonRow {
  id: number;
  title: string;
}

const emptyOptions = [
  { optionText: "", isCorrect: true },
  { optionText: "", isCorrect: false },
  { optionText: "", isCorrect: false },
  { optionText: "", isCorrect: false },
];

export default function AdminQuestionsPage() {
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [lessonId, setLessonId] = useState<number>(0);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(emptyOptions);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(): Promise<void> {
    const [questionRows, lessonRows] = await Promise.all([
      api<QuestionRow[]>("/admin/questions"),
      api<LessonRow[]>("/admin/lessons"),
    ]);
    setRows(questionRows);
    setLessons(lessonRows);
    if (lessonId === 0 && lessonRows[0]) {
      setLessonId(lessonRows[0].id);
    }
  }

  useEffect(() => {
    load().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to load");
    });
  }, []);

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setError(null);
    try {
      if (editingId == null) {
        await api("/admin/questions", {
          method: "POST",
          body: JSON.stringify({ lessonId, question, options }),
        });
      } else {
        await api(`/admin/questions/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ question, options }),
        });
      }
      setQuestion("");
      setOptions(emptyOptions);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function remove(id: number): Promise<void> {
    if (!window.confirm("Delete this question?")) return;
    await api(`/admin/questions/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Quiz questions</h1>
      {error ? <p className="mt-3 text-rose-600">{error}</p> : null}
      <Card className="mt-4">
        <h2 className="font-semibold">
          {editingId == null ? "Add question" : `Edit question #${editingId}`}
        </h2>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          {editingId == null ? (
            <div>
              <Label>Lesson</Label>
              <select
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                value={lessonId}
                onChange={(e) => setLessonId(Number(e.target.value))}
              >
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div>
            <Label>Question</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={option.isCorrect}
                onChange={() =>
                  setOptions((prev) =>
                    prev.map((item, i) => ({ ...item, isCorrect: i === index })),
                  )
                }
              />
              <Input
                placeholder={`Option ${index + 1}`}
                value={option.optionText}
                onChange={(e) =>
                  setOptions((prev) =>
                    prev.map((item, i) =>
                      i === index ? { ...item, optionText: e.target.value } : item,
                    ),
                  )
                }
                required
              />
            </div>
          ))}
          <div className="flex gap-2">
            <Button type="submit">{editingId == null ? "Create" : "Update"}</Button>
            {editingId != null ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setQuestion("");
                  setOptions(emptyOptions);
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>
      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <Card key={row.id}>
            <p className="text-xs text-slate-500">{row.lesson.title}</p>
            <h3 className="mt-1 font-semibold">{row.question}</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
              {row.options.map((option) => (
                <li key={option.id}>
                  {option.optionText}
                  {option.isCorrect ? " (correct)" : ""}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(row.id);
                  setQuestion(row.question);
                  setOptions(
                    row.options.map((option) => ({
                      optionText: option.optionText,
                      isCorrect: option.isCorrect,
                    })),
                  );
                }}
              >
                Edit
              </Button>
              <Button variant="danger" onClick={() => void remove(row.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

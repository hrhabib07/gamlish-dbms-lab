"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LessonRow {
  id: number;
  title: string;
  videoUrl: string;
  lessonContent: string;
  _count: { questions: number };
}

const emptyForm = {
  title: "",
  videoUrl: "https://youtu.be/UeD25OfPXew",
  lessonContent: "",
};

export default function AdminLessonsPage() {
  const [rows, setRows] = useState<LessonRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(): Promise<void> {
    const data = await api<LessonRow[]>("/admin/lessons");
    setRows(data);
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
        await api("/admin/lessons", {
          method: "POST",
          body: JSON.stringify(form),
        });
      } else {
        await api(`/admin/lessons/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function remove(id: number): Promise<void> {
    if (!window.confirm("Delete this lesson and its questions?")) return;
    await api(`/admin/lessons/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Lessons</h1>
      {error ? <p className="mt-3 text-rose-600">{error}</p> : null}
      <Card className="mt-4">
        <h2 className="font-semibold">
          {editingId == null ? "Add lesson" : `Edit lesson #${editingId}`}
        </h2>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Video URL</Label>
            <Input
              value={form.videoUrl}
              onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Lesson notes</Label>
            <Textarea
              rows={6}
              value={form.lessonContent}
              onChange={(e) =>
                setForm((f) => ({ ...f, lessonContent: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">{editingId == null ? "Create" : "Update"}</Button>
            {editingId != null ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
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
          <Card key={row.id} className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{row.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {row._count.questions} questions
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(row.id);
                  setForm({
                    title: row.title,
                    videoUrl: row.videoUrl,
                    lessonContent: row.lessonContent,
                  });
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

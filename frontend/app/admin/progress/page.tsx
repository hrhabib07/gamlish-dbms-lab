"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";

interface ProgressRow {
  id: number;
  completed: boolean;
  user: { name: string; email: string };
  lesson: { title: string };
}

export default function AdminProgressPage() {
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<ProgressRow[]>("/admin/progress")
      .then(setRows)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">User progress</h1>
      {error ? <p className="mt-3 text-rose-600">{error}</p> : null}
      <Card className="mt-4 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Lesson</th>
              <th className="px-4 py-3">Completed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  {row.user.name}
                  <div className="text-xs text-slate-500">{row.user.email}</div>
                </td>
                <td className="px-4 py-3">{row.lesson.title}</td>
                <td className="px-4 py-3">{row.completed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

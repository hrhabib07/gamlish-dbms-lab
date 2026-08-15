"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";

interface ScoreRow {
  userId: number;
  name: string;
  email: string;
  lessonTitle: string;
  totalScore: number;
  questionsAnswered: number;
}

export default function AdminScoresPage() {
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<ScoreRow[]>("/admin/scores")
      .then(setRows)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Quiz scores</h1>
      <p className="mt-1 text-sm text-slate-500">
        Built with SUM(Score) GROUP BY user and lesson.
      </p>
      {error ? <p className="mt-3 text-rose-600">{error}</p> : null}
      <Card className="mt-4 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Lesson</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.userId}-${row.lessonTitle}`} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  {row.name}
                  <div className="text-xs text-slate-500">{row.email}</div>
                </td>
                <td className="px-4 py-3">{row.lessonTitle}</td>
                <td className="px-4 py-3">
                  {row.totalScore}/{row.questionsAnswered}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

import { Card } from "@/components/ui/card";

export default function AdminHomePage() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
        Control room
      </p>
      <h1 className="mt-2 text-2xl font-bold">Admin dashboard</h1>
      <p className="mt-2 text-slate-600">
        Create students, edit Mission 01, and read scores from MySQL.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Users</h2>
          <p className="mt-2 text-sm text-slate-600">
            Register a new student from here, or let them sign up on the site.
          </p>
        </Card>
        <Card>
          <h2 className="font-semibold">Mission content</h2>
          <p className="mt-2 text-sm text-slate-600">
            Add, edit, and delete lessons and quiz questions.
          </p>
        </Card>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/progress", label: "Progress" },
  { href: "/admin/scores", label: "Scores" },
  { href: "/admin/lessons", label: "Lessons" },
  { href: "/admin/questions", label: "Questions" },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <SiteHeader />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <aside className="hidden w-52 shrink-0 sm:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">
            Admin
          </p>
          <nav className="mt-3 space-y-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

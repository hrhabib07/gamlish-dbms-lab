"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getStoredUser } from "@/lib/api";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    setName(user?.name ?? null);
    setRole(user?.role ?? null);
  }, []);

  function logout(): void {
    clearSession();
    router.push("/login");
  }

  return (
    <header className="sticky top-[3.4rem] z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl sm:top-[3.55rem]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-lg font-semibold tracking-tight">Gamlish</span>
          <span className="hidden border-l border-slate-200 pl-2.5 text-xs font-medium text-slate-500 sm:inline">
            The Game of English
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          {role === "admin" ? (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Admin
            </Link>
          ) : null}
          {role === "student" ? (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Play
            </Link>
          ) : null}
          {name ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:inline">{name}</span>
              <Button variant="outline" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link href="/register">
                <Button>Play Level 1</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

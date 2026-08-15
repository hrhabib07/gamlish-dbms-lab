"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api, setSession, type AuthUser } from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api<{ token: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(data.token, data.user);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12">
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
            Welcome back
          </p>
          <h1 className="mt-2 text-2xl font-bold">Log in to play</h1>
          <p className="mt-2 text-sm text-slate-500">
            Demo student: student@gamlish.test / Student@123
          </p>
          <p className="text-sm text-slate-500">
            Demo admin: admin@gamlish.test / Admin@123
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button className="h-12 w-full" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Enter the game"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-slate-600">
            New player?{" "}
            <Link className="font-semibold text-sky-700" href="/register">
              Create a free account
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}

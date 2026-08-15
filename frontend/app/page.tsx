import Link from "next/link";
import { BookOpen, Play, Trophy } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroMissionCard } from "@/components/HeroMissionCard";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="text-center lg:text-left">
              <p className="inline-flex items-center rounded-full border border-sky-500/35 bg-sky-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-sky-900">
                Play English like a game
              </p>
              <h1 className="mt-4 text-balance text-[clamp(2rem,6.8vw,3.15rem)] font-bold tracking-[-0.03em] leading-[1.15]">
                The <span className="text-sky-600">Game</span> of{" "}
                <span className="text-sky-600">English</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-pretty text-base font-semibold leading-snug text-slate-700 sm:text-lg lg:mx-0">
                <span className="mr-1.5 inline-flex items-center gap-1.5 align-middle">
                  <span
                    className="relative inline-flex h-[1.05em] w-[1.75em] shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
                    role="img"
                    aria-label="Bangladesh"
                  >
                    <svg viewBox="0 0 20 12" className="h-full w-full" aria-hidden>
                      <rect width="20" height="12" fill="#006A4E" />
                      <circle cx="9" cy="6" r="4" fill="#F42A41" />
                    </svg>
                  </span>
                  <span className="font-black tracking-tight text-sky-700">
                    For Bangla speakers
                  </span>
                  <span className="font-semibold text-slate-300">·</span>
                </span>
                Finish Mission 01. Watch. Read. Beat 10 questions. Save your score.
              </p>
              <div className="mt-7 flex w-full flex-col items-center gap-3 lg:items-start">
                <Link href="/register" className="w-full max-w-sm lg:w-auto">
                  <Button className="h-14 w-full rounded-2xl text-base lg:min-w-[15rem]">
                    Play Mission 01 free
                  </Button>
                </Link>
                <p className="text-sm text-slate-600">
                  Create an account. Your progress is stored in MySQL.
                </p>
                <Link href="/login" className="w-full max-w-sm lg:w-auto">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-2xl lg:min-w-[15rem]"
                  >
                    I already have an account
                  </Button>
                </Link>
                <a
                  href="https://gamlish.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-sky-700 hover:underline"
                >
                  Or open the real Gamlish at gamlish.com
                </a>
              </div>
            </div>
            <HeroMissionCard />
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-slate-200/70 px-4 py-14 sm:px-6"
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-sky-700">
              How Gamlish works
            </p>
            <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              One mission. Three moves. A real score.
            </h2>
            <ol className="mt-8 space-y-3">
              {[
                {
                  icon: Play,
                  title: "Watch the lesson",
                  body: "A short video on Subject + Verb + Object. Same idea as live Mission 01.",
                },
                {
                  icon: BookOpen,
                  title: "Read the notes",
                  body: "Tiny rules. Clear examples. Then you are ready to play.",
                },
                {
                  icon: Trophy,
                  title: "Beat 10 questions",
                  body: "One question at a time. Each answer is saved. See your score at the end.",
                },
              ].map((step) => (
                <li
                  key={step.title}
                  className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{step.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">
                      {step.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 text-center">
              <Link href="/register">
                <Button className="h-12 px-8">Start playing</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

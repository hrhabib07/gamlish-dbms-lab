import { Crown, Flame, Sparkles } from "lucide-react";

export function HeroMissionCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <span className="reward-pill absolute -right-1 -top-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black">
        <Sparkles className="h-3.5 w-3.5" />
        +10 XP
      </span>
      <div className="mission-card relative overflow-hidden rounded-[1.5rem] border border-sky-300/30 p-4 shadow-[0_28px_60px_-28px_rgba(15,23,42,0.75)] ring-1 ring-sky-400/30">
        <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-200">
              Mission 01
            </p>
            <p className="mt-1.5 text-lg font-bold leading-snug text-white">
              Word Order
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/25 text-sky-200 ring-1 ring-sky-300/40">
            <Crown className="h-5 w-5" />
          </span>
        </div>
        <div className="relative mt-4 rounded-xl border border-white/15 bg-white/10 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-100">
            <span>Ready to play</span>
            <span className="tabular-nums text-sky-200">3 stages</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-950/60">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-sky-300 to-blue-400" />
          </div>
        </div>
        <div className="relative mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950/50 px-2.5 py-1.5 text-xs font-bold text-slate-100 ring-1 ring-white/15">
            <Flame className="h-3.5 w-3.5 text-amber-300" />
            Video · Notes · Quiz
          </span>
          <span className="inline-flex items-center rounded-lg bg-sky-400/20 px-2.5 py-1.5 text-xs font-bold text-sky-100 ring-1 ring-sky-300/35">
            Free start
          </span>
        </div>
      </div>
    </div>
  );
}

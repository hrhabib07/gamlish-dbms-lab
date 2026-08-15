import { ExternalLink, Sparkles } from "lucide-react";
import { LIVE_GAMLISH_URL } from "@/lib/live-site";

export function LiveGamlishBanner() {
  return (
    <div className="sticky top-0 z-[60] border-b border-amber-400/40 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white">
      <a
        href={LIVE_GAMLISH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-amber-950 sm:flex">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
              Lab demo · CSE 224
            </span>
            <span className="block truncate text-sm font-semibold sm:text-[15px]">
              See the actual project on gamlish.com
            </span>
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-black text-amber-950 shadow-lg shadow-amber-500/30 sm:px-3.5 sm:text-sm">
          Open live Gamlish
          <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </a>
    </div>
  );
}

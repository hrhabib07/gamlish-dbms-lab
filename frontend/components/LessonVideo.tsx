"use client";

import { youtubeEmbed, youtubeWatch } from "@/lib/api";

export function LessonVideo({ url, title }: { url: string; title: string }) {
  const embed = youtubeEmbed(url);
  const watch = youtubeWatch(url);

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-950 shadow-xl shadow-slate-900/20">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={embed}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="flex items-center justify-between gap-3 bg-slate-900 px-4 py-3">
        <p className="text-xs font-medium text-slate-300">
          If the player is blocked, open YouTube in a new tab.
        </p>
        <a
          href={watch}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-bold text-sky-300 hover:text-sky-200"
        >
          Open video
        </a>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Expand } from "lucide-react";
import { useState } from "react";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { ScreenLightbox } from "./mockups/ScreenLightbox";
import type { MobileScreen } from "@/data/showcaseMedia";

/**
 * Every phone screenshot of a live project, in a row of phone frames — the
 * case-study counterpart of the home page's fan, which only shows three.
 * Each opens the same full-size viewer.
 */
export function ShowcaseScreens({
  screens,
  title,
  accent = "#6e56ff",
}: {
  screens: readonly MobileScreen[];
  title: string;
  accent?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ "--m-accent": accent } as React.CSSProperties}>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            Мобильная версия
          </p>
          <p className="mt-2 text-sm text-fg-secondary">
            Нажмите на экран, чтобы открыть его целиком.
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap font-mono text-xs text-fg-faint">
          {String(screens.length).padStart(2, "0")} экранов
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
        {screens.map((screen, index) => (
          <ClipReveal key={screen.src} delay={index * 0.06} className="rounded-[1.75rem]">
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`Открыть экран ${index + 1} проекта ${title}`}
              data-cursor="card"
              data-cursor-label="СМОТРЕТЬ"
              className="group relative block aspect-[9/19] w-full cursor-zoom-in overflow-hidden rounded-[1.75rem] border border-line bg-panel p-1.5 shadow-2xl shadow-black/40 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="relative block h-full w-full overflow-hidden rounded-[1.35rem] bg-white">
                <Image
                  src={screen.src}
                  alt={`${title} — мобильный экран ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                  className="object-cover object-top"
                />
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Expand size={13} strokeWidth={1.8} />
              </span>
            </button>
          </ClipReveal>
        ))}
      </div>

      <ScreenLightbox
        screens={screens}
        index={open}
        onIndexChange={setOpen}
        onClose={() => setOpen(null)}
        projectTitle={title}
        accent={accent}
      />
    </div>
  );
}

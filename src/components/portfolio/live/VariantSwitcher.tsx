"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLenis } from "@/components/layout/LenisProvider";
import { cn } from "@/lib/utils";
import { LIVE_VARIANTS } from "./variants";

const noop = () => () => {};

/**
 * Temporary floating picker for comparing the layouts. Switching keeps the
 * page and glides back to the top of the section. Remove once one is chosen.
 */
export function VariantSwitcher({ current }: { current: number }) {
  const router = useRouter();
  const lenis = useLenis();
  // Portalled: the page template animates its content with a transform,
  // which would pin a `fixed` child to the page instead of the screen.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  const go = (variant: number) => {
    router.replace(`/portfolio?v=${variant}`, { scroll: false });
    const section = document.getElementById("live");
    if (!section) return;
    if (lenis) lenis.scrollTo(section, { offset: -40 });
    else section.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) return null;
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-6">
      <div
        role="group"
        aria-label="Вариант секции «Живые проекты»"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line-strong bg-bg/85 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <span className="px-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-fg-muted max-sm:hidden">
          Вариант
        </span>
        {LIVE_VARIANTS.map((name, i) => {
          const variant = i + 1;
          const on = variant === current;
          return (
            <button
              key={name}
              type="button"
              onClick={() => go(variant)}
              aria-pressed={on}
              title={name}
              className={cn(
                "h-9 rounded-full px-3.5 text-sm transition-colors",
                on
                  ? "bg-accent text-white"
                  : "text-fg-secondary hover:bg-white/5 hover:text-fg",
              )}
            >
              {variant}
              <span className={cn("ml-1.5", on ? "inline" : "hidden lg:inline")}>
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}

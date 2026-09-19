"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "@/components/layout/LenisProvider";
import { setUrlVariant, useUrlVariant } from "@/hooks/useUrlVariant";
import { cn } from "@/lib/utils";

const noop = () => () => {};

/**
 * Floating picker for comparing layouts of one section while it is being
 * chosen. Switching keeps the page and glides back to the section.
 * Temporary — remove the switcher and the losing layouts once one wins.
 */
export function VariantSwitcher({
  param,
  labels,
  anchorId,
  caption = "Вариант",
}: {
  param: string;
  labels: readonly string[];
  anchorId: string;
  caption?: string;
}) {
  const current = useUrlVariant(param, labels.length);
  const lenis = useLenis();
  // Portalled: the page template animates its content with a transform,
  // which would pin a `fixed` child to the page instead of the screen.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  const go = (variant: number) => {
    setUrlVariant(param, variant);
    const section = document.getElementById(anchorId);
    if (!section) return;
    if (lenis) lenis.scrollTo(section, { offset: -40 });
    else section.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) return null;
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-6">
      <div
        role="group"
        aria-label={`${caption}: варианты`}
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line-strong bg-bg/85 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-md"
      >
        <span className="px-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-fg-muted max-sm:hidden">
          {caption}
        </span>
        {labels.map((name, i) => {
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

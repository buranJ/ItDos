"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { accentOf, CaseLinks, Facts, LiveWindow, pad, Stage, type LiveItem } from "./parts";

/**
 * 5 · Витрина: one big window and the list of projects beside it — picking
 * a project swaps the recording. Only one player on the page at a time.
 */
export function LiveTabs({ items }: { items: LiveItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];
  if (!current) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:order-2 lg:col-span-8">
        <Stage accent={accentOf(current.project)} className="p-3 sm:p-[4%]">
          {/* Keyed: a new project mounts a fresh player and its intro. */}
          <LiveWindow key={current.project.slug} item={current} interactive />
        </Stage>
      </div>

      <ul className="border-t border-line lg:order-1 lg:col-span-4">
        {items.map((item, i) => {
          const { project } = item;
          const on = i === active;
          const panelId = `live-details-${project.slug}`;
          return (
            <li
              key={project.slug}
              className="border-b border-line"
              style={{ "--m-accent": accentOf(project) } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={on}
                aria-controls={panelId}
                className="group flex w-full items-baseline gap-4 py-5 text-left lg:py-6"
              >
                <span
                  className={cn(
                    "w-6 shrink-0 font-mono text-xs transition-colors",
                    on ? "text-m" : "text-fg-faint",
                  )}
                >
                  {pad(i + 1)}
                </span>
                <span
                  className={cn(
                    "font-display text-[clamp(1.5rem,2.2vw,2.1rem)] font-semibold leading-tight tracking-tight transition-colors duration-300",
                    on ? "text-fg" : "text-fg-muted group-hover:text-fg-secondary",
                  )}
                >
                  {project.title}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fg-muted">
                  {project.year}
                </span>
              </button>

              <div
                id={panelId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-out",
                  on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
                inert={!on}
              >
                <div className="overflow-hidden">
                  <div className="pb-7 pl-10">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-m">
                      {project.tags[0]}
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-fg-secondary">
                      {project.tagline}
                    </p>
                    <Facts results={project.results} className="mt-6" />
                    <CaseLinks project={project} compact className="mt-7" />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

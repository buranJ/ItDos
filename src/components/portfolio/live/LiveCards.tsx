"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  accentOf,
  CaseLinks,
  Facts,
  LiveWindow,
  type LiveItem,
} from "./parts";

/** Доля экрана по центру, в которой карточка считается активной. */
const CENTRE_BAND = "-42% 0px -42% 0px";

/**
 * The stack of project cards. Only the card crossing the middle of the
 * screen keeps a player: the others unmount theirs, so the page never holds
 * five YouTube iframes at once.
 */
export function LiveCards({ items }: { items: LiveItem[] }) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  // -1: в центре нет ни одной карточки. Иначе карточка, ушедшая наверх
  // страницы, оставалась бы активной, и при возврате к ней видео и заставка
  // не перезапускались.
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const cards = refs.current.filter((el): el is HTMLElement => Boolean(el));
    if (cards.length === 0) return;

    // В стопке центр перекрывают сразу несколько карточек: видна верхняя,
    // то есть с наибольшим индексом.
    const inBand = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = cards.indexOf(entry.target as HTMLElement);
          if (entry.isIntersecting) inBand.add(index);
          else inBand.delete(index);
        }
        setActiveIndex(inBand.size > 0 ? Math.max(...inBand) : -1);
      },
      { rootMargin: CENTRE_BAND },
    );

    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <div className="relative">
      {items.map((item, i) => {
        const { project } = item;
        const accent = accentOf(project);
        return (
          // Стопка: карточка прилипает под шапкой, следующая наезжает
          // сверху со смещением, чтобы был виден край предыдущей.
          <div
            key={project.slug}
            className="mb-8 last:mb-0 lg:sticky lg:mb-[16vh]"
            style={{ top: `calc(6.5rem + ${i * 1.25}rem)` }}
          >
            <article
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="relative overflow-hidden rounded-4xl border border-line bg-panel shadow-[0_-24px_60px_-24px_rgba(0,0,0,0.85)]"
              style={{ "--m-accent": accent } as React.CSSProperties}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(60% 90% at 0% 0%, color-mix(in oklab, ${accent} 26%, transparent), transparent 70%)`,
                }}
              />
              <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10">
                <WindowLink item={item} className="lg:col-span-7">
                  <div className="transition-transform duration-700 ease-out group-hover:scale-[1.012]">
                    <LiveWindow item={item} active={i === activeIndex} />
                  </div>
                </WindowLink>
                <div className="lg:col-span-5">
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-muted">
                    {project.tags[0]} · {project.year}
                  </div>
                  {/* Длинное название («Бишкек Суу Водоканал») получает
                      меньший шаг, чтобы остаться в одну строку. */}
                  <h3
                    className={cn(
                      "mt-6 font-display font-semibold leading-[1.02] tracking-tight text-fg",
                      project.title.length > 16
                        ? "text-[clamp(1.6rem,2.3vw,2.2rem)]"
                        : "text-[clamp(2rem,3.4vw,3.2rem)]",
                    )}
                  >
                    {project.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-fg-secondary">
                    {project.tagline}
                  </p>
                  <Facts results={project.results} className="mt-7" />
                  <CaseLinks project={project} compact className="mt-8" />
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}

/** Link wrapper for the window: the whole picture opens the case. */
function WindowLink({
  item,
  className,
  children,
}: {
  item: LiveItem;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/portfolio/${item.project.slug}`}
      aria-label={`Кейс ${item.project.title}`}
      data-cursor="card"
      data-cursor-label="КЕЙС"
      className={cn("group block", className)}
    >
      {children}
    </Link>
  );
}

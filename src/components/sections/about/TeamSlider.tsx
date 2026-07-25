"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, RotateCw, X } from "lucide-react";
import { team } from "@/data/team";
import { cn } from "@/lib/utils";

function ink(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#0a0a0a" : "#fff";
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function TeamSlider() {
  const [active, setActive] = useState(Math.floor(team.length / 2));
  const [flipped, setFlipped] = useState(false);
  const startX = useRef<number | null>(null);
  const n = team.length;

  const select = (i: number) => {
    if (i === active) {
      setFlipped((f) => !f); // click the centred card → flip
    } else {
      setActive(i);
      setFlipped(false);
    }
  };
  const go = (dir: number) => {
    setActive((a) => (a + dir + n) % n);
    setFlipped(false);
  };

  const onPointerDown = (e: React.PointerEvent) => (startX.current = e.clientX);
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (dx > 50) go(-1);
    else if (dx < -50) go(1);
    startX.current = null;
  };

  return (
    <div className="relative select-none">
      {/* ambient glow behind the centre card */}
      <div
        aria-hidden="true"
        className="accent-glow pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 opacity-40"
      />

      {/* Stage */}
      <div
        className="relative mx-auto flex h-[400px] items-center justify-center sm:h-[500px]"
        style={{ perspective: 2000 }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {team.map((m, i) => {
          let offset = i - active;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const abs = Math.abs(offset);
          const isActive = offset === 0;
          const hidden = abs > 3;
          const tag = m.tagColor ?? "#6e56ff";

          return (
            <button
              key={m.name + m.role}
              type="button"
              onClick={() => select(i)}
              aria-label={`${m.name} — ${m.role}`}
              data-cursor={isActive ? undefined : "link"}
              className="absolute h-[340px] w-[244px] sm:h-[452px] sm:w-[322px]"
              style={{
                transform: `translateX(${offset * 50}%) rotateY(${offset * -22}deg) scale(${
                  isActive ? 1 : Math.max(0.6, 0.82 - (abs - 1) * 0.08)
                })`,
                transformStyle: "preserve-3d",
                transition: `transform 0.6s ${EASE}, filter 0.6s ${EASE}, opacity 0.5s ease`,
                zIndex: 50 - abs,
                opacity: hidden ? 0 : 1,
                filter: isActive ? "none" : `brightness(${Math.max(0.4, 0.6 - (abs - 1) * 0.12)})`,
                pointerEvents: hidden ? "none" : "auto",
              }}
            >
              {/* flip wrapper */}
              <div
                className="relative h-full w-full"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${isActive && flipped ? 180 : 0}deg)`,
                  transition: `transform 0.7s ${EASE}`,
                }}
              >
                {/* ── FRONT ── */}
                <div
                  className={cn(
                    "absolute inset-0 overflow-hidden rounded-3xl border bg-panel",
                    isActive ? "border-accent/40" : "border-white/10"
                  )}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 244px, 322px"
                      className="object-cover"
                      draggable={false}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-panel-2 font-display text-5xl font-semibold text-white/40">
                      {m.initials}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

                  {m.tag && (
                    <span
                      className="absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
                      style={{ background: tag, color: ink(tag) }}
                    >
                      {m.tag}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                    <p className="font-display text-lg font-semibold text-white sm:text-xl">
                      {m.name}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm text-white/70 transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {m.role}
                    </p>

                    {/* flip hint (active only) */}
                    {isActive && (
                      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                        <RotateCw size={12} className="text-accent" />
                        Подробнее
                      </span>
                    )}
                  </div>
                </div>

                {/* ── BACK ── */}
                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-accent/40 bg-panel p-6"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="accent-glow pointer-events-none absolute -right-16 -top-16 h-44 w-44 opacity-50"
                  />
                  <div className="relative">
                    {m.tag && (
                      <span
                        className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
                        style={{ background: tag, color: ink(tag) }}
                      >
                        {m.tag}
                      </span>
                    )}
                    <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-fg">
                      {m.name}
                    </h3>
                    <p className="text-sm text-fg-secondary">{m.role}</p>
                    {m.experience && (
                      <p className="mt-1 font-mono text-xs text-accent">{m.experience}</p>
                    )}
                  </div>

                  {m.bio && (
                    <p className="relative mt-4 text-sm leading-relaxed text-fg-secondary">
                      {m.bio}
                    </p>
                  )}

                  {m.skills && (
                    <div className="relative mt-auto flex flex-wrap gap-2 pt-4">
                      {m.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-line px-2.5 py-1 text-xs text-fg-secondary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="relative mt-4 inline-flex items-center gap-1.5 text-xs text-fg-muted">
                    <X size={12} /> Свернуть
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
          aria-label="Назад"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-all duration-200 hover:border-accent hover:bg-accent hover:text-accent-ink"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {team.map((m, i) => (
            <button
              key={m.name + m.role}
              onClick={() => {
                setActive(i);
                setFlipped(false);
              }}
              aria-label={`Показать ${m.name}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-7 bg-accent" : "w-1.5 bg-fg-faint hover:bg-fg-muted"
              )}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Вперёд"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-all duration-200 hover:border-accent hover:bg-accent hover:text-accent-ink"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

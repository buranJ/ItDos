"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Laptop, Smartphone, Play, ArrowLeft } from "lucide-react";
import { LaptopMock } from "./LaptopMock";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = { url: string; accent?: string; className?: string };

const PEOPLE = ["/team/1.jpg", "/team/2.jpg", "/team/3.jpg", "/team/4.jpg", "/team/5.jpg", "/team/6.jpg"];
const SCREENS = ["feed", "course", "auth"] as const;
type ScreenKind = (typeof SCREENS)[number];

/* ── Generative phone screens (stand-ins for a real mobile project) ── */

function Menu() {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="h-[2px] w-4 rounded bg-white/80" />
      <span className="h-[2px] w-4 rounded bg-white/80" />
      <span className="h-[2px] w-4 rounded bg-white/80" />
    </div>
  );
}

function FeedScreen({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col bg-[#0c0c0e] text-white">
      <div className="flex items-center justify-between px-3 pt-6 pb-2">
        <span className="font-display text-base font-bold italic">u!</span>
        <Menu />
      </div>
      <p className="px-3 font-display text-[15px] font-bold leading-tight">Полезный контент</p>
      <div className="flex gap-2.5 px-3 py-2 text-[8px]">
        {["Все", "Маркетинг", "Дизайн", "Fashion"].map((c, i) => (
          <span key={c} style={i === 0 ? { color: accent } : undefined} className={i === 0 ? "font-semibold" : "text-white/45"}>
            {c}
          </span>
        ))}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden px-3 pb-3">
        {[0, 1].map((k) => (
          <div key={k} className="overflow-hidden rounded-xl bg-white/5">
            <div className="relative h-16 w-full">
              <Image src={PEOPLE[k]} alt="" fill sizes="120px" className="object-cover" />
              <span
                className="absolute bottom-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[7px] font-bold text-white"
                style={{ background: accent }}
              >
                #дизайн
              </span>
            </div>
            <div className="space-y-1 p-2">
              <div className="h-1.5 w-3/4 rounded bg-white/25" />
              <div className="h-1.5 w-1/2 rounded bg-white/12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseScreen({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col bg-[#0c0c0e] px-3 pt-6 text-white">
      <div className="flex items-center justify-between">
        <span className="font-display text-base font-bold italic">u!</span>
        <Menu />
      </div>
      <div className="mt-2 flex items-center gap-1 text-[8px] text-white/45">
        <ArrowLeft size={9} /> Личный кабинет
      </div>
      <p className="mt-1.5 text-[8px] font-semibold" style={{ color: accent }}>
        Модуль #1
      </p>
      <p className="font-display text-[13px] font-bold leading-tight">Введение в Adobe Photoshop</p>
      <div className="relative mt-2 h-20 w-full overflow-hidden rounded-lg">
        <Image src={PEOPLE[4]} alt="" fill sizes="120px" className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black">
            <Play size={12} className="ml-0.5 fill-black" />
          </span>
        </div>
      </div>
      <p className="mt-2 text-[9px] font-semibold">Домашнее задание:</p>
      <div className="mt-1 space-y-1 text-[8px] text-white/55">
        <p>1. Разработать дизайн постера</p>
        <p>2. Подобрать шрифты</p>
        <p>3. Композиция и теория цвета</p>
      </div>
    </div>
  );
}

function AuthScreen({ accent }: { accent: string }) {
  return (
    <div className="relative flex h-full flex-col bg-black text-white">
      <div className="grid h-[52%] w-full grid-cols-4">
        {PEOPLE.slice(0, 4).map((src, i) => (
          <div key={i} className="relative h-full w-full">
            <Image src={src} alt="" fill sizes="60px" className="object-cover grayscale" />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 top-[18%] bottom-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
      <div className="relative -mt-12 flex flex-1 flex-col px-3">
        <p className="text-[10px] text-white/70">Чтобы продолжить</p>
        <p className="font-display text-[15px] font-bold leading-tight">Войдите в профиль</p>
        <div className="mt-3 space-y-2">
          {["Пароль", "Email"].map((l) => (
            <div key={l}>
              <p className="text-[7px] text-white/45">{l}</p>
              <div className="mt-0.5 h-6 rounded-md border border-white/15 bg-white/5" />
            </div>
          ))}
        </div>
        <button
          className="mt-3 h-7 w-2/3 rounded-full text-[9px] font-bold text-white"
          style={{ background: accent }}
        >
          Войти
        </button>
      </div>
    </div>
  );
}

function Screen({ kind, accent }: { kind: ScreenKind; accent: string }) {
  if (kind === "feed") return <FeedScreen accent={accent} />;
  if (kind === "course") return <CourseScreen accent={accent} />;
  return <AuthScreen accent={accent} />;
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative h-full w-full rounded-[1.8rem] border border-white/10 bg-[#161618] p-[4%]"
      style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-black">
        <div
          className="absolute left-1/2 top-1.5 z-30 h-1.5 w-[26%] -translate-x-1/2 rounded-full bg-black"
          style={{ boxShadow: "0 0 0 1px #2a2a2c" }}
        />
        {children}
      </div>
    </div>
  );
}

function PhoneCoverflow({ accent }: { accent: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(1);
  const startX = useRef<number | null>(null);
  const n = SCREENS.length;

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 3800);
    return () => clearInterval(id);
  }, [reduced, n]);

  const onDown = (e: React.PointerEvent) => (startX.current = e.clientX);
  const onUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (dx > 40) setActive((a) => (a - 1 + n) % n);
    else if (dx < -40) setActive((a) => (a + 1) % n);
    startX.current = null;
  };

  return (
    <div className="relative h-full w-full select-none" style={{ perspective: 1200 }} onPointerDown={onDown} onPointerUp={onUp}>
      <div className="absolute inset-0 flex items-center justify-center">
        {SCREENS.map((kind, i) => {
          const off = i - active;
          const abs = Math.abs(off);
          const center = off === 0;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => !center && setActive(i)}
              className="absolute"
              style={{
                height: "94%",
                aspectRatio: "300 / 620",
                transform: `translateX(${off * 50}%) rotateY(${off * -20}deg) scale(${center ? 1 : 0.82})`,
                transformStyle: "preserve-3d",
                transition: "transform .55s cubic-bezier(.16,1,.3,1), opacity .4s ease, filter .4s ease",
                opacity: abs > 1 ? 0 : 1,
                zIndex: 10 - abs,
                filter: center ? "none" : "brightness(0.7)",
                pointerEvents: abs > 1 ? "none" : "auto",
                cursor: center ? "default" : "pointer",
              }}
            >
              <PhoneFrame>
                <Screen kind={kind} accent={accent} />
              </PhoneFrame>
            </button>
          );
        })}
      </div>

      {/* dots */}
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SCREENS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Экран ${i + 1}`}
            className={cn("h-1.5 rounded-full transition-all duration-300", i === active ? "w-5" : "w-1.5 bg-white/25")}
            style={i === active ? { width: "1.25rem", background: accent } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

/** Website showcase: a laptop/mobile toggle. Laptop shows the project video,
 *  mobile shows a coverflow slider of another project's app screens. */
export function ShowcaseMock({ url, accent = "#6e56ff", className }: Props) {
  const [view, setView] = useState<"laptop" | "mobile">("laptop");

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden rounded-xl", className)}
      style={{ background: `radial-gradient(ellipse at 50% 45%, ${accent}22 0%, ${accent}08 45%, transparent 70%)` }}
    >
      <div className="absolute inset-0 flex flex-col items-center gap-3 p-3">
        {/* device toggle */}
        <div className="z-10 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur">
          {([["laptop", Laptop], ["mobile", Smartphone]] as const).map(([v, Icon]) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-label={v === "laptop" ? "Десктоп" : "Мобильная версия"}
              className={cn(
                "flex h-7 w-10 items-center justify-center rounded-lg transition-colors",
                view === v ? "bg-white/15 text-fg" : "text-fg-muted hover:text-fg-secondary"
              )}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>

        {/* stage */}
        <div className="relative w-full flex-1">
          {view === "laptop" ? (
            <LaptopMock url={url} accent={accent} className="absolute inset-0" />
          ) : (
            <PhoneCoverflow accent={accent} />
          )}
        </div>
      </div>
    </div>
  );
}

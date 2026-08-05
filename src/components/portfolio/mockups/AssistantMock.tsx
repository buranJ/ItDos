"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Calendar, FileText, Clock, Sparkles, Check } from "lucide-react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** 2026-trend "AI helper" that *demonstrates* what it does, in plain human
 *  language: it answers a client, books a meeting, issues an invoice — each as
 *  its own detailed animated scene — then sums up the saved time. Loops. */

const TILES = [
  { icon: MessageCircle, value: "24", label: "Ответил" },
  { icon: Calendar, value: "6", label: "Встречи" },
  { icon: FileText, value: "12", label: "Счета" },
  { icon: Clock, value: "3 ч", label: "Сэкономил" },
];

const STATUS = [
  "Отвечаю клиенту…",
  "Записываю встречу…",
  "Выставляю счёт…",
  "Готово! Навёл порядок в делах ✨",
];

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const DATES = [16, 17, 18, 19, 20, 21];
const BUSY = [false, true, false, true, true, false];

function ChatScene() {
  return (
    <div className="flex h-full flex-col gap-1.5">
      {/* header */}
      <div className="m-rise-in flex items-center gap-2 border-b border-line pb-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-panel-2 text-[8px] font-semibold text-fg/70">
          А
        </span>
        <span className="text-[10px] font-medium text-fg">Анна</span>
        <span className="h-1.5 w-1.5 rounded-full bg-m" />
        <span
          className="m-fade-out ml-auto flex items-center gap-1 text-[8px] text-fg-muted"
          style={{ animationDelay: "0.3s" }}
        >
          печатает
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="m-dot h-1 w-1 rounded-full bg-fg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        </span>
      </div>
      {/* messages */}
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        <div className="m-rise-in max-w-[84%] self-start rounded-2xl rounded-tl-sm bg-panel-2 px-2.5 py-1.5 text-[10.5px] leading-snug text-fg-secondary">
          Здравствуйте! Вы работаете в выходные?
        </div>
        <div
          className="m-rise-in max-w-[84%] self-end rounded-2xl rounded-tr-sm bg-m px-2.5 py-1.5 text-[10.5px] leading-snug text-accent-ink"
          style={{ animationDelay: "1.3s" }}
        >
          Да, конечно! Записал вас на субботу, 14:00 👍
        </div>
        <div
          className="m-rise-in flex items-center gap-1 self-end text-[8px] text-fg-muted"
          style={{ animationDelay: "1.7s" }}
        >
          <Check size={8} /> отправлено · 9:41
        </div>
      </div>
    </div>
  );
}

function CalendarScene() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className="m-rise-in flex items-center justify-between">
        <span className="text-[10px] font-medium text-fg">Июнь · эта неделя</span>
        <span className="text-[8px] text-m">свободно: Сб</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {DAYS.map((d, i) => {
          const pick = i === 5;
          return (
            <div
              key={d}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg border py-1.5 transition-colors",
                pick ? "border-m bg-m-soft" : "border-line bg-surface/50"
              )}
            >
              <span className="text-[8px] text-fg-muted">{d}</span>
              <span className={cn("text-[10px] font-semibold", pick ? "text-m" : "text-fg")}>{DATES[i]}</span>
              {pick ? (
                <span className="m-pop h-1.5 w-1.5 rounded-full bg-m" style={{ animationDelay: "0.6s" }} />
              ) : BUSY[i] ? (
                <span className="h-1 w-1 rounded-full bg-fg/25" />
              ) : (
                <span className="h-1 w-1" />
              )}
            </div>
          );
        })}
      </div>
      <div
        className="m-pop mx-auto flex items-center gap-1.5 rounded-full bg-m px-3 py-1.5 text-[10px] font-medium text-accent-ink"
        style={{ animationDelay: "0.9s" }}
      >
        <Calendar size={11} /> Суббота, 14:00 · Консультация
      </div>
    </div>
  );
}

function InvoiceScene() {
  return (
    <div className="m-rise-in mx-auto flex h-full w-[88%] flex-col justify-center">
      <div className="rounded-xl border border-line bg-surface p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-m text-[7px] font-bold text-accent-ink">
              IT
            </span>
            <span className="text-[10px] font-medium text-fg">Счёт №1428</span>
          </div>
          <span className="text-[8px] text-fg-muted">21 июня</span>
        </div>
        <div className="mt-2 space-y-1">
          <div className="m-rise-in flex items-center justify-between text-[9px]" style={{ animationDelay: "0.3s" }}>
            <span className="text-fg-secondary">Дизайн сайта</span>
            <span className="text-fg">₽ 14 000</span>
          </div>
          <div className="m-rise-in flex items-center justify-between text-[9px]" style={{ animationDelay: "0.55s" }}>
            <span className="text-fg-secondary">Разработка</span>
            <span className="text-fg">₽ 10 000</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-line pt-1.5">
          <span className="text-[9px] text-fg-muted">Итого</span>
          <span className="font-display text-sm font-semibold text-fg">₽ 24 000</span>
        </div>
        <div
          className="m-pop ml-auto mt-2 flex w-fit items-center gap-1 rounded-full bg-m-soft px-2 py-1 text-[9px] font-medium text-m"
          style={{ animationDelay: "1s" }}
        >
          <Check size={10} /> Отправлен клиенту
        </div>
      </div>
    </div>
  );
}

function SummaryScene() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center">
      <span className="m-pop flex h-10 w-10 items-center justify-center rounded-full bg-m text-accent-ink">
        <Check size={20} />
      </span>
      <p className="m-rise-in font-display text-sm font-semibold text-fg" style={{ animationDelay: "0.2s" }}>
        Всё сделал за вас ✨
      </p>
      <div className="m-rise-in flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[9px] text-fg-secondary" style={{ animationDelay: "0.45s" }}>
        <span className="flex items-center gap-1"><Check size={9} className="text-m" /> 24 ответа</span>
        <span className="flex items-center gap-1"><Check size={9} className="text-m" /> 6 встреч</span>
        <span className="flex items-center gap-1"><Check size={9} className="text-m" /> 12 счетов</span>
      </div>
      <p className="m-rise-in mt-0.5 text-[12px] text-fg-secondary" style={{ animationDelay: "0.7s" }}>
        Сэкономил вам <span className="font-semibold text-m">3 часа</span> сегодня
      </p>
    </div>
  );
}

function Scene({ phase }: { phase: number }) {
  if (phase === 0) return <ChatScene />;
  if (phase === 1) return <CalendarScene />;
  if (phase === 2) return <InvoiceScene />;
  return <SummaryScene />;
}

export function AssistantMock({ accent, className }: MockupProps & { className?: string }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0); // 0–2 actions, 3 summary

  useEffect(() => {
    if (reduced) return;
    let p = 0;
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      setPhase(p);
      const dur = p === 3 ? 3900 : 3400;
      p = (p + 1) % 4;
      t = setTimeout(run, dur);
    };
    t = setTimeout(run, 250);
    return () => clearTimeout(t);
  }, [reduced]);

  const activePhase = reduced ? 3 : phase;

  return (
    <Frame accent={accent} variant="app" label="Ваш AI-помощник" className={className}>
      <div className="relative h-full overflow-hidden p-3">
        {/* warm ambient glow */}
        <div aria-hidden className="accent-glow pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-40" />
        <div aria-hidden className="accent-glow pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 opacity-25" />

        <div className="relative flex h-full flex-col gap-2.5">
          {/* live status + progress dots */}
          <div className="flex items-center gap-2">
            {activePhase === 3 ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-m text-accent-ink">
                <Sparkles size={13} />
              </span>
            ) : (
              <span className="m-spin h-5 w-5 shrink-0 rounded-full border-2 border-m/25 border-t-m" />
            )}
            <p className="text-[12px] font-medium text-fg">{STATUS[activePhase]}</p>
            <div className="ml-auto flex items-center gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === activePhase ? "w-3 bg-m" : "w-1 bg-fg-faint"
                  )}
                />
              ))}
            </div>
          </div>

          {/* stage — the live demonstration */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-surface/40 p-3 backdrop-blur-sm">
            <div key={activePhase} className="h-full">
              <Scene phase={activePhase} />
            </div>
          </div>

          {/* outcome tiles — light up as each task lands */}
          <div className="grid grid-cols-4 gap-1.5">
            {TILES.map((tile, i) => {
              const Icon = tile.icon;
              const isTime = i === 3;
              const active = isTime ? activePhase === 3 : activePhase === i;
              const done = isTime ? activePhase === 3 : activePhase > i || activePhase === 3;
              return (
                <div
                  key={tile.label}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-xl border p-2 transition-all duration-300",
                    active
                      ? "scale-[1.04] border-m bg-m-soft"
                      : done
                        ? "border-m/30 bg-surface/60"
                        : "border-line bg-surface/40"
                  )}
                >
                  <Icon size={13} className={active || done ? "text-m" : "text-fg-muted"} />
                  <p className="font-display text-sm font-semibold leading-none text-fg">{tile.value}</p>
                  <p className="text-[8px] leading-tight text-fg-secondary">{tile.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Frame>
  );
}

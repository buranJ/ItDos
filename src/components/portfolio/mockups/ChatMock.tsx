"use client";

import { useEffect, useState } from "react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";

const PHRASES = [
  "Создание сайтов с индивидуальным дизайном под задачи вашего бизнеса — от $400 ✓",
  "Оставьте заявку на сайте или напишите нам в WhatsApp — ответим за 10 минут!",

];

type ChatMockProps = MockupProps & { className?: string; typing?: boolean };

/** AI-agent conversation placeholder with an optional live typewriter. */
export function ChatMock({ accent, className, typing = false }: ChatMockProps) {
  const reduced = useReducedMotion();
  const live = typing && !reduced;
  const [typed, setTyped] = useState("");
  const display = live ? typed : PHRASES[PHRASES.length - 1];

  useEffect(() => {
    if (!live) return;
    let phrase = 0;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const p = PHRASES[phrase];
      if (char <= p.length) {
        setTyped(p.slice(0, char));
        char += 1;
        timer = setTimeout(tick, 42);
      } else {
        timer = setTimeout(() => {
          phrase = (phrase + 1) % PHRASES.length;
          char = 0;
          setTyped("");
          tick();
        }, 1700);
      }
    }
    // defer the first state update out of the synchronous effect pass
    timer = setTimeout(tick, 350);
    return () => clearTimeout(timer);
  }, [live]);

  return (
    <Frame accent={accent} variant="app" label="AI-агент · ITDOS" className={className}>
      <div className="flex h-full flex-col gap-3 p-4">
        {/* user message */}
        <div className="flex justify-end">
          <div className="max-w-[78%] rounded-2xl rounded-tr-sm border border-m bg-m-soft px-3 py-2">
            <p className="text-[11px] leading-snug text-fg-secondary">
              Сколько стоит разработка сайта?
            </p>
          </div>
        </div>

        {/* AI message */}
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-m">
            <span className="text-[9px] font-bold text-accent-ink">AI</span>
          </div>
          <div className="max-w-[78%] rounded-2xl rounded-tl-sm border border-line bg-surface px-3 py-2 min-h-9">
            {display === "" ? (
              <span className="flex items-center gap-1 py-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="m-dot h-1.5 w-1.5 rounded-full bg-m"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </span>
            ) : (
              <p className="text-[11px] leading-snug text-fg">
                {display}
                {live && <span className="ml-0.5 inline-block w-1.5 animate-pulse text-m">▍</span>}
              </p>
            )}
          </div>
        </div>

        {/* input */}
        <div className="mt-auto flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5">
          <div className="h-2 w-1/3 rounded bg-fg/12" />
          <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-m">
            <svg width="11" height="11" viewBox="0 0 24 24" className="fill-accent-ink">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>
    </Frame>
  );
}

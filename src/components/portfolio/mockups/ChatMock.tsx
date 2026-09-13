"use client";

import { useEffect, useState } from "react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const PHRASES = [
  "Создание сайтов с индивидуальным дизайном под задачи вашего бизнеса — от $400 ✓",
  "Оставьте заявку на сайте или напишите нам в WhatsApp — ответим за 10 минут!",

];

const DEFAULT_QUESTION = "Сколько стоит разработка сайта?";
const SENT_REPLY =
  "Открыли WhatsApp с вашим сообщением — отправьте его, и мы ответим за 10 минут ✓";

type ChatMockProps = MockupProps & {
  className?: string;
  typing?: boolean;
  /** A real input: the visitor's message opens WhatsApp, prefilled. */
  interactive?: boolean;
  /** Larger type and controls, for the hero where the card is the focus. */
  size?: "md" | "lg";
};

/** AI-agent conversation placeholder with an optional live typewriter. */
export function ChatMock({
  accent,
  className,
  typing = false,
  interactive = false,
  size = "md",
}: ChatMockProps) {
  const reduced = useReducedMotion();
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  // The typewriter stops once the visitor has written — the reply to their
  // own message stays put instead of being typed over.
  const live = typing && !reduced && sent === null;
  const [typed, setTyped] = useState("");
  const display = sent !== null ? SENT_REPLY : live ? typed : PHRASES[PHRASES.length - 1];
  const lg = size === "lg";
  const text = lg ? "text-sm" : "text-xs";

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

  const send = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;
    // Opened inside the submit handler, so it counts as a user gesture and
    // popup blockers let it through.
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(message);
    setDraft("");
  };

  const sendIcon = (
    <svg
      width={lg ? 13 : 11}
      height={lg ? 13 : 11}
      viewBox="0 0 24 24"
      className="fill-accent-ink"
      aria-hidden="true"
    >
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );

  return (
    <Frame accent={accent} variant="app" label="AI-агент · ITDOS" className={className}>
      <div className={cn("flex h-full flex-col", lg ? "gap-3.5 p-5" : "gap-3 p-4")}>
        {/* Messages get their own flex track with `min-h-0`, and sit at its
            bottom: a long reply (or a long question from the visitor) now
            pushes older lines up and out of view, never the input down. */}
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col justify-end overflow-hidden",
            lg ? "gap-3.5" : "gap-3",
          )}
        >
          {/* user message */}
          <div className="flex justify-end">
            <div className="max-w-[78%] rounded-2xl rounded-tr-sm border border-m bg-m-soft px-3 py-2">
              {/* 12px rather than 11px: the card is tilted in 3D on small
                  screens, and resampling costs a fraction of a pixel of stroke
                  weight — the smaller the type, the more of it is lost. */}
              <p className={cn(text, "leading-snug text-fg-secondary wrap-break-word")}>
                {sent ?? DEFAULT_QUESTION}
              </p>
            </div>
          </div>

          {/* AI message */}
          <div className="flex items-start gap-2">
            <div
              className={cn(
                "mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-m",
                lg ? "h-7 w-7" : "h-6 w-6",
              )}
            >
              <span className="text-[10px] font-bold text-accent-ink">AI</span>
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
                <p className={cn(text, "leading-snug text-fg")}>
                  {display}
                  {live && <span className="ml-0.5 inline-block w-1.5 animate-pulse text-m">▍</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* input */}
        {interactive ? (
          <form
            onSubmit={send}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-m"
          >
            {/* 16px: anything smaller makes iOS Safari zoom the page on focus. */}
            <input
              type="text"
              name="message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Задайте свой вопрос…"
              aria-label="Ваш вопрос — отправим в WhatsApp"
              maxLength={500}
              enterKeyHint="send"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-base leading-tight text-fg outline-none placeholder:text-fg-muted"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Отправить в WhatsApp"
              data-cursor="button"
              className={cn(
                "flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-m transition-[opacity,transform] duration-200 hover:scale-105 disabled:cursor-default disabled:opacity-45 disabled:hover:scale-100",
                lg ? "h-8 w-8" : "h-7 w-7",
              )}
            >
              {sendIcon}
            </button>
          </form>
        ) : (
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5">
            <div className="h-2 w-1/3 rounded bg-fg/12" />
            <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-m">
              {sendIcon}
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}

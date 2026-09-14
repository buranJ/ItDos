"use client";

import { useEffect, useState } from "react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const PHRASES = [
  "Создание сайтов с индивидуальным дизайном под задачи вашего бизнеса — от $300 ✓",
  "Оставьте заявку на сайте или напишите нам в WhatsApp — мы быстро ответим!",

];

const DEFAULT_QUESTION = "Сколько стоит разработка сайта?";
const SENT_REPLY =
  "Открыли WhatsApp с вашим сообщением — отправьте его, и мы быстро ответим ✓";

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
            {/* The assistant's avatar is the ChatGPT mark — the model the
                agent runs on — on a white disc, which reads on the dark card. */}
            <div
              className={cn(
                "mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-white",
                lg ? "h-7 w-7" : "h-6 w-6",
              )}
              title="ChatGPT"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={cn("fill-[#0d0d0d]", lg ? "h-4.5 w-4.5" : "h-4 w-4")}
              >
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
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
            className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-4 pr-1.5 transition-[border-color,box-shadow] focus-within:border-m focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--m-accent)_18%,transparent)]"
          >
            {/* 16px: anything smaller makes iOS Safari zoom the page on focus.
                `outline: none` inline — the global `:focus-visible` outline is
                unlayered and outranks the utility, and it drew a hard box
                inside the pill. Focus shows on the pill itself instead. */}
            <input
              style={{ outline: "none" }}
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

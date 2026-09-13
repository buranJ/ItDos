"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "@/components/layout/LenisProvider";
import { cn } from "@/lib/utils";
import styles from "./ScreenLightbox.module.css";

export type LightboxScreen = {
  src: string;
  width: number;
  height: number;
};

type Props = {
  screens: readonly LightboxScreen[];
  /** Index of the screen to open, or null while closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  projectTitle: string;
  accent: string;
};

const EXIT_MS = 260;
const SWIPE_PX = 48;

/**
 * Full-size view of a project's mobile screenshots. Portalled to <body>:
 * the mock that opens it sits inside transformed, overflow-clipped stages,
 * and a `position: fixed` layer would otherwise be trapped by them.
 */
export function ScreenLightbox({
  screens,
  index,
  onIndexChange,
  onClose,
  projectTitle,
  accent,
}: Props) {
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const swipeStartRef = useRef<number | null>(null);
  // Held in a ref so a parent re-render mid-exit doesn't restart the timer.
  const onCloseRef = useRef(onClose);
  const open = index !== null;
  const count = screens.length;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const requestClose = useCallback(() => {
    setClosing(true);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => {
      setClosing(false);
      onCloseRef.current();
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  const go = useCallback(
    (step: 1 | -1) => {
      if (index === null || count < 2) return;
      setDirection(step);
      onIndexChange((index + step + count) % count);
    },
    [count, index, onIndexChange],
  );

  const select = (next: number) => {
    if (index === null || next === index) return;
    setDirection(next > index ? 1 : -1);
    onIndexChange(next);
  };

  // Lock the page behind the dialog — Lenis owns the scroll position, so
  // body overflow alone won't hold it — and hand focus back on close.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "Tab") {
        // Keep Tab inside the dialog.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, open, requestClose]);

  if (!mounted || index === null) return null;
  const screen = screens[index];
  if (!screen) return null;

  const counter = (n: number) => String(n).padStart(2, "0");

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} — экран ${index + 1} из ${count}`}
      data-lenis-prevent
      className={cn(styles.overlay, closing && styles.overlayClosing)}
      style={{ "--lightbox-accent": accent } as React.CSSProperties}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") swipeStartRef.current = event.clientX;
      }}
      onPointerUp={(event) => {
        const start = swipeStartRef.current;
        swipeStartRef.current = null;
        if (start === null) return;
        const dx = event.clientX - start;
        if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
      }}
    >
      <div aria-hidden="true" className={styles.glow} />

      <header className={styles.topBar}>
        <div className={styles.caption}>
          <span className={styles.captionDot} />
          <strong>{projectTitle}</strong>
          <span className={styles.captionCounter}>
            {counter(index + 1)} / {counter(count)}
          </span>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          aria-label="Закрыть просмотр"
          className={styles.iconButton}
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      </header>

      <div
        className={styles.stage}
        onClick={(event) => {
          if (event.target === event.currentTarget) requestClose();
        }}
      >
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Предыдущий экран"
            className={cn(styles.iconButton, styles.navButton, styles.navPrev)}
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </button>
        )}

        <figure
          key={screen.src}
          className={styles.figure}
          style={{ "--swap-from": `${direction * 2.5}rem` } as React.CSSProperties}
        >
          <div
            className={styles.frame}
            style={
              { "--ratio": screen.width / screen.height } as React.CSSProperties
            }
          >
            <Image
              src={screen.src}
              alt={`${projectTitle} — мобильный экран ${index + 1}`}
              fill
              sizes="(min-width: 768px) 30rem, 92vw"
              className={styles.image}
              priority
            />
          </div>
        </figure>

        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Следующий экран"
            className={cn(styles.iconButton, styles.navButton, styles.navNext)}
          >
            <ArrowRight size={18} strokeWidth={1.8} />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className={styles.thumbs}>
          {screens.map((thumb, thumbIndex) => (
            <button
              key={thumb.src}
              type="button"
              onClick={() => select(thumbIndex)}
              aria-label={`Экран ${thumbIndex + 1}`}
              aria-current={thumbIndex === index}
              className={cn(
                styles.thumb,
                thumbIndex === index && styles.thumbActive,
              )}
            >
              <Image
                src={thumb.src}
                alt=""
                fill
                sizes="3rem"
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

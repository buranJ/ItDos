"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "@/components/layout/LenisProvider";
import { cn } from "@/lib/utils";
import styles from "./VideoLightbox.module.css";

type Props = {
  /** YouTube id; null while closed. */
  videoId: string | null;
  title: string;
  onClose: () => void;
};

const EXIT_MS = 240;

/**
 * Full-size playback of a project video, with sound and controls — the
 * mockups loop it muted and chromeless. Portalled to <body>: the mockups
 * sit inside transformed, clipped stages that would trap a fixed layer.
 */
export function VideoLightbox({ videoId, title, onClose }: Props) {
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const open = videoId !== null;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => {
      setClosing(false);
      onCloseRef.current();
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  // Lock the page (Lenis owns the scroll) and hand focus back on close.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setClosing(true);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  if (!mounted || !videoId) return null;

  const src =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    "?autoplay=1&rel=0&modestbranding=1&playsinline=1";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Видео проекта — ${title}`}
      data-lenis-prevent
      className={cn(styles.overlay, closing && styles.overlayClosing)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setClosing(true);
      }}
    >
      <header className={styles.topBar}>
        <strong>{title}</strong>
        <button
          ref={closeRef}
          type="button"
          onClick={() => setClosing(true)}
          aria-label="Закрыть видео"
          className={styles.close}
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      </header>
      <div
        className={styles.stage}
        onClick={(event) => {
          if (event.target === event.currentTarget) setClosing(true);
        }}
      >
        <div className={styles.frame}>
          <iframe
            src={src}
            title={`Видео проекта — ${title}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** The small "expand" control drawn over a playing mockup video. */
export function ExpandVideoButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Смотреть видео на весь экран"
      data-cursor="button"
      className={cn(styles.expand, className)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
      </svg>
    </button>
  );
}

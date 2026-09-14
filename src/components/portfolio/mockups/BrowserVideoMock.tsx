"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Plus, RotateCw, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import {
  ExpandVideoButton,
  VideoLightbox,
  usePauseWhileFullView,
} from "./VideoLightbox";
import styles from "./BrowserVideoMock.module.css";

type Props = {
  /** YouTube id or link. Empty → a placeholder app UI instead of video. */
  url?: string;
  /** Text in the address bar. Internal systems have no public URL. */
  address?: string;
  /** Tab title. */
  projectTitle?: string;
  accent?: string;
  className?: string;
  /** Crops a recording that isn't a clean 16:9 app capture: the player is
   *  scaled up (`scale`, 1 = none) and pulled up by `top` % of the
   *  viewport, pushing letterbox bars and any recorded browser UI out of
   *  view. Horizontally it stays centred. */
  videoCrop?: { scale: number; top: number };
  /** False while this step isn't on screen — no player is created. */
  active?: boolean;
};

/** Minimum time the loader stays up, so it reads as a beat, not a flash;
 *  a branded one gets long enough to play its intro. */
const LOADER_MIN_MS = 1200;
const BRANDED_LOADER_MIN_MS = 2300;
const LOADER_FADE_MS = 450;

function ytId(input: string): string {
  if (!/[/.]/.test(input)) return input;
  const match = input.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);
  return match ? match[1] : input;
}

/**
 * A Chrome-style window playing a screen recording of a web system — for
 * CRM/ERP work, which has no phone version and reads best large. Wider than
 * its column on purpose (see the CSS), so the recorded UI stays legible.
 */
export function BrowserVideoMock({
  url = "",
  address,
  projectTitle = "Проект ITDOS",
  accent = "#2bd4c4",
  className,
  videoCrop,
  active = true,
}: Props) {
  const id = url ? ytId(url) : "";
  const [viewRef, seen] = useInView<HTMLDivElement>("0px");
  const inView = seen && active;
  const playerRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [fullView, setFullView] = useState(false);
  usePauseWhileFullView(playerRef, fullView);
  const branded = projectTitle.toLowerCase().includes("водоканал");

  useEffect(() => {
    if (!inView || !id) return;
    const timer = window.setTimeout(
      () => setMinElapsed(true),
      branded ? BRANDED_LOADER_MIN_MS : LOADER_MIN_MS,
    );
    return () => window.clearTimeout(timer);
  }, [branded, id, inView]);

  // Fade, THEN unmount — dropping it the moment it was ready skipped the
  // fade entirely and the loader vanished in one frame.
  const loaderFading = loaded && minElapsed;
  useEffect(() => {
    if (!loaderFading) return;
    const timer = window.setTimeout(() => setLoaderGone(true), LOADER_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [loaderFading]);

  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    "&controls=0&modestbranding=1&rel=0&iv_load_policy=3" +
    "&disablekb=1&fs=0&playsinline=1&enablejsapi=1";

  return (
    <div
      className={cn(styles.scene, className)}
      style={{ "--bv-accent": accent } as React.CSSProperties}
    >
      <div className={styles.window}>
        {/* ── Tab strip ── */}
        <div className={styles.tabs} aria-hidden="true">
          <span className={styles.lights}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.tab}>
            <span className={styles.favicon} />
            <span className={styles.tabTitle}>{projectTitle}</span>
          </span>
          <Plus className={styles.newTab} strokeWidth={1.8} />
        </div>

        {/* ── Toolbar + omnibox ── */}
        <div className={styles.toolbar} aria-hidden="true">
          <ArrowLeft strokeWidth={1.8} />
          <ArrowRight strokeWidth={1.8} />
          <RotateCw strokeWidth={1.8} />
          <span className={styles.omnibox}>
            <Lock strokeWidth={2} />
            <span>{address ?? "Внутренняя система · защищённый доступ"}</span>
          </span>
        </div>

        {/* ── Viewport ── */}
        <div ref={viewRef} className={styles.viewport}>
          {id ? (
            <>
              {inView && (
                <iframe
                  ref={playerRef}
                  src={src}
                  title={`Видео проекта — ${projectTitle}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                  tabIndex={-1}
                  onLoad={() => setLoaded(true)}
                  style={
                    videoCrop
                      ? {
                          width: `${videoCrop.scale * 100}%`,
                          height: `${videoCrop.scale * 100}%`,
                          left: `${((1 - videoCrop.scale) * 100) / 2}%`,
                          top: `${-videoCrop.top}%`,
                        }
                      : undefined
                  }
                />
              )}
              {loaderGone && (
                <ExpandVideoButton onClick={() => setFullView(true)} />
              )}
              {!loaderGone && (
                <div
                  className={cn(
                    styles.loader,
                    branded && styles.vkLoader,
                    loaderFading && styles.loaderDone,
                  )}
                  role="status"
                  aria-label={`Загружается видео проекта ${projectTitle}`}
                >
                  {branded ? (
                    <VodokanalLoaderArt />
                  ) : (
                    <>
                      <span className={styles.spinner} />
                      <strong>{projectTitle}</strong>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <PlaceholderApp title={projectTitle} />
          )}
        </div>
      </div>

      <VideoLightbox
        videoId={fullView ? id : null}
        title={projectTitle}
        onClose={() => setFullView(false)}
      />
    </div>
  );
}

/** Бишкекводоканал: the drop falls into the blue disc, rings spread across
 *  the water, the wave rises and rolls, then the name — the logo from their
 *  system, on the deep navy of its sidebar. */
function VodokanalLoaderArt() {
  return (
    <div className={styles.vkStage} aria-hidden="true">
      <span className={styles.vkMarkWrap}>
        <span className={styles.vkRipple} />
        <span className={cn(styles.vkRipple, styles.vkRippleLate)} />
        <svg viewBox="0 0 64 64" className={styles.vkMark}>
          <defs>
            <clipPath id="vk-disc">
              <circle cx="32" cy="32" r="30" />
            </clipPath>
          </defs>
          <circle cx="32" cy="32" r="30" fill="#1f6fe0" className={styles.vkDisc} />
          <g clipPath="url(#vk-disc)">
            <g className={styles.vkWaveRise}>
              <g className={styles.vkWaveFlow}>
                <path
                  d="M-20 44 C-10 38 0 50 10 44 S30 38 40 44 S60 50 70 44 S90 38 100 44 S120 50 130 44 S150 38 160 44 V70 H-20 Z"
                  fill="#0b3a82"
                />
                <path
                  d="M-20 44 C-10 38 0 50 10 44 S30 38 40 44 S60 50 70 44 S90 38 100 44 S120 50 130 44 S150 38 160 44"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.6"
                />
              </g>
            </g>
          </g>
          <path
            className={styles.vkDrop}
            d="M32 11 C32 11 22 24 22 31 A10 10 0 0 0 42 31 C42 24 32 11 32 11 Z"
            fill="#c4e6ff"
          />
        </svg>
      </span>
      <span className={styles.vkWord}>
        Бишкекводоканал
        <span className={styles.vkTrack} />
      </span>
    </div>
  );
}

/** Stand-in admin UI until a project's recording is ready. */
function PlaceholderApp({ title }: { title: string }) {
  return (
    <div className={styles.app} aria-label={`${title} — скоро здесь будет видео`}>
      <aside className={styles.sidebar}>
        <span className={styles.brand} />
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={cn(styles.navItem, i === 1 && styles.navActive)} />
        ))}
      </aside>
      <div className={styles.main}>
        <div className={styles.kpis}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.kpi}>
              <span />
              <strong />
            </div>
          ))}
        </div>
        <div className={styles.table}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.row}>
              <span className={styles.avatar} />
              <span className={styles.cell} style={{ width: `${34 + ((i * 17) % 28)}%` }} />
              <span className={cn(styles.badge, i % 2 === 0 && styles.badgeOn)} />
            </div>
          ))}
        </div>
        <span className={styles.soon}>Видео проекта скоро</span>
      </div>
    </div>
  );
}

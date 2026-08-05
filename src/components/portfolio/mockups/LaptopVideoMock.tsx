"use client";

import Image from "next/image";
import { Laptop, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/lib/motion";
import styles from "./LaptopVideoMock.module.css";

type Props = {
  /** YouTube id or any YouTube link. */
  url: string;
  /** Domain shown on the screen label, e.g. "avangardstyle.kg". */
  address?: string;
  accent?: string;
  className?: string;
};

const MOBILE_SCREENS = [
  { src: "/project/avangard-mob1.png", width: 430, height: 932 },
  { src: "/project/avangard-mob2.png", width: 370, height: 772 },
  { src: "/project/avangard-mob3.png", width: 370, height: 715 },
] as const;

const LOADER_DURATION_MS = 2200;
const LOADER_TIMEOUT_MS = 8000;
const LOADER_FADE_MS = 400;

function ytId(input: string): string {
  if (!/[/.]/.test(input)) return input;
  const match = input.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);
  return match ? match[1] : input;
}

function AvangardLoader({ fading }: { fading: boolean }) {
  return (
    <div
      className={cn(styles.videoLoader, fading && styles.videoLoaderFading)}
      role="status"
      aria-label="Загружается видео проекта Avangard Style"
    >
      <div className={styles.loaderLogo} aria-hidden="true">
        <svg
          viewBox="0 0 1230 390"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.loaderMark}
        >
          <path d="M217.5 3.5H292.5L338 119.5L259 146.5L217.5 3.5Z" fill="#0090FC" className={styles.loaderPart} />
          <path d="M217.5 3.5H292.5L338 119.5L259 146.5L217.5 3.5Z" fill="#084477" className={styles.loaderPart} />
          <path d="M217.5 3.5H292.5L338 119.5L259 146.5L217.5 3.5Z" fill="#fff" className={styles.loaderPart} />

          <path d="M217.5 3.5H292.5L212 177L0 392L217.5 3.5Z" fill="#0090FC" className={styles.loaderPart} />
          <path d="M217.5 3.5H292.5L212 177L0 392L217.5 3.5Z" fill="#084477" className={styles.loaderPart} />
          <path d="M217.5 3.5H292.5L212 177L0 392L217.5 3.5Z" fill="#fff" className={styles.loaderPart} />

          <path d="M493 80L477 85.5L212 176.5L0 392L493 80Z" fill="#0090FC" className={styles.loaderPart} />
          <path d="M493 80L477 85.5L212 176.5L0 392L493 80Z" fill="#084477" className={styles.loaderPart} />
          <path d="M493 80L477 85.5L212 176.5L0 392L493 80Z" fill="#fff" className={styles.loaderPart} />

          <path d="M357 166L413 309.5H306.5L278.5 215L357 166Z" fill="#0090FC" className={styles.loaderPart} />
          <path d="M357 166L413 309.5H306.5L278.5 215L357 166Z" fill="#084477" className={styles.loaderPart} />
          <path d="M357 166L413 309.5H306.5L278.5 215L357 166Z" fill="#fff" className={styles.loaderPart} />
        </svg>

        <svg
          viewBox="0 0 6177 1945"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.loaderWord}
        >
          <polygon
            fill="#fff"
            className={styles.loaderLetter}
            points="1961,923 2167,922 2170,922 2304,1259 2431,924 2432,922 2641,923 2410,1527 2409,1529 2198,1529"
          />
          <path
            fill="#fff"
            className={styles.loaderLetter}
            d="M2996 1393c0,0 -50,14 -103,14 -69,0 -73,-39 -73,-75 0,-54 22,-65 88,-65 32,0 61,4 88,10l0 115zm-88 -488c-55,0 -118,5 -178,16l-2 0 -57 148 -6 19 7 -2c51,-13 131,-29 193,-29 112,0 130,21 131,97 -47,-9 -91,-14 -131,-14 -149,0 -236,32 -236,198 0,97 23,148 82,176 70,33 239,7 284,-8l0 23 177 0 0 -390c0,-169 -74,-235 -265,-235z"
          />
          <path
            fill="#fff"
            className={styles.loaderLetter}
            d="M3663 922c-217,-31 -389,33 -389,33l-1 0 0 574 187 0 0 -435c0,0 0,0 1,-1 0,0 43,-23 116,-13 19,2 44,23 52,40 10,20 13,51 13,97l0 312 186 0 0 -338c0,-152 -39,-251 -164,-269z"
          />
          <path
            fill="#fff"
            className={styles.loaderLetter}
            d="M4291 1070l0 271c0,22 -39,38 -91,38 -82,0 -104,-33 -104,-155 0,-154 30,-169 109,-169 24,0 59,4 87,15zm-87 -164c-216,0 -296,87 -296,322 0,220 70,309 243,309 63,0 113,-18 140,-31 -2,71 -46,100 -149,100 -55,0 -113,-8 -181,-27l-4 -1 -33 147 3 1c58,21 146,35 218,35 173,0 332,-35 332,-288l0 -524 -3 -1c-66,-25 -177,-42 -271,-42z"
          />
          <path
            fill="#fff"
            className={styles.loaderLetter}
            d="M5897 1064c52,0 102,20 102,46l0 212c0,11 -6,28 -16,32 -17,8 -46,18 -81,17 -85,-2 -101,-44 -106,-154 -4,-103 17,-154 101,-154zm281 -382l-179 0 0 271c0,0 -81,-31 -139,-31 -147,0 -244,59 -244,298 0,98 17,166 46,216 28,47 100,95 208,92 56,-1 107,-14 129,-22l0 23 177 0 0 -848z"
          />
          <path
            fill="#fff"
            className={styles.loaderLetter}
            d="M4915 1393c0,0 -50,14 -103,14 -69,0 -73,-39 -73,-75 0,-54 22,-65 88,-65 32,0 61,4 88,10l0 115zm177 -256l0 0c0,0 0,-1 0,-1 0,-7 0,-15 -1,-22l0 0c-8,-159 -91,-210 -260,-210 -88,0 -187,14 -255,32l-1 146c50,-15 140,-26 208,-26 92,0 120,11 129,58l0 0c1,5 2,11 2,18 0,0 0,1 0,1 0,6 1,13 1,21 -47,-9 -91,-14 -131,-14 -149,0 -236,32 -236,198 0,97 23,149 82,176 70,33 239,7 284,-8l0 23 177 0 0 -390c0,-1 0,-2 0,-2z"
          />
          <path
            fill="#fff"
            className={styles.loaderLetter}
            d="M5609 915l-62 161 -21 -3c-9,0 -18,-1 -26,-1 -56,0 -116,18 -116,56l0 400 -187 0 0 -608 187 0 0 42c34,-32 66,-54 140,-58 37,-2 69,5 85,10z"
          />
        </svg>
      </div>
    </div>
  );
}

export function LaptopVideoMock({
  url,
  address = "itdos.ru",
  accent = "#6e56ff",
  className,
}: Props) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [loaderHidden, setLoaderHidden] = useState(false);
  const reduced = useReducedMotion();
  const [viewRef, inView] = useInView<HTMLDivElement>("0px");
  const loaderFading = introComplete && videoLoaded;
  const id = ytId(url);
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    "&controls=0&modestbranding=1&rel=0&iv_load_policy=3" +
    "&disablekb=1&fs=0&playsinline=1";

  useEffect(() => {
    if (!inView || view !== "desktop" || loaderHidden) return;

    const introTimer = window.setTimeout(
      () => setIntroComplete(true),
      reduced ? 0 : LOADER_DURATION_MS,
    );
    const timeoutTimer = window.setTimeout(
      () => setVideoLoaded(true),
      LOADER_TIMEOUT_MS,
    );

    return () => {
      window.clearTimeout(introTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, [inView, loaderHidden, reduced, view]);

  useEffect(() => {
    if (!loaderFading || loaderHidden) return;

    const fadeTimer = window.setTimeout(
      () => setLoaderHidden(true),
      reduced ? 0 : LOADER_FADE_MS,
    );

    return () => window.clearTimeout(fadeTimer);
  }, [loaderFading, loaderHidden, reduced]);

  const showDesktopView = () => {
    if (view === "mobile") {
      setVideoLoaded(false);
      setIntroComplete(false);
      setLoaderHidden(false);
    }
    setView("desktop");
  };

  return (
    <div
      className={cn("relative h-full w-full", styles.scene, className)}
      style={{ "--scene-accent": accent } as React.CSSProperties}
    >
      <div className={styles.deviceToggle} aria-label="Формат просмотра">
        <button
          type="button"
          onClick={showDesktopView}
          aria-label="Десктопная версия"
          aria-pressed={view === "desktop"}
          className={cn(
            styles.toggleButton,
            view === "desktop" && styles.toggleButtonActive,
          )}
        >
          <Laptop size={16} strokeWidth={1.7} />
        </button>
        <button
          type="button"
          onClick={() => setView("mobile")}
          aria-label="Мобильная версия"
          aria-pressed={view === "mobile"}
          className={cn(
            styles.toggleButton,
            view === "mobile" && styles.toggleButtonActive,
          )}
        >
          <Smartphone size={15} strokeWidth={1.7} />
        </button>
      </div>

      <div
        className={cn(
          styles.photoStage,
          view !== "desktop" && styles.previewHidden,
        )}
        aria-hidden={view !== "desktop"}
      >
        <div ref={viewRef} className={styles.screen}>
          <div aria-hidden="true" className={styles.fallback} />

          {inView && view === "desktop" && (
            <iframe
              src={src}
              title={`Проект — ${address}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              tabIndex={-1}
              onLoad={() => setVideoLoaded(true)}
            />
          )}

          {inView && view === "desktop" && !loaderHidden && (
            <AvangardLoader fading={loaderFading} />
          )}

          <div aria-hidden="true" className={styles.glass} />
        </div>

        <Image
          src="/mac-2.png"
          alt=""
          width={1536}
          height={1024}
          sizes="(min-width: 1024px) 55vw, 100vw"
          className={styles.photo}
        />
      </div>

      <div
        className={cn(
          styles.mobileStage,
          view === "mobile" && styles.mobileStageVisible,
        )}
        aria-hidden={view !== "mobile"}
      >
        {MOBILE_SCREENS.map(({ src, width, height }, index) => (
          <div
            key={src}
            className={cn(
              styles.mobilePhone,
              index === 0 && styles.mobilePhoneLeft,
              index === 1 && styles.mobilePhoneCenter,
              index === 2 && styles.mobilePhoneRight,
            )}
            style={
              {
                "--phone-aspect": `${width + 16} / ${height + 40}`,
              } as React.CSSProperties
            }
          >
            <div className={styles.mobilePhoneScreen}>
              <div className={styles.mobileFallback}>
                <span>0{index + 1}</span>
                <strong>Mobile screen</strong>
                <small>project/avangard-mob{index + 1}.png</small>
              </div>
              <Image
                src={src}
                alt={`Мобильная версия сайта — экран ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 14vw, 24vw"
                className={styles.mobileScreenImage}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <div aria-hidden="true" className={styles.mobileGlass} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

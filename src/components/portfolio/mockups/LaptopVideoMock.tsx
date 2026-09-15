"use client";

import Image from "next/image";
import { Expand, Laptop, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { DURATION, EASE, useReducedMotion } from "@/lib/motion";
import { ScreenLightbox, type LightboxScreen } from "./ScreenLightbox";
import {
  ExpandVideoButton,
  VideoLightbox,
  usePauseWhileFullView,
} from "./VideoLightbox";
import styles from "./LaptopVideoMock.module.css";

type MobileScreen = {
  src?: string;
  width: number;
  height: number;
};

type Props = {
  /** YouTube id or any YouTube link. */
  url: string;
  /** Domain shown on the screen label, e.g. "avangardstyle.kg". */
  address?: string;
  accent?: string;
  className?: string;
  projectTitle?: string;
  mobileScreens?: readonly MobileScreen[];
  /** False while the mockup's step isn't the one on screen: no player is
   *  created. The desktop column stacks every step's mockup, so otherwise a
   *  second (hidden) video ran alongside — and could pause this one. */
  active?: boolean;
  /** Controlled laptop/phones view, so the choice survives a project
   *  switch (each project remounts the mockup). Uncontrolled if omitted. */
  view?: "desktop" | "mobile";
  onViewChange?: (view: "desktop" | "mobile") => void;
  /** False where the mockup is only a picture inside a link (portfolio
   *  list rows): no view toggle, no full-screen button. */
  controls?: boolean;
  /** Centre the devices in their box. By default (the home page column)
   *  the group sits a little left so the laptop can grow into the gap. */
  centered?: boolean;
};

const PLACEHOLDER_MOBILE_SCREENS: readonly MobileScreen[] = [
  { width: 393, height: 852 },
  { width: 393, height: 852 },
  { width: 393, height: 852 },
] as const;

type FanPosition = {
  xPercent: number;
  yPercent: number;
  rotation: number;
  scale: number;
};

// Per ring of the fan, counted from the centre phone outwards. Offsets are a
// share of a phone's own width: ±54% keeps the side screenshots peeking out
// from behind the middle phone; the outer ring sits further out and smaller.
const FAN_RINGS = [
  { x: 0, y: 0, rotation: 0, scale: 1 },
  { x: 54, y: 4, rotation: 7, scale: 0.84 },
  { x: 98, y: 8, rotation: 11, scale: 0.7 },
] as const;

/** Signed distance of a phone from the centre of the fan (…, -1, 0, 1, …). */
function fanOffset(index: number, count: number) {
  return index - (count - 1) / 2;
}

function fanPosition(index: number, count: number): FanPosition {
  const offset = fanOffset(index, count);
  const ring =
    FAN_RINGS[Math.min(Math.round(Math.abs(offset)), FAN_RINGS.length - 1)];
  const side = Math.sign(offset);
  return {
    xPercent: -50 + side * ring.x,
    yPercent: -50 + ring.y,
    rotation: side * ring.rotation,
    scale: ring.scale,
  };
}

/** Stacking and dimming: the centre on top, the left side a touch darker. */
function fanPhoneStyle(index: number, count: number): React.CSSProperties {
  const offset = fanOffset(index, count);
  const depth = Math.round(Math.abs(offset));
  if (depth === 0) return { zIndex: 10 };
  const brightness = (offset < 0 ? 0.7 : 0.78) - (depth - 1) * 0.16;
  // A variable rather than `filter` itself, so :hover in CSS can lift it.
  return {
    zIndex: 10 - depth * 2 - (offset < 0 ? 1 : 0),
    "--phone-brightness": brightness,
  } as React.CSSProperties;
}

/** Phones in the fan; any further screens only appear in the viewer. */
const FAN_SIZE = 3;

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
      className={cn(
        styles.videoLoader,
        styles.avangardLoader,
        fading && styles.videoLoaderFading,
      )}
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

function ProjectVideoLoader({
  fading,
  title,
}: {
  fading: boolean;
  title: string;
}) {
  return (
    <div
      className={cn(styles.videoLoader, fading && styles.videoLoaderFading)}
      role="status"
      aria-label={`Загружается видео проекта ${title}`}
    >
      <div className={styles.genericLoaderContent}>
        <span aria-hidden="true" />
        <strong>{title}</strong>
        <small>Загружаем проект</small>
      </div>
    </div>
  );
}

const TOOLOR_LETTERS = [
  { left: 0, right: 83.5, y: "-0.7rem", rotation: "-4deg" },
  { left: 16.5, right: 64.5, y: "0.65rem", rotation: "3deg" },
  { left: 35.5, right: 45, y: "-0.65rem", rotation: "-2deg" },
  { left: 55, right: 29.5, y: "0.65rem", rotation: "2deg" },
  { left: 70.5, right: 11.5, y: "-0.65rem", rotation: "-3deg" },
  { left: 88.5, right: 0, y: "0.65rem", rotation: "3deg" },
] as const;

function ToolorLoader({ fading }: { fading: boolean }) {
  return (
    <div
      className={cn(
        styles.videoLoader,
        styles.toolorLoader,
        fading && styles.videoLoaderFading,
      )}
      role="status"
      aria-label="Загружается видео проекта Toolor"
    >
      <div className={styles.toolorLoaderStage} aria-hidden="true">
        <div className={styles.toolorLetterWord}>
          {TOOLOR_LETTERS.map((letter, index) => (
            <span
              key={`${letter.left}-${letter.right}`}
              className={styles.toolorLetter}
              style={
                {
                  "--letter-left": `${letter.left}%`,
                  "--letter-right": `${letter.right}%`,
                  "--letter-y": letter.y,
                  "--letter-rotation": letter.rotation,
                  "--letter-delay": `${140 + index * 105}ms`,
                } as React.CSSProperties
              }
            >
              <Image
                src="/logos/toolor.svg"
                alt=""
                width={184}
                height={48}
                className={styles.toolorLetterImage}
              />
            </span>
          ))}
        </div>
        <span className={styles.toolorLoaderTrack} />
      </div>
    </div>
  );
}

const BILMONT_WORD = "Bilmont";

/** The two bowls of the Bilmont «B» slide in from opposite sides and lock
 *  together, then the wordmark rises letter by letter — the brand's cream
 *  and olive, from public/logos/bilmont.svg. */
function BilmontLoader({ fading }: { fading: boolean }) {
  return (
    <div
      className={cn(
        styles.videoLoader,
        styles.bilmontLoader,
        fading && styles.videoLoaderFading,
      )}
      role="status"
      aria-label="Загружается видео проекта Bilmont"
    >
      <div className={styles.bilmontStage} aria-hidden="true">
        {/* The bowls touch in the source logo; at loader size that read as
            one glued blob, so the lower one sits 12 units down. The offset
            lives on a <g> because the CSS animation owns the path's own
            transform. */}
        <svg
          viewBox="0 0 160 232"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.bilmontMark}
        >
          <path
            className={styles.bilmontBowlTop}
            d="M0 12C0 5.373 5.373 0 12 0H92C126 0 160 27 160 55C160 83 126 110 92 110H12C5.373 110 0 104.627 0 98V12Z"
            fill="#7D9955"
          />
          <g transform="translate(0 12)">
            <path
              className={styles.bilmontBowlBottom}
              d="M0 122C0 115.373 5.373 110 12 110H92C126 110 160 137 160 165C160 193 126 220 92 220H12C5.373 220 0 214.627 0 208V122Z"
              fill="#7D9955"
            />
          </g>
        </svg>

        <span className={styles.bilmontWord}>
          {BILMONT_WORD.split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className={styles.bilmontLetter}
              style={
                { "--letter-delay": `${620 + index * 70}ms` } as React.CSSProperties
              }
            >
              {letter}
            </span>
          ))}
          <span className={styles.bilmontTrack} />
        </span>
      </div>
    </div>
  );
}

export type VideoBrand = "avangard" | "toolor" | "bilmont";

/** Which project gets its own branded intro. Matched loosely: the home
 *  slider calls it "Bilmont", the portfolio "Bilmont School". */
export function videoBrand(title = "", address = ""): VideoBrand | null {
  const key = `${title} ${address}`.toLowerCase();
  if (key.includes("avangard")) return "avangard";
  if (key.includes("toolor")) return "toolor";
  if (key.includes("bilmont")) return "bilmont";
  return null;
}

/** A project's branded intro over the video while it loads — also used by
 *  the plain browser window. Fills the nearest positioned box. */
export function BrandVideoLoader({
  brand,
  fading,
}: {
  brand: VideoBrand;
  fading: boolean;
}) {
  if (brand === "avangard") return <AvangardLoader fading={fading} />;
  if (brand === "toolor") return <ToolorLoader fading={fading} />;
  return <BilmontLoader fading={fading} />;
}

export function LaptopVideoMock({
  url,
  address = "itdos.ru",
  accent = "#6e56ff",
  className,
  projectTitle = "Проект ITDOS",
  mobileScreens,
  active = true,
  view: viewProp,
  onViewChange,
  controls = true,
  centered = false,
}: Props) {
  const [innerView, setInnerView] = useState<"desktop" | "mobile">(
    viewProp ?? "desktop",
  );
  const view = viewProp ?? innerView;
  const setView = (next: "desktop" | "mobile") => {
    setInnerView(next);
    onViewChange?.(next);
  };
  const playerRef = useRef<HTMLIFrameElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [videoFullView, setVideoFullView] = useState(false);
  const reduced = useReducedMotion();
  const [viewRef, seen] = useInView<HTMLDivElement>("0px");
  const inView = seen && active;
  const photoStageRef = useRef<HTMLDivElement>(null);
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const motionReadyRef = useRef(false);
  const loaderFading = introComplete && videoLoaded;
  const id = ytId(url);
  const allScreens = mobileScreens?.length
    ? mobileScreens
    : PLACEHOLDER_MOBILE_SCREENS;
  // The fan always shows three phones — the middle three of the list, so a
  // project's lead screen (placed mid-list) stays in the centre. Every
  // screen, the extra ones included, is in the full-size viewer.
  const fanStart = Math.max(0, Math.floor((allScreens.length - FAN_SIZE) / 2));
  const screens = allScreens.slice(fanStart, fanStart + FAN_SIZE);
  const screenCount = screens.length;
  const lightboxScreens = allScreens.filter(
    (screen): screen is LightboxScreen => Boolean(screen.src),
  );
  const brand = videoBrand(projectTitle, address);
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    "&controls=0&modestbranding=1&rel=0&iv_load_policy=3" +
    "&disablekb=1&fs=0&playsinline=1&enablejsapi=1";

  usePauseWhileFullView(playerRef, videoFullView);

  useEffect(() => {
    if (!id || !inView || view !== "desktop" || loaderHidden) return;

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
  }, [id, inView, loaderHidden, reduced, view]);

  useEffect(() => {
    if (!loaderFading || loaderHidden) return;

    const fadeTimer = window.setTimeout(
      () => setLoaderHidden(true),
      reduced ? 0 : LOADER_FADE_MS,
    );

    return () => window.clearTimeout(fadeTimer);
  }, [loaderFading, loaderHidden, reduced]);

  useEffect(() => {
    const photoStage = photoStageRef.current;
    const mobileStage = mobileStageRef.current;
    const phones = phoneRefs.current.slice(0, screenCount);

    if (
      !photoStage ||
      !mobileStage ||
      phones.length !== screenCount ||
      !phones.every(Boolean)
    ) {
      return;
    }

    const centerIndex = Math.floor((screenCount - 1) / 2);
    const centerPhone = phones[centerIndex] as HTMLDivElement;
    const sidePhones = phones.filter(
      (_, index) => index !== centerIndex,
    ) as HTMLDivElement[];
    // Rings of side phones from the centre outwards — each ring fans out a
    // beat after the one inside it.
    const phoneRings: HTMLDivElement[][] = [];
    phones.forEach((phone, index) => {
      if (index === centerIndex) return;
      const ring =
        Math.round(Math.abs(fanOffset(index, screenCount))) - 1;
      (phoneRings[ring] ??= []).push(phone as HTMLDivElement);
    });
    const collapsedSidePhone = {
      xPercent: -50,
      yPercent: -50,
      rotation: 0,
      scale: 0.78,
      autoAlpha: 0,
    };
    const collapsedCenterPhone = {
      xPercent: -50,
      yPercent: -50,
      rotation: 0,
      scaleX: 1.9,
      scaleY: 0.72,
      autoAlpha: 0,
    };
    const mobilePhonePositions = phones.map((_, index) =>
      fanPosition(index, screenCount),
    );

    const setDesktopState = () => {
      gsap.set(photoStage, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        autoAlpha: 1,
      });
      gsap.set(mobileStage, {
        autoAlpha: 0,
        y: 18,
        scale: 0.94,
        visibility: "hidden",
        pointerEvents: "none",
      });
      gsap.set(sidePhones, collapsedSidePhone);
      gsap.set(centerPhone, collapsedCenterPhone);
    };

    const setMobileState = () => {
      gsap.set(photoStage, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: -10,
        scaleX: 0.38,
        scaleY: 0.86,
        autoAlpha: 0,
      });
      gsap.set(mobileStage, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        visibility: "visible",
        pointerEvents: "auto",
      });
      phones.forEach((phone, index) => {
        gsap.set(phone, {
          ...mobilePhonePositions[index],
          autoAlpha: 1,
        });
      });
    };

    if (!motionReadyRef.current) {
      motionReadyRef.current = true;
      if (view === "desktop") setDesktopState();
      else setMobileState();
      return;
    }

    if (reduced) {
      if (view === "desktop") setDesktopState();
      else setMobileState();
      return;
    }

    gsap.killTweensOf([photoStage, mobileStage, ...phones]);

    const timeline = gsap.timeline({
      defaults: {
        duration: DURATION.base,
        ease: EASE.inOut,
        overwrite: "auto",
      },
    });

    if (view === "mobile") {
      timeline
        .set(mobileStage, {
          visibility: "visible",
          pointerEvents: "auto",
        })
        .to(
          photoStage,
          {
            y: -10,
            scaleX: 0.38,
            scaleY: 0.86,
            autoAlpha: 0,
            duration: DURATION.base,
          },
          0,
        )
        .to(
          mobileStage,
          { autoAlpha: 1, y: 0, scale: 1, duration: DURATION.fast },
          0.18,
        )
        .to(
          centerPhone,
          {
            ...mobilePhonePositions[centerIndex],
            autoAlpha: 1,
            duration: DURATION.base,
          },
          0.08,
        );
      phoneRings.forEach((ring, ringIndex) => {
        ring.forEach((phone) => {
          timeline.to(
            phone,
            {
              ...mobilePhonePositions[phones.indexOf(phone)],
              autoAlpha: 1,
              duration: DURATION.base,
            },
            0.26 + ringIndex * 0.12,
          );
        });
      });
    } else {
      timeline
        .set(photoStage, { visibility: "visible", pointerEvents: "auto" })
        .to(
          sidePhones,
          { ...collapsedSidePhone, duration: DURATION.base },
          0,
        )
        .to(
          centerPhone,
          { ...collapsedCenterPhone, duration: DURATION.base },
          0.08,
        )
        .to(
          mobileStage,
          { autoAlpha: 0, y: 18, scale: 0.94, duration: DURATION.fast },
          0.34,
        )
        .to(
          photoStage,
          {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            autoAlpha: 1,
            duration: DURATION.slow,
          },
          0.08,
        )
        .set(mobileStage, {
          visibility: "hidden",
          pointerEvents: "none",
        });
    }

    return () => {
      timeline.kill();
    };
  }, [reduced, screenCount, view]);

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
      className={cn(
        "relative h-full w-full",
        styles.scene,
        centered && styles.centered,
        className,
      )}
      style={{ "--scene-accent": accent } as React.CSSProperties}
    >
      {controls && (
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
      )}

      <div
        ref={photoStageRef}
        className={styles.photoStage}
        aria-hidden={view !== "desktop"}
      >
        <div ref={viewRef} className={styles.screen}>
          <div aria-hidden="true" className={styles.fallback} />

          {inView && view === "desktop" && id && (
            <iframe
              ref={playerRef}
              src={src}
              title={`Проект — ${address}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              tabIndex={-1}
              onLoad={() => setVideoLoaded(true)}
            />
          )}

          {inView && view === "desktop" && id && !loaderHidden && (
            brand ? (
              <BrandVideoLoader brand={brand} fading={loaderFading} />
            ) : (
              <ProjectVideoLoader
                fading={loaderFading}
                title={projectTitle}
              />
            )
          )}

          {!id && (
            <div className={styles.desktopPlaceholder}>
              <span>Лендинг</span>
              <strong>{projectTitle}</strong>
              <small>Видео проекта появится здесь</small>
            </div>
          )}

          <div aria-hidden="true" className={styles.glass} />

          {controls && id && view === "desktop" && (
            <ExpandVideoButton onClick={() => setVideoFullView(true)} />
          )}
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
        ref={mobileStageRef}
        className={styles.mobileStage}
        aria-hidden={view !== "mobile"}
      >
        {screens.map(({ src, width, height }, index) => (
          <div
            key={`${src ?? "placeholder"}-${index}`}
            ref={(element) => {
              phoneRefs.current[index] = element;
            }}
            className={styles.mobilePhone}
            data-fan-center={
              fanOffset(index, screenCount) === 0 ? "" : undefined
            }
            style={
              {
                ...fanPhoneStyle(index, screenCount),
                "--phone-aspect": `${width + 16} / ${height + 40}`,
              } as React.CSSProperties
            }
          >
            <div className={styles.mobilePhoneScreen}>
              <div className={styles.mobileFallback}>
                <span>0{index + 1}</span>
                <strong>{projectTitle}</strong>
                <small>Мобильный экран — заглушка</small>
              </div>
              {src && (
                <Image
                  src={src}
                  alt={`${projectTitle} — мобильный экран ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 14vw, 24vw"
                  className={styles.mobileScreenImage}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div aria-hidden="true" className={styles.mobileGlass} />
              {src && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex(
                      lightboxScreens.findIndex((screen) => screen.src === src),
                    )
                  }
                  aria-label={`Открыть экран ${index + 1} проекта ${projectTitle}`}
                  data-cursor="card"
                  data-cursor-label="СМОТРЕТЬ"
                  className={styles.mobileScreenOpen}
                >
                  <span aria-hidden="true" className={styles.mobileScreenHint}>
                    <Expand size={14} strokeWidth={1.8} />
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <VideoLightbox
        videoId={videoFullView ? id : null}
        title={projectTitle}
        onClose={() => setVideoFullView(false)}
      />

      <ScreenLightbox
        screens={lightboxScreens}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        projectTitle={projectTitle}
        accent={accent}
      />
    </div>
  );
}

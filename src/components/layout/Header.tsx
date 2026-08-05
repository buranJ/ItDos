"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navigation } from "./Navigation";
import { DesktopNav } from "./DesktopNav";
import { cn } from "@/lib/utils";

export const navLinks = [
  { label: "Услуги", href: "/services" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "О нас", href: "/about" },
  { label: "Процесс", href: "/process" },
  { label: "Блог", href: "/blog" },
];

/** Relative luminance of an `rgb()` / `rgba()` computed colour. */
function luminance(color: string): number | null {
  const parts = color.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return null;
  const alpha = parts.length > 3 ? Number(parts[3]) : 1;
  if (alpha < 0.5) return null; // effectively transparent — keep looking
  const [r, g, b] = parts.slice(0, 3).map((n) => {
    const c = Number(n) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Walk up until we hit an element that actually paints a background. */
function backdropIsLight(start: Element | null): boolean {
  let node: Element | null = start;
  while (node) {
    const l = luminance(getComputedStyle(node).backgroundColor);
    if (l !== null) return l > 0.4;
    node = node.parentElement;
  }
  return false;
}

/**
 * Floating island header.
 *
 * Detached from the viewport edge rather than a full-bleed bar: the page
 * scrolls *past* it instead of under a lid, which keeps the hero's floating
 * chips readable, and the rounded container reads as a control surface rather
 * than browser chrome.
 *
 * The island samples whatever sits underneath and flips its own treatment —
 * the site alternates light and dark chapters, so a single fixed tint would
 * be wrong on half the page.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight] = useState(false);
  /** False until the first sample resolves, so nothing animates from the
   *  placeholder state into the real one. */
  const [settled, setSettled] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    let frame = 0;

    const sample = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);

      const island = document.querySelector("[data-header-island]");
      const rect = island?.getBoundingClientRect();
      const probeY = (rect ? rect.bottom : 64) + 6;
      const stack = document.elementsFromPoint(window.innerWidth / 2, probeY);
      // `body` and `html` are deliberately excluded. The page-transition
      // wrapper starts at visibility:hidden, and hit-testing skips hidden
      // elements — so the very first sample fell through to <body>, read the
      // dark canvas colour and left the white logo on the light island until
      // something forced a re-sample. No hit means "don't know": keep the
      // current value rather than guessing.
      const beneath = stack.find(
        (el) =>
          !el.closest("header") &&
          el !== document.documentElement &&
          el !== document.body,
      );
      if (!beneath) return;
      setOnLight(backdropIsLight(beneath));

      // Enable transitions one frame later: if they were on for this commit,
      // the browser would animate from the placeholder colour to the real one.
      if (!settledRef.current) {
        settledRef.current = true;
        requestAnimationFrame(() => setSettled(true));
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sample);
    };

    sample();
    // Re-sample while the entrance animation is still unhiding the content.
    const retries = [120, 400, 1000, 1800].map((ms) => setTimeout(sample, ms));

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      retries.forEach(clearTimeout);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-5",
        scrolled ? "pt-2 sm:pt-2.5" : "pt-3 sm:pt-5",
      )}
    >
      <div
        data-header-island
        className={cn(
          // `lg:pl-12` lines the logo up with the page's content edge
          // (Container is max-w-7xl with lg:px-12), so the island reads as
          // part of the grid rather than floating loose above it.
          "mx-auto flex items-center justify-between gap-4 rounded-full border py-2 pl-4 pr-2 sm:pl-5 lg:pl-12",
          settled && "transition-all duration-500",
          // Contracting on scroll gives a physical sense of the page moving
          // past a fixed object, without changing its height.
          scrolled ? "max-w-5xl" : "max-w-7xl",
          onLight
            ? scrolled
              ? "border-black/8 bg-white/80 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
              : "border-black/6 bg-white/55 shadow-[0_8px_30px_-16px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            : scrolled
              ? "border-white/12 bg-[#0f0f13]/80 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
              : "border-white/8 bg-[#0f0f13]/45 shadow-[0_8px_30px_-16px_rgba(0,0,0,0.45)] backdrop-blur-xl",
        )}
      >
        <Link
          href="/"
          aria-label="ITDOS — на главную"
          data-cursor="link"
          className="shrink-0 transition-opacity duration-200 hover:opacity-70"
        >
          {/* One asset, recoloured — not two images cross-fading.
              The cross-fade had a dead window: mid-transition BOTH marks sat
              near 50% opacity, so the white one was invisible and the black one
              washed out, and the header looked like it had no logo at all. It
              self-corrected in ~600ms, which is exactly why it looked random —
              you saw it only if you looked right after a reload.
              The wordmark is flat monochrome, so it can be an alpha mask with
              the colour coming from `background-color`: a colour can never be
              half-absent the way two stacked images can. Aspect ratio is the
              file's real 372×170, so nothing is stretched. */}
          <span
            aria-hidden="true"
            className={cn(
              "block h-10 aspect-[372/170] sm:h-11",
              onLight ? "bg-[#0a0a0a]" : "bg-white",
              // Transitions only switch on after the first resolved sample, so
              // the initial state snaps into place instead of animating from
              // the wrong colour. Kept much shorter than the island's 500ms
              // fade: while both interpolate they briefly pass through similar
              // mid-greys, and the quicker the mark commits, the shorter that
              // low-contrast crossing lasts.
              settled && "transition-colors duration-150",
            )}
            style={{
              maskImage: "url(/logo.png)",
              WebkitMaskImage: "url(/logo.png)",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "left center",
              WebkitMaskPosition: "left center",
            }}
          />
        </Link>

        <DesktopNav links={navLinks} onLight={onLight} />

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            data-cursor="button"
            className={cn(
              "group hidden items-center gap-2 rounded-full bg-accent py-2.5 pl-5 pr-2.5 text-sm font-medium text-accent-ink transition-all duration-300 hover:bg-accent-bright lg:inline-flex",
              "shadow-[0_4px_18px_-4px_rgba(110,86,255,0.55)] hover:shadow-[0_6px_24px_-4px_rgba(110,86,255,0.7)]",
            )}
          >
            Обсудить проект
            {/* The arrow sits in its own circle — the CTA reads as a control,
                not a coloured word. */}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={13} />
            </span>
          </Link>

          <Navigation onLight={onLight} />
        </div>
      </div>
    </header>
  );
}

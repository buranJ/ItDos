"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { clients, CLIENT_BOX, type Client } from "@/data/clients";

/** Marks are shown smaller here than on a full logo wall. */
const SCALE = 0.58;
/** One full pass. Shorter than the shared 38s: twelve marks need to come
 *  round often enough that nobody has to wait to see the last three. */
const LOOP = "24s";

/**
 * Client logo strip on the dark canvas — marks sit directly on it, no chips.
 *
 * Each mark is drawn as a CSS mask rather than an `<img>`: the SVG supplies
 * only its silhouette and the colour comes from `background-color`. That is
 * what makes this possible at all. The files are single dark colours
 * (#00417D, #0033a1, #050505 …) which are invisible on near-black, so they
 * cannot simply be shown; and CSS filters can lighten a mark but cannot steer
 * it to a chosen hue. A mask can, exactly, and a colour transition has no
 * half-way state where the mark disappears.
 *
 * Trade-off: masking flattens artwork to one colour, so any internal knockout
 * detail (Имбирь's white glyph inside the orange badge) is filled in. At this
 * size that detail was already sub-pixel.
 */
export function ClientMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  /** Index closest to the middle of the screen — the "hover" of a touch device. */
  const [centred, setCentred] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef(0);

  // Two passes of the roster: the keyframes translate by -50%, so the second
  // copy is what makes the loop seamless.
  const row = [...clients, ...clients];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = -1;
    const tick = () => {
      const mid = window.innerWidth / 2;
      let best = -1;
      let bestDist = Infinity;

      for (let i = 0; i < track.children.length; i++) {
        const r = (track.children[i] as HTMLElement).getBoundingClientRect();
        if (r.right < 0 || r.left > window.innerWidth) continue;
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      // Only re-render when the winner actually changes.
      if (best !== last) {
        last = best;
        setCentred(best >= 0 ? best : null);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="select-none overflow-hidden border-y border-line bg-surface/40 py-5 [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]"
      // Touch pauses the travel, otherwise a tap can never land on a moving mark.
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex w-max animate-marquee-left items-center"
        style={{
          animationDuration: LOOP,
          animationPlayState: paused ? "paused" : undefined,
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {row.map((client, i) => (
          <Chip
            key={`${client.logo}-${i}`}
            client={client}
            active={hovered === i || (hovered === null && centred === i)}
            onEnter={() => setHovered(i)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  client,
  active,
  onEnter,
}: {
  client: Client;
  active: boolean;
  onEnter: () => void;
}) {
  const box = CLIENT_BOX[client.size];
  const w = Math.round(box.w * SCALE);
  const h = Math.round(box.h * SCALE);

  const body =
    client.render === "image" ? (
      // Multi-tone artwork keeps its own file so knockouts survive; it only
      // gets desaturated and lifted at rest.
      <Image
        src={client.logo}
        alt={client.name}
        width={w}
        height={h}
        unoptimized
        className="object-contain transition-[filter,opacity] duration-400"
        style={{
          width: w,
          height: h,
          // `brightness(0) invert(1)` flattens the artwork to a plain white
          // silhouette, which is exactly what the masked marks are — so at
          // rest every logo on the strip sits at the same grey, whichever
          // path drew it. Desaturating instead left the lighter files visibly
          // fainter than their neighbours.
          filter: active ? "none" : "brightness(0) invert(1)",
          opacity: active ? 1 : 0.42,
        }}
      />
    ) : (
      <span
        role="img"
        aria-label={client.name}
        className="block transition-colors duration-400"
        style={{
          width: w,
          height: h,
          backgroundColor: active ? client.color : "rgba(255,255,255,0.42)",
          maskImage: `url(${client.logo})`,
          WebkitMaskImage: `url(${client.logo})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );

  return (
    <div onMouseEnter={onEnter} className="flex shrink-0 items-center px-7 sm:px-9">
      {client.project ? (
        <Link
          href={`/portfolio/${client.project}`}
          data-cursor="link"
          aria-label={`${client.name} — смотреть кейс`}
          className="flex items-center"
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}

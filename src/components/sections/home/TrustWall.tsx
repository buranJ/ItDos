"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { clients, CLIENT_BOX, type Client } from "@/data/clients";
import { cn } from "@/lib/utils";

/**
 * Client logo wall.
 *
 * Replaces the marquee, for two reasons that both came out of looking at it:
 *
 *  · Twelve logos do not fit in a scrolling strip. About nine were on screen
 *    at once and the loop ran 38 seconds, so three clients only ever appeared
 *    to someone who stared at the section for half a minute.
 *  · Real logos of wildly different weight never read as a set on their own.
 *    What unifies them is the *cell*, not the artwork — every mark gets the
 *    same tile, the same optical height and the same grey, and the eye reads
 *    the grid instead of twelve competing shapes. This is also why the plain
 *    text version looked tidier: uniform type is uniform by definition.
 *
 * Light tiles on the dark canvas, echoing the pricing cards and the hero
 * chips. The tiles have to be light: every logo we were given is a single
 * dark colour, so the colour reveal is invisible on anything but a light
 * backdrop.
 */
export function TrustWall() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  /** Tile nearest the middle of the screen — the "hover" of a touch device. */
  const [centred, setCentred] = useState<number | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    // With a pointer, hover already says which tile is active.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let last = -1;
    let queued = false;

    const measure = () => {
      queued = false;
      const mid = window.innerHeight / 2;
      let best = -1;
      let bestDist = Infinity;

      for (let i = 0; i < grid.children.length; i++) {
        const r = (grid.children[i] as HTMLElement).getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      if (best !== last) {
        last = best;
        setCentred(best >= 0 ? best : null);
      }
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      rafRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <Section spacing="sm" className="border-y border-line">
      <Container>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            Нам доверяют
          </p>
          <p className="text-sm text-fg-secondary">
            {clients.length} компаний, для которых мы сделали сайты и системы
          </p>
        </div>

        <div
          ref={gridRef}
          onMouseLeave={() => setHovered(null)}
          className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        >
          {clients.map((client, i) => (
            <Tile
              key={client.logo}
              client={client}
              active={hovered === i || (hovered === null && centred === i)}
              onEnter={() => setHovered(i)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Tile({
  client,
  active,
  onEnter,
}: {
  client: Client;
  active: boolean;
  onEnter: () => void;
}) {
  const box = CLIENT_BOX[client.size];
  // White artwork is inverted in both states — otherwise it is simply absent
  // on a light tile. Constant inversion also avoids the mid-transition moment
  // where a half-inverted mark sits on a half-lit tile and neither is legible.
  const light = client.tone === "light";

  const body = (
    <>
      <Image
        src={client.logo}
        alt={client.name}
        width={box.w}
        height={box.h}
        // SVG: skip the optimiser, serve the file as-is.
        unoptimized
        className="max-h-full w-auto max-w-full object-contain transition-[filter,opacity] duration-400"
        style={{
          maxWidth: box.w,
          maxHeight: box.h,
          filter: light ? "invert(1) grayscale(1)" : active ? "grayscale(0)" : "grayscale(1)",
          opacity: active ? 1 : 0.5,
        }}
      />
      <span className="sr-only">{client.name}</span>
    </>
  );

  const tile = cn(
    "flex h-24 items-center justify-center rounded-2xl border px-4 transition-all duration-400 sm:h-28",
    active
      ? "-translate-y-0.5 border-accent/35 bg-white shadow-[0_14px_34px_-14px_rgba(0,0,0,0.55)]"
      : "border-black/5 bg-[#f2f1ec]",
  );

  return client.project ? (
    <Link
      href={`/portfolio/${client.project}`}
      onMouseEnter={onEnter}
      data-cursor="card"
      data-cursor-label="КЕЙС"
      aria-label={`${client.name} — смотреть кейс`}
      className={tile}
    >
      {body}
    </Link>
  ) : (
    <div onMouseEnter={onEnter} className={tile}>
      {body}
    </div>
  );
}

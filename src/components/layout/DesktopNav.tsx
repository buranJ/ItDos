"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

/**
 * Inline desktop navigation with a single indicator pill that slides between
 * items. One moving element instead of a per-item background: the motion
 * reads as one continuous object following the pointer, and there is no
 * cross-fade flicker when moving quickly between neighbours.
 */
export function DesktopNav({
  links,
  onLight,
}: {
  links: NavLink[];
  onLight: boolean;
}) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const activeIndex = links.findIndex((l) => l.href === pathname);
  const target = hovered ?? (activeIndex >= 0 ? activeIndex : null);

  useEffect(() => {
    if (target === null) return;
    const el = itemRefs.current[target];
    const list = listRef.current;
    if (!el || !list) return;
    const a = el.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setPill({ left: a.left - b.left, width: a.width });
  }, [target, pathname]);

  const visiblePill = target === null ? null : pill;

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <div
        ref={listRef}
        onMouseLeave={() => setHovered(null)}
        className="relative flex items-center"
      >
        {/* sliding indicator */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 rounded-full transition-all duration-300 ease-out",
            onLight ? "bg-black/6" : "bg-white/10",
            visiblePill ? "opacity-100" : "opacity-0",
          )}
          style={{
            transform: `translateX(${visiblePill?.left ?? 0}px)`,
            width: visiblePill?.width ?? 0,
            transitionProperty: "transform, width, opacity",
          }}
        />

        {links.map((link, i) => {
          const active = link.href === pathname;
          return (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onMouseEnter={() => setHovered(i)}
              aria-current={active ? "page" : undefined}
              data-cursor="link"
              className={cn(
                "relative z-10 rounded-full px-3.5 py-2 text-sm transition-colors duration-200",
                onLight
                  ? active
                    ? "font-medium text-[#0a0a0a]"
                    : "text-[#0a0a0a]/60 hover:text-[#0a0a0a]"
                  : active
                    ? "font-medium text-fg"
                    : "text-fg-secondary hover:text-fg",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

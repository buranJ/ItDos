"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/motion";
import { BrowserMock, ChatMock, DashboardMock } from "@/components/portfolio/mockups";

/**
 * Hero proof-of-work. Mobile vs desktop is chosen by CSS (not a JS branch),
 * so the server renders the correct layout and there's no hydration swap.
 */
export function HeroShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useMousePosition(({ x, y }) => {
    target.current.x = x / window.innerWidth - 0.5;
    target.current.y = y / window.innerHeight - 0.5;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const layers = root.querySelectorAll<HTMLElement>("[data-layer]");
    if (reduced) {
      gsap.set(layers, { autoAlpha: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        layers,
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 1.2, ease: "power4.out", stagger: 0.15, delay: 0.5 }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (reduced || isMobile) return;
    const root = rootRef.current;
    if (!root) return;
    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    let raf: number;
    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      for (const l of layers) {
        const depth = parseFloat(l.dataset.depth ?? "0");
        l.style.transform = `translate3d(${-current.current.x * depth * 55}px, ${
          -current.current.y * depth * 55
        }px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, isMobile]);

  return (
    <div ref={rootRef}>
      {/* Mobile: layered, floating mini-composition */}
      <div className="relative mx-auto w-full max-w-md pb-4 lg:hidden">
        <div data-layer className="relative rotate-[-2deg]">
          <div className="m-float aspect-[16/12]">
            <BrowserMock accent="#6e56ff" />
          </div>
        </div>
        <div data-layer className="absolute -bottom-2 right-0 w-[44%] rotate-[4deg]">
          <div className="m-float aspect-[3/4] shadow-2xl shadow-black/50" style={{ animationDelay: "0.5s" }}>
            <ChatMock accent="#8b78ff" typing />
          </div>
        </div>
      </div>

      {/* Desktop: depth-layered cluster */}
      <div
        className="relative hidden h-[460px] w-full lg:block lg:h-[560px]"
        style={{ perspective: 1400 }}
      >
        {/* dashboard — back */}
        <div data-depth="0.35" className="absolute right-[1%] top-0 w-[58%]">
          <div data-layer className="rotate-[6deg]">
            <div className="m-float aspect-[16/10] opacity-90" style={{ animationDelay: "1.1s" }}>
              <DashboardMock accent="#2bd4c4" />
            </div>
          </div>
        </div>

        {/* browser — main */}
        <div data-depth="0.85" className="absolute left-0 top-[15%] z-10 w-[74%]">
          <div data-layer className="rotate-[-3deg]">
            <div className="m-float aspect-[16/11] shadow-2xl shadow-black/40">
              <BrowserMock accent="#6e56ff" />
            </div>
          </div>
        </div>

        {/* AI chat — front */}
        <div data-depth="1.5" className="absolute bottom-0 right-[3%] z-20 w-[42%]">
          <div data-layer className="rotate-[3deg]">
            <div className="m-float aspect-[3/4] shadow-2xl shadow-black/50" style={{ animationDelay: "0.5s" }}>
              <ChatMock accent="#8b78ff" typing />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

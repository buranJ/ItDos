"use client";

import { useEffect, useRef } from "react";
import { lerp } from "@/lib/utils";

type CursorState =
  | "default"
  | "hover"
  | "card"
  | "drag"
  | "button"
  | "link"
  | "image";

const RING_SIZE: Record<CursorState, number> = {
  default: 32,
  hover: 50,
  card: 84,
  drag: 84,
  button: 50,
  link: 44,
  image: 84,
};

/**
 * Fully imperative cursor — no per-frame React state, so it never stutters or
 * re-subscribes. Uses mix-blend-mode: difference for outline states (visible on
 * both dark and light sections) and a solid accent puck for labelled cards.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    // Hiding the native pointer is a real barrier for anyone who relies on
    // it, and reduced-motion is the strongest signal we have for that.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("has-custom-cursor");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dp = { ...mouse };
    const rp = { ...mouse };
    let visible = false;
    let pressTarget = 1;
    let press = 1;
    let state: CursorState = "default";

    const isAccent = (s: CursorState) => s === "card" || s === "drag" || s === "image";
    const isFilled = (s: CursorState) => s === "hover" || s === "button";

    const applyState = (s: CursorState, text: string) => {
      state = s;
      const size = RING_SIZE[s];
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;

      if (isAccent(s)) {
        ring.style.mixBlendMode = "normal";
        ring.style.background = "var(--color-accent)";
        ring.style.borderColor = "transparent";
      } else {
        ring.style.mixBlendMode = "difference";
        ring.style.background = isFilled(s) ? "#fff" : "transparent";
        ring.style.borderColor = isFilled(s) ? "transparent" : "#fff";
      }

      dot.style.opacity = visible && !isAccent(s) && !isFilled(s) ? "1" : "0";

      const show = isAccent(s) && !!text;
      label.textContent = show ? text : "";
      label.style.opacity = show ? "1" : "0";
    };

    const setVisible = (v: boolean) => {
      visible = v;
      ring.style.opacity = v ? "1" : "0";
      dot.style.opacity = v && !isAccent(state) && !isFilled(state) ? "1" : "0";
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const el = t.closest<HTMLElement>("[data-cursor]");
      if (el) {
        applyState((el.dataset.cursor as CursorState) ?? "hover", el.dataset.cursorLabel ?? "");
      } else if (t.closest("a, button, [role='button'], input, textarea, select, label")) {
        applyState("hover", "");
      } else {
        applyState("default", "");
      }
    };
    const hide = () => setVisible(false);
    const show = () => setVisible(true);
    const onDown = () => (pressTarget = 0.8);
    const onUp = () => (pressTarget = 1);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    window.addEventListener("blur", hide);

    let raf = 0;
    const render = () => {
      dp.x = lerp(dp.x, mouse.x, 0.3);
      dp.y = lerp(dp.y, mouse.y, 0.3);
      rp.x = lerp(rp.x, mouse.x, 0.16);
      rp.y = lerp(rp.y, mouse.y, 0.16);
      press = lerp(press, pressTarget, 0.2);
      dot.style.transform = `translate(${dp.x}px, ${dp.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rp.x}px, ${rp.y}px) translate(-50%, -50%) scale(${press})`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          width: 6,
          height: 6,
          background: "#fff",
          mixBlendMode: "difference",
          opacity: 0,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full"
        style={{
          width: 32,
          height: 32,
          border: "1.5px solid #fff",
          background: "transparent",
          mixBlendMode: "difference",
          opacity: 0,
          transition:
            "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), background 0.25s, border-color 0.25s, opacity 0.25s",
          willChange: "transform",
        }}
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-accent-ink)", opacity: 0, transition: "opacity 0.2s" }}
        />
      </div>
    </>
  );
}

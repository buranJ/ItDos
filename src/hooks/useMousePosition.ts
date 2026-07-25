"use client";

import { useEffect, useRef } from "react";

export type MousePosition = { x: number; y: number };

export function useMousePosition(
  onMove: (pos: MousePosition) => void
) {
  const handler = useRef(onMove);

  useEffect(() => {
    handler.current = onMove;
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      handler.current({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
}

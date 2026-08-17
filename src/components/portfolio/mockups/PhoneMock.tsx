"use client";

import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import styles from "./PhoneMock.module.css";

const APP_VIEWPORT_WIDTH = 393;
const APP_VIEWPORT_HEIGHT = 900;

type Props = {
  url: string;
  accent?: string;
  className?: string;
};

export function PhoneMock({ url, className }: Props) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [viewRef, inView] = useInView<HTMLDivElement>();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / APP_VIEWPORT_WIDTH);
    });

    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("relative h-full w-full", styles.scene, className)}>
      <div className={styles.stage}>
        <div ref={screenRef} className={styles.screen}>
          <div ref={viewRef} className={styles.observer} />

          {inView && (
            <iframe
              src={url}
              title="Имбирь — мобильное приложение"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              style={{
                width: APP_VIEWPORT_WIDTH,
                height: APP_VIEWPORT_HEIGHT,
                transform: `scale(${scale})`,
              }}
            />
          )}

          <div aria-hidden="true" className={styles.glass} />
        </div>

        <Image
          src="/tel.png"
          alt=""
          width={1536}
          height={1024}
          sizes="(min-width: 1024px) 62vw, 160vw"
          className={styles.mockup}
        />

        {/* The hint shares the mockup coordinate system, so it follows the
            phone instead of drifting across it as the viewport changes. */}
        <div className={styles.hint}>
          <span aria-hidden="true" className={styles.hintIcon}>
            <ChevronsUpDown size={16} strokeWidth={1.8} />
            <span className={styles.hintDot} />
          </span>
          <span className={styles.hintCopy}>
            <strong>Живое приложение</strong>
            <span>Листайте экран прямо сейчас</span>
          </span>
        </div>
      </div>
    </div>
  );
}

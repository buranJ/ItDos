"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingContact } from "./FloatingContact";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

/**
 * Marketing chrome — header, footer, messenger bubbles, custom cursor.
 * The admin panel lives in the same app but must not inherit any of it:
 * a bespoke cursor and a scroll-progress bar over a data table is noise.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <CustomCursor />
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingContact />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "./Navigation";
import { cn } from "@/lib/utils";
import logo from "../../../public/logo-wh.png";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "py-4" : "py-6"
      )}
    >
      {/* Blurred background lives on its own layer. Keeping backdrop-filter
         OFF the <header> is essential: a filtered ancestor becomes the
         containing block for the fixed menu overlay and would break it. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 border-b transition-all duration-500",
          scrolled
            ? "border-line bg-bg/80 opacity-100 backdrop-blur-xl"
            : "border-white/10 bg-bg/55 opacity-100 backdrop-blur-md"
        )}
      />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="ITDOS — на главную"
          className="transition-opacity duration-200 hover:opacity-75"
        >
          <Image
            src={logo}
            alt="ITDOS"
            width={96}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <Navigation />
      </div>
    </header>
  );
}

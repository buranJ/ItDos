"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  // `/admin` must only match exactly, or it lights up on every sub-page.
  const active = href === "/admin" ? pathname === href : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "bg-panel font-medium text-fg" : "text-fg-secondary hover:bg-panel/60 hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

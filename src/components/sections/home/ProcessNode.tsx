"use client";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

/**
 * The dot on the process rail. It used to fill on hover only, so on a phone
 * — where most of the traffic is — it never animated at all. Now it fills
 * as the step scrolls into view, and hover still works with a pointer.
 */
export function ProcessNode() {
  const [ref, seen] = useInView<HTMLDivElement>("-25% 0px -25% 0px");

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 mt-2 h-4 w-4 rounded-full border-2 border-accent transition-colors duration-500",
        seen ? "bg-accent" : "bg-bg",
        "lg:bg-bg lg:group-hover:bg-accent",
      )}
    />
  );
}

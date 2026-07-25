import { marqueeItems, techStack } from "@/data/tech";

export function TechMarquee() {
  const row1 = [...marqueeItems, ...marqueeItems];
  const row2 = [
    ...techStack.map((t) => t.name),
    ...techStack.map((t) => t.name),
  ];

  return (
    <div className="select-none overflow-hidden border-y border-line bg-surface/30 py-6 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      {/* Row 1 — services */}
      {/* <div className="mb-3 flex animate-marquee-left">
        {row1.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center px-7 text-sm font-medium text-fg-secondary"
          >
            {item}
            <span className="ml-7 h-1 w-1 rounded-full bg-accent/70" />
          </span>
        ))}
      </div> */}

      {/* Row 2 — tech, moving right */}
      <div className="flex animate-marquee-right">
        {row2.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center px-6 font-mono text-xs text-fg-muted"
          >
            {item}
            <span className="ml-6 text-fg-faint">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

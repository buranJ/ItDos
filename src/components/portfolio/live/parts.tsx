import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrowserVideoMock } from "../mockups/BrowserVideoMock";
import type { PortfolioProject, ProjectResult } from "@/types/portfolio";
import type { ShowcaseMedia } from "@/data/showcaseMedia";
import { cn } from "@/lib/utils";

/* Building blocks of the «Живые проекты» section. */

export type LiveItem = { project: PortfolioProject; media: ShowcaseMedia };

export const accentOf = (project: PortfolioProject) =>
  project.accent ?? "#6e56ff";

/** White on dark accents, ink on light ones (Bilmont's olive, the teal). */
function inkOn(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return "#ffffff";
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
  return luminance > 0.3 ? "#0b0b0f" : "#ffffff";
}

/**
 * The recording in a plain browser window — no laptop. `interactive`
 * adds the full-screen button; without it the window is only a picture
 * (it usually sits inside a link to the case).
 */
export function LiveWindow({
  item,
  interactive = false,
  className,
}: {
  item: LiveItem;
  interactive?: boolean;
  className?: string;
}) {
  const { project, media } = item;
  return (
    <div className={className} inert={!interactive}>
      <BrowserVideoMock
        chrome="minimal"
        fluid
        url={media.video}
        address={media.address}
        projectTitle={project.title}
        accent={accentOf(project)}
        videoCrop={media.videoCrop}
        controls={interactive}
      />
    </div>
  );
}

/** The three facts from the case, value over label. */
export function Facts({
  results,
  className,
}: {
  results: ProjectResult[];
  className?: string;
}) {
  if (results.length === 0) return null;
  return (
    <dl className={cn("grid grid-cols-3 gap-4 border-t border-line pt-6", className)}>
      {results.slice(0, 3).map((result) => (
        <div key={result.label} className="min-w-0">
          <dt className="sr-only">{result.label}</dt>
          <dd className="font-display text-[clamp(1.35rem,2vw,1.9rem)] font-semibold leading-none tracking-tight text-fg">
            {result.value}
          </dd>
          <dd className="mt-2 text-xs leading-snug text-fg-muted">{result.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** «Смотреть кейс» in the project colour, and the live site if it's public. */
export function CaseLinks({
  project,
  className,
  compact,
}: {
  project: PortfolioProject;
  className?: string;
  compact?: boolean;
}) {
  const accent = accentOf(project);
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Link
        href={`/portfolio/${project.slug}`}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-transform duration-300 hover:-translate-y-0.5",
          compact ? "h-10 px-5 text-sm" : "h-12 px-6 text-sm",
        )}
        style={{ background: accent, color: inkOn(accent) }}
      >
        Смотреть кейс
      </Link>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-line text-sm text-fg-secondary transition-colors hover:border-line-strong hover:text-fg",
            compact ? "h-10 px-4" : "h-12 px-5",
          )}
        >
          Открыть сайт
          <ArrowUpRight size={14} />
        </a>
      )}
    </div>
  );
}

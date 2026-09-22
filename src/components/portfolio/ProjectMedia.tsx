import Image from "next/image";
import type { PortfolioProject } from "@/types/portfolio";
import { Mockup } from "./mockups";
import { showcaseMedia } from "@/data/showcaseMedia";
import { cn } from "@/lib/utils";

type ProjectMediaProps = {
  project: PortfolioProject;
  className?: string;
  priority?: boolean;
  /** Pass-through for live mockup behaviours (e.g. chat typing). */
  live?: boolean;
  sizes?: string;
  /** False where the media sits inside a link (list rows, "next project"):
   *  a live mockup then has no controls and takes no clicks. */
  interactive?: boolean;
};

/**
 * The hybrid switch: renders a real cover (video → image) when the project
 * has one, otherwise the generative mockup placeholder. Swapping to real
 * assets later is purely a data edit in `data/portfolio.ts`.
 */
export function ProjectMedia({
  project,
  className,
  priority,
  live,
  sizes = "(max-width: 768px) 100vw, 55vw",
  interactive = true,
}: ProjectMediaProps) {
  const { coverVideo, coverImage, mockup, accent, title } = project;
  const media = showcaseMedia[project.slug];

  // Live device mockup — the screen recording in a laptop or a browser
  // window, the phone screenshots — the same one as on the home page.
  if (media) {
    return (
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden",
          className,
        )}
        // Inside a link the mockup is a picture: `inert` keeps its player
        // controls out of the tab order and lets clicks reach the link.
        inert={!interactive}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 120% at 50% -10%, color-mix(in oklab, ${
              accent ?? "var(--color-accent)"
            } 18%, transparent), transparent 60%)`,
          }}
        />
        {/* Одно окно браузера во всю ширину — без ноутбука: он съедал
            место и делал запись мельче. Телефоны живут отдельным блоком. */}
        <div
          className="relative h-[92%] w-[94%] sm:h-[94%] sm:w-[92%]"
          style={{ "--m-accent": accent } as React.CSSProperties}
        >
          <Mockup
            kind="browser-video"
            accent={accent}
            url={media.video}
            address={media.address}
            projectTitle={title}
            videoCrop={media.videoCrop}
            chrome="minimal"
            controls={interactive}
            centered
          />
        </div>
      </div>
    );
  }

  if (coverVideo) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <video
          className="h-full w-full object-cover"
          src={coverVideo}
          poster={coverImage}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    );
  }

  if (coverImage) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <Image
          src={coverImage}
          alt={title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  // Placeholder — generative mockup floating over an accent wash.
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 50% -10%, color-mix(in oklab, ${
            accent ?? "var(--color-accent)"
          } 16%, transparent), transparent 58%)`,
        }}
      />
      <div className="relative aspect-[16/10] w-[86%] max-w-3xl">
        <Mockup kind={mockup} accent={accent} live={live} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/types/portfolio";
import { ProjectMedia } from "./ProjectMedia";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { cn } from "@/lib/utils";

type ProjectFeatureRowProps = {
  project: PortfolioProject;
  index: number;
  reversed?: boolean;
};

/** Full-bleed alternating project row — shared by the home preview and index. */
export function ProjectFeatureRow({
  project,
  index,
  reversed,
}: ProjectFeatureRowProps) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      data-cursor="card"
      data-cursor-label="КЕЙС"
      className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
      style={{ "--m-accent": project.accent } as React.CSSProperties}
    >
      {/* Media */}
      <ClipReveal
        className={cn(
          "rounded-2xl border border-line bg-panel",
          reversed && "lg:order-2"
        )}
      >
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <ProjectMedia project={project} live />
          {/* hover accent ring */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-m opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </ClipReveal>

      {/* Copy */}
      <div className={cn(reversed && "lg:order-1")}>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-fg-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
            {project.year}
          </span>
        </div>

        <h3 className="mt-6 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-fg transition-colors duration-300 group-hover:text-m">
          {project.title}
        </h3>
        <p className="mt-3 max-w-md text-base text-fg-secondary sm:text-lg">
          {project.tagline}
        </p>

        {project.highlight && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-m bg-m-softer px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-m" />
            <span className="text-sm font-medium text-m">{project.highlight}</span>
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs text-fg-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg">
          Смотреть кейс
          <ArrowUpRight
            size={16}
            className="text-m transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </span>
      </div>
    </Link>
  );
}

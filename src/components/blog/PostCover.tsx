import Image from "next/image";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";

/** Один цвет на рубрику — заглушка держит вёрстку, пока нет фотографии. */
const TINTS: Record<string, string> = {
  ai: "#6e56ff",
  crm: "#2bd4c4",
  bots: "#3d63f5",
  development: "#0090fc",
  design: "#9cba6e",
};

const LABELS: Record<string, string> = {
  ai: "AI",
  crm: "CRM",
  bots: "Боты",
  development: "Разработка",
  design: "Дизайн",
};

/**
 * Cover for a post: the uploaded image when there is one, otherwise a tinted
 * placeholder with the section name — so a post without a picture still has
 * a shape on the page, and adding one later is just a path in /admin.
 */
export function PostCover({
  post,
  className,
  priority,
}: {
  post: BlogPost;
  className?: string;
  priority?: boolean;
}) {
  const tint = TINTS[post.category] ?? "#6e56ff";
  const hasImage = Boolean(post.coverImage?.trim());

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-line bg-panel",
        className,
      )}
    >
      {hasImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 120% at 15% 0%, color-mix(in oklab, ${tint} 40%, transparent), transparent 62%), linear-gradient(140deg, color-mix(in oklab, ${tint} 14%, transparent), transparent 55%)`,
            }}
          />
          <span className="absolute bottom-4 left-5 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-fg-muted">
            {LABELS[post.category] ?? post.category}
          </span>
        </>
      )}
    </div>
  );
}

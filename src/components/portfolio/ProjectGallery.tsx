import Image from "next/image";
import type { PortfolioProject } from "@/types/portfolio";
import { Frame } from "./mockups/Frame";
import { Mockup } from "./mockups";
import { ClipReveal } from "@/components/motion/ClipReveal";

/** Gallery that prefers real desktop/mobile screenshots and falls back to
 *  device-framed generative mockups. Drop real paths into the project data
 *  (`desktopScreens` / `mobileScreens`) to replace the placeholders. */
export function ProjectGallery({ project }: { project: PortfolioProject }) {
  const { desktopScreens, mobileScreens, accent, mockup, title } = project;
  const phones = (mobileScreens?.length ? mobileScreens : [null, null, null]).slice(0, 3);

  return (
    <div style={{ "--m-accent": accent } as React.CSSProperties}>
      {/* Desktop */}
      <ClipReveal className="rounded-2xl border border-line bg-panel">
        {desktopScreens?.length ? (
          <Frame variant="browser" accent={accent} label={project.liveUrl ?? "itdos.ru"}>
            <div className="relative aspect-[16/10]">
              <Image
                src={desktopScreens[0]}
                alt={`${title} — десктоп`}
                fill
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="object-cover object-top"
              />
            </div>
          </Frame>
        ) : (
          <div className="relative aspect-[16/10]">
            <Mockup kind={mockup} accent={accent} live />
          </div>
        )}
      </ClipReveal>

      {/* Mobile trio */}
      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
        {phones.map((src, i) => (
          <ClipReveal key={i} delay={i * 0.08} className="rounded-[2rem]">
            <PhoneFrame accent={accent}>
              {src ? (
                <Image
                  src={src}
                  alt={`${title} — мобильный экран ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 45vw, 280px"
                  className="object-cover object-top"
                />
              ) : (
                <MobilePlaceholder />
              )}
            </PhoneFrame>
          </ClipReveal>
        ))}
      </div>
    </div>
  );
}

function PhoneFrame({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="relative mx-auto aspect-[9/19] w-full max-w-[210px] rounded-[2rem] border border-line bg-panel p-2 shadow-2xl shadow-black/40"
      style={accent ? ({ "--m-accent": accent } as React.CSSProperties) : undefined}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-surface">
        <div className="absolute left-1/2 top-2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-bg" />
        {children}
      </div>
    </div>
  );
}

function MobilePlaceholder() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-3 pt-7">
      <div className="h-8 rounded-lg bg-m" />
      <div className="h-2 w-2/3 rounded bg-fg/15" />
      <div className="relative aspect-video overflow-hidden rounded-lg bg-m-soft">
        <div className="absolute inset-0 m-shimmer" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="aspect-square rounded-lg border border-line bg-surface" />
        <div className="aspect-square rounded-lg border border-line bg-surface" />
      </div>
      <div className="mt-auto h-9 rounded-full bg-m" />
    </div>
  );
}

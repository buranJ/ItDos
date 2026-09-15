import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { cn } from "@/lib/utils";
import {
  accentOf,
  CaseLinks,
  Facts,
  LiveWindow,
  Meta,
  pad,
  Stage,
  Tags,
  type LiveItem,
} from "./parts";
import { LiveTabs } from "./LiveTabs";

/**
 * «Живые проекты» — launched work shown by its real screen recording, each
 * in a plain browser window (no laptop), big: roughly half the screen.
 */
export function LiveShowcase({
  items,
  variant,
}: {
  items: LiveItem[];
  variant: number;
}) {
  return (
    <Section id="live" className="scroll-mt-24 border-t border-line">
      <Container>
        <div className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
                Живые проекты · {pad(items.length)}
              </p>
            </div>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[1.02] tracking-tight text-fg">
              Работают прямо сейчас
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-fg-secondary lg:col-span-5 lg:justify-self-end">
            Записи реальных интерфейсов — сайтов и систем, которые уже
            работают у&nbsp;клиентов. В&nbsp;каждом кейсе — задача, решения
            и&nbsp;цифры.
          </p>
        </div>

        {variant === 2 ? (
          <GridLayout items={items} />
        ) : variant === 3 ? (
          <CinemaLayout items={items} />
        ) : variant === 4 ? (
          <StackLayout items={items} />
        ) : variant === 5 ? (
          <LiveTabs items={items} />
        ) : (
          <SplitLayout items={items} />
        )}
      </Container>
    </Section>
  );
}

/** Link wrapper for the window: the whole picture opens the case. */
function WindowLink({
  item,
  className,
  children,
}: {
  item: LiveItem;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/portfolio/${item.project.slug}`}
      aria-label={`Кейс ${item.project.title}`}
      data-cursor="card"
      data-cursor-label="КЕЙС"
      className={cn("group block", className)}
    >
      {children}
    </Link>
  );
}

/* ── 1 · Сплит: big window 7/12, the story beside it, sides alternate ── */
function SplitLayout({ items }: { items: LiveItem[] }) {
  return (
    <div className="flex flex-col gap-24 lg:gap-36">
      {items.map((item, i) => {
        const { project } = item;
        const reversed = i % 2 === 1;
        return (
          <article
            key={project.slug}
            className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
            style={{ "--m-accent": accentOf(project) } as React.CSSProperties}
          >
            <WindowLink item={item} className={cn("lg:col-span-7", reversed && "lg:order-2")}>
              <ClipReveal className="rounded-2xl">
                <Stage
                  accent={accentOf(project)}
                  className="p-[5%] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                >
                  <LiveWindow item={item} />
                </Stage>
              </ClipReveal>
            </WindowLink>

            <div className={cn("lg:col-span-5", reversed && "lg:order-1")}>
              <Meta index={i} project={project} />
              <h3 className="mt-6 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-tight text-fg">
                {project.title}
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-fg-secondary sm:text-lg">
                {project.tagline}
              </p>
              <Facts results={project.results} className="mt-8" />
              <Tags tags={project.tags} className="mt-7" />
              <CaseLinks project={project} className="mt-9" />
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ── 2 · Сетка: two per row, each card half the screen wide ── */
function GridLayout({ items }: { items: LiveItem[] }) {
  return (
    <div className="grid gap-x-6 gap-y-16 md:grid-cols-2 lg:gap-x-8 lg:gap-y-24">
      {items.map((item, i) => {
        const { project } = item;
        return (
          <WindowLink
            key={project.slug}
            item={item}
            className={cn(i % 2 === 1 && "md:mt-24")}
          >
            <div style={{ "--m-accent": accentOf(project) } as React.CSSProperties}>
              <ClipReveal className="rounded-2xl" delay={(i % 2) * 0.1}>
                <Stage
                  accent={accentOf(project)}
                  className="px-[6%] pb-[7%] pt-[9%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                >
                  <LiveWindow item={item} />
                </Stage>
              </ClipReveal>

              <div className="mt-7 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-muted">
                    <span className="text-m">{pad(i + 1)}</span>
                    {"  ·  "}
                    {project.tags[0]} · {project.year}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-tight text-fg transition-colors duration-300 group-hover:text-m">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-fg-secondary">
                    {project.tagline}
                  </p>
                </div>
                <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-fg transition-colors duration-300 group-hover:border-transparent group-hover:bg-m group-hover:text-white">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              {project.highlight && (
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-m bg-m-softer px-4 py-1.5 text-sm font-medium text-m">
                  {project.highlight}
                </p>
              )}
            </div>
          </WindowLink>
        );
      })}
    </div>
  );
}

/* ── 3 · Кино: one wide scene per project — the window centre-stage,
       the story in a strip underneath ── */
function CinemaLayout({ items }: { items: LiveItem[] }) {
  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {items.map((item, i) => {
        const { project } = item;
        const accent = accentOf(project);
        return (
          <article
            key={project.slug}
            className="relative overflow-hidden rounded-[2rem] border border-line bg-panel"
            style={{ "--m-accent": accent } as React.CSSProperties}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(70% 60% at 50% 0%, color-mix(in oklab, ${accent} 30%, transparent), transparent 75%), linear-gradient(to top, color-mix(in oklab, ${accent} 7%, transparent), transparent 45%)`,
              }}
            />
            <div className="relative flex flex-col gap-8 p-5 sm:p-8 lg:gap-10 lg:p-12">
              <div className="flex items-center justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-muted">
                <span>
                  <span className="text-m">{pad(i + 1)}</span>
                  {"  ·  "}
                  {project.tags[0]} · {project.year}
                </span>
                <span className="max-sm:hidden">{project.client}</span>
              </div>

              {/* 58vh tall at most: the whole scene stays within a screen. */}
              <WindowLink
                item={item}
                className="mx-auto w-full max-w-[calc((58vh_-_2.7rem)*16/9)]"
              >
                <ClipReveal className="rounded-2xl">
                  <div className="transition-transform duration-700 ease-out group-hover:scale-[1.012]">
                    <LiveWindow item={item} />
                  </div>
                </ClipReveal>
              </WindowLink>

              <div className="grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:items-end lg:gap-10">
                <div className="lg:col-span-5">
                  <h3 className="font-display text-[clamp(2.1rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-tight text-fg">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-fg-secondary">
                    {project.tagline}
                  </p>
                </div>
                <Facts
                  results={project.results}
                  className="border-t-0 pt-0 lg:col-span-4"
                />
                <CaseLinks
                  project={project}
                  compact
                  className="lg:col-span-3 lg:justify-end"
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ── 4 · Стопка: cards pin under the header and the next one slides over ── */
function StackLayout({ items }: { items: LiveItem[] }) {
  return (
    <div className="relative">
      {items.map((item, i) => {
        const { project } = item;
        const accent = accentOf(project);
        return (
          <div
            key={project.slug}
            className="mb-8 last:mb-0 lg:sticky lg:mb-[16vh]"
            style={{ top: `calc(6.5rem + ${i * 1.25}rem)` }}
          >
            <article
              className="relative overflow-hidden rounded-[2rem] border border-line bg-panel shadow-[0_-24px_60px_-24px_rgba(0,0,0,0.85)]"
              style={{ "--m-accent": accent } as React.CSSProperties}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(60% 90% at 0% 0%, color-mix(in oklab, ${accent} 26%, transparent), transparent 70%)`,
                }}
              />
              <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10">
                <WindowLink item={item} className="lg:col-span-7">
                  <div className="transition-transform duration-700 ease-out group-hover:scale-[1.012]">
                    <LiveWindow item={item} />
                  </div>
                </WindowLink>
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-muted">
                    <span>
                      <span className="text-m">{pad(i + 1)}</span> / {pad(items.length)}
                    </span>
                    <span>
                      {project.tags[0]} · {project.year}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.02] tracking-tight text-fg">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-fg-secondary">
                    {project.tagline}
                  </p>
                  <Facts results={project.results} className="mt-7" />
                  <CaseLinks project={project} compact className="mt-8" />
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}

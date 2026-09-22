import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/utils";
import {
  accentOf,
  CaseLinks,
  Facts,
  LiveWindow,
  type LiveItem,
} from "./parts";

/**
 * «Живые проекты» — launched work shown by its real screen recording, each
 * in a plain browser window (no laptop), big: roughly half the screen.
 * The cards pin under the header, each sliding over the previous one.
 */
export function LiveShowcase({ items }: { items: LiveItem[] }) {
  return (
    <Section id="live" className="scroll-mt-24 border-t border-line">
      <Container>
        <div className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
                Живые проекты
              </p>
            </div>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[1.02] tracking-tight text-fg">
              Работают прямо сейчас
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-fg-secondary lg:col-span-5 lg:justify-self-end">
            Здесь можно увидеть наши продукты такими, какими ими пользуются
            клиенты каждый день. Показываем задачу, решение и&nbsp;результат.
          </p>
        </div>

        <StackLayout items={items} />
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
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-muted">
                    {project.tags[0]} · {project.year}
                  </div>
                  {/* Длинное название («Бишкек Суу Водоканал») получает
                      меньший шаг, чтобы остаться в одну строку. */}
                  <h3
                    className={cn(
                      "mt-6 font-display font-semibold leading-[1.02] tracking-tight text-fg",
                      project.title.length > 16
                        ? "text-[clamp(1.6rem,2.3vw,2.2rem)]"
                        : "text-[clamp(2rem,3.4vw,3.2rem)]",
                    )}
                  >
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

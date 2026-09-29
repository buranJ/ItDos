import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LiveCards } from "./LiveCards";
import type { LiveItem } from "./parts";

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

        <LiveCards items={items} />
      </Container>
    </Section>
  );
}

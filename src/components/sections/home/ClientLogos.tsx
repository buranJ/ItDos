import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { clients } from "@/data/clients";

/** Trust strip — instant social proof. Swap names for real SVG logos later. */
export function ClientLogos() {
  return (
    <Section spacing="sm" className="border-y border-line">
      <Container>
        <p className="mb-9 text-center font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Нам доверяют компании Кыргызстана и СНГ
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16">
          {clients.map((c) => (
            <span
              key={c.name}
              className="font-display text-lg font-semibold tracking-tight text-fg/45 transition-colors duration-300 hover:text-fg sm:text-xl"
            >
              {c.name}
            </span>
          ))}
        </div>
      </Container>
    </Section>
  );
}

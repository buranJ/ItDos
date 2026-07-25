// import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
// import { founderNote } from "@/data/team";
import { TeamSlider } from "./TeamSlider";

// function FounderAvatar() {
//   return (
//     <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-panel-2">
//       {founderNote.photo ? (
//         <Image
//           src={founderNote.photo}
//           alt={founderNote.name}
//           fill
//           sizes="80px"
//           className="object-cover"
//         />
//       ) : (
//         <span className="font-display text-xl font-semibold text-fg/60">
//           {founderNote.initials}
//         </span>
//       )}
//     </div>
//   );
// }

export function Team() {
  return (
    <Section className="overflow-hidden border-t border-line">
      <Container>
        <div className="max-w-3xl">
          {/* <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            {"// команда"}
          </p> */}
          <TextReveal
            as="h2"
            className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
          >
            {"Кто будет работать\nнад вашим проектом"}
          </TextReveal>
          <p className="mt-5 text-lg leading-relaxed text-fg-secondary">
          Ваш проект ведут специалисты с опытом от 5 лет в создании сайтов, веб-приложений и систем автоматизации для бизнеса.
          </p>
        </div>

        {/* Founder note — the human signal */}
        {/* <div className="mt-12 grid gap-7 rounded-2xl border border-line bg-surface p-7 sm:grid-cols-[auto_1fr] sm:gap-9 sm:p-10">
          <FounderAvatar />
          <div>
            <p className="text-lg leading-relaxed text-fg sm:text-xl">
              «{founderNote.text}»
            </p>
            <p className="mt-5 font-medium text-fg">{founderNote.name}</p>
            <p className="text-sm text-fg-muted">{founderNote.role}</p>
          </div>
        </div> */}
      </Container>

      {/* Coverflow team slider (full-bleed for the side-card spill) */}
      <div className="mt-16">
        <TeamSlider />
      </div>
    </Section>
  );
}

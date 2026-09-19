"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Plan } from "@/data/pricing";

/** A plan's name lists the services it covers: «Лендинги / Корпоративные
 *  сайты» is two of them. They are shown as separate labels — joined by a
 *  dot they read as one long service name. */
function services(name: string) {
  return name.split(/\s*\/\s*/).filter(Boolean);
}

const askAbout = (plan: Plan) =>
  whatsappLink(`Здравствуйте! Интересует тариф «${plan.name}».`);

/** «Индивидуально» is a word, not a figure: at the price size it crowded
 *  the term beside it and, in the narrow chooser, wrapped over two lines. */
const isFigure = (price: string) => /\d/.test(price);

/** Small print under the plans: what the price does and doesn't hide. */
function Assurances() {
  return (
    <FadeIn delay={0.35}>
      <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-fg-muted">
        {[
          "Смету фиксируем в договоре",
          "Оплата по этапам",
          "Поддержка после запуска",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Check size={14} className="text-accent-text" strokeWidth={2.5} />
            {item}
          </li>
        ))}
      </ul>
    </FadeIn>
  );
}

/**
 * Prices as a chooser: the three plans on the left, the chosen one opened
 * on the right. Keeps the section to one screen — the visitor picks their
 * case first and reads the detail after.
 */
export function PricingPlans({ plans }: { plans: Plan[] }) {
  const [active, setActive] = useState(() =>
    Math.max(0, plans.findIndex((p) => p.popular)),
  );
  const plan = plans[active];
  if (!plan) return null;
  const chosen = services(plan.name);

  return (
    <>
      <FadeIn>
        <div className="grid gap-6 rounded-3xl border border-line bg-panel p-4 shadow-sm sm:p-6 lg:grid-cols-12 lg:gap-8 lg:p-8">
          {/* Chooser */}
          <div className="flex flex-col gap-2.5 lg:col-span-5">
            {plans.map((item, i) => {
              const on = i === active;
              const items = services(item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border p-5 text-left transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                    on
                      ? "border-accent/40 bg-accent/8 shadow-[0_6px_30px_rgba(110,86,255,0.12)]"
                      : "border-line bg-transparent hover:border-line-strong hover:bg-panel-2/60",
                  )}
                >
                  <span className="min-w-0">
                    {item.popular && (
                      <span className="mb-2 inline-block rounded-full bg-accent/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-text">
                        Хит
                      </span>
                    )}
                    {/* Labels, not one run of text joined by a separator:
                        a wrapped «+» opened the next line on its own. */}
                    <span className="flex flex-wrap gap-1.5">
                      {items.map((service) => (
                        <span
                          key={service}
                          className={cn(
                            "rounded-full border px-2.5 py-1 font-display text-sm font-semibold leading-tight tracking-tight text-fg",
                            on ? "border-accent/25 bg-panel" : "border-line bg-panel-2/70",
                          )}
                        >
                          {service}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="shrink-0 sm:text-right">
                    <span
                      className={cn(
                        "block font-display font-semibold leading-none tracking-tight text-fg",
                        isFigure(item.price) ? "text-lg" : "text-base",
                      )}
                    >
                      {item.price}
                    </span>
                    <span className="mt-1.5 block text-[11px] text-fg-muted">
                      {item.period}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* The chosen plan */}
          <div className="flex flex-col rounded-2xl bg-panel-2/70 p-6 lg:col-span-7 lg:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-muted">
              {chosen.length > 1 ? "Услуги в тарифе" : "Услуга"}
            </p>
            <h3 className="mt-3 flex flex-wrap gap-2">
              {chosen.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-line bg-panel px-4 py-2 font-display text-[clamp(1.05rem,1.5vw,1.35rem)] font-semibold leading-tight tracking-tight text-fg"
                >
                  {service}
                </span>
              ))}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-fg-secondary">
              {plan.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6">
              <p
                className={cn(
                  "font-display font-semibold leading-none tracking-tight text-fg",
                  isFigure(plan.price)
                    ? "text-[clamp(2rem,3.2vw,2.8rem)]"
                    : "text-[clamp(1.5rem,2.2vw,2rem)]",
                )}
              >
                {plan.price}
              </p>
              <p className="rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-medium text-fg-secondary">
                Срок&nbsp;·&nbsp;{plan.period}
              </p>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm leading-snug text-fg-secondary">
                  <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-accent-text" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={askAbout(plan)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="button"
              className={buttonClass("accent", "md", "group/btn mt-8 w-full sm:w-fit")}
            >
              Обсудить проект
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </FadeIn>
      <Assurances />
    </>
  );
}

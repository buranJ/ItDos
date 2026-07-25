import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center">
      <Container>
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
          404
        </p>
        <h1 className="text-[clamp(4rem,12vw,10rem)] font-semibold tracking-tight text-fg leading-none">
          Не найдено
        </h1>
        <p className="mt-6 text-lg text-fg-secondary max-w-sm">
          Страница не существует или была перемещена.
        </p>
        <div className="mt-10">
          <MagneticButton>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-accent text-accent-ink px-7 py-3.5 rounded-full text-sm font-medium hover:bg-accent-bright transition-colors"
            >
              <ArrowLeft size={16} />
              На главную
            </Link>
          </MagneticButton>
        </div>
      </Container>
    </div>
  );
}

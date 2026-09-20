import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact/ContactSection";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Контакты",
  description:
    "Свяжитесь с ITDOS. Обсудим ваш проект, быстро ответим и предложим оптимальное решение.",
};

export default function ContactPage() {
  return <ContactSection />;
}

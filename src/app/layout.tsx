import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://itdos.ru"),
  title: {
    default: "ITDOS — Разработка сайтов, AI-интеграции и автоматизация бизнеса",
    template: "%s | ITDOS",
  },
  description:
    "ITDOS — технологическая компания в Бишкеке. Разрабатываем сайты, веб-приложения, CRM/ERP системы, AI-агентов и автоматизируем бизнес-процессы.",
  keywords: [
    "разработка сайтов",
    "веб-приложения",
    "CRM система",
    "ERP система",
    "AI интеграция",
    "автоматизация бизнеса",
    "Telegram боты",
    "ITDOS",
    "Бишкек",
  ],
  authors: [{ name: "ITDOS" }],
  creator: "ITDOS",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://itdos.ru",
    siteName: "ITDOS",
    title: "ITDOS — Разработка сайтов, AI-интеграции и автоматизация бизнеса",
    description:
      "Технологическая компания. Разрабатываем сайты, приложения, CRM и автоматизируем бизнес с помощью AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITDOS — Разработка и AI-автоматизация",
    description:
      "Технологическая компания. Разрабатываем сайты, приложения, CRM и автоматизируем бизнес с помощью AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased">
        <JsonLd data={organizationLd} />
        <LenisProvider>
          <CustomCursor />
          <div className="grain-overlay" aria-hidden="true" />
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingContact />
        </LenisProvider>
      </body>
    </html>
  );
}

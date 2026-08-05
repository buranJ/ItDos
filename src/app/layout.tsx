import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
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
  // NB: no `alternates.canonical` here on purpose — metadata is inherited
  // field by field, so a root canonical would make every page declare "/"
  // as its canonical URL. Each page sets its own.
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
  // The site alternates dark and light chapters, and the hero is white.
  // Declaring only "dark" made the browser render native controls and
  // scrollbars for a dark page on top of light sections.
  colorScheme: "dark light",
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
          <SiteChrome>{children}</SiteChrome>
        </LenisProvider>
      </body>
    </html>
  );
}

import { site } from "./site";
import { faq } from "@/data/faq";

const base = "https://itdos.ru";

/** Organization + LocalBusiness graph (site-wide). */
export const organizationLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: site.name,
      url: base,
      logo: `${base}/opengraph-image`,
      email: site.email,
      telephone: `+${site.phoneRaw}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Бишкек",
        addressCountry: "KG",
      },
      sameAs: [`https://t.me/${site.telegram}`],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${base}/#business`,
      name: site.name,
      image: `${base}/opengraph-image`,
      url: base,
      telephone: `+${site.phoneRaw}`,
      email: site.email,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Бишкек",
        addressCountry: "KG",
      },
      areaServed: ["KG", "Центральная Азия", "СНГ"],
      description:
        "Разработка сайтов, веб-приложений, CRM/ERP, AI-агентов и автоматизация бизнеса.",
    },
  ],
};

/** FAQPage structured data (rich results in search). */
export const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

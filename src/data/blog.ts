import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-automation-for-business",
    title: "AI-автоматизация: как бизнес экономит 20+ часов в неделю",
    excerpt:
      "Разбираем реальные кейсы автоматизации с помощью AI: обработка заявок, генерация отчётов, умные уведомления. Сколько стоит и что даёт.",
    content: "",
    coverImage: "/blog/ai-automation.jpg",
    category: "ai",
    tags: ["AI", "Автоматизация", "Бизнес"],
    author: "ITDOS",
    publishedAt: "2024-11-10",
    readTime: 8,
  },
  {
    slug: "crm-vs-custom",
    title: "Готовая CRM vs кастомная: что выбрать для вашего бизнеса",
    excerpt:
      "Bitrix24, AmoCRM или разработка с нуля? Сравниваем варианты, считаем стоимость владения и разбираем, когда кастомная CRM оправдана.",
    content: "",
    coverImage: "/blog/crm-comparison.jpg",
    category: "crm",
    tags: ["CRM", "Выбор системы", "Бизнес"],
    author: "ITDOS",
    publishedAt: "2024-10-28",
    readTime: 6,
  },
  {
    slug: "telegram-bot-for-sales",
    title: "Telegram-бот для продаж: от идеи до 200 заявок в месяц",
    excerpt:
      "Кейс: как небольшая компания автоматизировала 80% входящих заявок через Telegram-бота. Функциональность, стоимость, результаты.",
    content: "",
    coverImage: "/blog/telegram-bot.jpg",
    category: "bots",
    tags: ["Telegram", "Боты", "Продажи"],
    author: "ITDOS",
    publishedAt: "2024-10-05",
    readTime: 5,
  },
  {
    slug: "nextjs-vs-wordpress",
    title: "Next.js vs WordPress: почему мы перестали делать сайты на WP",
    excerpt:
      "Скорость, безопасность, SEO, стоимость поддержки. Честное сравнение двух подходов к разработке корпоративных сайтов в 2024 году.",
    content: "",
    coverImage: "/blog/nextjs-vs-wp.jpg",
    category: "development",
    tags: ["Next.js", "WordPress", "Разработка"],
    author: "ITDOS",
    publishedAt: "2024-09-18",
    readTime: 7,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/* ⚠ ЭТОТ ФАЙЛ БОЛЬШЕ НЕ УПРАВЛЯЕТ САЙТОМ.
 * Контент переехал в базу — сайт читает его через `@/server/content`,
 * редактируется он в /admin. Здесь остались исходные данные только для
 * первичного наполнения (`npm run db:seed`).
 * Правка этого файла НИЧЕГО не изменит на сайте, пока не перезапустить сид. */

/** Team for the About page slider.
 *  NB: фото в /public/team — ВРЕМЕННЫЕ заглушки (взяты с примера-сайта).
 *  Замените на реальные фото вашей команды и поправьте имена/должности/био. */
export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  photo?: string;
  /** Short department tag shown on the card. */
  tag?: string;
  /** Tag background colour (hex). */
  tagColor?: string;
  /** Shown on the flipped (back) side. */
  bio?: string;
  skills?: string[];
  /** "Отвечает за" — 2–3 short lines. */
  focus?: string[];
  experience?: string;
};

export const team: TeamMember[] = [
  {
    name: "Бекжан",
    role: "Frontend-разработчик",
    initials: "Б",
    tag: "Разработка",
    tagColor: "#6e56ff",
    photo: "/prof/beka-card-close.jpg",
    experience: "5+ лет во frontend",
    bio: "Собирает интерфейсы, которые открываются мгновенно и одинаково хорошо работают на телефоне и на большом экране.",
    focus: ["Вёрстка до пикселя", "Адаптив под все экраны", "Анимации интерфейса"],
    skills: ["React", "Next.js", "TypeScript", "Tailwind", "GSAP"],
  },
  {
    name: "Автандил",
    role: "Mobile-разработчик",
    initials: "А",
    tag: "Мобайл",
    tagColor: "#2bd4c4",
    photo: "/prof/avto-card-close.jpg",
    experience: "5+ лет в мобильной разработке",
    bio: "Делает приложения для iOS и Android из одной кодовой базы — без потери в скорости и нативном ощущении.",
    focus: ["iOS и Android", "Оплаты и push-уведомления", "Публикация в сторах"],
    skills: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
  },

  {
    name: "Дастан",
    role: "Backend-разработчик",
    initials: "Д",
    tag: "Разработка",
    tagColor: "#6e56ff",
    photo: "/prof/dos-card-close.jpg",
    experience: "5+ лет в backend",
    bio: "Проектирует серверную часть, которая выдерживает рост нагрузки и спокойно масштабируется вместе с бизнесом.",
    focus: ["API и интеграции", "Базы данных и скорость", "Безопасность и бэкапы"],
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
  },
  {
    name: "Буран",
    role: "Team lead",
    initials: "Б",
    tag: "Разработка",
    tagColor: "#ff6a3d",
    photo: "/prof/buran-card-close.jpg",
    experience: "Руководит разработкой",
    bio: "Переводит задачи бизнеса на язык разработки и отвечает перед клиентом за сроки, архитектуру и качество.",
    focus: ["Архитектура и технологии", "Сроки и еженедельные демо", "Code review и качество"],
    skills: ["Архитектура", "DevOps", "CI/CD", "Code Review", "AI-интеграции"],
  },
  {
    name: "Урмат",
    role: "UX/UI дизайнер",
    initials: "У",
    tag: "Дизайн",
    tagColor: "#d6ff3d",
    photo: "/prof/mentor-3-card-close.jpg",
    experience: "5+ лет в продуктовом дизайне",
    bio: "Проектирует продукт от сценариев пользователя до дизайн-системы — так, чтобы им было понятно пользоваться с первого касания.",
    focus: ["UX-исследования", "Прототипы и тесты", "Дизайн-системы"],
    skills: ["Figma", "UX/UI", "Прототипы", "Дизайн-системы", "Motion"],
  },
  {
    name: "Сейтек",
    role: "Frontend-разработчик",
    initials: "С",
    tag: "Разработка",
    tagColor: "#6e56ff",
    photo: "/prof/mentor-7-card-close.jpg",
    experience: "5+ лет во frontend",
    bio: "Строит сложные веб-приложения — личные кабинеты, дашборды, CRM — и следит, чтобы даже тяжёлые экраны работали быстро.",
    focus: ["Кабинеты и дашборды", "Скорость загрузки", "Архитектура фронтенда"],
    skills: ["React", "Vue", "TypeScript", "Next.js", "Performance"],
  },
];

export const founderNote = {
  name: "Артур",
  role: "Основатель ITDOS",
  initials: "А",
  photo: "/team/1.jpg",
  text: "Я начинал ITDOS, потому что устал видеть, как бизнес теряет деньги на сырых сайтах и «коробочных» решениях, которые не подходят под реальные процессы. Мы работаем как продуктовая команда: разбираемся в вашей задаче, берём ответственность за результат и остаёмся на связи после запуска. С каждым клиентом я общаюсь лично.",
};

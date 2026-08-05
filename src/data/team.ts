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
  experience?: string;
};

export const team: TeamMember[] = [
  {
    name: "Бекжан",
    role: "Frontend-разработчик",
    initials: "Б",
    tag: "Разработка",
    tagColor: "#6e56ff",
    photo: "/prof/beka.png",
    // experience: "Frontend-разработчик",
    bio: "Превращает макеты в быстрые, отзывчивые интерфейсы. Фанат чистого кода и плавных анимаций.",
    skills: ["React", "Next.js", "TypeScript", "Анимации"],
  },
  {
    name: "Автандил",
    role: "Mobile-разработчик",
    initials: "А",
    tag: "Мобайл",
    tagColor: "#2bd4c4",
    photo: "/prof/avto.png",
    experience: "Mobile-разработчик",
    bio: "Создаёт нативные и кроссплатформенные мобильные приложения с чистой архитектурой.",
    skills: ["Flutter", "React Native", "iOS", "Android"],
  },

  {
    name: "Дастан",
    role: "Backend-разработчик",
    initials: "Д",
    tag: "Разработка",
    tagColor: "#6e56ff",
    photo: "/prof/dos.png",
    // experience: "Backend-разработчик",
    bio: "Проектирует архитектуру, которая держит нагрузку и легко масштабируется.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker"],
  },
  {
    name: "Буран",
    role: "Team lead",
    initials: "Б",
    tag: "Разработка",
    tagColor: "#ff6a3d",
    photo: "/prof/buran.png",
    experience: "Технический директор",
    bio: "Отвечает за техническую архитектуру и качество всех продуктов команды.",
    skills: ["Архитектура", "DevOps", "Стратегия", "Code Review"],
  },
  {
    name: "Урмат",
    role: "UX/UI дизайнер",
    initials: "У",
    tag: "Дизайн",
    tagColor: "#d6ff3d",
    photo: "/prof/mentor-3.jpg",
    experience: "UX/UI дизайнер",
    bio: "Создаёт интерфейсы, которые выглядят дорого и понятны с первого касания.",
    skills: ["UX/UI", "Figma", "Дизайн-системы", "Прототипы"],
  },
  {
    name: "Сейтек",
    role: "Frontend-разработчик",
    initials: "С",
    tag: "Разработка",
    tagColor: "#6e56ff",
    photo: "/prof/mentor-7.jpg",
    // experience: "Frontend-разработчик",
    bio: "Строит масштабируемые фронтенд-решения с акцентом на производительность.",
    skills: ["React", "Vue", "TypeScript", "Performance"],
  },
];

export const founderNote = {
  name: "Артур",
  role: "Основатель ITDOS",
  initials: "А",
  photo: "/team/1.jpg",
  text: "Я начинал ITDOS, потому что устал видеть, как бизнес теряет деньги на сырых сайтах и «коробочных» решениях, которые не подходят под реальные процессы. Мы работаем как продуктовая команда: разбираемся в вашей задаче, берём ответственность за результат и остаёмся на связи после запуска. С каждым клиентом я общаюсь лично.",
};

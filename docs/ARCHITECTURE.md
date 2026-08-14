# ARCHITECTURE — ITDOS

> Аудит от 2026-08-10. Всё ниже выведено из чтения файлов репозитория.
> Что я **не** читал, помечено явно. Уже существующий `docs/BACKEND.md`
> описывает часть решений со стороны автора — здесь я проверяю их по коду
> и добавляю то, чего там нет.

---

## 0. Инвентаризация

### Версии и менеджер пакетов

| Что | Значение | Источник |
|---|---|---|
| Next.js | **16.2.7** | `package.json:24` |
| React / React DOM | 19.2.4 | `package.json:25-26` |
| TypeScript | ^5, `strict: true` | `package.json:40`, `tsconfig.json:8` |
| Менеджер пакетов | **npm** (есть `package-lock.json`, 292 КБ) | корень репозитория |
| Тесты | **отсутствуют полностью** | нет ни одной зависимости и ни одного `*.test.*` файла |

### Ключевые библиотеки

- **БД / ORM**: `drizzle-orm@^0.45.2` + `@libsql/client@^0.17.4`, миграции — `drizzle-kit@^0.31.10` (`package.json:18,20,35`).
- **Валидация**: `zod@^4.4.3` (`package.json:28`) — используется **только** в админке (`src/server/admin/resources.ts:3`). Публичная форма валидируется руками (`src/lib/validation.ts`).
- **Анимация**: `gsap@^3.15.0` + `@gsap/react`, `lenis@^1.3.23` (smooth scroll).
- **Стили**: Tailwind **v4** через `@tailwindcss/postcss` (`postcss.config.mjs`), без `tailwind.config`. Токены живут в CSS: `src/app/globals.css:5-52`.
- **Иконки**: `lucide-react@^1.17.0`.
- **Утилиты классов**: `clsx` + `tailwind-merge` → `cn()` в `src/lib/utils.ts:4-6`.

**Чего нет вообще**: state-менеджера (Redux/Zustand/Jotai), data-fetching библиотеки (React Query/SWR), библиотеки форм (RHF/Formik), UI-кита, тестов, Prettier, Storybook.

### Скрипты (`package.json:5-15`)

```
dev        next dev
prebuild   node scripts/prepare-db.mjs   ← запускается ПЕРЕД каждым build
build      next build
start      next start
lint       eslint
db:generate / db:migrate / db:studio     drizzle-kit
db:seed    tsx scripts/seed.ts
```

`prebuild` критичен: страницы пререндерятся из БД, а файла БД в репозитории нет (`.gitignore:39-40`). Скрипт создаёт папку, гонит миграции и — **если `DATABASE_URL` пустой или `file:`** — сидит базу (`scripts/prepare-db.mjs:29-41`).

### Конфиги

- **`next.config.ts`** (14 строк, всё): `turbopack.root = import.meta.dirname` (иначе Next уходит вверх за `~/package-lock.json`) и `images.formats = ["image/avif","image/webp"]`. **`remotePatterns` не задан** — см. BUG-04.
- **`tsconfig.json`**: `strict`, `moduleResolution: "bundler"`, алиас `@/* → ./src/*`.
- **`eslint.config.mjs`**: flat config, `eslint-config-next/core-web-vitals` + `/typescript`. Кастомных правил нет.
- **Prettier — отсутствует.** Форматирование держится только на договорённости.
- **`drizzle.config.ts`**: `dialect: "turso"`, схема `./src/server/db/schema.ts`, вывод `./drizzle`.

### Переменные окружения (только имена, из `.env.example`)

`DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_API_URL`.

Единственная публичная — `NEXT_PUBLIC_API_URL` (`src/lib/api.ts:7`). Утечек серверных env в клиент **не найдено**: полный список обращений к `process.env` в `src/` — 7 штук, все либо в `src/server/**`, либо в route handler, либо `NODE_ENV`.

### Роутер

**Только App Router.** Каталога `src/pages` нет, гибрида нет. Все роуты в `src/app`.

### Дерево

```
src/
├── app/            роуты App Router + метадата-файлы (sitemap, robots, opengraph-image)
│   ├── admin/      админка: login (публичный) + (panel) route group (защищённый)
│   ├── api/        единственный route handler — contact
│   └── <прочее>/   публичные страницы: about, blog, contact, portfolio,
│                   privacy, process, reviews, services
├── components/
│   ├── cursor/     кастомный курсор (императивный, без React-стейта на кадр)
│   ├── layout/     Header/Footer/Container/Section/SiteChrome/LenisProvider
│   ├── motion/     GSAP-обёртки: FadeIn, TextReveal, ClipReveal, Parallax…
│   ├── portfolio/  медиа кейса + 25 генеративных мокапов
│   ├── sections/   крупные блоки страниц (home/about/shared)
│   ├── seo/        JsonLd
│   ├── ui/         Button — единственный примитив
│   └── visual/     AmbientBackdrop
├── data/           ⚠ ЛЕГАСИ: хардкод-контент, частично ещё живой (см. §5)
├── hooks/          useInView, useMediaQuery, useMousePosition
├── lib/            api, validation, utils, seo, site, motion, gsap, analytics
├── server/         ВСЁ серверное, помечено `server-only`
│   ├── admin/      реестр ресурсов + server actions
│   ├── auth/       сессии, пароли, requireUser
│   ├── content/    read-слой CMS
│   └── db/         drizzle client + schema
├── types/          доменные типы (blog, portfolio, review, service)
└── proxy.ts        ⚠ НЕ middleware.ts — переименование Next 16
```

---

## 1. Архитектура

### 1.1 Карта роутинга

**Публичные (все — server components, статические):**

| Роут | Файл | Данные |
|---|---|---|
| `/` | `src/app/page.tsx` | смешанные (см. §5) |
| `/about` | `src/app/about/page.tsx` | `getTeam()` через `<Team>` |
| `/services` · `/services/[slug]` | `src/app/services/…` | `getServices` / `getServiceBySlug` |
| `/portfolio` · `/portfolio/[slug]` | `src/app/portfolio/…` | `getProjects` / `getProjectBySlug` |
| `/blog` · `/blog/[slug]` | `src/app/blog/…` | `getPosts` / `getPostBySlug` |
| `/process`, `/reviews` | `…/page.tsx` | `getProcessPhases`, `getReviews` |
| `/contact`, `/privacy` | `…/page.tsx` | статика |

**Метадата-роуты**: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx` (`next/og` `ImageResponse`).

**Админка:**

```
/admin/login              src/app/admin/login/page.tsx        публичный
/admin                    src/app/admin/(panel)/page.tsx      ┐
/admin/leads              …/(panel)/leads/page.tsx            │ route group (panel)
/admin/[resource]         …/(panel)/[resource]/page.tsx       │ общий layout с
/admin/[resource]/[id]    …/(panel)/[resource]/[id]/page.tsx  ┘ requireUser()
```

`(panel)` — **route group**: не влияет на URL, существует чтобы повесить один защищённый layout (`src/app/admin/(panel)/layout.tsx:7`) на все приватные экраны, не задев `/admin/login`.

**Чего нет**: параллельных роутов (`@slot`), перехватывающих (`(.)foo`), `error.tsx`, `loading.tsx`, `global-error.tsx`, `not-found.tsx` внутри сегментов. Единственный `not-found.tsx` — корневой (`src/app/not-found.tsx`). См. BUG-06.

**Динамические сегменты**: `[slug]` ×3 с `generateStaticParams` (`portfolio/[slug]/page.tsx:18`, `blog/[slug]/page.tsx:15`, `services/[slug]/page.tsx:15`); `[resource]`/`[id]` в админке — без него, там `force-dynamic`.

`params` везде — **Promise** и разворачивается через `await` (`portfolio/[slug]/page.tsx:16,34`). Это API Next 15+, соблюдается последовательно.

### 1.2 Сервер vs клиент

Из 130 `.tsx`/`.ts` в `src/` **50 файлов** содержат `"use client"`. Границы проведены осмысленно:

- **Корневой layout — серверный** (`src/app/layout.tsx:81`), шрифты и метадата резолвятся на сервере.
- **`LenisProvider` и `SiteChrome` — клиентские**, но принимают `children` **пропсом** (`layout.tsx:91-93`). Это ключевая деталь: `children` уже отрендерены на сервере и просто передаются как готовый RSC-payload, поэтому клиентская обёртка **не** утаскивает дерево страницы в гидрацию. Паттерн применён верно.
- **`src/app/template.tsx` — клиентский** и оборачивает каждый роут (анимация перехода). Тот же приём с `children`.
- **`src/components/motion/*` — все клиентские**, это тонкие GSAP-обёртки вокруг `children`.
- **Серверные компоненты внутри секций**: `Team` (`sections/about/Team.tsx:29` — `async function`), `Pricing`, `ProcessPreview`, `Faq` — они `await`-ят контент и передают в клиентский слайдер (`TeamSlider`).

Серверного кода в клиентских файлах не найдено. Барьер `server-only` стоит в `src/server/db/index.ts:1`, `src/server/auth/*.ts:1`, `src/server/content/index.ts:1`, `src/server/admin/resources.ts:1` — импорт из клиента упадёт на сборке.

Исключение сделано осознанно: `src/server/db/client.ts` **без** `server-only`, чтобы им пользовались CLI-скрипты (`scripts/seed.ts:14`); комментарий на `client.ts:5-9` это объясняет.

### 1.3 Server Actions / Route Handlers

**Server Actions** — единственный файл `src/server/admin/actions.ts` (`"use server"` на строке 1), 5 экшенов:

| Экшен | Сигнатура | Где используется | Проверка доступа |
|---|---|---|---|
| `loginAction` | `(prev, FormData) → ActionState` | `LoginForm.tsx:11` через `useActionState` | — (это и есть вход) |
| `logoutAction` | `() → void` | `(panel)/layout.tsx:40` | — |
| `saveResourceAction` | `(prev, FormData) → ActionState` | `ResourceForm.tsx:26` | `requireUser()` :78 |
| `deleteResourceAction` | `(FormData) → void` | `ResourceForm.tsx:50` | `requireUser()` :136 |
| `setLeadStatusAction` | `(FormData) → void` | `leads/page.tsx:53` | `requireUser()` :154 |

Каждый мутирующий экшен проверяет сессию **сам** — это правильно и совпадает с прямым предупреждением в документации Next 16 (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:217-219`): Server Functions не являются отдельными роутами, и matcher прокси их не покрывает.

**Route Handlers** — ровно один: `src/app/api/contact/route.ts`, метод `POST`.

### 1.4 Стратегия данных и кэширование

| Механизм | Используется? | Где |
|---|---|---|
| `generateStaticParams` | ✅ | 3 динамических роута |
| `export const dynamic` | ✅ только `force-dynamic` | 4 файла админки |
| `export const revalidate` (ISR по времени) | ❌ **нигде** | — |
| `revalidatePath` | ✅ | `actions.ts:64-72,130-131,146-148,159` |
| `revalidateTag` / `cacheTag` | ❌ | — |
| `unstable_cache` / `use cache` | ❌ | — |
| `fetch`-кэш Next | ❌ (fetch только к Telegram) | — |
| React Query / SWR | ❌ | — |

Модель такая: **публичные страницы статические**. Они читают БД напрямую в RSC, не касаются динамических API (`cookies`/`headers`/`searchParams`), поэтому Next пререндерит их на сборке. Сохранение в админке дёргает `revalidatePath` по списку из реестра (`src/server/admin/resources.ts`, поле `revalidate` у каждого ресурса).

Кэш-обёртки над запросами нет **намеренно** — обосновано в `src/server/content/index.ts:29-32`. Логика верна: запрос выполняется на сборке/ревалидации, а не на каждый заход.

`use cache` из Next 16 не включён; причина — в `docs/BACKEND.md:120-122` (требует `cacheComponents: true`, меняет семантику всего приложения). Согласен, это отдельная задача.

**Дыры в этой модели** — BUG-03 (delete не ревалидирует `:slug`) и BUG-07 (`sitemap.xml` не ревалидируется никогда).

### 1.5 Глобальное состояние

Его практически нет, и это здорово:

- **Server state** — БД через `src/server/content`, читается прямо в RSC. Никакого клиентского кэша.
- **Client state** — только локальный `useState` в конкретных компонентах.
- **Единственный React Context** во всём проекте — `LenisContext` (`src/components/layout/LenisProvider.tsx:9`), отдаёт живой инстанс smooth-scroll. Потребитель один: `src/app/template.tsx:17`.
- Дублей стейта нет. Есть дубли **источника контента** — см. §5.

### 1.6 Auth

```
Cookie:   itdos_session   httpOnly · sameSite=lax · secure (только в prod) · path=/ · TTL 14 дней
                          src/server/auth/session.ts:26-32
Значение: 32 случайных байта hex (randomBytes)          session.ts:20
Хранение: таблица sessions (id, user_id, expires_at)    schema.ts:43-56
Пароли:   scrypt из node:crypto, формат <salt>:<key>    auth/password.ts:19-23
Сравнение: timingSafeEqual                              auth/password.ts:34
```

**Две линии защиты, и они разного веса:**

1. **`src/proxy.ts`** — дешёвый первый фильтр. Матчер `["/admin/:path((?!login).*)", "/admin"]` (`proxy.ts:27`). Видит **только факт наличия cookie** (`proxy.ts:15`), до БД не достаёт. Комментарий на `proxy.ts:5-11` честно это оговаривает.
2. **`requireUser()`** (`src/server/auth/index.ts:21-25`) — настоящая проверка. Вызывается в `(panel)/layout.tsx:9` и в каждом мутирующем экшене.

Сессия — **opaque id, не JWT**, обоснование в `session.ts:14-18`: отзыв через удаление строки. Истёкшие сессии подметаются лениво при чтении (`session.ts:63-66`), плюс есть неиспользуемый `purgeExpiredSessions()` (`session.ts:72-74`).

Защита от перечисления аккаунтов сделана: несуществующий пользователь всё равно прогоняется через `verifyPassword` с фиктивным хешем (`auth/index.ts:45-48`). Проверил длину — `"0".repeat(128)` = 64 байта = `KEYLEN`, значит проверка `expected.length !== KEYLEN` (`password.ts:30`) пройдена и scrypt реально считается. Работает как задумано.

**Роли не работают**: `requireAdmin()` объявлен (`auth/index.ts:27-31`) и **не вызывается нигде**. Колонка `role` есть, но editor может всё то же, что admin. Это признано в `docs/BACKEND.md:196-197`.

### 1.7 Стили

- **Tailwind v4**, конфиг-файла нет — всё через `@theme` в `src/app/globals.css:5-52`.
- **Токены не-inline осознанно** (`globals.css:2-3`): утилиты компилируются в `var(--color-*)`, поэтому тему можно переопределить в рантайме на уровне секции.
- **Тема**: класс `.theme-light` (`globals.css:57-73`) переопределяет те же переменные → сайт чередует тёмные и светлые «главы». Применяется прямо на `<Section className="theme-light">`.
- **Контрастность посчитана и задокументирована**: `globals.css:17-20` (`fg-muted` подняли с 0.42 до 0.52 ради 4.9:1), `globals.css:29-32` (отдельный `--color-accent-text`, потому что брендовый `#6e56ff` даёт лишь 4.23:1). Это заметно выше среднего уровня внимания к a11y.
- **Брейкпоинты** — дефолтные Tailwind (`sm/md/lg/xl`), кастомных нет.
- **CSS Modules** — только для 6 мокапов портфолио (`*.module.css` в `components/portfolio/mockups/`), там где нужны сложные keyframes.
- **Reduced motion** — двойное гейтирование: CSS-сеть безопасности (`globals.css:325-341`) + JS через `useReducedMotion()` в каждом motion-компоненте.

---

## 2. Подключение к бэкенду

### 2.1 Главное, что нужно понять

**Отдельного бэкенда нет.** «Бэкенд» — это сам Next: RSC читают SQLite напрямую через Drizzle, мутации идут через Server Actions. HTTP-слой между фронтом и данными существует **ровно в одном месте** — форма заявки.

Из этого следует: `src/lib/api.ts` — это **не** транспорт приложения. Это 57 строк, обслуживающих один-единственный эндпоинт.

### 2.2 Базовый URL

```ts
// src/lib/api.ts:6-7
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
```

Пустая строка по умолчанию → `fetch("/api/contact")` → относительный запрос на собственный origin. `.env.example:31-32` подтверждает: «Пусто = запросы идут на собственный /api/contact (рекомендуется)».

`NEXT_PUBLIC_` здесь корректен — значение читается в браузере. Серверные `DATABASE_URL`, `TELEGRAM_*` в клиент не попадают: `src/server/db/client.ts` защищён `server-only` через `src/server/db/index.ts:1`, а `TELEGRAM_*` читаются внутри route handler'а.

### 2.3 Транспорт — разбор `src/lib/api.ts` построчно

```ts
 9  type RequestOptions = {
10    method?: "GET" | "POST" | "PUT" | "DELETE";   // PATCH отсутствует
11    body?: unknown;
12    headers?: Record<string, string>;
13  };

15  async function request<T>(path, options = {}): Promise<T> {
19    const { method = "GET", body, headers = {} } = options;

21    const res = await fetch(`${BASE_URL}${path}`, {
22      method,
23      headers: { "Content-Type": "application/json", ...headers },
27      body: body ? JSON.stringify(body) : undefined,
28    });

30    if (!res.ok) {
31      throw new Error(`API error: ${res.status} ${res.statusText}`);   // ← тело ответа выброшено
32    }
34    return res.json() as Promise<T>;    // ← `as`, а не валидация
35  }
```

Что здесь **есть**: типизация дженериком, единая точка входа, дефолтные заголовки.

Что здесь **отсутствует целиком**:

| Механизм | Статус |
|---|---|
| Интерсепторы | нет — нечего перехватывать, авторизация на cookie |
| Подстановка токена | нет и не нужно (httpOnly cookie едет сама) |
| Refresh-флоу | нет (сессия на 14 дней, refresh-токенов не существует) |
| Обработка 401/403 | нет |
| Ретраи | нет |
| Таймаут | **нет** — зависшая сеть держит форму в `loading` бесконечно |
| `AbortController` | **нет** |
| Разбор тела ошибки | **нет** — см. BUG-05 |
| Runtime-валидация ответа | **нет** — `as Promise<T>` это просто утверждение TS |

Отсутствие refresh/интерсепторов — не недостаток, а следствие архитектуры (opaque cookie-сессия). А вот отсутствие таймаута и потеря тела ошибки — реальные проблемы.

### 2.4 Слой API и типизация

```ts
// src/lib/api.ts:49-57
export const api = {
  contact: { submit: (payload: ContactPayload) => request<ContactResponse>("/api/contact", {…}) },
};
```

Группировка по домену, одна ветка. DTO объявлены рядом (`api.ts:37-47`). Маппинга backend → frontend **здесь** нет — он не нужен, обе стороны наши.

Настоящий маппинг живёт в другом месте — `src/server/content/index.ts`. Каждая функция руками перекладывает строку БД в доменный тип (`toProject` на `content/index.ts:80-111`, аналогично для services/posts/reviews/team/plans/faq/process). Служебные колонки (`position`, `published`, timestamps) до React не доходят — обосновано в `content/index.ts:24-27`. Это грамотный anti-corruption layer.

### 2.5 Что вызывается откуда

| Источник | Что делает |
|---|---|
| **RSC (сервер, на сборке)** | `getServices/getProjects/getPosts/getReviews/getTeam/getPlans/getFaq/getProcessPhases` → Drizzle → SQLite |
| **RSC (сервер, per-request)** | админка с `force-dynamic` — прямые `db.select()` / `db.all()` |
| **Браузер** | ровно один вызов: `api.contact.submit()` |
| **Server Actions (сервер)** | все мутации админки |
| **Route Handler (сервер)** | `POST /api/contact` → БД + Telegram |

Прокси через Route Handlers к внешнему API **нет** — `/api/contact` не проксирует, а сам является конечной точкой. Единственный исходящий `fetch` во всём проекте — к `api.telegram.org` (`api/contact/route.ts:92`), и он идёт с сервера, поэтому токен бота не покидает сервер.

### 2.6 Сценарий А: отправка заявки (единственный клиент→сервер поток)

```
[БРАУЗЕР]
ContactForm (ContactForm.tsx:19, "use client")
  │ useState: form {name, contact, company}, status, errors        :20-26
  │
  ├─ onChange → handleChange                                        :28-35
  │    setForm + сброс ошибки поля при первом же вводе
  │
  └─ onSubmit → handleSubmit                                        :37-58
       │
       ├─ e.preventDefault()
       ├─ validateLead(form)              lib/validation.ts:29-39
       │    isValidName   — trim().length >= 2                      :12-14
       │    isValidContact — есть "@" ? email-regex : 9–15 цифр     :22-25
       │    ✗ невалидно → setErrors, status="idle", RETURN (сеть не трогаем)
       │
       ├─ setStatus("loading")   → кнопка disabled                  :150
       │
       ├─ api.contact.submit(form)          lib/api.ts:51-55
       │    └─ request<ContactResponse>("/api/contact", POST)  api.ts:15-35
       │         fetch("" + "/api/contact")   ← BASE_URL пуст → свой origin
       │         ⚠ без таймаута, без AbortController
       │
       ▼
[СЕРВЕР]  POST /api/contact          app/api/contact/route.ts:16
       │
       ├─ request.json().catch(() => null)                          :18
       │    ✗ не объект → 400 «Некорректный запрос»                 :19-21
       │
       ├─ HONEYPOT: company непустой → 200 {success:true}           :26-28
       │    Бот получает «успех» и уходит. Заявка НЕ сохраняется.
       │
       ├─ validateLead({name, contact})   ← ТА ЖЕ функция, что в браузере
       │    ✗ → 400 + {errors}                                      :34-41
       │
       ├─ contactIsEmail = normalizedContact.includes("@")           :46
       │
       ├─ try { db.insert(leads) …; stored = true }                  :54-63
       │    ✗ catch → console.error, stored = false, НЕ бросаем      :64-66
       │      (осознанно: на serverless файловая БД недостижима,
       │       throw здесь потерял бы заявку — комментарий :47-52)
       │
       ├─ if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID)                :90
       │    fetch api.telegram.org/bot<token>/sendMessage            :92-96
       │      ok  → note({notified: true})                           :98
       │      !ok → note({notifyError: detail.slice(0,500)})         :100-102
       │    ✗ throw → note({notifyError: message})                   :104-107
       │    else → note({notifyError: "Telegram не настроен"})       :110-113
       │      note() — best-effort, свой try/catch, no-op если !stored :69-76
       │
       └─ 200 {success:true, "Заявка принята"}                       :117
           ⚠ Возвращается ДАЖЕ если и БД, и Telegram упали.
       ▼
[БРАУЗЕР]
       ├─ res.ok → api.ts:34 res.json()
       ├─ trackLead({})              lib/analytics.ts:26-38
       │    window.dataLayer.push({event:"generate_lead"}) + CustomEvent
       │    (no-op, пока GTM не установлен — он не установлен)
       └─ setStatus("success") → форма заменяется экраном благодарности :60-73

   ОШИБКА:
       catch { setStatus("error") }                                  :55-57
       ⚠ Тело ответа с конкретным сообщением уже потеряно в api.ts:31.
         Пользователь видит «Ошибка отправки» вместо «Укажите корректный телефон».
       UI-фидбек: видимый <p> :132-136 + постоянный live-region :140-146
```

### 2.7 Сценарий Б: логин + правка приватного контента

```
[БРАУЗЕР] GET /admin/services
       ▼
[PROXY]  src/proxy.ts:12          матчер "/admin/:path((?!login).*)"  :27
       │  cookies.get("itdos_session") отсутствует
       └─ 307 → /admin/login?next=/admin/services                     :16-19
       ▼
[СЕРВЕР] LoginPage (admin/login/page.tsx:11) — server component
       │  getSessionUser() → null → рендерим форму
       │  ⚠ searchParams.next НЕ читается — см. BUG-14
       ▼
[БРАУЗЕР] LoginForm (LoginForm.tsx:10, "use client")
       │  useActionState<ActionState, FormData>(loginAction, {})       :11
       │  <form action={action}> — прогрессивное улучшение: работает без JS
       └─ submit → POST на текущий роут (Server Function)
       ▼
[СЕРВЕР] loginAction               server/admin/actions.ts:16
       ├─ пустые поля → {error:"Введите почту и пароль"}               :19
       ├─ login(email, password)    server/auth/index.ts:35
       │    ├─ select users where email = lower(trim(email))           :36-40
       │    ├─ нет юзера → фиктивный verifyPassword + тот же текст     :45-48
       │    │    (защита от перебора почт по времени ответа)
       │    ├─ verifyPassword       auth/password.ts:25-35
       │    │    scrypt(password, salt, 64) → timingSafeEqual
       │    └─ createSession(user.id)   auth/session.ts:19-33
       │         randomBytes(32).hex → insert sessions
       │         cookies().set(httpOnly, sameSite=lax, secure в prod, 14д)
       └─ redirect("/admin")        ← ⚠ всегда /admin, ?next игнорируется
       ▼
[PROXY]  cookie есть → NextResponse.next()                             :22
       ▼
[СЕРВЕР] PanelLayout (admin/(panel)/layout.tsx:7)
       └─ requireUser()             auth/index.ts:21-25   ← НАСТОЯЩАЯ проверка
            getSessionUser(): cookie → join sessions×users             session.ts:48-59
              нет строки → null
              expiresAt < now → delete + null                          session.ts:63-66
            null → redirect("/admin/login")
       ▼
[СЕРВЕР] ResourceListPage (…/[resource]/page.tsx:19)   force-dynamic :9
       │  getResource("services")   реестр resources.ts:308-310
       │  db.all(sql`select * from ${def.table} order by ${orderColumn}`)  :28-30
       │    orderColumn через sql.raw — значение из закрытого union,
       │    не пользовательский ввод, инъекции нет                     :25-26
       ▼
[БРАУЗЕР] правка → ResourceForm (…/[id]/ResourceForm.tsx:25, "use client")
       │  useActionState(saveResourceAction, {})                       :26
       │  скрытые поля __resource / __id                               :31-32
       ▼
[СЕРВЕР] saveResourceAction        actions.ts:74
       ├─ requireUser()                                                :78
       │    ⚠ не requireAdmin — роли не разграничены (BUG-15)
       ├─ getResource(key) — неизвестный ключ отсекается               :82-83
       ├─ readField() по каждому полю реестра                          :34-62
       │    boolean → "on"|"true"; number → Number|0;
       │    stringList → split("\n").trim().filter(Boolean);
       │    objectList → JSON.parse, при ошибке null → fieldError
       ├─ schemaFor(resource).safeParse(values)   resources.ts:313-343
       │    Zod-схема строится ИЗ ТОГО ЖЕ реестра — один источник правды
       │    ⚠ .catch() у необязательных полей глушит ошибки (BUG-12)
       ├─ db.update / db.insert(randomUUID())                          :115-119
       │    catch UNIQUE → fieldErrors.slug «Такой slug уже занят»      :123-125
       ├─ revalidateFor(resource, slug)                                :130
       │    для services: "/", "/services", "/services/:slug"          resources.ts:83
       │    ⚠ /sitemap.xml в списках нет (BUG-07)
       ├─ revalidatePath(`/admin/${key}`)                              :131
       └─ redirect(`/admin/${key}?saved=1`)                            :132
       ▼
Публичная страница пересобирается при следующем запросе.
```

---

## 3. Схема данных

`src/server/db/schema.ts`, 13 таблиц: `users`, `sessions`, `services`, `projects`, `posts`, `reviews`, `team_members`, `plans`, `faq_items`, `process_phases`, `leads`, `settings`.

Ключевое решение — **списки и объекты лежат JSON-колонками**, а не отдельными таблицами (`schema.ts:6-16`). Обоснование: они всегда читаются целиком с родителем, не фильтруются и не джойнятся. Проверил по коду — так и есть, ни одного запроса по содержимому этих колонок нет. Решение корректное.

Всё, что действительно запрашивается отдельно, — обычные колонки с индексами: `slug` (uniqueIndex ×3), `category`, `featured`, `status`, `created_at`.

Таблица `settings` (`schema.ts:249-255`) создана, но **не используется ни одной строкой кода** — задел на будущее.

---

## 4. Админка — генеративный подход

Восемь типов контента обслуживают **один** список и **одна** форма. Реестр `src/server/admin/resources.ts:76-306` описывает каждый тип декларативно; `/admin/[resource]` и `/admin/[resource]/[id]` рендерят их генерически; Zod-схема строится из того же описания (`resources.ts:313-343`).

Это сильное решение: добавление типа контента = запись в реестре, а не новый экран. Обоснование в `resources.ts:16-24` («те же ~300 строк, скопированные восемь раз, разъедутся при первом же новом поле») — согласен.

Цена: `saveResourceAction` вынужден работать с таблицей как с `never` (`actions.ts:107-108,116-118`), теряя типобезопасность Drizzle. Ограничено одной функцией — приемлемый размен, но это место, где типы не защищают.

---

## 5. ⚠ Два источника контента одновременно

Миграция с хардкода на БД **не завершена**. `src/data/*.ts` остались и частично живы:

| Компонент | Источник | Отрендерен сейчас? |
|---|---|---|
| `ClientMarquee.tsx:6` | `@/data/clients` | ✅ **ДА** — `app/page.tsx:35` |
| `ServicesGrid.tsx:19` | `@/data/services` | ❌ закомментирован `page.tsx:50` |
| `Reviews.tsx:9` | `@/data/reviews` | ❌ закомментирован `page.tsx:63` |
| `PortfolioPreview.tsx:7` | `@/data/portfolio` | ❌ закомментирован `page.tsx:54` |
| `TrustWall.tsx:8`, `ClientLogos.tsx:3`, `TechMarquee.tsx:1` | `@/data/*` | ❌ закомментированы |

При этом `getClientBrands()` (`server/content/index.ts:146-167`) написан именно для витрины логотипов — и **не вызывается нигде**. То есть замена для единственного живого потребителя `@/data` готова, но не подключена.

`src/data/*` также остаётся входом для сида (`scripts/seed.ts:28-35`) — это законное применение. Но роль «источник для сида» и роль «источник для рендера» смешаны, и по коду не видно, какая где.

Отдельно: `src/app/page.tsx` — 72 строки, из которых **12 блоков закомментированы**. Главная страница фактически хранит несколько нереализованных вариантов вёрстки в комментариях.

---

## 6. Итоговая оценка архитектуры

**Сильные стороны:**
- Граница сервер/клиент проведена дисциплинированно и защищена `server-only` на уровне сборки.
- Клиентские обёртки (`SiteChrome`, `LenisProvider`, `template`) принимают `children` пропсом — дерево страницы не утягивается в гидрацию.
- Auth сделан по учебнику: opaque-сессии, scrypt, `timingSafeEqual`, защита от перечисления, проверка в каждом экшене, а не только в прокси.
- Read-слой честно маппит строки в доменные типы, служебные колонки не текут в UI.
- Генеративная админка вместо восьми копий одного экрана.
- Контрастность посчитана, reduced-motion гейтируется дважды.
- Комментарии объясняют **почему**, а не **что** — местами вместе с историей бага, который они чинят.

**Слабые:**
- Ноль тестов при нетривиальной логике (`readField`, `schemaFor`, `toSnake`, `luminance`, `ink`).
- Нет `error.tsx` / `loading.tsx` — падение серверного компонента упирается в дефолтный экран Next.
- Незавершённая миграция контента (§5).
- Дефолтные учётки админа воспроизводимо создаются сборкой (см. `BUGS.md`, BUG-01).
- `src/lib/api.ts` без таймаута и с потерей тела ошибки.
</content>

# CODESTYLE — ITDOS

> Правила выведены из чтения кода, а не из общих рекомендаций.
> Каждое — с примером из проекта. Формулировки императивные:
> так пишут здесь, так пиши и ты.
> Отдельный раздел в конце — **анти-паттерны, которые в проекте уже есть**.
> Их копировать не надо.

---

## 1. Именование

### Файлы и папки

| Что | Правило | Пример |
|---|---|---|
| Компоненты | `PascalCase.tsx` | `src/components/layout/Header.tsx` |
| Хуки | `camelCase.ts` с префиксом `use` | `src/hooks/useMediaQuery.ts` |
| Утилиты / lib | `camelCase.ts`, коротко и по домену | `src/lib/validation.ts`, `src/lib/seo.ts` |
| Типы | `camelCase.ts` по домену | `src/types/portfolio.ts` |
| Данные-константы | `camelCase.ts` | `src/data/pricing.ts` |
| Данные рядом с компонентом | `<Component>.data.ts` | `src/components/sections/home/heroGeometric.data.ts` |
| CSS-модули | `<Component>.module.css` | `src/components/portfolio/mockups/PhoneMock.module.css` |
| Папки | `camelCase` в единственном или множественном числе по смыслу | `components/`, `server/auth/`, `sections/home/` |
| Роуты App Router | строчными, kebab при нужде | `src/app/admin/(panel)/leads/page.tsx` |

**Баррель-файл — только там, где он реально нужен.** Всего два: `src/components/portfolio/mockups/index.tsx` (диспетчер `Mockup`) и `src/server/db/index.ts` (re-export с добавлением `server-only`). Не заводи `index.ts` в каждой папке.

### Идентификаторы

- **Компоненты** — `PascalCase`, имя файла = имя экспорта: `export function Header()` в `Header.tsx:54`.
- **Функции и переменные** — `camelCase`.
- **Модульные константы-конфиги** — `SCREAMING_SNAKE`: `RING_SIZE` (`CustomCursor.tsx:15`), `SESSION_COOKIE`, `SESSION_TTL_MS`, `KEYLEN` (`auth/password.ts:12`), `STATUSES` (`leads/page.tsx:14`), `REVEAL_START` (`lib/motion.ts:27`), `CLIENT_BOX`.
- **Локальные строки классов** — `camelCase` строчными: `inputClass`, `invalidClass` (`ContactForm.tsx:15-17`), `base`, `invalid` (`ResourceForm.tsx:13-15`), `input` (`LoginForm.tsx:7`).
- **Приватные хелперы** внизу файла — `camelCase` / `PascalCase` для локальных компонентов: `toSnake`, `safeJson`, `Cell`, `Field`, `GroupColumn`.
- **Типы** — `PascalCase`. Строки БД — суффикс `Row`: `UserRow`, `ProjectRow` (`schema.ts:257-267`).

---

## 2. Структура компонента

### Порядок импортов — соблюдай его

Ровно такой порядок, группы разделены пустой строкой **не всегда** (в проекте чаще подряд, но порядок стабилен):

```tsx
// src/components/sections/shared/ContactForm.tsx:1-11
"use client";                                    // 1. директива, самой первой

import { useState } from "react";                // 2. react
import Link from "next/link";                    // 3. next/*
import { ArrowRight, CheckCircle } from "lucide-react";  // 4. внешние пакеты
import { api } from "@/lib/api";                 // 5. @/lib
import { cn } from "@/lib/utils";
import { site, whatsappLink } from "@/lib/site";
import { validateLead, type LeadErrors } from "@/lib/validation";
import { trackLead } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";  // 6. @/components
```

Серверная версия того же порядка — `src/app/portfolio/[slug]/page.tsx:1-14`:
`type { Metadata }` → `next/navigation` → `next/link` → `lucide-react` → `@/components/*` → `@/server/content` (данные — последними).

**Всегда используй алиас `@/`.** Относительные пути допустимы только внутри одной папки-модуля: `./Header`, `./Footer` в `SiteChrome.tsx:4-6`; `./password`, `./session` в `server/auth/index.ts:7-8`.

### Типы пропсов — рядом с компонентом, всегда `type`

Два принятых варианта, оба живые:

**А. Именованный `type` над компонентом** — когда пропсов больше трёх или тип переиспользуется:

```tsx
// src/components/motion/FadeIn.tsx:8-15
type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  trigger?: "scroll" | "immediate";
};
```

**Б. Инлайн в сигнатуре** — для 1–3 простых пропсов:

```tsx
// src/components/layout/SiteChrome.tsx:15
export function SiteChrome({ children }: { children: React.ReactNode }) {
```

Для страниц — всегда короткий `type Props` (`portfolio/[slug]/page.tsx:16`):
```tsx
type Props = { params: Promise<{ slug: string }> };
```

### Дефолтные значения — в деструктуризации, не через `defaultProps`

```tsx
// src/components/layout/Section.tsx:19-26
export function Section({ children, className, id, as: Tag = "section", spacing = "md", style }: SectionProps)
```
Переименование `as: Tag` — принятая идиома для полиморфного тега (`Section.tsx:23`, `TextReveal.tsx:23`).

### Экспорты

**Именованный экспорт — по умолчанию для всего.** `export function Button`, `export function Header`, `export function cn`.

`export default` — **только** там, где этого требует Next:
- `page.tsx`, `layout.tsx`, `template.tsx`, `not-found.tsx`
- `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`
- `next.config.ts`, `eslint.config.mjs`, `drizzle.config.ts`

Никогда не делай `export default` для обычного компонента или утилиты.

### Локальные подкомпоненты — внизу файла, без экспорта

```tsx
// src/components/sections/shared/ContactForm.tsx:197
function Field({ label, required, error, htmlFor, children }: {...}) { … }
```
Так же: `GroupColumn` (`portfolio/[slug]/page.tsx:293`), `Cell`/`toSnake` (`admin/(panel)/[resource]/page.tsx:96,116`), `PhoneFrame`/`MobilePlaceholder` (`ProjectGallery.tsx:61,81`).

**Правило:** компонент, используемый только в этом файле, не выносится в отдельный файл и не экспортируется.

---

## 3. TypeScript

### `type`, а не `interface`

**В проекте нет ни одного `interface` для пропсов или доменных моделей.** Единственное исключение — обязательное расширение глобального `Window`:

```ts
// src/lib/analytics.ts:20-24
declare global {
  interface Window { dataLayer?: Record<string, unknown>[]; }
}
```
Пиши `type`. `interface` — только для declaration merging.

### Union вместо enum

**`enum` не используется нигде.** Всё — строковые union:

```ts
// src/types/portfolio.ts:42-48
export type ProjectCategory = "website" | "webapp" | "crm" | "ai" | "bot" | "marketplace";
```
```tsx
// src/components/sections/shared/ContactForm.tsx:13
type FormState = "idle" | "loading" | "success" | "error";
```
Для констант — `as const` вместо enum: `EASE`/`DURATION` (`lib/motion.ts:9-24`), `site` (`lib/site.ts:5-19`), `STATUSES` (`leads/page.tsx:14-19`).

### Discriminated union для результатов операций

```ts
// src/server/auth/index.ts:33
export type LoginResult = { ok: true } | { ok: false; error: string };
```
Так же `ActionState` (`server/admin/actions.ts:12`). Возвращай результат объектом, а не бросай исключение, когда ошибка — ожидаемый исход.

### `any` — ноль вхождений. `unknown` — рабочая лошадка

`grep` по `src/`: **ни одного `any`**. Неизвестные данные типизируются `unknown` и сужаются:

```ts
// src/server/admin/actions.ts:34
function readField(form: FormData, f: FieldDef): unknown
// src/app/admin/(panel)/[resource]/page.tsx:96
function Cell({ value, type }: { value: unknown; type: string })
```

Сужение ошибок — стабильная идиома, повторяется трижды:
```ts
const message = err instanceof Error ? err.message : String(err);
// actions.ts:121, api/contact/route.ts:105
```

### Дженерики — только там, где реально нужны

Три места на весь проект: `request<T>` (`lib/api.ts:15`), `useInView<T extends HTMLElement>` (`hooks/useInView.ts:13`), `db.all<Record<string, unknown>>` (`[resource]/page.tsx:28`).

### `satisfies` для конфигов

```ts
// drizzle.config.ts:12
} satisfies Config;
```

### Общие типы — в `src/types/`, доменные — рядом с владельцем

- `src/types/*.ts` — то, что переиспользуется между слоями: `PortfolioProject`, `Service`, `BlogPost`, `Review`.
- Типы, у которых один владелец, живут **у владельца** и экспортируются оттуда: `TeamMember`, `Plan`, `FaqItem`, `ProcessPhase`, `ClientBrand` — все в `src/server/content/index.ts:129-137,232-242,266-273,294,307-313`.
- Типы строк БД выводятся, а не пишутся руками:
  ```ts
  // src/server/db/schema.ts:257-267
  export type UserRow = typeof users.$inferSelect;
  ```

### `import type` — обязательно для типов

```ts
import type { Metadata } from "next";
import type { NextRequest } from "next/server";
import { validateLead, type LeadErrors } from "@/lib/validation";  // инлайн, когда смешано
```

---

## 4. Хуки

Пиши хук, только если логика переиспользуется. В проекте их три, и каждый решает конкретную задачу.

**Возврат:** кортеж `as const` для пары значений, скаляр — напрямую.
```ts
// src/hooks/useInView.ts:37
return [ref, inView] as const;
// src/hooks/useMediaQuery.ts:5
export function useMediaQuery(query: string): boolean
```

**SSR-безопасность обязательна.** Для подписок на браузерные API — `useSyncExternalStore` с серверным снапшотом:
```ts
// src/hooks/useMediaQuery.ts:15-19
return useSyncExternalStore(
  subscribe,
  () => window.matchMedia(query).matches,
  () => false            // server snapshot — assume no match during SSR
);
```

**Свежий колбэк без пересоздания слушателя** — через ref:
```ts
// src/hooks/useMousePosition.ts:10-14
const handler = useRef(onMove);
useEffect(() => { handler.current = onMove; });   // без deps — обновляем каждый рендер
```

**Cleanup — всегда.** Каждый `useEffect` с подпиской возвращает функцию отписки: `useInView.ts:34`, `useMousePosition.ts:21`, `CustomCursor.tsx:129-139`, `Header.tsx:106-111`, `FloatingContact.tsx:24-27`.

**Хуки-обёртки над хуками** вместо дублирования `matchMedia`:
```ts
// src/lib/motion.ts:33-35
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
```

---

## 5. Утилиты, константы, серверный слой

- **`src/lib/`** — чистые функции и константы, без побочных эффектов при импорте. Исключение — `lib/gsap.ts`, где регистрация плагина обёрнута в `typeof window !== "undefined"` (`lib/gsap.ts:4-6`).
- **Один домен — один файл.** Не сваливай всё в `utils.ts`: там только `cn`, `lerp`, `clamp`, `formatDate` (`lib/utils.ts`).
- **Единый источник правды для данных, которые видны в двух местах.** Контакты — `lib/site.ts`, и комментарий объясняет зачем (`site.ts:1-4`, `contact/page.tsx:16-17`): подпись на экране и `mailto:` не должны разъезжаться.
- **`src/server/**` — только сервер.** Первой строкой каждого модуля:
  ```ts
  import "server-only";
  ```
  `server/db/index.ts:1`, `server/auth/session.ts:1`, `server/auth/password.ts:1`, `server/auth/index.ts:1`, `server/content/index.ts:1`, `server/admin/resources.ts:1`.
  Единственное исключение — `server/db/client.ts`, оно намеренное и объяснено в комментарии (`client.ts:5-9`): без него CLI-скрипты не смогли бы переиспользовать схему.

---

## 6. Ошибки и загрузки

Текущее состояние (см. `BUGS.md`, BUG-06): `error.tsx`, `loading.tsx`, `global-error.tsx`, скелетонов и toast-библиотеки **в проекте нет**. Пока их не завели, действуют такие правила:

**Состояние формы — конечный автомат, не набор булевых флагов:**
```tsx
// src/components/sections/shared/ContactForm.tsx:13,25
type FormState = "idle" | "loading" | "success" | "error";
const [status, setStatus] = useState<FormState>("idle");
```

**Ошибка обязана иметь UI-выражение.** Просто `console.error` недостаточно.
- видимый текст: `ContactForm.tsx:132-136`
- постоянно смонтированный live-region: `ContactForm.tsx:138-146` — с комментарием, почему регион не создаётся по факту ошибки (иначе скринридер его не объявит)
- в экшенах — поле в `ActionState`, отрисовываемое формой: `LoginForm.tsx:43-45`, `ResourceForm.tsx:38-40`

**Логируй с префиксом-тегом:**
```ts
console.error("[contact] could not persist lead:", err);   // api/contact/route.ts:65
console.error("[admin] save failed:", err);                // actions.ts:126
```
Формат: `[<домен>] <что произошло>:`.

**Глушить ошибку можно только осознанно и с комментарием, почему это правильно:**
```ts
// src/app/api/contact/route.ts:68
/** Bookkeeping updates are best-effort — never worth failing a lead over. */
```

---

## 7. Формы и валидация

Библиотеки форм **нет**. Используются два паттерна, выбор зависит от того, где живут данные.

### Паттерн А — публичные формы: `useState` + `fetch`

`ContactForm.tsx`. Порядок шагов фиксирован:

1. `e.preventDefault()`
2. Валидация **до** сети — если невалидно, `return` без запроса (`ContactForm.tsx:42-47`)
3. `setStatus("loading")` → кнопка `disabled` (`:150`)
4. `try/catch` вокруг вызова
5. Успех → `trackLead()` → `setStatus("success")`

Ошибка поля сбрасывается при первом же вводе в него (`ContactForm.tsx:33-34`).

### Паттерн Б — админка: Server Action + `useActionState`

```tsx
// src/app/admin/(panel)/[resource]/[id]/ResourceForm.tsx:26
const [state, action, pending] = useActionState<ActionState, FormData>(saveResourceAction, {});
…
<form action={action}>
```
Так же `LoginForm.tsx:11`. `pending` из хука → `disabled` на кнопке. Никакого `onSubmit`, никакого своего `fetch`. Форма работает без JS.

Скрытые поля для контекста — с префиксом `__`:
```tsx
<input type="hidden" name="__resource" value={resourceKey} />   // ResourceForm.tsx:31-32
```

### Валидация

**Одна функция на клиент и на сервер.** `src/lib/validation.ts` импортируется и формой (`ContactForm.tsx:9`), и route handler'ом (`api/contact/route.ts:6`) — комментарий на `validation.ts:1-4` объясняет: браузер и сервер не должны расходиться в том, что считается валидной заявкой.

**Клиентская проверка — не проверка.** Сервер валидирует всегда заново (`api/contact/route.ts:32`).

**Zod — только в админке**, и схема **выводится из реестра**, а не пишется отдельно (`resources.ts:313-343`). Не дублируй описание полей.

**Возвращай ошибки полей объектом:**
```ts
export type LeadErrors = Partial<Record<"name" | "contact", string>>;   // validation.ts:27
fieldErrors?: Record<string, string>                                    // actions.ts:12
```

---

## 8. Стили

### `cn()` — всегда

```tsx
import { cn } from "@/lib/utils";
className={cn(inputClass, errors.name && invalidClass)}     // ContactForm.tsx:105
```
Никогда не склеивай классы шаблонной строкой при наличии условий. `cn` = `twMerge(clsx(...))` (`lib/utils.ts:4-6`), поэтому конфликтующие Tailwind-классы схлопываются правильно.

### Условные стили — тернарник внутри `cn`

```tsx
// src/app/admin/(panel)/AdminNavLink.tsx:16-19
className={cn(
  "rounded-lg px-3 py-2 text-sm transition-colors",
  active ? "bg-panel font-medium text-fg" : "text-fg-secondary hover:bg-panel/60 hover:text-fg",
)}
```

### Порядок классов внутри строки

Устойчиво соблюдается: **позиционирование → размеры → flex/grid → отступы → рамка/фон → типографика → эффекты → варианты состояний → респонсив**.

```
"fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-5"      Header.tsx:117
"relative flex h-full w-full items-center justify-center overflow-hidden"  ProjectMedia.tsx:64
```
Модификаторы (`hover:`, `sm:`, `lg:`) идут **после** базовых утилит.

### Только токены, никаких сырых цветов в утилитах

Пиши `text-fg`, `bg-surface`, `border-line`, `text-fg-muted`, `bg-accent` — они компилируются в `var(--color-*)` и переключаются вместе с `.theme-light`.

Сырой цвет допустим **только** для брендовых констант чужих сервисов, и через `style`:
```tsx
style={{ background: "#25d366" }}   // WhatsApp — FloatingContact.tsx:50
style={{ background: "#229ed9" }}   // Telegram — FloatingContact.tsx:69
```

### Варианты — таблицей `Record<Variant, string>`

```tsx
// src/components/ui/Button.tsx:14-28
const sizes: Record<ButtonSize, string> = { sm: "…", md: "…", lg: "…" };
const variants: Record<ButtonVariant, string> = { accent: "…", dark: "…", … };
```
И **экспортируй генератор классов** для случаев, когда элемент не может быть `<button>`:
```tsx
export function buttonClass(variant = "accent", size = "md", className?): string   // Button.tsx:31
// применение: <Link className={buttonClass("accent", "sm")}>  — [resource]/page.tsx:41
```

### CSS-модуль — только для сложных keyframes

Всё, что выражается утилитами, пишется утилитами. `*.module.css` заведены лишь у 6 мокапов, где нужна многошаговая анимация.

### Динамическая тема через CSS-переменную

```tsx
// src/app/portfolio/[slug]/page.tsx:49
<div style={{ "--m-accent": project.accent } as React.CSSProperties}>
```
Дальше утилиты `.text-m`, `.bg-m`, `.border-m` (`globals.css:301-307`) читают `var(--m-accent, var(--color-accent))`. Так акцент кейса протекает вглубь дерева без пропсов.

---

## 9. Комментарии и язык

Здесь у проекта сильная и последовательная культура — **соблюдай её**.

### Технические комментарии — по-английски, и объясняют «почему»

Не «что делает код», а какое решение принято и какой ценой:

```ts
// src/server/auth/session.ts:14-18
/**
 * Sessions are opaque random ids stored server-side. Nothing about the user
 * lives in the cookie, so a stolen cookie can be revoked by deleting one row
 * — which a signed/stateless JWT cannot offer.
 */
```

```css
/* src/app/globals.css:93-96 */
/* `clip` (not `hidden`) tames horizontal overflow WITHOUT turning <body>
   into a scroll container — `overflow-x: hidden` forces overflow-y to
   compute to `auto`, which breaks every descendant `position: sticky` */
```

### Зафиксированный баг документируется вместе с симптомом

Это фирменная черта проекта — сохраняй её:

```tsx
// src/components/layout/Header.tsx:73-78
// … the very first sample fell through to <body>, read the dark canvas
// colour and left the white logo on the light island until something forced
// a re-sample. No hit means "don't know": keep the current value.
```
См. также `TextReveal.tsx:41-45` (почему ScrollTrigger привязан к таймлайну), `Header.tsx:147-156` (почему маска, а не кросс-фейд), `FloatingContact.tsx:46-48` (почему `relative`).

### Числа с обоснованием

```css
/* globals.css:17-20 */
/* `muted` at 0.42 measured 3.71:1 and carried most of the selling copy;
   0.52 lands at ~4.9:1. */
```

### Русский — для UI и для доменной документации

Все строки интерфейса на русском, без словаря переводов:
```tsx
{status === "loading" ? "Отправка..." : "Получить бесплатную оценку"}   // ContactForm.tsx:153
return { ok: false, error: "Неверная почта или пароль" };               // auth/index.ts:47
```
Русские комментарии допустимы там, где речь о контенте и продуктовых решениях: `app/page.tsx:27-69`, `.env.example`, `docs/BACKEND.md`.

### i18n отсутствует

Ни `next-intl`, ни словарей, ни локальных сегментов. `lang="ru"` жёстко в `layout.tsx:86`, `locale: "ru_RU"` в OpenGraph (`layout.tsx:53`). Единственная локаль-зависимая функция — `formatDate(dateString, locale = "ru-RU")` (`lib/utils.ts:16`). **Не добавляй i18n-инфраструктуру, не согласовав** — сейчас её отсутствие осознанно.

### Разделители секций в длинных файлах

```ts
/* ─────────────────────────── auth ─────────────────────────── */    // actions.ts:14
/* ── services ── */                                                   // content/index.ts:34
```
Используй в файлах, где больше двух логических групп.

---

## 10. Метадата и SEO — обязательный минимум страницы

Каждая публичная страница экспортирует `metadata` **со своим `canonical`**:
```tsx
// src/app/reviews/page.tsx:10-14
export const metadata: Metadata = {
  alternates: { canonical: "/reviews" },
  title: "Отзывы",
  description: "…",
};
```
Корневой layout **намеренно не задаёт** `alternates.canonical` — метадата наследуется по полям, и корневой canonical сделал бы `/` каноничным для всех страниц (`layout.tsx:29-31`).

Для динамических роутов — `generateMetadata`, и **пустой объект, если сущности нет** (`portfolio/[slug]/page.tsx:22-31`).

Каждая страница админки закрывается от индексации:
```tsx
robots: { index: false, follow: false }    // login/page.tsx:8, leads/page.tsx:9, [resource]/page.tsx:16
```

---

# ⚠ АНТИ-ПАТТЕРНЫ, КОТОРЫЕ УЖЕ ЕСТЬ В КОДЕ

Они присутствуют в репозитории. **Не копируй их в новый код.**

### A1. Два источника контента одновременно

`src/data/*.ts` и `src/server/content/` живут параллельно. `ClientMarquee.tsx:6` берёт `@/data/clients` и **отрендерен на главной**, при этом готовый `getClientBrands()` (`server/content/index.ts:146`) не вызывается нигде.

**Правило:** любой новый компонент витрины берёт данные **только** из `@/server/content`. `src/data/*` — исключительно вход для `scripts/seed.ts`.

### A2. Закомментированная вёрстка вместо веток

`src/app/page.tsx` — 72 строки, из них 12 закомментированных блоков (`:23-25, 28-29, 35-38, 46-48, 50, 53-54, 56-58, 63, 66`). Половина главной страницы — мёртвые варианты. Так же `sections/about/Team.tsx:1,5,9-27,35-37,50-59`, `contact/page.tsx:22`, `lib/site.ts:17`.

**Правило:** удаляй. История в git. Не храни варианты дизайна в комментариях.

### A3. `key` по индексу массива

`TextReveal.tsx:74`, `ProjectGallery.tsx:40`, `reviews/page.tsx:44`, `TechMarquee.tsx:15,28`, `Reviews.tsx:77` и ~12 мокапов.

Для статичных декоративных списков это безвредно, но паттерн растиражирован. **Правило:** `key` — стабильный id из данных. Индекс — только для гарантированно неизменяемого декоративного массива, и лучше с комментарием.

### A4. `key` по значению строки

```tsx
{items.map((item) => (<li key={item}>…))}   // portfolio/[slug]/page.tsx:312
{project.tags.map((tag) => (<span key={tag}>…))}   // :67-68
{project.stack.map((t) => (<span key={t}>…))}      // :149-150
```
Эти массивы редактируются в админке как `stringList` — дубликат строки даст дублирующийся `key` и предупреждение React с некорректным ре-рендером. **Правило:** `key={`${item}-${i}`}` либо гарантируй уникальность на входе.

### A5. Потеря типобезопасности через `as never`

```ts
// src/server/admin/actions.ts:107-108,116-118,143-144
const table = resource.table as never;
const idCol = (resource.table as unknown as { id: never }).id;
await db.update(table).set(data).where(eq(idCol, id as never));
```
Цена генеративной админки. **Правило:** приемлемо ровно в этих двух функциях. В любом новом коде `as never` / `as unknown as X` — красный флаг, ищи другой способ.

### A6. Мёртвый код, оставленный «на будущее»

- `requireAdmin()` — `server/auth/index.ts:27-31`, не вызывается
- `purgeExpiredSessions()` — `server/auth/session.ts:72-74`, не вызывается
- `getClientBrands()` — `server/content/index.ts:146-167`, не вызывается
- `getFaqLd()` — `lib/seo.ts:49-60`, вызов закомментирован (`app/page.tsx:25`)
- таблица `settings` — `schema.ts:249-255`, ни одного запроса
- бессмысленная пара строк:
  ```ts
  // src/app/admin/(panel)/page.tsx:26-27
  const table = r.table as unknown as Parameters<typeof db.select>[0];
  void table;      // ← вычисляется и выбрасывается
  ```
- проп объявлен, но не деструктурирован и не используется:
  ```tsx
  // src/app/portfolio/[slug]/page.tsx:303 — `muted` есть в типе,
  // передаётся на :216-217, но в теле компонента не читается
  muted?: boolean;
  ```
- `RequestOptions.method` включает `PUT`/`DELETE`, которые нигде не вызываются (`lib/api.ts:10`)

**Правило:** удаляй или помечай `TODO` с задачей. Неиспользуемый код читается как поддерживаемый.

### A7. Отключение `exhaustive-deps` вместо решения проблемы

```tsx
// src/app/template.tsx:67-69
// run once per route mount
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```
И `LenisProvider.tsx:54-56` (`react-hooks/set-state-in-effect`). Оба с комментарием — уже лучше среднего. **Правило:** если пишешь `eslint-disable`, комментарий с причиной обязателен. Но сначала попробуй `useRef` / вынести значение из эффекта.

### A8. Дублирование хелпера копипастой

`toSnake()` определён дважды, идентично:
`admin/(panel)/[resource]/page.tsx:116-118` и `admin/(panel)/[resource]/[id]/page.tsx:94-96`.

**Правило:** второе вхождение хелпера → выноси в `@/lib` или в модуль рядом.

### A9. Магические строки вместо общей константы

`"itdos_session"` объявлена в двух местах: `src/proxy.ts:3` и `src/server/auth/session.ts:9`.

Технически оправданно — `proxy.ts` не может импортировать `server-only` модуль. **Но:** переименование сломает вход молча. Правило: если дублируешь константу по техническим причинам, поставь перекрёстные комментарии в обоих файлах.

### A10. Тип `RequestOptions` шире, чем реализация

`lib/api.ts:9-13` описывает `method`/`headers`/`body`, но нет ни таймаута, ни `signal`, ни разбора тела ошибки. Тип выглядит как полноценный HTTP-клиент, а является обёрткой на один эндпоинт.

**Правило:** не проектируй абстракцию шире реального применения. Либо сузь тип, либо доведи реализацию (см. BUG-05, BUG-23).

### A11. Стилевая непоследовательность внутри одного проекта

Часть страниц использует токен-утилиты и порядок из §8 (`portfolio/[slug]`, админка), часть — более старый стиль с иным порядком:
```tsx
// src/app/reviews/page.tsx:22
"text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6"
//  типографика → цвет → типографика → отступ (отступ в конце)
// сравни с portfolio/[slug]/page.tsx:94:
"font-mono text-xs uppercase tracking-widest text-fg-muted"   // цвет в конце
```
Также `pt-32!` (важность в конце — синтаксис Tailwind v4) в `reviews/page.tsx:20`, `contact/page.tsx:28` — единичные вкрапления.

**Правило:** новый код пишется по §8. Старый не трогаем ради переформатирования.
</content>

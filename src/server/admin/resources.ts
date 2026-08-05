import "server-only";

import { z } from "zod";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import {
  faqItems,
  plans,
  posts,
  processPhases,
  projects,
  reviews,
  services,
  teamMembers,
} from "@/server/db/schema";

/**
 * Resource registry.
 *
 * Eight content types with hand-written list and edit screens would be the
 * same ~300 lines copied eight times, and would drift the first time someone
 * added a field. Instead each type is *described* here, and one generic list
 * page plus one generic form render all of them. Adding a content type is a
 * config entry, not a new screen.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "select"
  | "stringList"
  | "objectList";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: readonly string[];
  /** For objectList: the keys each row has. */
  subFields?: { name: string; label: string; type?: "text" | "textarea" }[];
  /** Shown in the list table. */
  inList?: boolean;
  required?: boolean;
};

export type ResourceDef = {
  key: string;
  label: string;
  labelSingular: string;
  table: SQLiteTable;
  /** Column used in the URL and for human identification. */
  titleField: string;
  /** Routes to regenerate after a write. `:slug` is replaced per row. */
  revalidate: string[];
  orderBy: "position" | "sortOrder" | "publishedAt";
  fields: FieldDef[];
};

const publishField: FieldDef = {
  name: "published",
  label: "Опубликовано",
  type: "boolean",
  inList: true,
};

const positionField: FieldDef = {
  name: "position",
  label: "Порядок",
  type: "number",
  help: "Меньше — выше в списке",
};

export const resources: ResourceDef[] = [
  {
    key: "services",
    label: "Услуги",
    labelSingular: "Услугу",
    table: services,
    titleField: "title",
    revalidate: ["/", "/services", "/services/:slug"],
    orderBy: "position",
    fields: [
      { name: "title", label: "Название", type: "text", inList: true, required: true },
      { name: "slug", label: "URL (slug)", type: "text", inList: true, required: true },
      { name: "shortTitle", label: "Короткое название", type: "text" },
      { name: "description", label: "Краткое описание", type: "textarea" },
      { name: "longDescription", label: "Полное описание", type: "textarea" },
      {
        name: "category",
        label: "Категория",
        type: "select",
        inList: true,
        options: ["development", "ai", "automation", "integration", "support"],
      },
      { name: "icon", label: "Иконка (lucide)", type: "text", help: "Monitor, Bot, Database…" },
      { name: "timeframe", label: "Сроки", type: "text" },
      { name: "features", label: "Что входит", type: "stringList" },
      { name: "technologies", label: "Технологии", type: "stringList" },
      { name: "deliverables", label: "Что получите", type: "stringList" },
      positionField,
      publishField,
    ],
  },
  {
    key: "projects",
    label: "Портфолио",
    labelSingular: "Проект",
    table: projects,
    titleField: "title",
    revalidate: ["/", "/portfolio", "/portfolio/:slug"],
    orderBy: "position",
    fields: [
      { name: "title", label: "Название", type: "text", inList: true, required: true },
      { name: "slug", label: "URL (slug)", type: "text", inList: true, required: true },
      { name: "tagline", label: "Подзаголовок", type: "textarea" },
      {
        name: "category",
        label: "Категория",
        type: "select",
        inList: true,
        options: ["website", "webapp", "crm", "ai", "bot", "marketplace"],
      },
      { name: "year", label: "Год", type: "text", inList: true },
      { name: "client", label: "Клиент", type: "text" },
      { name: "liveUrl", label: "Ссылка на сайт", type: "text" },
      { name: "highlight", label: "Главный результат", type: "text", help: "Например: +280% органики" },
      { name: "featured", label: "В избранном", type: "boolean" },
      {
        name: "coverImage",
        label: "Обложка (путь к файлу)",
        type: "text",
        help: "Например /cases/avangard.jpg — как только заполнено, вместо мокапа показывается реальный скриншот",
      },
      { name: "coverVideo", label: "Видео обложки", type: "text" },
      {
        name: "mockup",
        label: "Мокап (если нет обложки)",
        type: "select",
        options: [
          "browser", "dashboard", "marketplace", "portal", "chat", "iframe",
          "phone", "laptop", "laptop-video", "showcase", "flow", "agent", "neural",
          "command", "unified", "assistant",
        ],
      },
      { name: "accent", label: "Акцентный цвет", type: "text", help: "HEX, например #6e56ff" },
      { name: "tags", label: "Теги", type: "stringList" },
      { name: "overview", label: "О проекте", type: "textarea" },
      { name: "goals", label: "Цели", type: "stringList" },
      { name: "challenges", label: "Сложности", type: "stringList" },
      { name: "solutions", label: "Решения", type: "stringList" },
      { name: "stack", label: "Стек", type: "stringList" },
      { name: "services", label: "Услуги в проекте", type: "stringList" },
      { name: "role", label: "Наша роль", type: "text" },
      {
        name: "results",
        label: "Результаты",
        type: "objectList",
        subFields: [
          { name: "label", label: "Метрика" },
          { name: "value", label: "Значение" },
          { name: "description", label: "Пояснение", type: "textarea" },
        ],
      },
      {
        name: "process",
        label: "Этапы работы",
        type: "objectList",
        subFields: [
          { name: "phase", label: "№" },
          { name: "title", label: "Этап" },
          { name: "description", label: "Описание", type: "textarea" },
          { name: "duration", label: "Длительность" },
        ],
      },
      { name: "gallery", label: "Галерея", type: "stringList" },
      { name: "nextProject", label: "Следующий проект (slug)", type: "text" },
      positionField,
      publishField,
    ],
  },
  {
    key: "posts",
    label: "Блог",
    labelSingular: "Статью",
    table: posts,
    titleField: "title",
    revalidate: ["/blog", "/blog/:slug"],
    orderBy: "publishedAt",
    fields: [
      { name: "title", label: "Заголовок", type: "text", inList: true, required: true },
      { name: "slug", label: "URL (slug)", type: "text", inList: true, required: true },
      { name: "excerpt", label: "Анонс", type: "textarea" },
      { name: "content", label: "Текст статьи", type: "richtext" },
      { name: "coverImage", label: "Обложка", type: "text" },
      {
        name: "category",
        label: "Категория",
        type: "select",
        inList: true,
        options: ["development", "ai", "automation", "crm", "business", "bots"],
      },
      { name: "tags", label: "Теги", type: "stringList" },
      { name: "author", label: "Автор", type: "text" },
      { name: "publishedAt", label: "Дата публикации", type: "text", inList: true, help: "ГГГГ-ММ-ДД" },
      { name: "readTime", label: "Время чтения (мин)", type: "number" },
      publishField,
    ],
  },
  {
    key: "reviews",
    label: "Отзывы",
    labelSingular: "Отзыв",
    table: reviews,
    titleField: "author",
    revalidate: ["/", "/reviews"],
    orderBy: "sortOrder",
    fields: [
      { name: "author", label: "Имя", type: "text", inList: true, required: true },
      { name: "position", label: "Должность", type: "text", inList: true },
      { name: "company", label: "Компания", type: "text", inList: true },
      { name: "text", label: "Текст отзыва", type: "textarea" },
      { name: "rating", label: "Оценка (1–5)", type: "number" },
      { name: "projectSlug", label: "Проект (slug)", type: "text" },
      { name: "date", label: "Дата", type: "text", help: "ГГГГ-ММ-ДД" },
      { name: "sortOrder", label: "Порядок", type: "number" },
      publishField,
    ],
  },
  {
    key: "team",
    label: "Команда",
    labelSingular: "Сотрудника",
    table: teamMembers,
    titleField: "name",
    revalidate: ["/", "/about"],
    orderBy: "position",
    fields: [
      { name: "name", label: "Имя", type: "text", inList: true, required: true },
      { name: "role", label: "Роль", type: "text", inList: true },
      { name: "initials", label: "Инициалы", type: "text", help: "Показываются, если нет фото" },
      { name: "photo", label: "Фото (путь)", type: "text", help: "Например /prof/buran.png" },
      { name: "tag", label: "Отдел", type: "text" },
      { name: "tagColor", label: "Цвет отдела", type: "text", help: "HEX" },
      { name: "bio", label: "О сотруднике", type: "textarea" },
      { name: "skills", label: "Навыки", type: "stringList" },
      { name: "experience", label: "Опыт", type: "text" },
      positionField,
      publishField,
    ],
  },
  {
    key: "plans",
    label: "Тарифы",
    labelSingular: "Тариф",
    table: plans,
    titleField: "name",
    revalidate: ["/"],
    orderBy: "position",
    fields: [
      { name: "name", label: "Название", type: "text", inList: true, required: true },
      { name: "tagline", label: "Подзаголовок", type: "text" },
      { name: "price", label: "Цена", type: "text", inList: true },
      { name: "period", label: "Срок", type: "text", inList: true },
      { name: "features", label: "Что входит", type: "stringList" },
      { name: "popular", label: "Отметка «ТОП»", type: "boolean", inList: true },
      positionField,
      publishField,
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    labelSingular: "Вопрос",
    table: faqItems,
    titleField: "question",
    revalidate: ["/"],
    orderBy: "position",
    fields: [
      { name: "question", label: "Вопрос", type: "text", inList: true, required: true },
      { name: "answer", label: "Ответ", type: "textarea" },
      positionField,
      publishField,
    ],
  },
  {
    key: "process",
    label: "Процесс",
    labelSingular: "Этап",
    table: processPhases,
    titleField: "title",
    revalidate: ["/", "/process"],
    orderBy: "position",
    fields: [
      { name: "number", label: "Номер", type: "text", inList: true },
      { name: "title", label: "Название этапа", type: "text", inList: true, required: true },
      { name: "description", label: "Описание", type: "textarea" },
      { name: "duration", label: "Длительность", type: "text", inList: true },
      { name: "deliverables", label: "Что делаем", type: "stringList" },
      positionField,
      publishField,
    ],
  },
];

export function getResource(key: string): ResourceDef | undefined {
  return resources.find((r) => r.key === key);
}

/** Builds a Zod schema from the field definitions — one source of truth. */
export function schemaFor(resource: ResourceDef) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const f of resource.fields) {
    switch (f.type) {
      case "number":
        shape[f.name] = z.coerce.number().int().catch(0);
        break;
      case "boolean":
        shape[f.name] = z.coerce.boolean().catch(false);
        break;
      case "stringList":
        shape[f.name] = z.array(z.string()).catch([]);
        break;
      case "objectList":
        shape[f.name] = z.array(z.record(z.string(), z.string())).catch([]);
        break;
      case "select":
        shape[f.name] = f.required
          ? z.string().min(1, `${f.label}: обязательное поле`)
          : z.string().catch("");
        break;
      default:
        shape[f.name] = f.required
          ? z.string().trim().min(1, `${f.label}: обязательное поле`)
          : z.string().catch("");
    }
  }

  return z.object(shape);
}

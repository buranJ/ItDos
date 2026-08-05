import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";
import { getResource } from "@/server/admin/resources";
import { ResourceForm } from "./ResourceForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ resource: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource, id } = await params;
  const def = getResource(resource);
  return {
    title: `${id === "new" ? "Новая запись" : "Редактирование"} · ${def?.label ?? ""}`,
    robots: { index: false, follow: false },
  };
}

export default async function ResourceEditPage({ params }: Props) {
  const { resource, id } = await params;
  const def = getResource(resource);
  if (!def) notFound();

  let values: Record<string, unknown> = {};

  if (id !== "new") {
    const rows = await db.all<Record<string, unknown>>(
      sql`select * from ${def.table} where id = ${id} limit 1`,
    );
    if (!rows[0]) notFound();

    // SQLite gives back snake_case keys and JSON columns as strings; the form
    // wants camelCase keys and real arrays.
    const row = rows[0];
    for (const f of def.fields) {
      const raw = row[toSnake(f.name)] ?? row[f.name];
      if (f.type === "stringList" || f.type === "objectList") {
        values[f.name] = typeof raw === "string" ? safeJson(raw) : (raw ?? []);
      } else if (f.type === "boolean") {
        values[f.name] = raw === 1 || raw === true;
      } else {
        values[f.name] = raw ?? "";
      }
    }
  } else {
    values = Object.fromEntries(
      def.fields.map((f) => [
        f.name,
        f.type === "stringList" || f.type === "objectList"
          ? []
          : f.type === "boolean"
            ? f.name === "published"
            : f.type === "number"
              ? 0
              : "",
      ]),
    );
  }

  const title =
    id === "new"
      ? `Добавить: ${def.labelSingular.toLowerCase()}`
      : String(values[def.titleField] || "Без названия");

  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${def.key}`} className="text-sm text-fg-muted hover:text-fg">
        ← {def.label}
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg">{title}</h1>

      <ResourceForm
        resourceKey={def.key}
        id={id}
        fields={def.fields}
        values={values}
        canDelete={id !== "new"}
      />
    </div>
  );
}

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

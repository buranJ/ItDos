import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";
import { getResource } from "@/server/admin/resources";
import { buttonClass } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ resource: string }>; searchParams: Promise<Record<string, string>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource } = await params;
  const def = getResource(resource);
  return { title: def?.label ?? "Раздел", robots: { index: false, follow: false } };
}

export default async function ResourceListPage({ params, searchParams }: Props) {
  const { resource } = await params;
  const flags = await searchParams;
  const def = getResource(resource);
  if (!def) notFound();

  const orderColumn =
    def.orderBy === "publishedAt" ? sql`published_at desc` : sql.raw(`${toSnake(def.orderBy)} asc`);

  const rows = await db.all<Record<string, unknown>>(
    sql`select * from ${def.table} order by ${orderColumn}`,
  );

  const listFields = def.fields.filter((f) => f.inList);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">{def.label}</h1>
          <p className="mt-1 text-sm text-fg-muted">{rows.length} записей</p>
        </div>
        <Link href={`/admin/${def.key}/new`} className={buttonClass("accent", "sm")}>
          Добавить
        </Link>
      </div>

      {(flags.saved || flags.deleted) && (
        <p role="status" className="mt-5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-fg">
          {flags.saved ? "Сохранено. Страницы сайта обновлены." : "Запись удалена."}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-line bg-surface/50">
            <tr>
              {listFields.map((f) => (
                <th key={f.name} className="px-4 py-3 font-medium text-fg-secondary">
                  {f.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)} className="border-b border-line last:border-0">
                {listFields.map((f) => (
                  <td key={f.name} className="px-4 py-3 text-fg">
                    <Cell value={row[toSnake(f.name)] ?? row[f.name]} type={f.type} />
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/${def.key}/${String(row.id)}`}
                    className="text-sm text-accent-text hover:underline"
                  >
                    Изменить
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={listFields.length + 1} className="px-4 py-10 text-center text-fg-muted">
                  Пока пусто
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ value, type }: { value: unknown; type: string }) {
  if (type === "boolean") {
    const on = value === true || value === 1;
    return (
      <span
        className={
          on
            ? "rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent-text"
            : "rounded-full bg-panel px-2 py-0.5 text-xs text-fg-muted"
        }
      >
        {on ? "да" : "нет"}
      </span>
    );
  }
  const text = value == null ? "—" : String(value);
  return <span className="line-clamp-1">{text.length > 60 ? `${text.slice(0, 60)}…` : text}</span>;
}

/** Drizzle columns are camelCase in TS but snake_case in SQLite. */
function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

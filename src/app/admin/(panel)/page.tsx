import type { Metadata } from "next";
import Link from "next/link";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { leads } from "@/server/db/schema";
import { resources } from "@/server/admin/resources";

export const metadata: Metadata = {
  title: "Обзор",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [newLeads] = await db
    .select({ n: count() })
    .from(leads)
    .where(eq(leads.status, "new"));
  const [totalLeads] = await db.select({ n: count() }).from(leads);

  // One round trip per resource is fine here — eight cheap COUNT(*) queries
  // against a local file, on a page only staff ever open.
  const counts = await Promise.all(
    resources.map(async (r) => {
      const table = r.table as unknown as Parameters<typeof db.select>[0];
      void table;
      const rows = await db.all<{ n: number }>(
        sql`select count(*) as n from ${r.table}`,
      );
      return { key: r.key, label: r.label, n: Number(rows[0]?.n ?? 0) };
    }),
  );

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">Обзор</h1>
      <p className="mt-2 text-sm text-fg-secondary">
        Всё, что видно на сайте, редактируется здесь. После сохранения страница
        пересобирается автоматически.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/leads"
          className="rounded-xl border border-line bg-surface/40 p-6 transition-colors hover:border-fg/30"
        >
          <p className="text-sm text-fg-secondary">Новые заявки</p>
          <p className="mt-2 font-display text-4xl font-semibold text-fg">{newLeads?.n ?? 0}</p>
          <p className="mt-1 text-xs text-fg-muted">всего {totalLeads?.n ?? 0}</p>
        </Link>
      </div>

      <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted">
        Разделы контента
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((c) => (
          <Link
            key={c.key}
            href={`/admin/${c.key}`}
            className="flex items-baseline justify-between rounded-xl border border-line bg-surface/40 px-5 py-4 transition-colors hover:border-fg/30"
          >
            <span className="text-sm font-medium text-fg">{c.label}</span>
            <span className="font-mono text-sm text-fg-muted">{c.n}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

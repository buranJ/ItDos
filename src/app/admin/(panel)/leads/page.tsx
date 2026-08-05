import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/server/db";
import { leads } from "@/server/db/schema";
import { setLeadStatusAction } from "@/server/admin/actions";

export const metadata: Metadata = {
  title: "Заявки",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUSES = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "won", label: "Успех" },
  { value: "lost", label: "Отказ" },
] as const;

export default async function LeadsPage() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(200);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">Заявки</h1>
      <p className="mt-1 text-sm text-fg-muted">
        {rows.length} последних. Заявки сохраняются в базе — даже если отправка в
        Telegram не прошла.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {rows.map((l) => (
          <article key={l.id} className="rounded-xl border border-line bg-surface/40 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-fg">{l.name}</p>
                <p className="mt-0.5 text-sm text-fg-secondary">
                  <a href={`tel:${l.phone}`} className="hover:text-fg">
                    {l.phone}
                  </a>
                  {l.email && (
                    <>
                      {" · "}
                      <a href={`mailto:${l.email}`} className="hover:text-fg">
                        {l.email}
                      </a>
                    </>
                  )}
                </p>
              </div>

              <form action={setLeadStatusAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={l.id} />
                <select
                  name="status"
                  defaultValue={l.status}
                  aria-label={`Статус заявки от ${l.name}`}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-fg focus:border-accent focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-fg-secondary transition-colors hover:border-fg/40 hover:text-fg"
                >
                  Сохранить
                </button>
              </form>
            </div>

            {l.service && <p className="mt-3 text-sm text-fg-secondary">Услуга: {l.service}</p>}
            {l.message && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-fg-secondary">{l.message}</p>
            )}

            <p className="mt-3 font-mono text-[11px] text-fg-muted">
              {l.createdAt}
              {!l.notified && " · не отправлено в Telegram"}
              {l.notifyError && ` (${l.notifyError.slice(0, 80)})`}
            </p>
          </article>
        ))}

        {rows.length === 0 && (
          <p className="rounded-xl border border-line px-5 py-10 text-center text-fg-muted">
            Заявок пока нет
          </p>
        )}
      </div>
    </div>
  );
}

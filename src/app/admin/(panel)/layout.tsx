import Link from "next/link";
import { requireUser } from "@/server/auth";
import { logoutAction } from "@/server/admin/actions";
import { resources } from "@/server/admin/resources";
import { AdminNavLink } from "./AdminNavLink";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // The real gate. Proxy/middleware can only see that a cookie exists; this
  // resolves it against the sessions table on every protected render.
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface/40 lg:flex">
        <div className="border-b border-line px-6 py-5">
          <Link href="/admin" className="font-display text-lg font-semibold tracking-tight text-fg">
            ITDOS
          </Link>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-fg-muted">
            Панель
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          <AdminNavLink href="/admin">Обзор</AdminNavLink>
          <AdminNavLink href="/admin/leads">Заявки</AdminNavLink>

          <p className="mt-4 px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
            Контент
          </p>
          {resources.map((r) => (
            <AdminNavLink key={r.key} href={`/admin/${r.key}`}>
              {r.label}
            </AdminNavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <p className="truncate px-3 text-xs text-fg-muted">{user.email}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-fg-secondary transition-colors hover:bg-panel hover:text-fg"
            >
              Выйти
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar — the sidebar is desktop-only */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 overflow-x-auto border-b border-line px-4 py-3 lg:hidden">
          <Link href="/admin" className="shrink-0 font-display font-semibold text-fg">
            ITDOS
          </Link>
          <Link href="/admin/leads" className="shrink-0 text-sm text-fg-secondary">
            Заявки
          </Link>
          {resources.map((r) => (
            <Link
              key={r.key}
              href={`/admin/${r.key}`}
              className="shrink-0 text-sm text-fg-secondary"
            >
              {r.label}
            </Link>
          ))}
        </div>

        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

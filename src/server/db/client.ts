import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Raw connection, deliberately free of `server-only` so that CLI scripts
 * (seed, migrations, backups) can use the exact same schema and helpers the
 * app uses. Application code should import `@/server/db` instead.
 *
 * One `DATABASE_URL` switches between:
 *   file:./data/itdos.db     — local dev, no service to run
 *   libsql://…turso.io       — managed hosting (+ DATABASE_AUTH_TOKEN)
 */
const url = process.env.DATABASE_URL ?? "file:./data/itdos.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const globalForDb = globalThis as unknown as {
  __itdosDb?: ReturnType<typeof drizzle<typeof schema>>;
};

export const db =
  globalForDb.__itdosDb ?? drizzle(createClient({ url, authToken }), { schema });

// Next re-evaluates modules on every hot reload; without this cache each
// edit would leak another connection.
if (process.env.NODE_ENV !== "production") globalForDb.__itdosDb = db;

export { schema };

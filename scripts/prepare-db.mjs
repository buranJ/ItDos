/**
 * Runs before `next build` (npm `prebuild` hook).
 *
 * The build reads content out of the database to render the static pages, so
 * CI needs a database to exist before Next starts. The local file is
 * gitignored, which is why the Netlify build died with
 * `Unable to open connection to local database ./data/itdos.db`.
 *
 * Two paths:
 *
 *  · No DATABASE_URL, or a `file:` one — a throwaway CI database. Create the
 *    directory, apply migrations, seed it from `src/data/*.ts`.
 *  · A remote URL (Turso) — apply migrations only. Seeding there would
 *    overwrite whatever was edited in the admin panel with the checked-in
 *    starter content, on every single deploy.
 */
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const url = process.env.DATABASE_URL ?? "file:./data/itdos.db";
const isFile = url.startsWith("file:");

const run = (cmd) => {
  console.log(`→ ${cmd}`);
  execSync(cmd, { stdio: "inherit", env: process.env });
};

if (isFile) {
  const path = url.replace(/^file:/, "");
  mkdirSync(dirname(path), { recursive: true });
  console.log(`prepare-db: local database at ${path}`);
}

run("npx drizzle-kit migrate");

if (isFile) {
  run("npx tsx scripts/seed.ts");
} else {
  console.log("prepare-db: remote database — migrations only, seed skipped");
}

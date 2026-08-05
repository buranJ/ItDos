"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { requireUser, login as doLogin, destroySession } from "@/server/auth";
import { leads } from "@/server/db/schema";
import { getResource, schemaFor, type FieldDef, type ResourceDef } from "./resources";

export type ActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

/* ─────────────────────────── auth ─────────────────────────── */

export async function loginAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Введите почту и пароль" };

  const result = await doLogin(email, password);
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* ─────────────────────────── content ─────────────────────────── */

/** FormData is all strings; rebuild the typed value each field expects. */
function readField(form: FormData, f: FieldDef): unknown {
  switch (f.type) {
    case "boolean":
      return form.get(f.name) === "on" || form.get(f.name) === "true";
    case "number": {
      const raw = String(form.get(f.name) ?? "").trim();
      return raw === "" ? 0 : Number(raw);
    }
    case "stringList":
      // One item per line — the least fiddly editor for a short list.
      return String(form.get(f.name) ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    case "objectList": {
      const raw = String(form.get(f.name) ?? "").trim();
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Surfaced as a field error by the caller.
        return null;
      }
    }
    default:
      return String(form.get(f.name) ?? "");
  }
}

function revalidateFor(resource: ResourceDef, slug?: string): void {
  for (const path of resource.revalidate) {
    if (path.includes(":slug")) {
      if (slug) revalidatePath(path.replace(":slug", slug));
    } else {
      revalidatePath(path);
    }
  }
}

export async function saveResourceAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireUser();

  const key = String(form.get("__resource") ?? "");
  const id = String(form.get("__id") ?? "");
  const resource = getResource(key);
  if (!resource) return { error: "Неизвестный раздел" };

  const values: Record<string, unknown> = {};
  const fieldErrors: Record<string, string> = {};

  for (const f of resource.fields) {
    const v = readField(form, f);
    if (v === null) {
      fieldErrors[f.name] = "Некорректный JSON";
      continue;
    }
    values[f.name] = v;
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors, error: "Проверьте поля" };

  const parsed = schemaFor(resource).safeParse(values);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors, error: "Проверьте поля" };
  }

  const data = { ...parsed.data, updatedAt: sql`(current_timestamp)` } as Record<string, unknown>;
  const table = resource.table as never;
  const idCol = (resource.table as unknown as { id: never }).id;

  let slug: string | undefined;
  const slugValue = parsed.data["slug"];
  if (typeof slugValue === "string" && slugValue) slug = slugValue;

  try {
    if (id && id !== "new") {
      await db.update(table).set(data).where(eq(idCol, id as never));
    } else {
      await db.insert(table).values({ id: randomUUID(), ...data } as never);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // The only realistic constraint here is the unique slug index.
    if (/UNIQUE/i.test(message)) {
      return { fieldErrors: { slug: "Такой slug уже занят" }, error: "Проверьте поля" };
    }
    console.error("[admin] save failed:", err);
    return { error: "Не удалось сохранить" };
  }

  revalidateFor(resource, slug);
  revalidatePath(`/admin/${resource.key}`);
  redirect(`/admin/${resource.key}?saved=1`);
}

export async function deleteResourceAction(form: FormData): Promise<void> {
  await requireUser();

  const key = String(form.get("__resource") ?? "");
  const id = String(form.get("__id") ?? "");
  const resource = getResource(key);
  if (!resource || !id) return;

  const idCol = (resource.table as unknown as { id: never }).id;
  await db.delete(resource.table as never).where(eq(idCol, id as never));

  revalidateFor(resource);
  revalidatePath(`/admin/${resource.key}`);
  redirect(`/admin/${resource.key}?deleted=1`);
}

/* ─────────────────────────── leads ─────────────────────────── */

export async function setLeadStatusAction(form: FormData): Promise<void> {
  await requireUser();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "new") as "new" | "in_progress" | "won" | "lost";
  if (!id) return;
  await db.update(leads).set({ status }).where(eq(leads.id, id));
  revalidatePath("/admin/leads");
}

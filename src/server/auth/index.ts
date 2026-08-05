import "server-only";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { verifyPassword } from "./password";
import { createSession, getSessionUser, type SessionUser } from "./session";

export { hashPassword, verifyPassword } from "./password";
export { createSession, destroySession, getSessionUser, SESSION_COOKIE } from "./session";
export type { SessionUser } from "./session";

/**
 * Gate for every admin server component and action.
 *
 * The middleware also checks the cookie, but middleware only sees that a
 * cookie exists — it cannot hit the database. This is the real check, and
 * every protected surface must call it rather than trusting the redirect.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  // Same message and roughly the same work either way: a "no such user"
  // response that returns faster than a "wrong password" one is an account
  // enumeration oracle.
  if (!user) {
    await verifyPassword(password, `${"0".repeat(32)}:${"0".repeat(128)}`);
    return { ok: false, error: "Неверная почта или пароль" };
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, error: "Неверная почта или пароль" };
  }

  await createSession(user.id);
  return { ok: true };
}

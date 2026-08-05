"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/server/admin/actions";
import { Button } from "@/components/ui/Button";

const input =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-fg placeholder-fg-muted transition-colors focus:border-accent focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-fg">
          Почта
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={input}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-fg">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
        />
      </div>

      <p role="status" aria-live="polite" className="min-h-5 text-sm text-red-400">
        {state.error ?? ""}
      </p>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Проверяем…" : "Войти"}
      </Button>
    </form>
  );
}

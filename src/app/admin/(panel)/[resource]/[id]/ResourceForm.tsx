"use client";

import { useActionState } from "react";
import {
  saveResourceAction,
  deleteResourceAction,
  type ActionState,
} from "@/server/admin/actions";
import type { FieldDef } from "@/server/admin/resources";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-lg border border-line bg-surface/60 px-4 py-2.5 text-sm text-fg placeholder-fg-muted transition-colors focus:border-accent focus:outline-none";
const invalid = "border-red-500/70 focus:border-red-500";

type Props = {
  resourceKey: string;
  id: string;
  fields: FieldDef[];
  values: Record<string, unknown>;
  canDelete: boolean;
};

export function ResourceForm({ resourceKey, id, fields, values, canDelete }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveResourceAction, {});

  return (
    <>
      <form action={action} className="mt-8 flex flex-col gap-6">
        <input type="hidden" name="__resource" value={resourceKey} />
        <input type="hidden" name="__id" value={id} />

        {fields.map((f) => (
          <Field key={f.name} field={f} value={values[f.name]} error={state.fieldErrors?.[f.name]} />
        ))}

        <p role="status" aria-live="polite" className="min-h-5 text-sm text-red-400">
          {state.error ?? ""}
        </p>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Сохраняем…" : "Сохранить"}
          </Button>
        </div>
      </form>

      {canDelete && (
        <form action={deleteResourceAction} className="mt-10 border-t border-line pt-6">
          <input type="hidden" name="__resource" value={resourceKey} />
          <input type="hidden" name="__id" value={id} />
          <button
            type="submit"
            className="text-sm text-red-400 transition-colors hover:text-red-300"
          >
            Удалить запись
          </button>
          <p className="mt-1 text-xs text-fg-muted">Действие необратимо.</p>
        </form>
      )}
    </>
  );
}

function Field({
  field: f,
  value,
  error,
}: {
  field: FieldDef;
  value: unknown;
  error?: string;
}) {
  const id = `f-${f.name}`;
  const described = error ? `${id}-error` : f.help ? `${id}-help` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {f.label}
        {f.required && <span className="ml-0.5 text-fg-muted">*</span>}
      </label>

      {f.type === "textarea" || f.type === "richtext" ? (
        <textarea
          id={id}
          name={f.name}
          defaultValue={String(value ?? "")}
          rows={f.type === "richtext" ? 16 : 4}
          aria-invalid={!!error}
          aria-describedby={described}
          className={cn(base, "resize-y", error && invalid)}
        />
      ) : f.type === "boolean" ? (
        <label className="inline-flex w-fit cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-surface/60 px-4 py-2.5">
          <input
            id={id}
            type="checkbox"
            name={f.name}
            defaultChecked={value === true}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm text-fg-secondary">Да</span>
        </label>
      ) : f.type === "select" ? (
        <select
          id={id}
          name={f.name}
          defaultValue={String(value ?? "")}
          aria-invalid={!!error}
          aria-describedby={described}
          className={cn(base, error && invalid)}
        >
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : f.type === "stringList" ? (
        <textarea
          id={id}
          name={f.name}
          defaultValue={Array.isArray(value) ? value.join("\n") : ""}
          rows={Math.min(10, Math.max(3, (Array.isArray(value) ? value.length : 0) + 1))}
          aria-describedby={described}
          className={cn(base, "resize-y font-mono text-xs", error && invalid)}
        />
      ) : f.type === "objectList" ? (
        <textarea
          id={id}
          name={f.name}
          defaultValue={JSON.stringify(Array.isArray(value) ? value : [], null, 2)}
          rows={10}
          aria-invalid={!!error}
          aria-describedby={described}
          className={cn(base, "resize-y font-mono text-xs", error && invalid)}
        />
      ) : (
        <input
          id={id}
          name={f.name}
          type={f.type === "number" ? "number" : "text"}
          defaultValue={String(value ?? "")}
          aria-invalid={!!error}
          aria-describedby={described}
          className={cn(base, error && invalid)}
        />
      )}

      {f.type === "stringList" && (
        <p className="text-xs text-fg-muted">Каждый пункт — с новой строки</p>
      )}
      {f.type === "objectList" && f.subFields && (
        <p className="text-xs text-fg-muted">
          JSON-массив. Поля: {f.subFields.map((s) => s.name).join(", ")}
        </p>
      )}
      {f.help && !error && (
        <p id={`${id}-help`} className="text-xs text-fg-muted">
          {f.help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

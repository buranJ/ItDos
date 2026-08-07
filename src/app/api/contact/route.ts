import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { leads } from "@/server/db/schema";
import { validateLead } from "@/lib/validation";

/**
 * Contact form intake.
 *
 * The lead is persisted FIRST, then a Telegram notification is attempted.
 * That ordering is the whole point: notification is a convenience, the
 * database is the system of record. Previously a failed/unconfigured
 * Telegram call meant the enquiry vanished entirely.
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return Response.json({ success: false, message: "Некорректный запрос" }, { status: 400 });
    }

    const { name, contact, company } = data as Record<string, string>;

    // Honeypot: real users never fill `company`. Silently accept & drop bots.
    if (company?.trim()) {
      return Response.json({ success: true, message: "Заявка принята" });
    }

    // Same rules the browser applies — a client-side check alone is not a
    // check at all, and "абвгд" used to sail straight through as a phone.
    const errors = validateLead({ name, contact });
    if (Object.keys(errors).length) {
      return Response.json(
        {
          success: false,
          message: Object.values(errors)[0] ?? "Проверьте данные формы",
          errors,
        },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const normalizedContact = contact.trim();
    const contactIsEmail = normalizedContact.includes("@");

    // Storing the lead must never be able to lose it. On a host with an
    // ephemeral filesystem the local database is simply not reachable from a
    // serverless function, so a throw here would 500 the form and the enquiry
    // would be gone. Persist if we can, and fall through to Telegram either
    // way — see docs/BACKEND.md for the Turso setup that makes this durable.
    let stored = false;
    try {
      await db.insert(leads).values({
        id,
        name: name.trim(),
        phone: contactIsEmail ? "" : normalizedContact,
        email: contactIsEmail ? normalizedContact : null,
        service: null,
        message: null,
      });
      stored = true;
    } catch (err) {
      console.error("[contact] could not persist lead:", err);
    }

    /** Bookkeeping updates are best-effort — never worth failing a lead over. */
    const note = async (patch: Record<string, unknown>) => {
      if (!stored) return;
      try {
        await db.update(leads).set(patch).where(eq(leads.id, id));
      } catch (err) {
        console.error("[contact] could not update lead:", err);
      }
    };

    const text = [
      "🟣 Новая заявка с сайта ITDOS",
      "",
      `👤 Имя: ${name}`,
      `${contactIsEmail ? "✉️ Email" : "📞 Телефон"}: ${normalizedContact}`,
    ]
      .filter(Boolean)
      .join("\n");

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      try {
        const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        });
        if (tg.ok) {
          await note({ notified: true });
        } else {
          const detail = await tg.text();
          console.error("[contact] Telegram delivery failed:", detail);
          await note({ notifyError: detail.slice(0, 500) });
        }
      } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        console.error("[contact] Telegram error:", detail);
        await note({ notifyError: detail.slice(0, 500) });
      }
    } else {
      await note({
        notifyError: "Telegram не настроен (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)",
      });
      console.log("[contact] lead received (Telegram not configured):\n" + text);
    }

    // Success as long as the enquiry reached us by at least one route.
    return Response.json({ success: true, message: "Заявка принята" });
  } catch (err) {
    console.error("[contact] error:", err);
    return Response.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}

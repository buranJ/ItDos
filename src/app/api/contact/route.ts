import type { NextRequest } from "next/server";

/**
 * Contact form delivery. Sends the lead to Telegram if configured
 * (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID), otherwise logs it so leads are
 * never silently lost in development. Swap/extend with email/CRM as needed.
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return Response.json({ success: false, message: "Некорректный запрос" }, { status: 400 });
    }

    const { name, phone, email, service, message, company } = data as Record<string, string>;

    // Honeypot: real users never fill `company`. Silently accept & drop bots.
    if (company?.trim()) {
      return Response.json({ success: true, message: "Заявка принята" });
    }

    if (!name?.trim() || !phone?.trim()) {
      return Response.json(
        { success: false, message: "Имя и телефон обязательны" },
        { status: 400 }
      );
    }

    const text = [
      "🟣 Новая заявка с сайта ITDOS",
      "",
      `👤 Имя: ${name}`,
      `📞 Телефон: ${phone}`,
      email ? `✉️ Email: ${email}` : null,
      service ? `🧩 Услуга: ${service}` : null,
      message ? `📝 Задача: ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      });
      if (!tg.ok) {
        console.error("[contact] Telegram delivery failed:", await tg.text());
        return Response.json(
          { success: false, message: "Не удалось отправить. Напишите нам напрямую." },
          { status: 502 }
        );
      }
    } else {
      // Not configured yet — log so the lead is visible during development.
      console.log("[contact] lead received (Telegram not configured):\n" + text);
    }

    return Response.json({ success: true, message: "Заявка принята" });
  } catch (err) {
    console.error("[contact] error:", err);
    return Response.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}

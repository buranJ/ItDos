import { ImageResponse } from "next/og";

export const alt = "ITDOS — строим цифровые продукты мирового уровня";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded share preview — shows up when the link is sent in WhatsApp/Telegram/social.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          color: "#f4f2ed",
          padding: "76px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* accent glow */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 640,
            height: 640,
            borderRadius: 999,
            background:
              "radial-gradient(closest-side, rgba(110,86,255,0.45), rgba(110,86,255,0))",
          }}
        />

        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, background: "#6e56ff" }} />
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>ITDOS</div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -2.5,
              maxWidth: 940,
              display: "flex",
            }}
          >
            Строим цифровые продукты мирового уровня
          </div>
          <div style={{ fontSize: 30, color: "rgba(244,242,237,0.6)", display: "flex" }}>
            Сайты · Веб-приложения · CRM/ERP · AI-агенты
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(244,242,237,0.5)",
          }}
        >
          <div style={{ display: "flex" }}>itdos.ru</div>
          <div style={{ display: "flex" }}>Бишкек · Кыргызстан</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

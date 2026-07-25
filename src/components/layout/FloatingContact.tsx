import { whatsappLink, telegramLink, defaultInquiry } from "@/lib/site";

/** Always-available messenger quick-contact. Sits below the nav overlay
 *  (z-30) so it's hidden when the menu is open. */
export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <a
        href={whatsappLink(defaultInquiry)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в WhatsApp"
        data-cursor="link"
        className="group flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-black/40 transition-transform duration-200 hover:scale-110"
        style={{ background: "#25d366" }}
      >
        <span
          aria-hidden="true"
          className="absolute h-12 w-12 animate-ping rounded-full opacity-30"
          style={{ background: "#25d366" }}
        />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" className="relative">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.07.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.49-8.41" />
        </svg>
      </a>

      <a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в Telegram"
        data-cursor="link"
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-black/40 transition-transform duration-200 hover:scale-110"
        style={{ background: "#229ed9" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.3-.07-.45-.52-.18L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
        </svg>
      </a>
    </div>
  );
}

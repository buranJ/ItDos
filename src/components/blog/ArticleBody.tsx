import Image from "next/image";
import Link from "next/link";

/**
 * Article text, written in Markdown in /admin and rendered here.
 *
 * Deliberately a small hand-rolled subset rather than a Markdown library:
 * the body of a post only ever needs headings, paragraphs, lists, quotes,
 * links, code and — the point of this — images, and every one of those has
 * to come out in the site's own typography rather than a plugin's defaults.
 *
 * Supported:
 *   ## Heading        ### Sub-heading
 *   Plain paragraphs, **bold**, *italic*, `code`
 *   [text](https://…)         links
 *   ![caption](/blog/pic.jpg) images with a caption
 *   - bullet list     1. numbered list
 *   > quote
 *   ---               divider
 *   ```code block```
 */
export function ArticleBody({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown.trim());
  if (blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

type Block =
  | { kind: "h2" | "h3" | "p" | "quote"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "image"; src: string; caption: string }
  | { kind: "code"; text: string }
  | { kind: "hr" };

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // ```code block```
    if (trimmed.startsWith("```")) {
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ kind: "code", text: body.join("\n") });
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ kind: "hr" });
      i += 1;
      continue;
    }

    // ![caption](/blog/pic.jpg) — on its own line
    const image = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (image) {
      blocks.push({ kind: "image", caption: image[1], src: image[2] });
      i += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push({ kind: "h3", text: trimmed.slice(4) });
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push({ kind: "h2", text: trimmed.slice(3) });
      i += 1;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const body: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        body.push(lines[i].trim().slice(2));
        i += 1;
      }
      blocks.push({ kind: "quote", text: body.join(" ") });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i += 1;
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    // Paragraph: everything up to the next blank line.
    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim()) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ kind: "p", text: paragraph.join(" ") });
  }

  return blocks;
}

function Block({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-tight tracking-tight text-fg">
          {inline(block.text)}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-fg">
          {inline(block.text)}
        </h3>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-accent pl-5 text-lg italic leading-relaxed text-fg">
          {inline(block.text)}
        </blockquote>
      );
    case "ul":
      return (
        <ul className="flex flex-col gap-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-fg-secondary">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{inline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="flex flex-col gap-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-fg-secondary">
              <span className="mt-0.5 font-mono text-sm text-accent-text">{i + 1}</span>
              <span>{inline(item)}</span>
            </li>
          ))}
        </ol>
      );
    case "image":
      return (
        <figure className="my-2">
          <div className="relative aspect-16/9 overflow-hidden rounded-2xl border border-line bg-panel">
            <Image
              src={block.src}
              alt={block.caption}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-sm text-fg-muted">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-2xl border border-line bg-panel p-5 text-sm leading-relaxed text-fg-secondary">
          <code>{block.text}</code>
        </pre>
      );
    case "hr":
      return <hr className="my-4 border-line" />;
    default:
      return (
        <p className="text-base leading-relaxed text-fg-secondary sm:text-[1.0625rem]">
          {inline((block as { text: string }).text)}
        </p>
      );
  }
}

/** **bold**, *italic*, `code` and [links](…) inside a line of text. */
function inline(text: string): React.ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  return text.split(pattern).filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-fg">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.9em] text-fg"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const external = /^https?:\/\//.test(href);
      return external ? (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-text underline underline-offset-4 transition-colors hover:text-fg"
        >
          {label}
        </a>
      ) : (
        <Link
          key={i}
          href={href}
          className="text-accent-text underline underline-offset-4 transition-colors hover:text-fg"
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}

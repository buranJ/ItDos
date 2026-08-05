/**
 * Client roster for the trust strip.
 *
 * The logo files live in `public/logos` and are real client artwork, so this
 * list stays in code rather than the CMS — it changes when a file lands, not
 * when someone edits copy. (It also replaces the invented placeholder names
 * that used to be here.)
 *
 * `size` normalises wildly different proportions — from 1.2:1 up to 13:1 —
 * into one optical weight. A single fixed height would render the long DI
 * Store wordmark as a hairline and the near-square БВК mark as a chunky
 * block, so each class gets its own box and `object-contain` fits the art
 * inside it.
 *
 * `project` links a mark to its case study where one exists; the rest render
 * without a link rather than pointing at a 404.
 */
export type ClientSize = "ultraWide" | "wide" | "medium" | "compact";

export type Client = {
  name: string;
  /** Path under /public. */
  logo: string;
  size: ClientSize;
  /** Portfolio slug, when we have a published case for this client. */
  project?: string;
  /**
   * Colour the mark takes when it is active on the dark strip.
   *
   * Most of the supplied files are a single very dark colour — #00417D,
   * #0033a1, #050505 — which is invisible against the near-black canvas. So
   * this is the brand hue lifted to something that actually reads there,
   * rather than the literal value from the file. Where the artwork is already
   * bright enough (Имбирь's orange, Air My Baby's white) it is kept as-is.
   */
  color: string;

  /**
   * Set for artwork that is drawn in white. Only relevant where the mark is
   * rendered on a light surface (the `TrustWall` variant), never on the dark
   * strip, which recolours everything anyway.
   */
  tone?: "light";

  /**
   * `"image"` keeps the original file instead of masking it.
   *
   * Masking flattens a mark to one colour, which destroys any knockout — the
   * white glyph inside Имбирь's orange badge just fills in. Use this for
   * multi-tone artwork whose real colours are already bright enough to read
   * on the dark strip; everything dark still has to be masked, because its
   * real colours are invisible there.
   */
  render?: "image";
};

/** Box each size class is fitted into, in px. */
export const CLIENT_BOX: Record<ClientSize, { w: number; h: number }> = {
  ultraWide: { w: 230, h: 30 },
  wide: { w: 150, h: 34 },
  medium: { w: 128, h: 38 },
  compact: { w: 84, h: 46 },
};

/* Source colour → colour used on the dark strip:
   #00417D navy  → #4C9BE0    #0033a1 blue   → #4C7FE8
   #0052A4 blue  → #3E8FD8    #AA1930 red    → #E03A55
   #7D9955 olive → #9CBA6E    #4E565A slate  → #9AA6AC
   #050505 / #111111 / #000 have no hue to keep, so they become near-white. */
export const clients: Client[] = [
  { name: "Avangard Style", logo: "/logos/avangard.svg", size: "medium", color: "#4C9BE0", project: "avangard-style" },
  { name: "DI Store", logo: "/logos/di-store.svg", size: "ultraWide", color: "#EDEDED", project: "distore" },
  { name: "ABA Medical", logo: "/logos/aba-medical.svg", size: "wide", color: "#7C8BEA", render: "image", project: "abamed" },
  { name: "Имбирь", logo: "/logos/imbir.svg", size: "medium", color: "#F5653E", render: "image", project: "imbir" },
  { name: "Avangard Business", logo: "/logos/avangard-business.svg", size: "medium", color: "#9AA6AC" },
  { name: "Nova Clinic", logo: "/logos/nova-clinic.svg", size: "medium", color: "#DDE1E6" },
  { name: "Silkway", logo: "/logos/silkway.svg", size: "medium", color: "#E03A55" },
  { name: "Bilmont", logo: "/logos/bilmont.svg", size: "wide", color: "#9CBA6E" },
  { name: "Toolor", logo: "/logos/toolor.svg", size: "medium", color: "#4C7FE8" },
  // The supplied file is a single all-white silhouette.
  { name: "Air My Baby", logo: "/logos/air-my-baby.svg", size: "compact", color: "#FFFFFF", tone: "light" },
  { name: "БишкекВодоКанал", logo: "/logos/bsv.svg", size: "compact", color: "#3E8FD8" },
  { name: "Dr. Alybaev", logo: "/logos/dr-alybaev.svg", size: "compact", color: "#E3E3E3" },
];

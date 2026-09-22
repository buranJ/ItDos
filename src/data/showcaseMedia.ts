/**
 * Real media for projects shown as live device mockups — the recording that
 * plays in the laptop / browser window, the phone screenshots, the crop.
 *
 * One source for the home page's "Наши проекты" slider and the portfolio
 * (list rows, case covers, galleries), keyed by the portfolio slug. The
 * case-study TEXT lives in the database and is edited in /admin; this file
 * is only the media wiring. A project with an entry here is shown on the
 * portfolio page in the top "live demo" block.
 */

export type MobileScreen = { src: string; width: number; height: number };

export type ShowcaseMedia = {
  /** Which device mockup plays the recording. */
  kind: "laptop-video" | "browser-video";
  /** YouTube id of the screen recording. */
  video: string;
  /** Address-bar / laptop label. Omitted for internal systems. */
  address?: string;
  /** Phone screenshots, lead screen mid-list (the fan centres it). */
  mobileScreens?: readonly MobileScreen[];
  /** Crop for the plain browser window: these recordings carry the
   *  recorder's own Chrome UI (and sometimes black margins), which a window
   *  around them would double. The laptop shows the full frame. */
  videoCrop?: { scale: number; top: number };
};

export const showcaseMedia: Record<string, ShowcaseMedia> = {
  "avangard-style": {
    kind: "laptop-video",
    video: "o1USBxQkmvU",
    address: "avangardstyle.kg",
    // Full-width capture, recorder's tabs + bookmarks bar on the top 11%.
    videoCrop: { scale: 1.13, top: 12.9 },
    mobileScreens: [
      { src: "/project/avangard-mob1.png", width: 430, height: 932 },
      { src: "/project/avangard-mob2.png", width: 370, height: 772 },
      { src: "/project/avangard-mob3.png", width: 370, height: 715 },
    ],
  },
  toolor: {
    kind: "laptop-video",
    video: "nNYSL7SbYsM",
    address: "toolor.store",
    // Window capture on black: margins around, browser UI on the top 16%.
    // 1.16 is the smallest scale that still hides the recorder's own chrome
    // and the black margins — anything larger starts cutting the site itself.
    videoCrop: { scale: 1.16, top: 18.4 },
    // The middle screen sets the phone's shape (see LaptopVideoMock), so a
    // full-height capture goes there — 4.jpg is cropped short (1316×2155)
    // and as the centre it drew a stubby phone.
    mobileScreens: [
      { src: "/pr/3.jpg", width: 1319, height: 2371 },
      { src: "/pr/4.jpg", width: 1316, height: 2155 },
      { src: "/pr/2.jpg", width: 1269, height: 2560 },
      { src: "/pr/5.jpg", width: 1319, height: 2336 },
      { src: "/pr/1.jpg", width: 1272, height: 2560 },
    ],
  },
  bilmont: {
    kind: "laptop-video",
    video: "SO5efpX3Xw0",
    address: "bilmont.school",
    videoCrop: { scale: 1.16, top: 18.4 },
    mobileScreens: [
      { src: "/pr/8.jpg", width: 1305, height: 2560 },
      { src: "/pr/6.jpg", width: 1316, height: 2553 },
      { src: "/pr/10.jpg", width: 1316, height: 2560 },
      { src: "/pr/9.jpg", width: 1290, height: 2560 },
      { src: "/pr/7.jpg", width: 1280, height: 2560 },
    ],
  },
  bishkekvodokanal: {
    kind: "browser-video",
    video: "z5q2Siv12X0",
    // The recording is ~16:10 and includes the recorder's own Chrome tab
    // and address bar: scaled 1.21× and lifted 19.6%, the window shows only
    // the app — no pillarbox bars, no browser-inside-a-browser.
    videoCrop: { scale: 1.21, top: 19.6 },
  },
};

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Without this Next walks up looking for a lockfile, finds
    // ~/package-lock.json and treats the home directory as the build root.
    root: import.meta.dirname,
  },
  images: {
    // AVIF first, WebP as the fallback: the team portraits are large
    // photographic PNGs and AVIF is ~20% smaller again than WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

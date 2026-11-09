import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // AVIF first (smaller than WebP at the same look), WebP for browsers without it; copies stay cached a year
  images: { formats: ["image/avif", "image/webp"], qualities: [75], minimumCacheTTL: 31536000 },
  devIndicators: false,
  partialPrefetching: true,
  experimental: { agentUpgrade: "security" },
  // Every model and still is requested with ?v=N, so it can be cached forever (bump N to ship a change); the plain
  // artwork under /img has no version in its URL, so it revalidates in the background after a day
  async headers() {
    const forever = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/:path*.glb", headers: forever },
      { source: "/models/:path*", headers: forever },
      { source: "/img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

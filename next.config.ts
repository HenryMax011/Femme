import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build local → upload pronto (contorna o build quebrado da Hostinger)
  output: "standalone",
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ["framer-motion"],
  },
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

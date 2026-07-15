import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Cache em disco — dev mais rápido entre reinícios
    turbopackFileSystemCacheForDev: true,
    // Cache em disco — builds subsequentes mais rápidos
    turbopackFileSystemCacheForBuild: true,
    // Tree-shake de pacotes pesados usados no site
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Performance
  poweredByHeader: false,
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Experimental optimizations
  experimental: {
    optimizeServerReact: true,
    optimizePackageImports: [
      "react-icons",
      "lucide-react",
      "@tanstack/react-query",
      "sonner",
    ],
  },
};

export default nextConfig;

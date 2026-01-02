import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ["www.flaticon.com"],
  },
};

export default nextConfig;

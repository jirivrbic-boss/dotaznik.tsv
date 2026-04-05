import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.tenor.com", pathname: "/**" },
      { protocol: "https", hostname: "tenor.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;

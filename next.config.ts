import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.5"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "alfatah.pk",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      }
    ],
  },
};

export default nextConfig;

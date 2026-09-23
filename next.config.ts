import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "192.168.1.239"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xrpwkaqzuupjctaxqisn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

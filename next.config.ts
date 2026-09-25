import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "xrpwkaqzuupjctaxqisn.supabase.co";
  }
})();

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "192.168.1.239"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

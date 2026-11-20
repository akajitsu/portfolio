import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a verification build run alongside `npm run dev` without sharing .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    // The project was renamed from InkMoon to BeanZz — keep old links working.
    return [{ source: "/projects/inkmoon", destination: "/projects/beanzz", permanent: true }];
  },
};

export default nextConfig;

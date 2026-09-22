import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This project lives at sites/pocco inside the pocco-web git repo (whose
  // root is one level up) — without this, Next/Turbopack looks for a
  // lockfile relative to the git root instead of this directory's own
  // package-lock.json and prints a "ignored package-lock.json ... outside
  // the current Git repository" warning on every dev/build run. Pinning the
  // root here to this directory silences that false positive.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Next 16 only serves a quality if it's explicitly whitelisted here —
    // an unlisted `quality` prop on <Image> is silently ignored and falls
    // back to the default (75), which is why the gallery's quality={90}
    // had no effect until this was added.
    qualities: [75, 90],
    // Event flyers come from Fourvenues' own CDN (see events-calendar.tsx),
    // not our own /public assets — next/image refuses remote hosts unless
    // explicitly allowed here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fourvenues.com",
        pathname: "/cdn-cgi/imagedelivery/**",
      },
    ],
  },
};

export default nextConfig;

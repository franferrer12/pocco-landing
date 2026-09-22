import type { MetadataRoute } from "next";

// Next 16 route handler — generates /robots.txt at request time instead of
// a static public/robots.txt file, so it can't drift from the real route
// list (sitemap.ts) or the real domain below.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://pocco.club/sitemap.xml",
  };
}

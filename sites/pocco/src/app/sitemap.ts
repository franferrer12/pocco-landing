import type { MetadataRoute } from "next";

// Next 16 route handler — generates /sitemap.xml at request time. Lists
// every real, indexable route: the home page and the three standalone legal
// pages (privacidad, aviso-legal, cookies — each also reachable via a
// footer popup, but these are the crawlable, linkable URLs for them, see
// footer.tsx and each page's own file for why both forms exist).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pocco.club";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/aviso-legal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}

import type { MetadataRoute } from "next";
import { fetchEvents } from "@/lib/events";

// Next 16 route handler — generates /sitemap.xml at request time. Lists
// every real, indexable route: the home page, /alquiler-sala (the venue
// rental page for private events — see that page's own comment for why it
// exists), the three standalone legal pages (privacidad, aviso-legal,
// cookies — each also reachable via a footer popup, but these are the
// crawlable, linkable URLs for them, see footer.tsx and each page's own
// file for why both forms exist), the /eventos index, and one entry per
// currently-upcoming event under /eventos/[slug] — sourced live from the
// same Fourvenues API data those pages themselves render from, so the
// sitemap never drifts out of sync with what's actually published.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://pocco.club";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/eventos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/alquiler-sala`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/aviso-legal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const oneYearOut = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const events = await fetchEvents(now, oneYearOut);
  const upcoming = events.filter((e) => e.end * 1000 >= now.getTime());

  const eventRoutes: MetadataRoute.Sitemap = upcoming.map((event) => ({
    url: `${base}/eventos/${event.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes];
}

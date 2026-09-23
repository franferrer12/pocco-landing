import type { MetadataRoute } from "next";

// Next 16 route handler — generates /manifest.webmanifest at request time,
// same pattern as robots.ts/sitemap.ts. Previously missing entirely: no
// web app manifest meant no real "Add to Home Screen" identity (a visitor
// who saves the site from their phone got a generic browser bookmark, no
// icon/name/theme of its own) and one fewer signal for Google's own
// understanding of the site as a real, named entity rather than just a
// URL. Icons are the same POCCO isotype used for favicon.ico
// (public/assets/nav/pocco-mark.png — see that file's own history),
// regenerated in white-on-dark instead of the favicon's black-on-
// transparent treatment, since a home-screen icon tile needs real
// contrast against whatever background sits behind it.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "POCCO Club — Discoteca en Alzira",
    short_name: "POCCO Club",
    description:
      "POCCO Club, discoteca en Alzira (Valencia). Próximos eventos, reservados VIP y toda la información para tu próxima noche de fiesta en la Ribera.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "es",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

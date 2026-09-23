"use client";

// Thin client boundary around EventCheckoutEmbed for the server-rendered
// /eventos/[slug] page — that page itself must stay a server component
// (generateMetadata + the JSON-LD script need real server-side data
// fetching), but the checkout embed itself needs client state/effects
// (see event-checkout-embed.tsx), so it's isolated here rather than
// forcing "use client" onto the whole page.
//
// Renders the exact same embedded Fourvenues checkout the homepage's
// EventModal uses (events-calendar.tsx) — previously this page instead
// linked out to fourvenues.com in a new tab, which broke from how every
// other event on the site behaves (opened in place, inside this site).

import { EventCheckoutEmbed } from "./event-checkout-embed";

export function EventPageCheckout({ shortCode }: { shortCode: string }) {
  return <EventCheckoutEmbed shortCode={shortCode} />;
}

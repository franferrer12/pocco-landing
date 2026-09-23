import type { Metadata } from "next";
import JellyfishDrift from "@/components/ui/jelly-fish";
import BrandsMarquee from "@/components/ui/brands-marquee";
import EventsSection from "@/components/ui/events-section";
import GallerySection from "@/components/ui/gallery-section";
import VipSection from "@/components/ui/vip-section";
import LocationSection from "@/components/ui/location-section";
import HallOfFameSection from "@/components/ui/hall-of-fame-section";
import FaqSection from "@/components/ui/faq-section";
import Footer from "@/components/ui/footer";
import { PillNav } from "@/components/ui/pill-nav";
import {
  SITE_NAME,
  LEGAL_NAME,
  SITE_URL,
  ADDRESS,
  PHONE_E164,
  EMAIL,
  SOCIAL_URLS,
} from "@/lib/site-data";

export const metadata: Metadata = {
  // Home-specific title/description instead of inheriting the root
  // layout's generic ones verbatim — still built from the same SITE_NAME
  // constant so the two stay related, but this copy leads with the actual
  // local-SEO search intent ("discoteca en Alzira") rather than only the
  // brand name, per the SEO review: the homepage is the site's single
  // highest-value URL and was previously sharing undifferentiated metadata
  // with every other page.
  title: `${SITE_NAME} — Discoteca en Alzira, Valencia`,
  description:
    "POCCO Club, discoteca en Alzira (Valencia). Próximos eventos, reservados VIP y toda la información para tu próxima noche de fiesta en la Ribera.",
  alternates: { canonical: "/" },
};

// LocalBusiness/NightClub structured data — real identity/address/contact
// data, now read from the shared src/lib/site-data.ts instead of being
// hand-duplicated here (see that file's own comment for why). Includes a
// real phone number and opening hours as of this update — both previously
// missing, flagged as a local-SEO gap since Google's ranking of local
// results leans on relevance/distance/prominence signals like a complete,
// consistent business listing. Event schema per event lives on each
// /eventos/[slug] page instead of here — this stays the site-wide
// LocalBusiness/NightClub entity, not a per-event one.
const NIGHTCLUB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "NightClub",
  name: SITE_NAME,
  alternateName: LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/og/pocco-club-og.jpg`,
  image: `${SITE_URL}/assets/og/pocco-club-og.jpg`,
  telephone: PHONE_E164,
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    ...ADDRESS,
  },
  // Doors typically open at 01:00 per the FAQ copy ("Normalmente abrimos a
  // la 01:00 y cerramos al amanecer") — expressed generically across
  // Friday/Saturday since the exact night varies event to event and isn't
  // fixed enough to state as a hard weekly schedule beyond that.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "01:00",
    },
  ],
  sameAs: SOCIAL_URLS,
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static, hand-authored
        // JSON-LD with no user input, not html; this is the documented way
        // to emit structured data in the App Router (next/script strips
        // non-JS content types, so a plain <script type="application/ld+json">
        // is what Next's own docs use for this).
        dangerouslySetInnerHTML={{ __html: JSON.stringify(NIGHTCLUB_JSON_LD) }}
      />
      {/* Fixed to the viewport (not the hero section) so it stays visible
          while scrolling through the rest of the page, not just inside the
          hero — previously lived inside JellyfishDrift's own <header> with
          position:absolute, which scrolled away with the hero itself. */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.4vh 2.6vw",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <PillNav />
        </div>
      </header>
      <JellyfishDrift />
      <BrandsMarquee padding="3vh 0" />
      <EventsSection />
      <HallOfFameSection />
      <GallerySection />
      <VipSection />
      <FaqSection />
      <LocationSection />
      <BrandsMarquee />
      <Footer />
    </main>
  );
}

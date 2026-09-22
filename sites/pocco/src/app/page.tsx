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

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// LocalBusiness/NightClub structured data — same real identity/address data
// already confirmed and published in the legal pages (legal-notice-content.tsx,
// privacy-policy-content.tsx: NIF B23996051, Calle Guadassuar 4, 46600 Alzira),
// not duplicated by hand here beyond what's needed for the schema. Gives
// Google a machine-readable name/address/hours/socials for potential rich
// results (knowledge panel, map card) — there's no per-event data source
// exposed outside the Fourvenues widget itself to also emit Event schema
// from, so this deliberately stays LocalBusiness/NightClub-only for now.
const NIGHTCLUB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "NightClub",
  name: "POCCO Club",
  alternateName: "POCCOCLUB, S.L.",
  url: "https://pocco.club",
  logo: "https://pocco.club/assets/og/pocco-club-og.jpg",
  image: "https://pocco.club/assets/og/pocco-club-og.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Guadassuar, 4",
    addressLocality: "Alzira",
    addressRegion: "Valencia",
    postalCode: "46600",
    addressCountry: "ES",
  },
  sameAs: [
    "https://www.instagram.com/pocco.club/",
    "https://wa.me/message/A3BHIH24Q6M4L1",
  ],
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

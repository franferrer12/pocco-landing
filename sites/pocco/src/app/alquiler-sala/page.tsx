import type { Metadata } from "next";
import Footer from "@/components/ui/footer";
import { PillNav } from "@/components/ui/pill-nav";
import RentalHero from "@/components/ui/rental-hero";
import RentalStatement from "@/components/ui/rental-statement";
import RentalRoomsSection from "@/components/ui/rental-rooms-section";
import RentalExperience from "@/components/ui/rental-experience";
import RentalPricing from "@/components/ui/rental-pricing";
import RentalIncludes from "@/components/ui/rental-includes";
import RentalExtras from "@/components/ui/rental-extras";
import RentalAccess from "@/components/ui/rental-access";
import RentalGallery from "@/components/ui/rental-gallery";
import RentalClosing from "@/components/ui/rental-closing";
import { RentalRoomProvider } from "@/components/ui/rental-room-context";
import { SITE_NAME, SITE_URL, ADDRESS, PHONE_E164, EMAIL } from "@/lib/site-data";
import { RENTAL_ROOMS } from "@/lib/rental-rooms";

// /alquiler-sala — commercial/B2C page for renting the venue for private
// events (communions, birthdays, company events), distinct in purpose from
// /eventos (the club's own nightlife calendar). Added directly in response
// to real, currently-unserved search demand confirmed in Search Console's
// own Performance report: queries like "celebrar bautizos en alzira",
// "comuniones alzira", "bautizos alzira" and "sala de eventos alzira" show
// real impressions (31-65 each) but 0 clicks and very low ranking (avg.
// position 40-70) — there was no page on the site that could satisfy that
// search intent at all before this one.
//
// Deliberately NOT added as a 4th PillNav tab — that nav is a small,
// deliberately minimal set (Home/Eventos/Ubicación) built around the
// club's own nightlife visitors; this page serves a different audience
// (someone planning a private daytime event) and is discovered instead via
// the footer's own cross-link and a short teaser from the homepage,
// without competing for space in the primary nav.
//
// Full 10-section narrative rebuild (from the site owner's own approved
// brief): desire → identification → space → experience → price →
// personalization → confidence → conversion, replacing the original
// single-pass "dossier de tarifas" layout (hero → sala → precio →
// incluidos → galería → formulario → FAQ) with the fuller recorrido:
// Hero → Statement → Las Salas → Experiencia → Precio → Incluido →
// Extras/Catering → Acceso previo → Galería → FAQ → Cierre. Each section
// is its own component (rental-*.tsx) built in one pass per the site
// owner's own instruction ("haz todo de una tirada") — visual polish is
// expected to be iterated on afterward, not this pass's job.
//
// RentalRoomProvider wraps the whole body (not just the sections that use
// it) so "Las Salas", "Experiencia" and "Precio" all read/write the same
// POCCO/Lo Nuestro selection without prop-drilling through the FAQ/gallery
// sections in between that don't care about it.

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export const metadata: Metadata = {
  title: "Alquiler de Sala para Eventos en Alzira",
  description:
    "Alquila POCCO Club para tu comunión, bautizo, cumpleaños o evento de empresa en Alzira (Valencia). Dos salas, sonido, barra y catering para tu celebración privada.",
  alternates: { canonical: "/alquiler-sala" },
};

// schema.org/Service rather than /Event — this page offers the venue
// itself, not a scheduled event with its own date, so Event's required
// startDate/endDate don't apply the way they do on /eventos/[slug].
// hasOfferCatalog lists both real rooms with their own real per-hour
// pricing (AggregateOffer, since each room has a day/night rate rather
// than one fixed price) — previously this page only described the
// service generically with no priced offers at all.
const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Alquiler de sala para eventos privados",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: PHONE_E164,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      ...ADDRESS,
    },
  },
  areaServed: {
    "@type": "City",
    name: "Alzira",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Particulares y empresas",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Salas disponibles para alquiler",
    itemListElement: RENTAL_ROOMS.map((room) => ({
      "@type": "Offer",
      name: room.name,
      priceSpecification: {
        "@type": "AggregateOffer",
        lowPrice: room.pricing.dayPrice,
        highPrice: room.pricing.nightPrice,
        priceCurrency: "EUR",
      },
    })),
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Alquiler de sala", item: `${SITE_URL}/alquiler-sala` },
  ],
};

const RENTAL_FAQS = [
  {
    q: "¿Cuál es el aforo máximo de cada sala?",
    a: "La Sala Pocco admite hasta 400 personas y la Sala Lo Nuestro hasta 150. Cuéntanos el número de invitados en el formulario y te confirmamos la sala más adecuada.",
  },
  {
    q: "¿Puedo traer mi propio catering o bebida?",
    a: "Sí. Puedes traer tu propia comida y bebida sin problema, o elegir uno de nuestros tres menús de catering (desde 15,50€/persona).",
  },
  {
    q: "¿Con cuánta antelación hay que reservar?",
    a: "Cuanto antes mejor, sobre todo para fechas de temporada alta (comuniones en primavera, Navidad). Escríbenos y te confirmamos disponibilidad real.",
  },
  {
    q: "¿El precio incluye limpieza, vasos y hielo?",
    a: "Sí, en ambas salas. Limpieza completa, vasos y hielo ilimitado ya están incluidos en el precio del alquiler, sin coste adicional.",
  },
  {
    q: "¿Tengo acceso a la sala antes del evento?",
    a: "Sí. El día anterior a tu evento tienes entre 2 y 3 horas de acceso previo para montar decoración, mobiliario y dejar preparada tu bebida o comida.",
  },
];

export default function AlquilerSalaPage() {
  return (
    <RentalRoomProvider>
      <main>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- static JSON-LD, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- static JSON-LD, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
        />

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

        <RentalHero />
        <RentalStatement />
        <RentalRoomsSection />
        <RentalExperience />
        <RentalPricing />
        <RentalIncludes />
        <RentalExtras />
        <RentalAccess />
        <RentalGallery />

        {/* FAQ del alquiler */}
        <section style={{ background: "#000", padding: "2vh 6vw 12vh" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(24px, 3.6vw, 36px)",
                fontWeight: 900,
                color: "#f5f5f5",
                margin: "0 0 2rem",
                letterSpacing: "-0.01em",
                textAlign: "center",
              }}
            >
              Preguntas frecuentes
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {RENTAL_FAQS.map((faq) => (
                <div key={faq.q}>
                  <p
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#f5f5f5",
                      margin: "0 0 0.4rem",
                    }}
                  >
                    {faq.q}
                  </p>
                  <p
                    style={{
                      fontFamily: BODY,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(245,245,245,0.55)",
                      margin: 0,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RentalClosing />

        <Footer />
      </main>
    </RentalRoomProvider>
  );
}

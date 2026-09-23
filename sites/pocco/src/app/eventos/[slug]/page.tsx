import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/ui/footer";
import { PillNav } from "@/components/ui/pill-nav";
import { SITE_NAME, SITE_URL, ADDRESS, WHATSAPP_URL } from "@/lib/site-data";
import { fetchEvents, fetchEventBySlug, madridDateParts, translateOutfit, eventShortCode } from "@/lib/events";

// /eventos/[slug] — one page per event, auto-generated from Fourvenues' own
// API data (no hand-authoring — there's no CMS and no content workflow for
// individual events, so this reads the same live data the homepage calendar
// already uses). This is the piece the SEO review's P0 priority actually
// asked for: a real indexable URL per event, carrying its own metadata and
// Event schema, instead of every event only existing inside a client-side
// modal with no URL of its own. Ticket purchase itself still happens on
// Fourvenues — their API is read-only, there's no way to take a real
// payment here — so the CTA below deep-links to Fourvenues' own checkout
// for this event via its short code (see eventShortCode in lib/events.ts).

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";

const WEEKDAY_LONG = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTH_LONG = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatEventDate(unixSeconds: number): string {
  const { year, month, day } = madridDateParts(unixSeconds);
  const weekday = WEEKDAY_LONG[new Date(year, month, day).getDay()];
  return `${weekday} ${day} de ${MONTH_LONG[month]} de ${year}`;
}

function formatTime(unixSeconds: number): string {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(unixSeconds * 1000));
}

// Pre-render every currently-known upcoming event at build/ISR time — new
// events published later on Fourvenues still resolve (this page isn't
// `dynamicParams = false`), just via on-demand SSR on first request instead
// of being in the initial static set.
export async function generateStaticParams() {
  const now = new Date();
  const oneYearOut = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const events = await fetchEvents(now, oneYearOut);
  return events.map((event) => ({ slug: event.slug }));
}

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) return {};

  const title = `${event.name} — ${formatEventDate(event.date)}`;
  const description = event.description
    ? event.description.slice(0, 155)
    : `${event.name} en ${SITE_NAME}, Alzira. ${formatEventDate(event.date)}. Consulta el dress code y consigue tu entrada.`;

  return {
    title,
    description,
    alternates: { canonical: `/eventos/${event.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/eventos/${event.slug}`,
      images: event.flyer ? [{ url: event.flyer, width: 1080, height: 1080, alt: event.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event.flyer ? [event.flyer] : undefined,
    },
  };
}

export default async function EventPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) notFound();

  const startIso = new Date(event.start * 1000).toISOString();
  const endIso = new Date(event.end * 1000).toISOString();
  const isPast = event.end * 1000 < Date.now();
  const checkoutUrl = `https://fourvenues.com/pocco-club#events/${eventShortCode(event.url)}`;

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: startIso,
    endDate: endIso,
    eventStatus: isPast
      ? "https://schema.org/EventMovedOnline" // never actually hit for real listings (past events are excluded from generateStaticParams' set), kept only as a defensive fallback that isn't a false "scheduled" claim
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: event.flyer ? [event.flyer] : undefined,
    description: event.description || event.name,
    location: {
      "@type": "Place",
      name: SITE_NAME,
      address: {
        "@type": "PostalAddress",
        ...ADDRESS,
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: checkoutUrl,
      priceCurrency: "EUR",
      availability: isPast
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static JSON-LD built
        // server-side from Fourvenues' own API data, not raw user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
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

      <section style={{ background: "#000", padding: "18vh 6vw 10vh" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ margin: "0 0 2rem" }}>
            <Link
              href="/eventos"
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: 13,
                color: "rgba(245,245,245,0.5)",
                textDecoration: "none",
              }}
            >
              ← Todos los eventos
            </Link>
          </p>

          {event.flyer && (
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                aspectRatio: "1 / 1",
                margin: "0 auto 3vh",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Image src={event.flyer} alt={event.name} fill sizes="420px" style={{ objectFit: "cover" }} priority />
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(12px, 1.4vw, 14px)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#e21212",
                margin: "0 0 0.8rem",
                textTransform: "uppercase",
              }}
            >
              {formatEventDate(event.date)} · {formatTime(event.start)}h
            </p>

            <h1
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(28px, 4.6vw, 48px)",
                fontWeight: 900,
                color: "#f5f5f5",
                margin: 0,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              {event.name}
            </h1>

            {event.description && (
              <p
                style={{
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "clamp(15px, 1.6vw, 17px)",
                  lineHeight: 1.6,
                  color: "rgba(245,245,245,0.65)",
                  maxWidth: 560,
                  margin: "1.6rem auto 0",
                  whiteSpace: "pre-line",
                }}
              >
                {event.description}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0.6rem 1.4rem",
                marginTop: "2.4rem",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: 14,
                color: "rgba(245,245,245,0.55)",
              }}
            >
              {event.outfit && <span>Dress code: {translateOutfit(event.outfit)}</span>}
              {event.age > 0 && <span>+{event.age} años</span>}
              <span>{ADDRESS.streetAddress}, {ADDRESS.addressLocality}</span>
            </div>

            <div style={{ marginTop: "3vh" }}>
              {isPast ? (
                <p
                  style={{
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: 14,
                    color: "rgba(245,245,245,0.4)",
                  }}
                >
                  Este evento ya ha finalizado.
                </p>
              ) : (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "12px 32px",
                    borderRadius: 999,
                    background: "#e21212",
                    color: "#f5f5f5",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Conseguir entrada
                </a>
              )}
            </div>

            <p style={{ marginTop: "2vh" }}>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: 13,
                  color: "rgba(245,245,245,0.4)",
                  textDecoration: "underline",
                }}
              >
                ¿Dudas? Escríbenos por WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

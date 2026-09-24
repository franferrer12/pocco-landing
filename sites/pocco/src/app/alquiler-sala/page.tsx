import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/ui/footer";
import { PillNav } from "@/components/ui/pill-nav";
import RentalRequestForm from "@/components/ui/rental-request-form";
import { SITE_NAME, SITE_URL, ADDRESS, PHONE_E164, EMAIL } from "@/lib/site-data";

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

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export const metadata: Metadata = {
  title: "Alquiler de Sala para Eventos en Alzira",
  description:
    "Alquila POCCO Club para tu comunión, bautizo, cumpleaños o evento de empresa en Alzira (Valencia). Espacio, sonido y barra para tu celebración privada.",
  alternates: { canonical: "/alquiler-sala" },
};

// schema.org/Service rather than /Event — this page offers the venue
// itself, not a scheduled event with its own date, so Event's required
// startDate/endDate don't apply the way they do on /eventos/[slug].
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
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Alquiler de sala", item: `${SITE_URL}/alquiler-sala` },
  ],
};

const EVENT_TYPES = [
  {
    title: "Comuniones y bautizos",
    copy: "El espacio se adapta para una celebración de día, con la sala montada a tu gusto y todo el equipo técnico ya disponible.",
  },
  {
    title: "Cumpleaños y celebraciones privadas",
    copy: "Tu fiesta, tu gente, sin compartir la noche con nadie más. Barra, sonido y pista solo para tu grupo.",
  },
  {
    title: "Eventos de empresa",
    copy: "Cenas de empresa, presentaciones o after-works corporativos en un espacio con personalidad, no en un salón genérico.",
  },
];

const INCLUDES = [
  "Aforo amplio para grupos grandes",
  "Barra y servicio de bebidas",
  "Equipo de sonido y DJ profesional",
  "Horario flexible según tu evento",
];

// Reuses three of the club's own real photos (already described/alt-texted
// in gallery-section.tsx, per the site owner's own answer to use what
// already exists rather than wait on new daytime/empty-room photography).
const GALLERY_IMAGES = [
  { src: "/assets/gallery/pocco-03.webp", alt: "Cabina de DJ y equipo de sonido de POCCO Club" },
  { src: "/assets/gallery/pocco-01.webp", alt: "Pista y zona principal de POCCO Club" },
  { src: "/assets/gallery/pocco-05.webp", alt: "Entrada de POCCO Club en Alzira" },
];

const RENTAL_FAQS = [
  {
    q: "¿Cuál es el aforo máximo de la sala?",
    a: "Depende de la disposición que necesite tu evento. Cuéntanos el número de invitados en el formulario y te confirmamos el aforo exacto para tu celebración.",
  },
  {
    q: "¿Puedo traer mi propio catering?",
    a: "Sí, es posible. Lo hablamos directamente contigo según el tipo de evento y horario.",
  },
  {
    q: "¿Con cuánta antelación hay que reservar?",
    a: "Cuanto antes mejor, sobre todo para fechas de temporada alta (comuniones en primavera, Navidad). Escríbenos y te confirmamos disponibilidad real.",
  },
  {
    q: "¿El precio incluye sonido y DJ?",
    a: "El equipo de sonido y DJ ya están disponibles en la sala. Te damos un presupuesto cerrado según lo que necesite tu evento.",
  },
];

export default function AlquilerSalaPage() {
  return (
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

      {/* Hero */}
      <section style={{ background: "#000", padding: "18vh 6vw 8vh", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(12px, 1.4vw, 14px)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#e21212",
              margin: "0 0 0.8rem",
            }}
          >
            ALQUILER DE SALA
          </p>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(32px, 5.5vw, 56px)",
              fontWeight: 900,
              color: "#f5f5f5",
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Tu celebración, en POCCO Club.
          </h1>
          <p
            style={{
              fontFamily: BODY,
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.6,
              color: "rgba(245,245,245,0.6)",
              maxWidth: 520,
              margin: "1.4rem auto 0",
            }}
          >
            Alquila el espacio en Alzira para tu comunión, bautizo, cumpleaños
            o evento de empresa. Espacio, sonido y barra listos para tu día.
          </p>
        </div>
      </section>

      {/* Tipos de evento */}
      <section style={{ background: "#000", padding: "2vh 6vw 8vh" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.4rem",
          }}
        >
          {EVENT_TYPES.map((type) => (
            <div
              key={type.title}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: "1.6rem",
                background: "#0a0a0a",
              }}
            >
              <p
                style={{
                  fontFamily: DISPLAY,
                  fontSize: "clamp(16px, 1.8vw, 19px)",
                  fontWeight: 800,
                  color: "#f5f5f5",
                  margin: "0 0 0.6rem",
                }}
              >
                {type.title}
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
                {type.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Qué incluye */}
      <section style={{ background: "#000", padding: "2vh 6vw 8vh" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(24px, 3.6vw, 36px)",
              fontWeight: 900,
              color: "#f5f5f5",
              margin: "0 0 2rem",
              letterSpacing: "-0.01em",
            }}
          >
            Qué incluye
          </h2>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              textAlign: "left",
            }}
          >
            {INCLUDES.map((item) => (
              <li
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontFamily: BODY,
                  fontSize: 14,
                  color: "rgba(245,245,245,0.7)",
                }}
              >
                <span style={{ color: "#e21212", fontWeight: 700 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Galería */}
      <section style={{ background: "#000", padding: "2vh 6vw 8vh" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.src}
              style={{
                position: "relative",
                aspectRatio: "4 / 5",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 90vw, 320px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Formulario de solicitud */}
      <section style={{ background: "#000", padding: "2vh 6vw 10vh" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(24px, 3.6vw, 36px)",
              fontWeight: 900,
              color: "#f5f5f5",
              margin: "0 0 0.6rem",
              letterSpacing: "-0.01em",
            }}
          >
            Solicita información
          </h2>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 14,
              color: "rgba(245,245,245,0.5)",
              margin: "0 0 2.4rem",
            }}
          >
            Cuéntanos tu evento y te respondemos con disponibilidad y presupuesto.
          </p>
          <RentalRequestForm />
        </div>
      </section>

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

      <Footer />
    </main>
  );
}

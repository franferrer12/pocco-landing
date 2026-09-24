"use client";

// Short lead-capture form for /alquiler-sala — deliberately NOT a backend
// form (no API route, no email service): on submit it composes a WhatsApp
// message from the filled-in fields and opens wa.me with that message
// pre-filled, via buildWhatsAppMessageUrl (site-data.ts). This keeps a
// rental inquiry as a real, structured lead (event type, approximate date,
// guest count, contact name/phone all captured before the conversation
// starts) without needing any new service, backend route, or email
// integration — WhatsApp is where the club already handles every other
// inquiry (VIP reservations, general questions), and ~99% of this site's
// traffic is mobile per Search Console's own device breakdown, where
// wa.me opens the WhatsApp app directly rather than a web fallback.
//
// If a real historical record of leads (not just what shows up in
// WhatsApp) becomes necessary later, this is the seam to add it at: a
// server action or /api route that also stores/emails the same fields
// before redirecting to the same wa.me URL, without changing the form
// itself.

import { useState, type FormEvent } from "react";
import { buildWhatsAppMessageUrl } from "@/lib/site-data";

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const EVENT_TYPES = [
  "Comunión o bautizo",
  "Cumpleaños o celebración privada",
  "Evento de empresa",
  "Otro",
] as const;

function buildMessage(fields: {
  name: string;
  eventType: string;
  date: string;
  guests: string;
  phone: string;
  notes: string;
}): string {
  const lines = [
    "Hola, quiero información sobre el alquiler de la sala de POCCO Club.",
    "",
    `Nombre: ${fields.name}`,
    `Tipo de evento: ${fields.eventType}`,
    fields.date && `Fecha aproximada: ${fields.date}`,
    fields.guests && `Nº de invitados: ${fields.guests}`,
    `Teléfono de contacto: ${fields.phone}`,
    fields.notes && `Detalles: ${fields.notes}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export default function RentalRequestForm() {
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = buildMessage({ name, eventType, date, guests, phone, notes });
    // target="_blank" via window.open rather than a real link's href — the
    // URL has to be built from current form state at submit time, not
    // known ahead of render.
    window.open(buildWhatsAppMessageUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 480,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Field label="Nombre" htmlFor="rental-name">
        <input
          id="rental-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          placeholder="Tu nombre"
        />
      </Field>

      <Field label="Tipo de evento" htmlFor="rental-event-type">
        <select
          id="rental-event-type"
          required
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          style={{ ...inputStyle, appearance: "none" }}
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type} style={{ color: "#000" }}>
              {type}
            </option>
          ))}
        </select>
      </Field>

      <div style={{ display: "flex", gap: 12 }}>
        <Field label="Fecha aproximada" htmlFor="rental-date" style={{ flex: 1 }}>
          <input
            id="rental-date"
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
            placeholder="Ej. mayo 2027"
          />
        </Field>
        <Field label="Nº de invitados" htmlFor="rental-guests" style={{ flex: 1 }}>
          <input
            id="rental-guests"
            type="text"
            inputMode="numeric"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            style={inputStyle}
            placeholder="Ej. 80"
          />
        </Field>
      </div>

      <Field label="Teléfono de contacto" htmlFor="rental-phone">
        <input
          id="rental-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          placeholder="Tu teléfono"
        />
      </Field>

      <Field label="Cuéntanos algo más (opcional)" htmlFor="rental-notes">
        <textarea
          id="rental-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ ...inputStyle, minHeight: 80, resize: "vertical", paddingTop: 10 }}
          placeholder="Catering, horario, decoración..."
        />
      </Field>

      <button
        type="submit"
        style={{
          marginTop: 8,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 28px",
          borderRadius: 999,
          background: "#e21212",
          color: "#f5f5f5",
          border: "none",
          fontFamily: BODY,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Enviar consulta por WhatsApp
      </button>

      <p
        style={{
          fontFamily: BODY,
          fontSize: 12,
          color: "rgba(245,245,245,0.4)",
          textAlign: "center",
          margin: 0,
        }}
      >
        Se abrirá WhatsApp con tu consulta ya redactada — solo tienes que enviarla.
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
  style,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <label htmlFor={htmlFor} style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <span
        style={{
          fontFamily: DISPLAY,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "rgba(245,245,245,0.55)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: 15,
  color: "#f5f5f5",
  background: "#111",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 10,
  padding: "12px 14px",
  outline: "none",
  width: "100%",
};

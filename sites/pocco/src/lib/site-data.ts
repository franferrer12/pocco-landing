// Single source of truth for POCCO's real contact/NAP (Name-Address-Phone)
// data and social URLs — consolidated from what used to be duplicated
// separately across vip-section.tsx, location-section.tsx and page.tsx's
// own JSON-LD (each defining its own WHATSAPP_URL/INSTAGRAM_URL constant
// with the same value, per those files' own "kept in sync between both"
// comments). Centralizing here means a real change (a new phone number, a
// different Instagram handle) only has to happen in one place, and every
// consumer — the NightClub JSON-LD, the footer, VIP's CTA, Location's
// CTAs, and any future Event schema — reads the same values by construction
// instead of by manual discipline.
//
// Values are the same ones already confirmed and published across the
// legal documents (privacy-policy-content.tsx, legal-notice-content.tsx,
// cookies-policy-content.tsx) and, for the phone number, confirmed directly
// by the site owner as the real, active number for the club.

export const SITE_NAME = "POCCO Club";
export const LEGAL_NAME = "POCCOCLUB, S.L.";
export const NIF = "B23996051";
export const SITE_URL = "https://pocco.club";

export const ADDRESS = {
  streetAddress: "Calle Guadassuar, 4",
  addressLocality: "Alzira",
  addressRegion: "Valencia",
  postalCode: "46600",
  addressCountry: "ES",
} as const;

export const EMAIL = "poccotheclub@gmail.com";
// E.164 for schema.org/tel: URIs; the human-readable Spanish format is
// derived from this everywhere it's displayed, so the two can't drift.
export const PHONE_E164 = "+34614868148";
export const PHONE_DISPLAY = "+34 614 86 81 48";

export const WHATSAPP_URL = "https://wa.me/message/A3BHIH24Q6M4L1";
export const INSTAGRAM_URL = "https://www.instagram.com/pocco.club/";

export const SOCIAL_URLS = [INSTAGRAM_URL, WHATSAPP_URL];

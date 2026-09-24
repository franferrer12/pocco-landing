// Shared data for the two rooms POCCO Club actually rents out for private
// events — sourced directly from a rental-page content dossier the site
// owner provided (their own real pricing/capacity/catering document, not
// invented). Centralized here so the pricing, rooms and includes sections
// (each its own component) read the same numbers instead of hand-copying
// them separately and risking drift.

export type RoomId = "pocco" | "lo-nuestro";

export interface RentalRoom {
  id: RoomId;
  name: string;
  capacity: number;
  tagline: string;
  description: string;
  pricing: {
    dayLabel: string; // e.g. "17:00 — 00:00"
    dayPrice: number;
    nightLabel: string; // e.g. "00:00 — 03:00"
    nightPrice: number;
    endNote: string;
  };
  /** Real photo available today, or null when there isn't one yet (Lo
   * Nuestro's own room photo is still pending — the dossier's own mockup
   * showed a "PRÓXIMAMENTE..." placeholder in its place). */
  photo: { src: string; alt: string } | null;
}

export const RENTAL_ROOMS: RentalRoom[] = [
  {
    id: "pocco",
    name: "Sala Pocco",
    capacity: 400,
    tagline: "La sala principal.",
    description:
      "Escenario, cabina, pista central y sonido de alto impacto para grandes celebraciones. Sonorización profesional e iluminación de espectáculo.",
    pricing: {
      dayLabel: "17:00 — 00:00",
      dayPrice: 120,
      nightLabel: "00:00 — 03:00",
      nightPrice: 150,
      endNote: "Fin máximo: 23:30 si hay sesión ese día · 03:00 si no hay sesión.",
    },
    photo: {
      src: "/assets/alquiler/pocco-sala-llena.jpg",
      alt: "Interior de la Sala POCCO con luces rojas y gente disfrutando",
    },
  },
  {
    id: "lo-nuestro",
    name: "Sala Lo Nuestro",
    capacity: 150,
    tagline: "La sala secundaria.",
    description:
      "Más íntima, más versátil. Cuando hay alquiler, la sala no abre al público — tu evento tiene el espacio en exclusiva absoluta, de la primera a la última hora.",
    pricing: {
      dayLabel: "12:00 — 00:00",
      dayPrice: 75,
      nightLabel: "00:00 — 03:00",
      nightPrice: 100,
      endNote: "Fin máximo: 03:00 · Disponible desde las 12:00 del mediodía.",
    },
    photo: null,
  },
];

export const RENTAL_INCLUDES = [
  { title: "Limpieza incluida", copy: "Limpieza completa de la sala. Sin costes adicionales al finalizar." },
  { title: "Vasos incluidos", copy: "Os incluimos los vasos para que no tengas que traerlos tú." },
  { title: "Hielo ilimitado", copy: "Hielo incluido en el precio para que no tengas que cargar ni preocuparte por ello." },
];

export interface CateringMenu {
  id: string;
  price: number;
  groups: { label: string; options: string[] }[];
}

// Full real menus from the site owner's own catering dossier — kept
// complete (not summarized) since this is the actual offer a visitor
// would be choosing between, not marketing copy.
export const CATERING_MENUS: CateringMenu[] = [
  {
    id: "Menú 01",
    price: 15.5,
    groups: [
      {
        label: "2 Bocadillos — elige entre:",
        options: [
          "Fajita de pavo, crema y canónigos",
          "Mini chapata patata + embutido",
          "Mini burguer clásica",
          "Brioch relleno de ternera asada",
          "Bollito brascada",
        ],
      },
      {
        label: "1 Chupito — elige entre:",
        options: [
          "Bocaditos de solomillo con salsa pimienta",
          "Gambón con agridulce",
          "Solomillo de pollo con salsa de soja",
          "Brocheta de tomate cherry, mozzarella y albahaca",
        ],
      },
      {
        label: "1 Cucharita — elige entre:",
        options: [
          "Con croqueta (carrillada, cocido, ibérico)",
          "Con bolita de foie y crema suave",
          "Con bolita de salmón y atún fresco",
          "Con bolita de pollo y salsa agridulce",
        ],
      },
      {
        label: "1 Tradicional — elige entre:",
        options: ["Tortilla de patatas", "Ensaladilla rusa o de marisco"],
      },
      {
        label: "2 De Mahori — elige entre:",
        options: ["Taco empanada", "Taco pizza", "Empanadillas", "Tartaleta quiche", "Focaccia rellena"],
      },
    ],
  },
  {
    id: "Menú 02",
    price: 18.5,
    groups: [
      {
        label: "3 Bocadillos — elige entre:",
        options: [
          "Fajita de pavo, crema y canónigos",
          "Mini chapata patata + embutido",
          "Mini burguer clásica",
          "Brioch relleno de ternera asada",
          "Bollito brascada",
        ],
      },
      {
        label: "1 Chupito — elige entre:",
        options: [
          "Bocaditos de solomillo con salsa pimienta",
          "Gambón con agridulce",
          "Solomillo de pollo con salsa de soja",
          "Brocheta de tomate cherry, mozzarella y albahaca",
        ],
      },
      {
        label: "2 Cucharitas — elige entre:",
        options: [
          "Con croqueta (carrillada, cocido, ibérico)",
          "Con bolita de foie y crema suave",
          "Con bolita de salmón y atún fresco",
          "Con bolita de pollo y salsa agridulce",
        ],
      },
      {
        label: "1 Tradicional — elige entre:",
        options: ["Tortilla de patatas", "Ensaladilla rusa o de marisco"],
      },
      {
        label: "2 De Mahori — elige entre:",
        options: ["Taco empanada", "Taco pizza", "Empanadillas", "Tartaleta quiche", "Focaccia rellena"],
      },
    ],
  },
  {
    id: "Menú 03",
    price: 20.5,
    groups: [
      {
        label: "2 Bocadillos — elige entre:",
        options: [
          "Fajita de pavo, crema y canónigos",
          "Mini chapata patata + embutido",
          "Mini burguer clásica",
          "Brioch relleno de ternera asada",
          "Bollito brascada",
        ],
      },
      {
        label: "1 Chupito — elige entre:",
        options: [
          "Bocaditos de solomillo con salsa pimienta",
          "Gambón con agridulce",
          "Solomillo de pollo con salsa de soja",
          "Brocheta de tomate cherry, mozzarella y albahaca",
        ],
      },
      {
        label: "2 Cucharitas — elige entre:",
        options: [
          "Con croqueta (carrillada, cocido, ibérico)",
          "Con bolita de foie y crema suave",
          "Con bolita de salmón y atún fresco",
          "Con bolita de pollo y salsa agridulce",
        ],
      },
      {
        label: "1 Tradicional — elige entre:",
        options: ["Tortilla de patatas", "Ensaladilla rusa o de marisco"],
      },
      {
        label: "2 De Mahori — elige entre:",
        options: ["Taco empanada", "Taco pizza", "Empanadillas", "Tartaleta quiche", "Focaccia rellena"],
      },
      {
        label: "A elegir entre:",
        options: [
          "½ ración de Paella Valenciana o Senyoret",
          "½ ración de solomillo o secreto ibérico con guarnición",
        ],
      },
    ],
  },
];

export const CATERING_NOTE =
  "Extras disponibles: Tabla de jamón y quesos desde +2,50€/pers. · Postre desde +0,60€/pers. · Menú 100% personalizable bajo petición. También puedes traer tu propia comida y bebida.";

export const RENTAL_EXTRAS = [
  {
    label: "Servicio musical",
    title: "DJ profesional",
    copy: "Todos los géneros: house, techno, reggaeton, comercial, flamenco fusión y más. El DJ no tiene que estar toda la duración del alquiler — tú decides cuántas horas quieres música en directo.",
  },
  {
    label: "Bebidas",
    title: "Alcohol a precio de fábrica",
    copy: "Puedes traer tu propia bebida sin problema. Si prefieres que nos encarguemos, pídenos el dossier de precios de alcohol y te lo hacemos llegar por WhatsApp.",
  },
];

export const RENTAL_ACCESS_ITEMS = [
  {
    title: "Decoración y ambientación",
    copy: "Montad vuestros elementos decorativos, centros de mesa, photocall o cualquier detalle.",
  },
  {
    title: "Mesas, sillas y mobiliario",
    copy: "Si traéis mobiliario propio, tenéis tiempo para organizarlo a vuestro gusto.",
  },
  {
    title: "Depositar la bebida y comida",
    copy: "Dejad vuestra bebida o comida el día antes para tenerlo todo listo desde el primer minuto.",
  },
];

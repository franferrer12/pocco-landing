# 📋 Documentación Completa - POCCO Club Website

**Última actualización:** 27 de enero de 2026

---

## 📁 Información del Servidor

### Acceso FTP
- **Host:** 194.164.74.18
- **Usuario:** u381629691
- **Password:** /=kMj=rz9$]4.]-
- **Password URL-encoded:** %2F%3DkMj%3Drz9%24%5D4.%5D-
- **Archivo principal:** `/domains/pocco.club/public_html/index.html`

### Acceso WordPress
- **URL Admin:** https://pocco.club/wp-admin
- **Usuario:** poccotheclub@gmail.com
- **Password:** iRqs Zft0 UeDy Ip4l z8j0 gtCf

### Caché
- **Sistema:** LiteSpeed Cache
- **Purgar caché:** `curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"`

---

## 🎯 Estructura del Proyecto

### Arquitectura
- **Tipo:** Landing page con calendario de eventos
- **Frontend:** HTML, CSS, JavaScript vanilla
- **Backend:** WordPress (solo para gestión de contenido)
- **Hosting:** Hostinger con LiteSpeed

### Componentes Principales

#### 1. **Hero Section**
- Imagen de fondo: `https://i.imgur.com/NJ6eZTK.jpeg`
- CTA principal: "Próximos eventos"
- Scroll suave a calendario

#### 2. **Sección "Próxima Semana"**
- Muestra eventos de lunes a domingo de la **semana actual** (usa `thisMonday`)
- Botones dinámicos:
  - Eventos futuros: "Comprar entradas"
  - Eventos pasados: "Ver detalles"
- Mensaje centrado: "No hay eventos esta semana" cuando no hay eventos (usa `grid-column: 1 / -1`)

#### 3. **Calendario de Eventos**
- Navegación por meses
- Punto rojo en eventos pasados
- Sistema de detección: evento pasado = después de las 07:00 AM del día siguiente
- Responsive: se adapta a todas las pantallas

#### 4. **Sección VIP**
- 3 tipos de reserva:
  - VIP Zona
  - **VIP Cabina** (destacada - "MÁS POPULAR")
  - VIP Botella
- Scroll horizontal en mobile
- Auto-scroll a VIP Cabina en mobile

#### 5. **Footer**
- Copyright: © 2026 POCCO CLUB (en mayúsculas)
- Información de contacto
- Enlaces a políticas legales:
  - Política de privacidad: `/politica-de-privacidad`
  - Aviso legal: `/aviso-legal`
  - Política de cookies: `/politica-de-cookies`

---

## 🎨 Sistema de Diseño

### Colores (CSS Variables)
```css
--color-primary: #791f22;           /* Rojo POCCO */
--color-primary-rgb: 121, 31, 34;
--color-bg: #000000;                /* Fondo negro */
--color-elevated-1: #1c1c1e;
--color-label-primary: rgba(255, 255, 255, 1);
--color-label-secondary: rgba(235, 235, 245, 0.6);
```

### Tipografía
- **Fuente:** Inter (Google Fonts)
- **Fallback:** -apple-system, BlinkMacSystemFont, SF Pro Display

### Escalas
```css
/* Font sizes */
--font-largetitle: 34px;
--font-title1: 28px;
--font-headline: 17px;
--font-body: 17px;
--font-footnote: 13px;

/* Spacing */
--space-8: 8px;
--space-16: 16px;
--space-24: 24px;
--space-48: 48px;

/* Border radius */
--radius-small: 10px;
--radius-medium: 14px;
--radius-large: 18px;
```

---

## 📱 Sistema Responsive

### Breakpoints
- **Mobile:** < 767px
- **Tablet:** 768px - 1023px
- **Desktop:** > 1024px

### Adaptaciones Mobile
1. **Calendario:**
   - Font-size: `clamp(14px, 3.5vw, 17px)`
   - Gap: `clamp(4px, 1.5vw, 8px)`
   - Border-radius: `clamp(8px, 2vw, 14px)`

2. **VIP Cards:**
   - Scroll horizontal
   - 85% de ancho cada card
   - Auto-scroll a "VIP Cabina"

3. **Upcoming Events:**
   - Cards en columna
   - Botones full-width

---

## 🎫 Sistema de Eventos

### Estructura de Datos
```javascript
var eventos = [
    {
        fecha: '2025-12-06',
        titulo: 'REGGAETON OLD SCHOOL 06.12',
        descripcion: 'Reggaeton clásico',
        imagen: 'https://i.imgur.com/URL.jpeg',
        enlaceEntradas: 'https://www.fourvenues.com/...'
    }
];
```

### Lógica de Estados

#### Evento Pasado
```javascript
// Un evento es "pasado" si ya pasaron las 07:00 AM del día siguiente
var eventDate = new Date(event.fecha);
var nextDay = new Date(eventDate);
nextDay.setDate(nextDay.getDate() + 1);
nextDay.setHours(7, 0, 0, 0);

var isPastEvent = now >= nextDay;
```

#### Clases CSS
- `.has-event` - Día con evento (inicial)
- `.past-event` - Evento pasado (tiene punto rojo)
- `.future-event` - Evento futuro
- `.current-day` - Día actual

---

## 🔧 Funciones JavaScript Principales

### 1. `renderCalendar()`
Renderiza el calendario completo con todos los meses desde noviembre 2025.

### 2. `renderUpcomingEvents()`
Muestra eventos de la próxima semana (lunes a domingo).

**Lógica de botones:**
```javascript
if (isPastEvent) {
    // "Ver detalles" → scroll al evento
} else {
    // "Comprar entradas" → abre modal
}
```

### 3. `forceRedDotsOnPastEvents()`
Marca eventos como pasados y agrega la clase `.past-event`.

### 4. `openTicket(index)`
Abre el modal de compra de entradas (iframe de FourVenues).

### 5. `openEventPopup(event)`
Muestra popup informativo para eventos pasados.

---

## 🎯 Modal de Compra de Entradas

### Sistema
- **Proveedor:** FourVenues
- **Tipo:** iframe modal
- **Tamaño:** Responsive
  - Desktop: 90% viewport
  - Mobile: calc(100vh - 20px)

### HTML del Modal
```html
<div class="ticket-modal" id="ticketModal">
    <div class="ticket-modal-content">
        <button class="ticket-modal-close">×</button>
        <div class="ticket-modal-loader">
            Cargando entradas...
        </div>
        <iframe id="ticketModalIframe"></iframe>
    </div>
</div>
```

### Funcionalidad
1. Click en "Comprar entradas"
2. Se abre modal
3. Muestra loader
4. Carga iframe de FourVenues
5. Timeout de seguridad (10s) para ocultar loader

---

## 📊 SEO y Metadatos

### Meta Tags
```html
<title>POCCO CLUB - De lo bueno, POCCO</title>
<meta name="description" content="De lo bueno, POCCO. No necesitas mucho para pasarlo bien: las mejores fiestas, los mejores eventos, la mejor música en Alzira.">
<meta name="keywords" content="POCCO, de lo bueno poco, club nocturno Alzira, discoteca Valencia">
```

### Open Graph
```html
<meta property="og:title" content="POCCO CLUB - De lo bueno, POCCO">
<meta property="og:image" content="https://i.imgur.com/1v3GTYt.jpeg">
<meta property="og:url" content="https://pocco.club/">
```

### Datos Estructurados (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "NightClub",
  "name": "POCCO Club",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Alzira",
    "addressRegion": "Valencia"
  }
}
```

---

## 🐛 Problemas Resueltos

### 1. Doble Punto Rojo en Calendario (21/12/2024)
**Problema:** Aparecían 2 puntos rojos en eventos pasados

**Causa:**
- Punto CSS: `.past-event::after`
- Punto JavaScript: `<span class="forced-red-dot">•</span>`

**Solución:** Eliminado el código JavaScript que creaba el `<span>` dinámico
```javascript
// CÓDIGO ELIMINADO:
let dot = document.createElement('span');
dot.className = 'forced-red-dot';
dayElement.appendChild(dot);
```

### 2. Error de Sintaxis JavaScript (21/12/2024)
**Error:** `Uncaught SyntaxError: missing ) after argument list`

**Causa:** Llave `}` extra después de eliminar código del punto

**Solución:** Eliminada la llave extra y ajustada la estructura del código

### 3. Calendario No Responsive (21/12/2024)
**Problema:** Números muy grandes en móviles pequeños

**Solución:** CSS responsive con `clamp()`
```css
.calendar-day {
    font-size: clamp(14px, 3.5vw, 17px);
    gap: clamp(4px, 1.5vw, 8px);
}
```

### 4. Botones CTA Incorrectos (21/12/2024)
**Problema:** Todos los eventos de "Próxima semana" mostraban "Ver detalles"

**Solución:** Lógica dinámica para decidir el botón según fecha
```javascript
if (isPastEvent) {
    cardHTML += 'Ver detalles';
} else {
    cardHTML += 'Comprar entradas';
}
```

### 5. Error nextMonday is not defined (13/01/2026)
**Problema:** `ReferenceError: nextMonday is not defined` en línea 4576

**Causa:** Quedaba una referencia a `nextMonday` después de cambiar la lógica a `thisMonday`

**Solución:** Reemplazar todas las referencias:
```javascript
// Antes:
nextMonday.setHours(0, 0, 0, 0);
nextSunday.setHours(23, 59, 59, 999);

// Después:
thisMonday.setHours(0, 0, 0, 0);
thisSunday.setHours(23, 59, 59, 999);
```

### 6. Mensaje "No hay eventos esta semana" Descuadrado (13/01/2026)
**Problema:** El mensaje aparecía desalineado a la izquierda en desktop

**Causa:** La grid tenía múltiples columnas y el mensaje solo ocupaba una

**Solución:** Usar `grid-column: 1 / -1` para abarcar todas las columnas
```javascript
container.innerHTML = '<div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 24px; text-align: center;"><p>No hay eventos esta semana</p></div>';
```

### 7. Footer Copyright - Año y Mayúsculas (13/01/2026)
**Cambios realizados:**
- Año actualizado: 2025 → 2026
- Texto en mayúsculas: "Pocco Club" → "POCCO CLUB"

**Resultado final:**
```html
<div class="footer-copyright">© 2026 POCCO CLUB</div>
```

### 8. Ajuste de Posición de Imágenes de Eventos (27/01/2026)
**Problema:** Las imágenes de los eventos mostraban la parte central en lugar de la superior

**Solución:** Añadido `object-position: top` al CSS
```css
.upcoming-card-image {
    object-fit: cover !important;
    object-position: top !important;  /* NUEVO */
}
```

**Resultado:** Las imágenes ahora muestran la parte superior, donde suele estar la información importante de los flyers

### 9. Nuevos Eventos Añadidos - Enero 2026 (27/01/2026)
**Eventos agregados:**

1. **24 de Enero - Un POCCO de flamenco (Tardeo)**
   - ID: 53545
   - Horario: 17:30 - 23:59
   - Nota: Imagen inicialmente cambiada y luego revertida a 2zwJUE87ASDz.jpg

2. **24 de Enero - Pocco Club (Noche)**
   - ID: 53569
   - Horario: 23:59 - 6:30

3. **31 de Enero - POCCO IS CALLING vol.2 by: Alonso Chover**
   - ID: 53689

**Total eventos activos en enero 2026:** 4 eventos

---

## 🚀 Comandos Útiles

### Subir Archivo al Servidor
```bash
PASS_ENCODED="%2F%3DkMj%3Drz9%24%5D4.%5D-"
HOST="194.164.74.18"
USER="u381629691"

curl -s --ftp-pasv -T /tmp/archivo.html \
  "ftp://$USER:$PASS_ENCODED@$HOST/domains/pocco.club/public_html/index.html"
```

### Purgar Caché
```bash
curl -s -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"
```

### Descargar Archivo Actual
```bash
curl -s "https://pocco.club/" -o /tmp/pocco-actual.html
```

---

## 📝 Workflow de Desarrollo

### 1. Hacer Cambios
```bash
# Descargar archivo actual
curl -s "https://pocco.club/" -o /tmp/pocco.html

# Hacer modificaciones en /tmp/pocco.html

# Validar JavaScript (opcional)
node -c /tmp/validate.js
```

### 2. Subir Cambios
```bash
# Subir al servidor
curl -s --ftp-pasv -T /tmp/pocco.html \
  "ftp://u381629691:%2F%3DkMj%3Drz9%24%5D4.%5D-@194.164.74.18/domains/pocco.club/public_html/index.html"

# Purgar caché
curl -s -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"

# Esperar 2-3 segundos
sleep 3

# Verificar cambios
curl -s "https://pocco.club/" | grep "tu-cambio"
```

---

## 🎨 Assets y Recursos

### Imágenes
- **Logo/Hero:** `https://i.imgur.com/NJ6eZTK.jpeg`
- **Open Graph:** `https://i.imgur.com/1v3GTYt.jpeg`
- **Eventos:** URLs individuales en array `eventos`

### Fuentes
- **Google Fonts:** Inter (weights: 300, 400, 500, 600, 700)
- **Icons:** Line Awesome 1.3.0

### CDNs
```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">

<!-- Line Awesome Icons -->
<link href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">

<!-- Animate.css -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
```

---

## 🔒 Seguridad

### Políticas Legales
- ✅ Política de privacidad
- ✅ Aviso legal
- ✅ Política de cookies

### HTTPS
- ✅ SSL activo en todo el sitio

### Optimizaciones Instagram
```css
/* Desactivar animaciones en Instagram WebView */
html.instagram-browser {
    scroll-behavior: auto !important;
}
html.instagram-browser * {
    animation: none !important;
    transition: none !important;
}
```

---

## 📈 Optimizaciones de Rendimiento

### 1. Preconnect a Dominios de Venta
```html
<link rel="preconnect" href="https://venta.enterticket.es">
<link rel="preconnect" href="https://www.fourvenues.com">
```

### 2. Lazy Loading de Iframes
Solo se carga cuando el usuario hace click en "Comprar entradas"

### 3. Animaciones Condicionales
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 🎯 Próximas Mejoras Sugeridas

1. **Sistema de Gestión de Eventos**
   - Panel admin para añadir/editar eventos sin tocar código
   - Integración con WordPress Custom Post Types

2. **Analytics**
   - Google Analytics 4
   - Tracking de conversiones de venta

3. **Newsletter**
   - Sistema de suscripción
   - Notificaciones de nuevos eventos

4. **Sistema de Reservas VIP**
   - Formulario de contacto directo
   - Integración con sistema de reservas

5. **PWA (Progressive Web App)**
   - Instalable en móvil
   - Funcionamiento offline

---

## 📞 Contacto y Soporte

**Desarrollador:** Fran Ferrer
**Proyecto:** POCCO Club Website
**Fecha inicio:** Noviembre 2024
**Última actualización:** 13 Enero 2026

---

## 📅 Eventos Actuales

### Eventos Activos (Enero 2026)

#### 17 de Enero 2026 - POCCO CLUB
- Descripción: Mama hoy salgo solo un POCCO
- Imagen: https://d31tcnbxvxtafg.cloudfront.net/images/events/evzkHZ4WeM6C.jpg
- Proveedor: EnterTicket (ID: 53277)
- Estado: ✅ Activo

#### 24 de Enero 2026 - Un POCCO de flamenco (Tardeo)
- Descripción: Tardeo de 17:30 a 23:59
- Imagen: https://d31tcnbxvxtafg.cloudfront.net/images/events/2zwJUE87ASDz.jpg
- Proveedor: EnterTicket (ID: 53545)
- Estado: ✅ Activo
- Nota: Imagen revertida de 5Pv8lJQ4uSRz.jpg a 2zwJUE87ASDz.jpg el 27/01/2026

#### 24 de Enero 2026 - Pocco Club (Noche)
- Descripción: Sábado 24 enero de 23:59 a 6:30
- Imagen: https://d31tcnbxvxtafg.cloudfront.net/images/events/H7tLKgA7BO4h.jpg
- Proveedor: EnterTicket (ID: 53569)
- Estado: ✅ Activo

#### 31 de Enero 2026 - POCCO IS CALLING vol.2 by: Alonso Chover
- Descripción: Sábado 31 enero
- Imagen: https://d31tcnbxvxtafg.cloudfront.net/images/events/GEQBVe6xMkrP.jpg
- Proveedor: EnterTicket (ID: 53689)
- Estado: ✅ Activo

### Último Evento Añadido
- **Fecha:** 27/01/2026
- **Evento:** POCCO IS CALLING vol.2 by: Alonso Chover - 31 de enero
- **Método:** Añadido manualmente al array de eventos

---

## 📄 Licencia

Proyecto privado - POCCO Club
Todos los derechos reservados © 2026

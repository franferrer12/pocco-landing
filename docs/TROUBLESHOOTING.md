# 🔧 Troubleshooting - Solución de Problemas

## 🚨 Problemas Comunes y Soluciones

### 1. El Evento No Aparece en el Calendario

#### Síntomas:
- Agregaste un evento pero no se ve en el calendario
- El día no muestra el punto rojo

#### Posibles Causas y Soluciones:

**A) Caché de LiteSpeed no limpiada**
```bash
# Solución: Limpiar caché 2 veces
curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"
sleep 1
curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"
```

**B) El navegador tiene caché**
- Abre en modo incógnito (Ctrl+Shift+N)
- O recarga con Ctrl+Shift+R

**C) El post_type no es correcto**
```sql
-- Verificar en la base de datos
SELECT ID, post_title, post_type, post_status
FROM wp_posts
WHERE ID = [ID_DEL_EVENTO];

-- Debería ser:
-- post_type: 'tribe_events'
-- post_status: 'publish'
```

**D) La fecha está en formato incorrecto**
```sql
-- Verificar metadatos
SELECT meta_key, meta_value
FROM wp_postmeta
WHERE post_id = [ID_DEL_EVENTO]
AND meta_key = '_EventStartDate';

-- Formato correcto: 'YYYY-MM-DD HH:MM:SS'
-- Ejemplo: '2025-12-31 23:00:00'
```

**E) El evento está fuera del rango visible**
- El calendario muestra desde 2 meses antes del mes actual
- Verifica que la fecha no sea muy antigua
- Navega al mes correcto con los botones ← →

---

### 2. No Aparece el Punto Rojo

#### Síntomas:
- El evento existe pero no tiene el indicador visual (punto rojo)

#### Soluciones:

**A) Verificar que el CSS esté presente**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Elements" o "Elementos"
3. Busca el CSS:
```css
.calendar-day.has-event::after {
    content: '';
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: #ff0000;
    border-radius: 50%;
    z-index: 2;
}
```

**B) Verificar que el día tenga la clase correcta**
1. En la consola (F12), busca el día del evento
2. Debería tener: `class="calendar-day has-event"`
3. Y el atributo: `data-event='{"title":"...","description":"..."}'`

**C) Error de JavaScript**
1. Abre la consola (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Si hay errores, el JavaScript puede estar roto

**Solución si el código está roto**:
```bash
# Restaurar desde backup
# Ver: /Users/franferrer/pocco-web/backups/README.md
```

---

### 3. El Calendario No Muestra el Mes Correcto

#### Síntomas:
- Al navegar entre meses, no cambia
- Los botones ← → no funcionan

#### Soluciones:

**A) Verificar JavaScript en consola**
```javascript
// Ejecutar en consola del navegador (F12):
console.log(typeof showMonth);  // Debería ser: 'function'
console.log(currentDate);       // Debería mostrar una fecha
```

**B) Verificar que los botones tengan IDs correctos**
```html
<!-- Deben existir estos elementos: -->
<button id="prevMonth">←</button>
<button id="nextMonth">→</button>
<h2 id="currentMonth"></h2>
```

**C) Error en event listeners**
- Abre consola (F12)
- Busca errores de JavaScript
- Verifica que no haya errores de sintaxis

---

### 4. El Popup No Se Abre al Hacer Clic

#### Síntomas:
- Al hacer clic en un día con evento, no pasa nada
- O se abre pero está vacío

#### Soluciones:

**A) Verificar que el atributo data-event existe**
```javascript
// En consola (F12):
document.querySelectorAll('.calendar-day.has-event').forEach(day => {
    console.log(day.getAttribute('data-event'));
});
```

**B) Verificar función showEventPopup**
```javascript
// En consola (F12):
console.log(typeof showEventPopup);  // Debería ser: 'function'
```

**C) Verificar estructura del popup en HTML**
```html
<!-- Debe existir: -->
<div id="eventPopup" class="event-popup">
    <div class="event-popup-content">
        <span class="event-popup-close">×</span>
        <h3 id="popupTitle"></h3>
        <p id="popupDescription"></p>
        <p id="popupTime"></p>
    </div>
</div>
```

---

### 5. Los Botones de Navegación Se Quedan en Color

#### Síntomas:
- Los botones ← → se quedan rojos después de hacer clic
- No vuelven a su color normal

#### Solución:

**Verificar que el CSS tenga estos estados**:
```css
/* Hover - Solo cuando el cursor está encima */
.calendar-nav-button:hover:not(:active) {
    background: #ff0000;
    border-color: #ff0000;
    transform: scale(1.1);
}

/* Active - Mientras se presiona */
.calendar-nav-button:active {
    background: var(--color-elevated-2) !important;
    border-color: var(--color-separator) !important;
    transform: scale(0.95);
}

/* Focus - Después de hacer clic */
.calendar-nav-button:focus {
    background: var(--color-elevated-2) !important;
    border-color: var(--color-separator) !important;
    outline: none;
}
```

**Verificar JavaScript de blur**:
```javascript
document.querySelectorAll('.calendar-nav-button').forEach(function(button) {
    button.addEventListener('click', function() {
        setTimeout(function() {
            button.blur();
        }, 100);
    });
});
```

---

### 6. La Sección VIPs No Hace Scroll en Móvil

#### Síntomas:
- En móvil, no se posiciona en el VIP recomendado (Cabina)
- Muestra el primer VIP (Tarima) en lugar del del centro

#### Solución:

**A) Verificar que el código esté presente**:
```javascript
function scrollToFeaturedVIP() {
    if (window.innerWidth <= 768) {
        const vipContainer = document.querySelector('.vip-cards');
        if (vipContainer) {
            const featuredCard = vipContainer.querySelector('.vip-card.featured');
            if (featuredCard) {
                setTimeout(function() {
                    featuredCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }, 300);
            }
        }
    }
}
scrollToFeaturedVIP();
```

**B) Verificar que el VIP tenga la clase `.featured`**:
```html
<div class="vip-card featured">VIP Cabina (recomendado)</div>
```

**C) Probar manualmente en consola**:
```javascript
// En móvil, ejecutar en consola (F12):
document.querySelector('.vip-card.featured').scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
});
```

---

### 7. El Punto Rojo Está Mal Posicionado

#### Síntomas:
- El punto aparece encima del número
- O muy lejos del número
- O no se ve en móvil

#### Solución:

**Ajustar la posición en CSS**:
```css
.calendar-day.has-event::after {
    top: 75%;  /* Ajustar este valor */
    /* 0% = arriba, 100% = abajo */
}

/* Móvil */
@media (max-width: 768px) {
    .calendar-day.has-event::after {
        top: 65%;  /* Ajustar para móvil */
        width: 6px;
        height: 6px;
    }
}
```

**Valores recomendados**:
- Desktop: `top: 75%` (debajo del número con espacio)
- Móvil: `top: 65%` (más cerca en pantallas pequeñas)

---

### 8. Aparecen Dos Puntos (Blanco y Rojo)

#### Síntomas:
- Se ven dos indicadores en cada día con evento

#### Solución:

**Eliminar el punto blanco antiguo**:
1. Buscar en el CSS de la página 198
2. Eliminar este código si existe:
```css
/* ELIMINAR ESTE CÓDIGO */
.calendar-day.has-event::after {
    content: '•';
    position: absolute;
    top: 2px;
    right: 4px;
    font-size: 18px;
    color: white;
}
```

3. Limpiar la caché

---

## 🔍 Herramientas de Debugging

### Consola del Navegador (F12)

**Ver errores de JavaScript**:
```javascript
// Pestaña "Console"
// Buscar mensajes en rojo
```

**Inspeccionar elementos**:
```javascript
// Pestaña "Elements" o "Elementos"
// Click derecho → Inspeccionar
```

**Ver variables globales**:
```javascript
console.log(events);        // Lista de eventos
console.log(currentDate);   // Fecha actual del calendario
console.log(minDate);       // Fecha mínima visible
```

### MySQL - Consultas Útiles

```bash
# Conectar a la base de datos
mysql -h 127.0.0.1 -u u381629691_melFW -p u381629691_VGByx
```

```sql
-- Ver últimos eventos
SELECT ID, post_title, post_date, post_status
FROM wp_posts
WHERE post_type = 'tribe_events'
ORDER BY post_date DESC
LIMIT 10;

-- Ver metadatos de un evento
SELECT meta_key, meta_value
FROM wp_postmeta
WHERE post_id = 123;

-- Buscar eventos por fecha
SELECT p.ID, p.post_title, pm.meta_value as fecha
FROM wp_posts p
JOIN wp_postmeta pm ON p.ID = pm.post_id
WHERE p.post_type = 'tribe_events'
AND pm.meta_key = '_EventStartDate'
AND pm.meta_value LIKE '2025-12%'
ORDER BY pm.meta_value;

-- Ver tamaño del contenido de la página 198
SELECT ID, LENGTH(post_content) as size_bytes
FROM wp_posts
WHERE ID = 198;
```

### Verificar Cache de LiteSpeed

```bash
# Limpiar caché
curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"

# Verificar estado (si tienes acceso al plugin)
# WordPress Admin → LiteSpeed Cache → Dashboard
```

---

## 📋 Checklist de Verificación Post-Cambio

Después de cualquier modificación, verifica:

### Funcionalidad Básica:
- [ ] El calendario muestra el mes actual correctamente
- [ ] Los botones ← → cambian de mes
- [ ] Los días con eventos tienen punto rojo
- [ ] Al hacer clic en un día, se abre el popup
- [ ] El popup muestra título, descripción y hora
- [ ] El popup se cierra correctamente (X o clic fuera)

### Indicadores Visuales:
- [ ] Punto rojo posicionado debajo del número del día
- [ ] Tamaño correcto del punto (8px desktop, 6px móvil)
- [ ] Color rojo (#ff0000) correcto
- [ ] No hay puntos blancos duplicados
- [ ] El día actual tiene fondo gris

### Botones de Navegación:
- [ ] Se ponen rojos al hacer hover
- [ ] Vuelven a color normal después del clic
- [ ] No se quedan "pegados" en ningún color
- [ ] Animación de scale funciona (hover: 1.1, active: 0.95)

### Sección VIPs:
- [ ] Se ven los 3 VIPs (Tarima, Cabina, Supervip)
- [ ] En desktop, se ven los 3 lado a lado
- [ ] En móvil (≤768px), es un carrusel deslizable
- [ ] En móvil, scroll automático al VIP del centro (Cabina)
- [ ] El VIP recomendado tiene estilo especial (clase .featured)

### Móvil (≤768px):
- [ ] El calendario se adapta correctamente
- [ ] Los puntos rojos son más pequeños (6px)
- [ ] Los puntos están bien posicionados
- [ ] El popup se muestra correctamente
- [ ] El scroll de VIPs funciona
- [ ] Los botones son fáciles de tocar
- [ ] No hay elementos cortados o superpuestos

### Performance:
- [ ] La página carga en menos de 3 segundos
- [ ] No hay errores en la consola (F12)
- [ ] Las animaciones son suaves
- [ ] El scroll es fluido

---

## 🆘 Proceso de Recuperación de Emergencia

Si todo falla y nada funciona:

### Paso 1: Identificar el Problema

```bash
# Verificar que la página 198 existe
curl -s "https://pocco.club/eventos" | grep -c "calendar-container"
# Si devuelve 0, la página está rota
```

### Paso 2: Restaurar desde Backup

```bash
# 1. Buscar backup más reciente
ls -lt /Users/franferrer/pocco-web/backups/

# 2. Usar script de restauración
# Ver: /Users/franferrer/pocco-web/backups/README.md
```

### Paso 3: Restaurar desde Revisiones de WordPress

```bash
USER="poccotheclub@gmail.com"
PASS="iRqs Zft0 UeDy Ip4l z8j0 gtCf"

# Ver revisiones disponibles
curl -s "https://pocco.club/wp-json/wp/v2/pages/198/revisions" \
  -u "$USER:$PASS" \
  | node -e "
    const data = JSON.parse(require('fs').readFileSync(0));
    data.forEach(r => console.log(r.id, r.date));
  "

# Restaurar revisión específica
REVISION_ID=12345  # Cambiar por ID de revisión

curl -X POST "https://pocco.club/wp-json/wp/v2/pages/198" \
  -u "$USER:$PASS" \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"$(curl -s https://pocco.club/wp-json/wp/v2/pages/198/revisions/$REVISION_ID -u $USER:$PASS | node -e 'console.log(JSON.parse(require(\"fs\").readFileSync(0)).content.raw)')\"}"
```

### Paso 4: Verificar Restauración

```bash
# Limpiar caché
curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"

# Abrir en navegador
open "https://pocco.club/eventos"
```

### Paso 5: Volver a Aplicar Cambios

Si restauraste a una versión antigua, necesitarás volver a aplicar los cambios:
1. Consulta `docs/CAMBIOS-REALIZADOS.md`
2. Aplica cada cambio uno por uno
3. Verifica después de cada cambio
4. Haz backup después de cada cambio exitoso

---

## 📞 Contacto y Ayuda

Si después de seguir esta guía todavía tienes problemas:

1. **Revisa los logs**: WordPress Admin → Herramientas → Salud del sitio
2. **Consulta la documentación**: `/Users/franferrer/pocco-web/docs/`
3. **Revisa los ejemplos**: `/Users/franferrer/pocco-web/scripts/ejemplos/`
4. **Crea un backup**: Antes de intentar cualquier solución drástica
5. **Documenta el error**: Capturas de pantalla, mensajes de error, etc.

---

**Última actualización**: 2025-12-09
**Versión**: 1.0

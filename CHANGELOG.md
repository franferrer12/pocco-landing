# Changelog - POCCO Club Website

## 2024-12-19 - Actualización de título y favicon

### Cambios realizados:
- ✅ Título actualizado a "POCCO CLUB - De lo bueno, POCCO"
- ✅ Favicon configurado con isotipo de POCCO
- ✅ Meta tags de redes sociales actualizados (og:title, twitter:title)
- ✅ Fix de scroll en popup de tickets (scroll instantáneo al cerrar)
- ✅ Punto rojo solo en eventos pasados del calendario
- ✅ Meta description optimizada para Alzira

### Archivos modificados:
- `index.html` - Versión en producción

### Assets:
- Favicon: https://i.imgur.com/KrcAxGk.png (isotipo POCCO)
- Imagen redes sociales: https://i.imgur.com/1v3GTYt.jpeg

### SEO:
- Meta description: "De lo bueno, POCCO. No necesitas mucho para pasarlo bien: las mejores fiestas, los mejores eventos, la mejor música en Alzira. POCCO Club, la sala de referencia. Porque de lo bueno, poco basta."
- Posicionamiento: Alzira (sala de referencia)

---

## Versiones anteriores

Ver carpeta `backups/` para versiones anteriores del sitio.

## 2024-12-21 - Sección "Esta semana" muestra próxima semana

### Cambios realizados:
- ✅ Modificada función `renderUpcomingEvents()` para mostrar eventos de la PRÓXIMA semana
- ✅ Cálculo automático del próximo lunes basado en el día actual
- ✅ Filtrado automático de eventos (lunes a domingo de la próxima semana)
- ✅ No requiere intervención manual - se actualiza automáticamente cada día

### Funcionamiento:
La sección "Esta semana" ahora muestra eventos de la próxima semana completa (lunes a domingo).

**Ejemplos:**
- Si hoy es sábado 21/12 → Muestra eventos del 23/12 al 29/12
- Si hoy es lunes 23/12 → Muestra eventos del 30/12 al 05/01
- Si hoy es domingo 29/12 → Muestra eventos del 30/12 al 05/01

### Código modificado:
```javascript
// Calcular el lunes de la PRÓXIMA semana
var dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
var daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
var nextMonday = new Date(today);
nextMonday.setDate(today.getDate() + daysUntilNextMonday);

// Filtrar eventos de la próxima semana
if (eventDate >= nextMonday && eventDate <= nextSunday) {
    upcomingEvents.push({...});
}
```

### Archivos modificados:
- `index.html` - Función `renderUpcomingEvents()` actualizada

---

## 2024-12-21 - Corrección del calendario en móvil

### Cambios realizados:
- ✅ Arreglado día actual que sobresalía en móvil (overflow: hidden)
- ✅ Confirmado que solo eventos pasados tienen punto rojo (.past-event::after)
- ✅ Eliminado punto blanco duplicado en eventos (.has-event::after)
- ✅ Optimizado espaciado del calendario en dispositivos móviles

### CSS modificado:
```css
.calendar-day.current-day {
    overflow: hidden !important;
    box-sizing: border-box !important;
}

@media (max-width: 767px) {
    .calendar-grid {
        gap: var(--space-4) !important;
    }

    .calendar-day {
        font-size: 14px !important;
        padding: 8px 4px !important;
    }
}
```

### Problemas corregidos:
1. **Día actual sobresaliendo**: Agregado `overflow: hidden` para evitar que el fondo gris del día actual (domingo 21) se salga del contenedor en móvil
2. **Punto rojo duplicado**: Verificado que solo `.past-event::after` tiene el punto rojo, sin duplicados
3. **Espaciado mobile**: Optimizado gap y padding para mejor visualización en pantallas pequeñas

---

# FIX: JavaScript Syntax Error - 11 Diciembre 2025

## Problema Original
Error de sintaxis JavaScript en línea 1760:
```
(index):1760 Uncaught SyntaxError: Invalid or unexpected token (at (index):1760:71)
```

## Causa Raíz
El evento "GLITXMAS 25.12" tenía una descripción con:
- Saltos de línea sin escapar
- HTML embebido con comillas
- Contenido largo que rompía el string literal de JavaScript

Cuando el script `/tmp/total-rebuild.php` generó el calendario, usó `addslashes()` que NO es suficiente para escapar correctamente strings JavaScript con saltos de línea.

## Solución Aplicada

### 1. Diagnóstico
- Identificado que línea 1760 del HTML renderizado contenía string sin cerrar
- La descripción del evento contenía HTML multilínea que rompía el JavaScript

### 2. Corrección
Creado `/tmp/fix-event-escaping.php` que:
- Extrae descripciones de eventos y elimina HTML con `strip_tags()`
- Normaliza espacios en blanco (reemplaza `\n`, `\r`, múltiples espacios)
- Trunca descripciones a 100 caracteres máximo
- **USA `json_encode()` para escapado correcto** en lugar de `addslashes()`

### 3. Verificación
```bash
node -c calendar-correct.js
✅ ¡SINTAXIS JAVASCRIPT COMPLETAMENTE VÁLIDA!
```

## Evento Corregido

**Antes (ROTO):**
```javascript
{ fecha: '2025-12-25', titulo: 'GLITXMAS 25.12', descripcion: 'Las tradiciones cambian pero, pero nunca se pierden.

<!-- EVENT FLYER -->
<div class="event-flyer">
  <img src="https://..." ...
```

**Después (CORRECTO):**
```javascript
{ fecha: "2025-12-25", titulo: "GLITXMAS 25.12", descripcion: "Las tradiciones cambian pero, pero nunca se pierden.", venue: "", hora: "23:00", link: "" }
```

## Componentes Verificados
✅ Array de eventos con escapado correcto
✅ Función `renderCalendar()`
✅ Función `showMonth()`
✅ Event listeners
✅ CSS punto rojo para eventos (`.calendar-day.has-event::after`)
✅ CSS día actual (`.current-day`)
✅ CSS botones navegación
✅ Scroll automático a VIP en móvil

## Backups Creados
- Servidor: `/tmp/backups_calendar/auto_backup_2025-12-11_15-45-32.html`
- Local: `/Users/franferrer/pocco-web/backups/backup_calendar_FIXED_2025-12-11_*.html`

## Lección Aprendida
**SIEMPRE usar `json_encode()` para generar valores JavaScript desde PHP**, nunca `addslashes()` para strings que pueden contener saltos de línea.

## Próximos Pasos
1. Visitar https://pocco.club/eventos en modo incógnito
2. Verificar que calendario se muestra correctamente
3. Verificar punto rojo en 25 de diciembre
4. Verificar día actual marcado en gris
5. Probar navegación entre meses

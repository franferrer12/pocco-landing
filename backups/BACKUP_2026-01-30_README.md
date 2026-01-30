# 💾 Backup - POCCO Club Website

**Fecha:** 30 de Enero de 2026, 14:52:25
**Archivo:** `backup_4-eventos-enero_2026-01-30_14-52-25.html`
**Tamaño:** 141 KB

---

## 📋 Contenido del Backup

### Eventos Incluidos (4 eventos de Enero 2026)

1. **17 de Enero 2026** - POCCO CLUB
   - Descripción: Mama hoy salgo solo un POCCO
   - Imagen: evzkHZ4WeM6C.jpg
   - EnterTicket ID: 53277

2. **24 de Enero 2026** - Un POCCO de flamenco (Tardeo)
   - Horario: 17:30 a 23:59
   - Imagen: 2zwJUE87ASDz.jpg (revertida)
   - EnterTicket ID: 53545

3. **24 de Enero 2026** - Pocco Club (Noche)
   - Horario: 23:59 a 6:30
   - Imagen: H7tLKgA7BO4h.jpg
   - EnterTicket ID: 53569

4. **31 de Enero 2026** - POCCO IS CALLING vol.2 by: Alonso Chover
   - Imagen: GEQBVe6xMkrP.jpg
   - EnterTicket ID: 53689

---

## ✨ Características Aplicadas

### CSS
- ✅ `object-position: top` en imágenes de eventos (muestra la parte superior)
- ✅ Footer: "© 2026 POCCO CLUB" (en mayúsculas)
- ✅ Sistema responsive completo
- ✅ Optimizaciones mobile (calendario, VIP cards)

### JavaScript
- ✅ Sección "Próxima Semana" usando `thisMonday` (semana actual)
- ✅ Botones dinámicos: "Comprar entradas" vs "Ver detalles"
- ✅ Sistema de detección de eventos pasados (07:00 AM día siguiente)
- ✅ Auto-scroll a VIP Cabina en mobile

---

## 🔧 Para Restaurar

```bash
# Copiar el backup al servidor
curl -s --ftp-pasv -T backups/backup_4-eventos-enero_2026-01-30_14-52-25.html \
  "ftp://u381629691:%2F%3DkMj%3Drz9%24%5D4.%5D-@194.164.74.18/domains/pocco.club/public_html/index.html"

# Purgar caché
curl -s -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"
```

---

## 📝 Notas

- Este backup fue creado después de añadir todos los eventos de enero 2026
- La imagen del evento "Un POCCO de flamenco" fue revertida a la original (2zwJUE87ASDz.jpg)
- El sitio está completamente funcional y optimizado
- Todos los enlaces de EnterTicket están verificados y activos

---

**Generado automáticamente** - POCCO Club Website Backup System

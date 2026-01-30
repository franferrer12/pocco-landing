# 🚀 Quick Start - Pocco Club

## Guía Rápida para Agregar un Evento

### Paso 1: Conectar al Panel de WordPress

```
URL: https://pocco.club/wp-admin/
```

### Paso 2: Ir a Eventos

1. En el menú lateral: **"Eventos"** → **"Añadir nuevo"**

### Paso 3: Rellenar Datos

- **Título**: Nombre del evento
- **Descripción**: Detalles
- **Fecha y hora**: Cuándo sucede
- **Publicar**

### Paso 4: Limpiar Caché

```bash
curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"
```

### Paso 5: Verificar

Abre en modo incógnito:
- https://pocco.club/eventos
- Busca el mes correcto
- Verifica el punto rojo en el día
- Haz clic para ver el popup
- Prueba en móvil

---

## ⚠️ Si Algo Sale Mal

1. **El evento no aparece**:
   - Limpia la caché (2 veces)
   - Abre en modo incógnito
   - Verifica que el post_type sea 'tribe_events'

2. **No hay punto rojo**:
   - Verifica que la fecha esté correcta
   - Revisa la consola del navegador (F12)
   - Limpia la caché

3. **El calendario no funciona**:
   - NO modifiques el código manualmente
   - Consulta `docs/CAMBIOS-REALIZADOS.md`
   - Restaura desde backup si es necesario

---

## 📚 Documentación Completa

- **README.md** - Resumen general
- **docs/ACCESOS.md** - Credenciales y accesos
- **docs/CAMBIOS-REALIZADOS.md** - Historial de cambios
- **docs/AGREGAR-EVENTOS.md** - Guía detallada
- **scripts/** - Templates y ejemplos
- **backups/** - Backups de seguridad

---

## 🔧 Comandos Útiles

### Limpiar Caché de LiteSpeed:
```bash
curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"
```

### Ver Eventos en Base de Datos:
```bash
mysql -h 127.0.0.1 -u u381629691_melFW -p u381629691_VGByx
```
```sql
SELECT ID, post_title, post_date
FROM wp_posts
WHERE post_type = 'tribe_events'
ORDER BY post_date DESC
LIMIT 10;
```

### Crear Backup:
```bash
curl -s "https://pocco.club/wp-json/wp/v2/pages/198" > backup_$(date +%Y%m%d).json
```

---

## 📞 Soporte

Si tienes dudas, consulta:
1. Este archivo (QUICK-START.md)
2. docs/AGREGAR-EVENTOS.md (guía detallada)
3. docs/CAMBIOS-REALIZADOS.md (ver qué código debe estar presente)

---

**Última actualización**: 2025-12-09

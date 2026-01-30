# 📅 Guía: Cómo Agregar Nuevos Eventos

## 🎯 Resumen

Esta guía explica el proceso real para agregar eventos a las webs de **POCCO Club** y **TRENDY The Party**.

Ambas webs funcionan con **HTML estático**, por lo que los eventos se agregan editando directamente el código HTML.

---

## 📋 Proceso para Agregar Eventos

### Paso 1: Proporcionar Información del Evento

El usuario debe proporcionar la siguiente información:

**Datos requeridos:**
- ✅ **Fecha del evento** (formato: DD/MM/YYYY o YYYY-MM-DD)
- ✅ **Nombre del evento** (ej: "POCCO IS CALLING vol.2")
- ✅ **Imagen del evento** (URL de la imagen o archivo local)
- ✅ **URL de EnterTicket** (enlace para comprar entradas)
- ⚠️ **Web destino** (POCCO o TRENDY)

**Datos opcionales:**
- Hora del evento (ej: "23:00h")
- Descripción adicional
- Información de DJs o artistas

**Ejemplo de mensaje para agregar evento:**

```
Agregar evento a POCCO:
- Fecha: 14 febrero 2025
- Nombre: San Valentín - La Noche del Amor
- Imagen: https://i.imgur.com/ejemplo.jpg
- EnterTicket: https://venta.enterticket.es/evento/12345
- Hora: 23:00h
```

### Paso 2: Edición del HTML

El sistema (Claude Code) edita el archivo HTML correspondiente:

**Para POCCO Club:**
- Archivo: `/Users/franferrer/pocco-web/sites/pocco/index.html`
- Servidor: `/domains/pocco.club/public_html/index.html`

**Para TRENDY:**
- Archivo: `/Users/franferrer/pocco-web/sites/trendy/index.html`
- Servidor: `/domains/pocco.club/public_html/trendy/index.html`

### Paso 3: Subida al Servidor

El archivo modificado se sube automáticamente al servidor vía FTP:

```bash
PASS_ENCODED="%2F%3DkMj%3Drz9%24%5D4.%5D-"
HOST="194.164.74.18"
USER="u381629691"

# Para POCCO
curl --ftp-pasv -T sites/pocco/index.html \
  "ftp://$USER:$PASS_ENCODED@$HOST/domains/pocco.club/public_html/index.html"

# Para TRENDY
curl --ftp-pasv -T sites/trendy/index.html \
  "ftp://$USER:$PASS_ENCODED@$HOST/domains/pocco.club/public_html/trendy/index.html"
```

### Paso 4: Verificación

Después de subir, verificar:

✅ **Para POCCO:** https://pocco.club/
✅ **Para TRENDY:** https://trendy.pocco.club/

**Checklist:**
- [ ] El evento aparece en el calendario
- [ ] La fecha es correcta
- [ ] La imagen se muestra correctamente
- [ ] El botón de compra funciona (enlace a EnterTicket)
- [ ] Se ve bien en móvil y desktop
- [ ] El color de la marca es correcto (rojo para POCCO, rosa para TRENDY)

---

## 🎨 Diferencias entre POCCO y TRENDY

| Característica | POCCO Club | TRENDY |
|----------------|------------|--------|
| **Color principal** | Rojo `#791f22` | Rosa magenta `#E91E8C` |
| **Público** | +18 años | +16 años |
| **Slogan** | "De lo bueno, POCCO" | "THE PARTY" |
| **URL** | https://pocco.club/ | https://trendy.pocco.club/ |
| **Archivo HTML** | `sites/pocco/index.html` | `sites/trendy/index.html` |
| **Servidor** | `public_html/index.html` | `public_html/trendy/index.html` |

---

## 🔧 Estructura del Código de Eventos

Cada evento en el HTML tiene esta estructura:

```javascript
{
    fecha: '2025-02-14',
    nombre: 'San Valentín - La Noche del Amor',
    imagen: 'https://i.imgur.com/ejemplo.jpg',
    enterticket: 'https://venta.enterticket.es/evento/12345',
    hora: '23:00h'
}
```

**Ubicación en el HTML:**
- Buscar el array `eventos = [...]` en el código JavaScript
- Los eventos se ordenan por fecha automáticamente
- El calendario detecta automáticamente los eventos y muestra puntos rojos en los días correspondientes

---

## ✅ Modificaciones Estéticas

Además de añadir eventos, se pueden hacer cambios estéticos:

### Para POCCO Club:

**Cambiar colores:**
- Buscar `--color-primary: #791f22` en el CSS
- Editar `/Users/franferrer/pocco-web/sites/pocco/index.html`

**Cambiar textos:**
- Buscar el texto a modificar en el HTML
- Reemplazar y guardar

**Subir cambios:**
```bash
curl --ftp-pasv -T sites/pocco/index.html \
  "ftp://$USER:$PASS_ENCODED@$HOST/domains/pocco.club/public_html/index.html"
```

### Para TRENDY:

**Cambiar colores:**
- Buscar `--color-primary: #E91E8C` en el CSS
- Editar `/Users/franferrer/pocco-web/sites/trendy/index.html`

**Cambiar textos:**
- Buscar el texto a modificar en el HTML
- Reemplazar y guardar

**Subir cambios:**
```bash
curl --ftp-pasv -T sites/trendy/index.html \
  "ftp://$USER:$PASS_ENCODED@$HOST/domains/pocco.club/public_html/trendy/index.html"
```

---

## 🚨 Importante

### ⚠️ Antes de Modificar:

1. **Hacer backup** del archivo HTML actual
   ```bash
   cp sites/pocco/index.html backups/BACKUP_pocco_$(date +%Y%m%d_%H%M%S).html
   cp sites/trendy/index.html backups/BACKUP_trendy_$(date +%Y%m%d_%H%M%S).html
   ```

2. **Probar en local** si es posible (abrir el HTML en el navegador)

3. **Verificar sintaxis** JavaScript si se editan eventos manualmente

### ✅ Después de Modificar:

1. **Verificar en el navegador** (modo incógnito para evitar caché)
2. **Probar en móvil y desktop**
3. **Verificar que los enlaces funcionan** (botones de compra, imágenes, etc.)
4. **Hacer commit a Git** si los cambios son importantes
   ```bash
   git add sites/pocco/index.html
   git commit -m "Agregar evento: [nombre del evento]"
   git push origin main
   ```

---

## 📱 Ejemplos de Eventos

### Ejemplo 1: Evento de POCCO Club

```javascript
{
    fecha: '2025-01-31',
    nombre: 'POCCO IS CALLING vol.2 by Alonso Chover',
    imagen: 'https://i.imgur.com/XYZ123.jpg',
    enterticket: 'https://venta.enterticket.es/evento/53689',
    hora: '23:59h'
}
```

### Ejemplo 2: Evento de TRENDY

```javascript
{
    fecha: '2025-02-14',
    nombre: 'San Valentín - La Noche de las Tentaciones',
    imagen: 'https://i.imgur.com/ABC456.jpg',
    enterticket: 'https://venta.enterticket.es/evento/54321',
    hora: '23:00h'
}
```

### Ejemplo 3: Evento de Tardeo (día completo)

```javascript
{
    fecha: '2025-01-24',
    nombre: 'Un POCCO de flamenco - Tardeo',
    imagen: 'https://i.imgur.com/DEF789.jpg',
    enterticket: 'https://venta.enterticket.es/evento/53545',
    hora: '17:30h - 23:59h'
}
```

---

## 🔄 Editar o Eliminar Eventos

### Editar Evento Existente

1. Abrir el archivo HTML correspondiente
2. Buscar el evento en el array `eventos = [...]`
3. Modificar los campos necesarios
4. Guardar y subir al servidor

### Eliminar Evento

1. Abrir el archivo HTML correspondiente
2. Buscar el evento en el array `eventos = [...]`
3. Eliminar el objeto completo del evento (incluir comas)
4. Guardar y subir al servidor

**Ejemplo de eliminación:**

Antes:
```javascript
eventos = [
    { fecha: '2025-01-17', nombre: 'Evento antiguo', ... },
    { fecha: '2025-01-24', nombre: 'Evento a eliminar', ... },  ← Eliminar esta línea
    { fecha: '2025-01-31', nombre: 'Evento futuro', ... }
]
```

Después:
```javascript
eventos = [
    { fecha: '2025-01-17', nombre: 'Evento antiguo', ... },
    { fecha: '2025-01-31', nombre: 'Evento futuro', ... }
]
```

---

## 📊 Archivos del Proyecto

### Estructura del Proyecto:

```
pocco-web/
├── sites/
│   ├── pocco/
│   │   └── index.html          # HTML de POCCO Club
│   └── trendy/
│       └── index.html          # HTML de TRENDY
├── assets/
│   ├── pocco/                  # Recursos de POCCO
│   └── trendy/                 # Recursos de TRENDY
│       ├── logo-trendy.png
│       ├── cartel-exams-break.png
│       └── cartel-san-valentin.png
├── docs/
│   ├── ACCESOS.md              # Credenciales FTP/DB
│   ├── AGREGAR-EVENTOS.md      # Esta guía
│   ├── CAMBIOS-REALIZADOS.md   # Historial
│   ├── TROUBLESHOOTING.md      # Solución de problemas
│   └── TRENDY.md               # Info de TRENDY
├── backups/                    # Backups de HTML
│   └── BACKUP_*.html
└── README.md                   # Documentación principal
```

---

## 💡 Tips y Mejores Prácticas

### ✅ Hacer:

- Proporcionar toda la información del evento de una vez
- Usar URLs de imágenes alojadas (Imgur, EnterTicket, etc.)
- Verificar que las URLs de EnterTicket funcionen antes de agregarlas
- Especificar claramente la web destino (POCCO o TRENDY)
- Revisar los eventos después de subirlos
- Hacer backup antes de cambios grandes

### ❌ No Hacer:

- No editar el HTML manualmente sin conocimientos técnicos
- No olvidar especificar la web destino
- No usar imágenes rotas o enlaces incorrectos
- No agregar eventos con fechas pasadas (a menos que sea intencional)
- No modificar código JavaScript sin verificar sintaxis

---

## 🆘 Solución de Problemas

### Problema: El evento no aparece

**Posibles causas:**
- El archivo no se subió correctamente al servidor
- Caché del navegador (probar en modo incógnito)
- Fecha en formato incorrecto

**Solución:**
1. Verificar que el archivo se subió: `curl -I https://pocco.club/`
2. Abrir en modo incógnito
3. Verificar formato de fecha: `YYYY-MM-DD`

### Problema: La imagen no se muestra

**Posibles causas:**
- URL de la imagen incorrecta
- Imagen eliminada del servidor original
- Problema de CORS

**Solución:**
1. Verificar que la URL funciona (abrir en navegador)
2. Subir la imagen a un servidor estable (Imgur, etc.)
3. Usar HTTPS en la URL de la imagen

### Problema: El botón de compra no funciona

**Posibles causas:**
- URL de EnterTicket incorrecta
- Evento no publicado en EnterTicket

**Solución:**
1. Verificar la URL en el navegador
2. Contactar con EnterTicket si el evento no está publicado

---

## 📞 Contacto y Ayuda

**Para agregar eventos:**
- Proporcionar la información del evento en el formato indicado
- Especificar claramente POCCO o TRENDY
- Incluir todos los datos necesarios (fecha, nombre, imagen, URL)

**Para modificaciones estéticas:**
- Describir el cambio deseado
- Especificar la web (POCCO o TRENDY)
- Proporcionar ejemplos si es necesario

**Archivos de referencia:**
- `ACCESOS.md` - Credenciales y accesos
- `TRENDY.md` - Información de TRENDY
- `TROUBLESHOOTING.md` - Solución de problemas técnicos

---

**Última actualización**: 2026-01-30
**Versión**: 2.0

**Cambios en esta versión:**
- Actualizado para reflejar el proceso real (edición directa de HTML)
- Añadida sección para TRENDY
- Eliminadas referencias a WordPress/PHP
- Simplificado el proceso de agregar eventos

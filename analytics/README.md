# 📊 POCCO Club - Sistema de Análisis de Google Analytics

## 🎯 Qué hace esto

Este sistema te permite **analizar automáticamente** las métricas de pocco.club desde la terminal, sin necesidad de entrar a Google Analytics cada vez.

Podrás ver:
- ✅ Qué eventos generan más clics en "Comprar entradas"
- ✅ Engagement de los usuarios (scroll, tiempo en página)
- ✅ Clics en redes sociales
- ✅ Usuarios activos y sesiones

## 🚀 Estado Actual

### ✅ Completado

1. **Google Analytics instalado**
   - ID: G-REG9BSZ0G1
   - Instalado en: https://pocco.club/

2. **Eventos de tracking implementados**
   - `view_ticket_modal` - Clics en "Comprar entradas"
   - `scroll_depth` - Scroll profundo (25%, 50%, 75%, 90%)
   - `time_on_page` - Tiempo en página (30s, 1m, 2m, 5m)
   - `social_click` - Clics en redes sociales
   - `calendar_click` - Clics en calendario
   - `outbound_link` - Enlaces externos

3. **Script de análisis creado**
   - Archivo: `pocco-analytics.js`
   - Funcionalidad: Dashboard completo de métricas

### ⚠️ Pendiente de Configuración

Para que el script funcione, necesitas:

1. **Crear credenciales de Google Cloud** (5 minutos)
2. **Descargar archivo credentials.json**
3. **Añadir Service Account a Google Analytics**

**👉 Sigue la guía:** [SETUP.md](./SETUP.md)

## 📁 Archivos

```
analytics/
├── README.md              # Este archivo
├── SETUP.md               # Guía paso a paso de configuración
├── pocco-analytics.js     # Script principal de análisis
└── credentials.json       # Credenciales de Google Cloud (PENDIENTE)
```

## 🎬 Quick Start

Una vez configurado (siguiendo [SETUP.md](./SETUP.md)):

```bash
cd /Users/franferrer/pocco-web/analytics
node pocco-analytics.js
```

Verás un dashboard con:
- 📊 Resumen general (usuarios, sesiones, páginas vistas)
- 🎫 Eventos con más clics en "Comprar entradas"
- 📈 Métricas de engagement
- 📱 Clics en redes sociales

## 💡 Cómo Usar los Datos para Optimizar

### Ejemplo Real

```
🎫 Eventos con más clics en "Comprar entradas":

1. La fiebre de POCCO
   └─ 45 clics

2. Cupido Club by:POCCO
   └─ 32 clics

3. Trendy the party vol.2
   └─ 28 clics
```

**Conclusión:**
- "La fiebre de POCCO" es el más popular (45 clics)
- Replica su formato de imagen y descripción para futuros eventos
- Promociona más "Cupido Club" en Instagram para subir sus clics

### Otro Ejemplo

```
🔗 Clics en redes sociales:

   • Instagram: 89 clics
   • TikTok: 12 clics
   • Facebook: 5 clics
```

**Conclusión:**
- Instagram genera 7x más clics que TikTok
- Invierte más presupuesto en Instagram
- Revisa la estrategia de TikTok (contenido, frecuencia, horarios)

## 🔄 Automatización

Para recibir reportes automáticos cada día:

### Opción 1: Alias (Recomendado)

Añade a tu `~/.zshrc` o `~/.bashrc`:

```bash
alias pocco-stats="cd /Users/franferrer/pocco-web/analytics && node pocco-analytics.js"
```

Luego ejecuta:
```bash
pocco-stats
```

### Opción 2: Cron (Reporte diario a las 9 AM)

```bash
crontab -e
```

Añade:
```
0 9 * * * cd /Users/franferrer/pocco-web/analytics && node pocco-analytics.js > /tmp/pocco-analytics-report.txt
```

## 📊 Property ID

Tu propiedad de Google Analytics:
- **Property ID:** `475752389`
- **Measurement ID:** `G-REG9BSZ0G1`
- **URL:** https://pocco.club/

## 🆘 Solución de Problemas

### "No data yet"

**Normal.** Los eventos tardan 24-48 horas en aparecer en Google Analytics después de implementarlos.

### "Could not load credentials"

Asegúrate de que existe el archivo:
```bash
ls /Users/franferrer/pocco-web/analytics/credentials.json
```

Si no existe, sigue la [guía de configuración](./SETUP.md).

### "Permission denied"

El Service Account no tiene acceso a Google Analytics. Ve a:
- Google Analytics → Admin → Property access management
- Añade el email del Service Account con rol "Viewer"

## 📞 Documentación Adicional

- [Guía de configuración paso a paso](./SETUP.md)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🎯 Próximos Pasos

1. **HOY:** Sigue la [guía de configuración](./SETUP.md) para crear las credenciales (5 minutos)
2. **MAÑANA:** Ejecuta `node pocco-analytics.js` para ver tus primeros datos
3. **CADA SEMANA:** Revisa las métricas y optimiza tus eventos basándote en los datos

---

**Última actualización:** 2026-02-12
**Versión:** 1.0

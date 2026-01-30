# Grupo POCCO - Webs y Documentación

## 📋 Resumen

Este directorio contiene toda la documentación técnica y archivos de los sitios web del **Grupo POCCO**:
- **pocco.club** - Web principal del club
- **trendy.pocco.club** - Fiesta +16 "THE PARTY"

## 📁 Estructura del Directorio

```
pocco-web/
├── README.md                          # Este archivo
├── sites/                             # HTMLs de cada sitio
│   ├── pocco/                         # POCCO Club
│   │   └── index.html
│   └── trendy/                        # TRENDY ✅ CREADA
│       └── index.html                 # HTML con branding rosa/magenta
├── assets/                            # Recursos visuales
│   ├── pocco/                         # Logos e imágenes POCCO
│   └── trendy/                        # Logos e imágenes TRENDY
│       ├── logo-trendy.png
│       ├── cartel-exams-break.png
│       └── cartel-san-valentin.png
├── docs/                              # Documentación
│   ├── ACCESOS.md                     # Credenciales FTP/DB
│   ├── CAMBIOS-REALIZADOS.md          # Historial POCCO
│   ├── AGREGAR-EVENTOS.md             # Guía eventos POCCO
│   ├── TROUBLESHOOTING.md             # Solución problemas
│   └── TRENDY.md                      # Info proyecto TRENDY
├── backups/                           # Backups de ambos sitios
│   └── BACKUP_*.html
└── scripts/                           # Scripts de automatización
    └── ejemplos/
```

## 🎯 Página Principal de Eventos

- **ID de Página WordPress**: 198
- **URL**: https://pocco.club/eventos
- **Título**: Eventos

Esta página contiene:
- ✅ Calendario de eventos con navegación por meses
- ✅ Sistema de indicadores (puntos rojos) para días con eventos
- ✅ Popup con detalles del evento al hacer clic
- ✅ Sección de VIPs con 3 opciones (Tarima, Cabina, Supervip)
- ✅ Optimización móvil con scroll automático al VIP recomendado

## 🎨 TRENDY - The Party (+16)

- **Estado**: HTML creado ✅ | Pendiente de despliegue ⏳
- **URL destino**: https://trendy.pocco.club/
- **Branding**: Rosa magenta (#E91E8C) - Estilo urbano/underground
- **Documentación completa**: `docs/TRENDY.md`
- **Assets**: Logo + carteles en `assets/trendy/`

### Próximos pasos para TRENDY:
1. Configurar el subdominio `trendy.pocco.club` en el panel de Hostinger
2. Subir `sites/trendy/index.html` al servidor vía FTP
3. Añadir eventos de TRENDY (San Valentín, etc.)

## 🚀 Quick Start

### POCCO Club:
1. **Ver credenciales de acceso**: Lee `docs/ACCESOS.md`
2. **Agregar un nuevo evento**: Sigue `docs/AGREGAR-EVENTOS.md`
3. **Ver qué se ha modificado**: Consulta `docs/CAMBIOS-REALIZADOS.md`

### TRENDY:
1. **Ver información del proyecto**: Lee `docs/TRENDY.md`
2. **Ver assets de branding**: Carpeta `assets/trendy/`

## ⚠️ IMPORTANTE

- **Siempre hacer backup** antes de modificar la base de datos
- **Limpiar la caché de LiteSpeed** después de cada cambio
- **Probar en móvil y desktop** después de cualquier modificación
- **No modificar el código manualmente** en el editor de WordPress (usar scripts PHP)

## 🔧 Tecnologías Utilizadas

- **WordPress** con tema personalizado
- **PHP** para scripts de modificación
- **MySQL/MariaDB** como base de datos
- **LiteSpeed Cache** para optimización
- **FTP** para subir scripts al servidor

## 📞 Soporte

Si algo se rompe o no funciona:
1. Revisa los logs en el servidor
2. Limpia la caché de LiteSpeed
3. Verifica que la página 198 no haya sido modificada manualmente
4. Consulta `docs/CAMBIOS-REALIZADOS.md` para ver qué código debería estar presente

---

## 📅 Eventos Actuales (Enero 2026)

1. **17 enero** - POCCO CLUB (EnterTicket ID: 53277)
2. **24 enero** - Un POCCO de flamenco - Tardeo 17:30-23:59 (ID: 53545)
3. **24 enero** - Pocco Club - Noche 23:59-6:30 (ID: 53569)
4. **31 enero** - POCCO IS CALLING vol.2 by Alonso Chover (ID: 53689)

---

**Última actualización**: 2026-01-30
**Versión**: 2.0

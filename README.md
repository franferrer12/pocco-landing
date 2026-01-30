# Pocco Club - Documentación Técnica

## 📋 Resumen

Este directorio contiene toda la documentación técnica del sitio web **pocco.club**, incluyendo credenciales de acceso, cambios realizados, y procedimientos para mantener y actualizar el calendario de eventos.

## 📁 Estructura del Directorio

```
pocco-web/
├── README.md                          # Este archivo
├── docs/
│   ├── ACCESOS.md                     # Credenciales y accesos
│   ├── CAMBIOS-REALIZADOS.md          # Historial de todos los cambios
│   └── AGREGAR-EVENTOS.md             # Guía paso a paso para nuevos eventos
├── scripts/
│   ├── template-add-event.php         # Template para agregar eventos
│   ├── template-modify-page.php       # Template para modificar página
│   └── ejemplos/                      # Scripts de ejemplo usados
└── backups/
    └── README.md                      # Información sobre backups
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

## 🚀 Quick Start

1. **Ver credenciales de acceso**: Lee `docs/ACCESOS.md`
2. **Agregar un nuevo evento**: Sigue `docs/AGREGAR-EVENTOS.md`
3. **Ver qué se ha modificado**: Consulta `docs/CAMBIOS-REALIZADOS.md`

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

**Última actualización**: 2025-12-09
**Versión**: 1.0

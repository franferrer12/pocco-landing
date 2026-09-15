# 🚀 Configuración de Google Analytics API

## Resumen

Este sistema te permite analizar automáticamente las métricas de POCCO.club desde la terminal, sin necesidad de entrar a Google Analytics cada vez.

## 📋 Requisitos Previos

- ✅ Google Analytics 4 instalado en pocco.club (G-REG9BSZ0G1) - **YA HECHO**
- ✅ Eventos de tracking implementados - **YA HECHO**
- ⚠️ Credenciales de Google Cloud - **PENDIENTE**

---

## 🔧 Configuración (5 minutos)

### Paso 1: Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en **"Select a project"** → **"New Project"**
3. Nombre del proyecto: **"POCCO Analytics"**
4. Haz clic en **"Create"**

### Paso 2: Habilitar la API de Google Analytics

1. Con el proyecto seleccionado, ve a:
   [Google Analytics Data API](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com)

2. Haz clic en **"Enable"**

3. Espera a que se active (tarda ~30 segundos)

### Paso 3: Crear Service Account

1. Ve a [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)

2. Haz clic en **"+ CREATE CREDENTIALS"** → **"Service account"**

3. Configuración:
   - **Service account name:** `pocco-analytics`
   - **Service account ID:** Se genera automáticamente
   - **Description:** `Acceso a Google Analytics para POCCO Club`

4. Haz clic en **"CREATE AND CONTINUE"**

5. **Role:** Selecciona **"Viewer"**

6. Haz clic en **"CONTINUE"** y luego **"DONE"**

### Paso 4: Descargar Credenciales JSON

1. En la lista de Service Accounts, busca `pocco-analytics`

2. Haz clic en los **3 puntos** (⋮) → **"Manage keys"**

3. Haz clic en **"ADD KEY"** → **"Create new key"**

4. Selecciona **"JSON"**

5. Haz clic en **"CREATE"**

6. Se descargará un archivo JSON. **Guárdalo en:**
   ```
   /Users/franferrer/pocco-web/analytics/credentials.json
   ```

### Paso 5: Añadir Service Account a Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)

2. Selecciona tu propiedad (G-REG9BSZ0G1)

3. Ve a **Admin** (⚙️ abajo a la izquierda) → **Property access management**

4. Haz clic en el botón **"+"** (arriba a la derecha)

5. Añade el email del Service Account:
   - Debería ser algo como: `pocco-analytics@pocco-analytics-xxxxx.iam.gserviceaccount.com`
   - Lo encuentras en Google Cloud Console → Service Accounts

6. **Role:** Selecciona **"Viewer"**

7. Haz clic en **"Add"**

### Paso 6: Obtener el Property ID

1. En Google Analytics, ve a **Admin** (⚙️)

2. En la columna **"Property"**, haz clic en **"Property details"**

3. Copia el **"Property ID"** (debería ser: `475752389`)

4. Verifica que esté correcto en el archivo `pocco-analytics.js`:
   ```javascript
   const PROPERTY_ID = '475752389';
   ```

---

## 🎯 Uso

Una vez configurado, puedes ejecutar el análisis con:

```bash
cd /Users/franferrer/pocco-web/analytics
node pocco-analytics.js
```

Verás un dashboard como este:

```
🎯 POCCO CLUB - ANALYTICS DASHBOARD

Período: Últimos 7 días
Property: G-REG9BSZ0G1


📊 RESUMEN GENERAL
════════════════════════════════════════════════════════════

👥 Usuarios activos: 245
📊 Sesiones: 312
📄 Páginas vistas: 478
⏱️  Duración promedio: 2m 34s


📊 ANÁLISIS DE COMPRA DE ENTRADAS
════════════════════════════════════════════════════════════

🎫 Eventos con más clics en "Comprar entradas":

1. La fiebre de POCCO
   └─ 45 clics

2. Cupido Club by:POCCO
   └─ 32 clics

3. Trendy the party vol.2
   └─ 28 clics


📈 MÉTRICAS DE ENGAGEMENT
════════════════════════════════════════════════════════════

🔄 Scroll profundo:

   • 25% scroll: 156 usuarios
   • 50% scroll: 98 usuarios
   • 75% scroll: 67 usuarios
   • 90% scroll: 34 usuarios

⏱️  Tiempo en página:

   • 30 seconds: 189 usuarios
   • 1 minute: 123 usuarios
   • 2 minutes: 67 usuarios
   • 5 minutes: 23 usuarios


📱 REDES SOCIALES
════════════════════════════════════════════════════════════

🔗 Clics en redes sociales:

   • Instagram: 89 clics
   • TikTok: 12 clics
   • Facebook: 5 clics


════════════════════════════════════════════════════════════

💡 Para optimizar conversiones:
   1. Identifica qué eventos tienen más clics en "Comprar"
   2. Replica el formato de esos eventos
   3. Mejora las imágenes y descripciones
   4. Promociona más en redes sociales
```

---

## 🔄 Automatización Diaria

Para recibir un reporte automático cada día a las 9:00 AM:

### En macOS (usando cron):

1. Edita el crontab:
   ```bash
   crontab -e
   ```

2. Añade esta línea:
   ```
   0 9 * * * cd /Users/franferrer/pocco-web/analytics && node pocco-analytics.js > /tmp/pocco-analytics-report.txt && cat /tmp/pocco-analytics-report.txt
   ```

3. Guarda y cierra (`:wq` en vim)

### Alternativa: Script de ejecución manual

Crea un alias en tu `.zshrc` o `.bashrc`:

```bash
alias pocco-stats="cd /Users/franferrer/pocco-web/analytics && node pocco-analytics.js"
```

Luego solo ejecuta:
```bash
pocco-stats
```

---

## 📊 Métricas Disponibles

### 1. Resumen General
- Usuarios activos
- Sesiones totales
- Páginas vistas
- Duración promedio de sesión

### 2. Compra de Entradas (MÁS IMPORTANTE)
- Qué eventos tienen más clics
- Número total de clics por evento
- Ordenado por popularidad

### 3. Engagement
- % de usuarios que hacen scroll profundo (25%, 50%, 75%, 90%)
- Tiempo en página (30s, 1m, 2m, 5m)

### 4. Redes Sociales
- Clics en Instagram
- Clics en TikTok
- Clics en Facebook

### 5. Calendario
- Qué días del calendario generan más clics

---

## 🎯 Cómo Optimizar con Estos Datos

### 1. Identifica Eventos Populares
- Si "La fiebre de POCCO" tiene 45 clics y "Cupido Club" tiene 32:
  - ✅ Usa imágenes similares a "La fiebre"
  - ✅ Replica el estilo de descripción
  - ✅ Promociona más "Cupido Club" en redes

### 2. Mejora Engagement
- Si solo el 34% llega al 90% de scroll:
  - ✅ Coloca CTAs más arriba
  - ✅ Mejora el contenido "above the fold"

### 3. Redes Sociales
- Si Instagram genera 89 clics vs 12 de TikTok:
  - ✅ Invierte más en Instagram
  - ✅ Mejora la estrategia de TikTok

### 4. Conversión
- Si un evento tiene muchos clics pero pocas ventas:
  - ✅ Revisa el precio
  - ✅ Mejora la imagen
  - ✅ Añade urgencia ("Quedan pocas entradas")

---

## 🆘 Solución de Problemas

### Error: "Could not load the default credentials"

**Causa:** No encuentra el archivo credentials.json

**Solución:**
```bash
# Verifica que existe el archivo
ls /Users/franferrer/pocco-web/analytics/credentials.json

# Si no existe, descárgalo de nuevo desde Google Cloud
```

### Error: "User does not have sufficient permissions"

**Causa:** El Service Account no tiene acceso a Google Analytics

**Solución:**
1. Ve a Google Analytics → Admin → Property access management
2. Verifica que el email del Service Account esté añadido con rol "Viewer"

### Error: "No data yet"

**Causa:** Los eventos todavía no tienen datos (primeras 24-48 horas)

**Solución:**
- Espera 24-48 horas
- Mientras tanto, verifica que los eventos se estén enviando:
  1. Abre https://pocco.club/
  2. Abre las Developer Tools (F12)
  3. Ve a la pestaña "Network"
  4. Filtra por "collect"
  5. Haz clic en "Comprar entradas"
  6. Deberías ver una petición a Google Analytics

---

## 📞 Contacto

Para dudas o problemas, consulta:
- [Documentación oficial de GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**Última actualización:** 2026-02-12
**Versión:** 1.0

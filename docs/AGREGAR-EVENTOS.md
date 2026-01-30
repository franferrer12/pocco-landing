# 📅 Guía: Cómo Agregar Nuevos Eventos

## 🎯 Resumen

Esta guía explica paso a paso cómo agregar nuevos eventos al calendario de pocco.club **SIN ROMPER** el código existente.

---

## ⚠️ REGLAS DE ORO

1. **NUNCA modifiques manualmente** el HTML/CSS/JavaScript de la página 198
2. **SIEMPRE limpia la caché** de LiteSpeed después de cualquier cambio
3. **PRUEBA en móvil y desktop** después de agregar eventos
4. **HAZ BACKUP** antes de modificaciones grandes

---

## 🚀 Opción 1: Agregar Evento Manualmente (WordPress Admin)

Esta es la forma más segura y recomendada.

### Paso 1: Acceder al Panel de WordPress

1. Ve a: https://pocco.club/wp-admin/
2. Inicia sesión con tus credenciales de administrador

### Paso 2: Ir a Eventos

Si tienes un plugin de eventos (The Events Calendar, etc.):

1. En el menú lateral, busca **"Eventos"** o **"Events"**
2. Haz clic en **"Añadir nuevo"** o **"Add New"**

### Paso 3: Rellenar Información del Evento

Información requerida:

- **Título**: Nombre del evento (ej: "Noche de Reggaeton")
- **Descripción**: Detalles del evento
- **Fecha**: Día y hora del evento
- **Hora**: Hora de inicio (ej: 23:00)
- **Lugar**: "Pocco Club" o ubicación específica
- **Imagen destacada**: Poster o imagen del evento (recomendado)

### Paso 4: Publicar

1. Verifica que todos los campos estén completos
2. Haz clic en **"Publicar"**
3. El evento aparecerá automáticamente en el calendario

### Paso 5: Limpiar Caché

**MUY IMPORTANTE**: Después de publicar, limpia la caché:

1. En el panel de WordPress, busca el menú de **LiteSpeed Cache**
2. Haz clic en **"Purge All"** o **"Limpiar Todo"**
3. O ejecuta este comando en terminal:
   ```bash
   curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"
   ```

### Paso 6: Verificar

1. Abre https://pocco.club/eventos en **modo incógnito**
2. Busca el mes del evento
3. Verifica que aparezca el **punto rojo** en el día correcto
4. Haz clic en el día para ver el popup con la información
5. **Prueba en móvil** también

---

## 🔧 Opción 2: Agregar Evento por PHP Script

Para eventos más complejos o agregar múltiples eventos a la vez.

### Template de Script

Usa el template en: `/Users/franferrer/pocco-web/scripts/template-add-event.php`

```php
<?php
// Script para agregar un nuevo evento

$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== AGREGANDO NUEVO EVENTO ===\n\n";

    // CONFIGURACIÓN DEL EVENTO
    $event_title = "Noche de Reggaeton";
    $event_date = "2025-12-15";           // Formato: YYYY-MM-DD
    $event_time = "23:00";                // Formato: HH:MM
    $event_description = "La mejor noche de reggaeton del mes";
    $event_location = "Pocco Club";

    // Insertar evento
    $stmt = $pdo->prepare("
        INSERT INTO wp_posts (
            post_author,
            post_date,
            post_date_gmt,
            post_content,
            post_title,
            post_status,
            post_type,
            post_modified,
            post_modified_gmt
        ) VALUES (
            1,
            NOW(),
            UTC_TIMESTAMP(),
            :description,
            :title,
            'publish',
            'tribe_events',
            NOW(),
            UTC_TIMESTAMP()
        )
    ");

    $stmt->bindParam(':title', $event_title);
    $stmt->bindParam(':description', $event_description);
    $stmt->execute();

    $event_id = $pdo->lastInsertId();

    echo "✅ Evento creado con ID: $event_id\n";

    // Agregar metadatos del evento (fecha, hora, etc.)
    $meta_data = [
        '_EventStartDate' => "$event_date $event_time:00",
        '_EventEndDate' => "$event_date 05:00:00",
        '_EventVenueID' => "0",
        '_EventShowMapLink' => "1",
        '_EventShowMap' => "1",
        '_EventTimezone' => "Europe/Madrid",
    ];

    foreach ($meta_data as $meta_key => $meta_value) {
        $stmt = $pdo->prepare("
            INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
            VALUES (:post_id, :meta_key, :meta_value)
        ");
        $stmt->bindParam(':post_id', $event_id);
        $stmt->bindParam(':meta_key', $meta_key);
        $stmt->bindParam(':meta_value', $meta_value);
        $stmt->execute();
    }

    echo "✅ Metadatos del evento agregados\n\n";

    // Limpiar cache
    @file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");
    sleep(1);
    @file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");

    echo "✅ Cache limpiado\n";
    echo "🎯 Evento agregado exitosamente!\n";
    echo "   Verifica en: https://pocco.club/eventos\n\n";

    // Auto-eliminar
    @unlink(__FILE__);
    echo "✅ Script eliminado\n";

} catch (PDOException $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}
?>
```

### Pasos para Usar el Script:

1. **Copia el template**:
   ```bash
   cp /Users/franferrer/pocco-web/scripts/template-add-event.php /tmp/add-event-$(date +%Y%m%d).php
   ```

2. **Edita el archivo**:
   ```bash
   nano /tmp/add-event-$(date +%Y%m%d).php
   ```

3. **Modifica los datos del evento**:
   - Cambia `$event_title`
   - Cambia `$event_date` (formato: YYYY-MM-DD)
   - Cambia `$event_time` (formato: HH:MM)
   - Cambia `$event_description`

4. **Sube el script al servidor**:
   ```bash
   PASS_ENCODED="%2F%3DkMj%3Drz9%24%5D4.%5D-"
   HOST="194.164.74.18"
   USER="u381629691"

   curl -s --ftp-pasv -T /tmp/add-event-*.php "ftp://$USER:$PASS_ENCODED@$HOST/domains/pocco.club/public_html/"
   ```

5. **Ejecuta el script**:
   ```bash
   curl https://pocco.club/add-event-20251209.php
   ```

6. **El script se auto-elimina** después de ejecutarse

7. **Verifica** el evento en https://pocco.club/eventos

---

## 🔍 Verificación Post-Agregado

Después de agregar un evento, SIEMPRE verifica:

### ✅ Checklist de Verificación:

- [ ] El evento aparece en el mes correcto
- [ ] El **punto rojo** aparece debajo del número del día
- [ ] Al hacer clic, se abre el popup con la información correcta
- [ ] El popup muestra:
  - [ ] Título del evento
  - [ ] Descripción
  - [ ] Hora (si está disponible)
  - [ ] Punto rojo como indicador
- [ ] **En móvil** (≤ 768px):
  - [ ] El punto rojo es más pequeño (6px)
  - [ ] El punto está bien posicionado
  - [ ] El popup se muestra correctamente
- [ ] La sección de VIPs sigue funcionando:
  - [ ] En móvil, scroll automático al VIP del centro
  - [ ] Los 3 VIPs se muestran correctamente
- [ ] Los botones de navegación (← →) funcionan:
  - [ ] Se ponen rojos al hacer hover
  - [ ] Vuelven a color normal después del clic
  - [ ] No se quedan "pegados" en color

---

## 🚨 Solución de Problemas

### Problema: El evento no aparece en el calendario

**Posibles causas**:
1. Caché de LiteSpeed no limpiada
2. Fecha del evento en formato incorrecto
3. El post_type no es 'tribe_events'

**Solución**:
```bash
# Limpiar caché (ejecutar 2 veces)
curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"
sleep 1
curl -X POST "https://pocco.club/wp-json/litespeed/v1/purge_all"

# Verificar en la base de datos
mysql -h 127.0.0.1 -u u381629691_melFW -p u381629691_VGByx

SELECT ID, post_title, post_date, post_type, post_status
FROM wp_posts
WHERE post_type = 'tribe_events'
ORDER BY post_date DESC
LIMIT 5;
```

### Problema: No aparece el punto rojo

**Posibles causas**:
1. El día no tiene la clase `.has-event`
2. El JavaScript no detectó el evento
3. CSS del punto rojo fue modificado

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores de JavaScript
3. Verifica que el día tenga el atributo `data-event`
4. Comprueba que el CSS del punto rojo está presente:
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

### Problema: El calendario no muestra el evento en el mes correcto

**Causa**: La variable `minDate` puede estar limitando la visualización

**Solución**: Verificar que el código tiene:
```javascript
var currentDate = new Date();
var minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
// Sin maxDate definido (muestra todos los eventos futuros)
```

### Problema: El popup no muestra información del evento

**Causa**: El atributo `data-event` no está bien formado

**Solución**: Verificar en la consola del navegador que el evento tiene:
```html
<div class="calendar-day has-event" data-event='{"title":"Evento","description":"...","time":"23:00"}'>
```

---

## 📊 Base de Datos: Estructura de Eventos

### Tabla: wp_posts

```sql
ID:              [Auto-generado]
post_author:     1
post_date:       [Fecha actual]
post_date_gmt:   [Fecha actual UTC]
post_content:    [Descripción del evento]
post_title:      [Título del evento]
post_status:     'publish'
post_type:       'tribe_events'  ← IMPORTANTE
post_modified:   [Auto-actualizado]
post_modified_gmt: [Auto-actualizado UTC]
```

### Tabla: wp_postmeta

Metadatos importantes del evento:

```sql
_EventStartDate:  "2025-12-15 23:00:00"
_EventEndDate:    "2025-12-16 05:00:00"
_EventVenueID:    "0"
_EventShowMapLink: "1"
_EventShowMap:    "1"
_EventTimezone:   "Europe/Madrid"
```

---

## 🎨 Personalización de Eventos

### Cambiar el Color del Punto

En la página 198, buscar el CSS:

```css
.calendar-day.has-event::after {
    background: #ff0000;  ← Cambiar este color
}
```

Colores sugeridos:
- Rojo: `#ff0000` (actual)
- Rosa: `#e91e63`
- Azul: `#2196f3`
- Verde: `#4caf50`

### Cambiar el Tamaño del Punto

```css
.calendar-day.has-event::after {
    width: 8px;   ← Cambiar tamaño
    height: 8px;  ← Cambiar tamaño
}
```

### Cambiar la Posición del Punto

```css
.calendar-day.has-event::after {
    top: 75%;  ← Ajustar posición vertical (0% = arriba, 100% = abajo)
}
```

**NOTA**: Después de cualquier cambio en CSS, recordar limpiar la caché.

---

## 📱 Eventos Especiales y Casos de Uso

### Evento de Todo el Día

```php
$event_time = "00:00";
$meta_data = [
    '_EventAllDay' => 'yes',
    '_EventStartDate' => "$event_date 00:00:00",
    '_EventEndDate' => "$event_date 23:59:59",
];
```

### Evento de Varios Días

```php
$event_start_date = "2025-12-15";
$event_end_date = "2025-12-17";

$meta_data = [
    '_EventStartDate' => "$event_start_date 23:00:00",
    '_EventEndDate' => "$event_end_date 05:00:00",
];
```

**NOTA**: El calendario mostrará el punto rojo en todos los días del rango.

### Evento Recurrente

Para eventos que se repiten (ej: todos los viernes), necesitarás:

1. Usar el plugin de eventos (The Events Calendar Pro)
2. O crear múltiples entradas de eventos con un script en bucle

---

## 🔄 Editar o Eliminar Eventos

### Editar Evento Existente

#### Opción 1: WordPress Admin
1. Ve a **Eventos** → **Todos los eventos**
2. Busca el evento
3. Haz clic en **"Editar"**
4. Modifica los campos necesarios
5. Haz clic en **"Actualizar"**
6. **Limpia la caché**

#### Opción 2: Script PHP
```php
$event_id = 123; // ID del evento a modificar

$stmt = $pdo->prepare("
    UPDATE wp_posts
    SET post_title = :title,
        post_content = :description,
        post_modified = NOW(),
        post_modified_gmt = UTC_TIMESTAMP()
    WHERE ID = :id
");
$stmt->bindParam(':id', $event_id);
$stmt->bindParam(':title', $new_title);
$stmt->bindParam(':description', $new_description);
$stmt->execute();
```

### Eliminar Evento

#### Opción 1: WordPress Admin
1. Ve a **Eventos** → **Todos los eventos**
2. Busca el evento
3. Haz clic en **"Papelera"** o **"Trash"**
4. (Opcional) Vaciar papelera para eliminar permanentemente
5. **Limpia la caché**

#### Opción 2: Script PHP
```php
$event_id = 123; // ID del evento a eliminar

$stmt = $pdo->prepare("UPDATE wp_posts SET post_status = 'trash' WHERE ID = :id");
$stmt->bindParam(':id', $event_id);
$stmt->execute();

// O eliminar permanentemente:
$stmt = $pdo->prepare("DELETE FROM wp_posts WHERE ID = :id");
$stmt->bindParam(':id', $event_id);
$stmt->execute();

// También eliminar metadatos:
$stmt = $pdo->prepare("DELETE FROM wp_postmeta WHERE post_id = :id");
$stmt->bindParam(':id', $event_id);
$stmt->execute();
```

---

## 💡 Tips y Mejores Prácticas

### ✅ Hacer:
- Siempre hacer backup antes de cambios grandes
- Probar en modo incógnito para ver cambios reales
- Limpiar caché después de CADA modificación
- Usar scripts PHP con auto-eliminación (`unlink(__FILE__)`)
- Verificar en móvil Y desktop
- Usar fechas en formato ISO (YYYY-MM-DD HH:MM:SS)

### ❌ No Hacer:
- No modificar el código de la página 198 manualmente
- No usar el editor de WordPress para cambiar HTML/CSS/JavaScript
- No olvidar limpiar la caché
- No agregar eventos con fechas en formato incorrecto
- No usar post_type diferente a 'tribe_events'
- No dejar scripts PHP en el servidor público

---

## 📞 Ayuda y Debugging

### Ver Logs de Eventos

```bash
# Conectar a la base de datos
mysql -h 127.0.0.1 -u u381629691_melFW -p u381629691_VGByx

# Ver últimos 10 eventos
SELECT ID, post_title, post_date, post_status, post_type
FROM wp_posts
WHERE post_type = 'tribe_events'
ORDER BY post_date DESC
LIMIT 10;

# Ver metadatos de un evento específico
SELECT meta_key, meta_value
FROM wp_postmeta
WHERE post_id = 123;

# Contar eventos por mes
SELECT
    DATE_FORMAT(post_date, '%Y-%m') as month,
    COUNT(*) as total
FROM wp_posts
WHERE post_type = 'tribe_events'
    AND post_status = 'publish'
GROUP BY month
ORDER BY month DESC;
```

### Verificar Configuración del Calendario

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Ver eventos cargados
console.log(events);

// Ver fecha actual del calendario
console.log(currentDate);

// Ver minDate/maxDate
console.log(minDate);
console.log(maxDate);
```

---

**Última actualización**: 2025-12-09
**Versión**: 1.0

Para cualquier duda, consulta:
- `ACCESOS.md` - Credenciales y conexiones
- `CAMBIOS-REALIZADOS.md` - Historial de modificaciones

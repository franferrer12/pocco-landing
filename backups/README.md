# 💾 Carpeta de Backups

Esta carpeta está destinada para guardar backups del contenido de la página 198 antes de hacer modificaciones importantes.

## 🎯 ¿Por Qué Hacer Backups?

- Prevenir pérdida de código personalizado
- Poder revertir cambios si algo sale mal
- Mantener historial de versiones
- Tranquilidad al hacer modificaciones

## 📝 Cómo Crear un Backup

### Opción 1: Script PHP Automático

```php
<?php
// Script para crear backup de la página 198

$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $pdo->prepare("SELECT post_content FROM wp_posts WHERE ID = 198");
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

$timestamp = date('Y-m-d_H-i-s');
$filename = "backup_page_198_$timestamp.html";

file_put_contents($filename, $result['post_content']);
echo "✅ Backup creado: $filename\n";

@unlink(__FILE__);
?>
```

### Opción 2: Desde MySQL

```bash
# Backup completo de la página 198
mysql -h 127.0.0.1 -u u381629691_melFW -p u381629691_VGByx \
  -e "SELECT post_content FROM wp_posts WHERE ID = 198" \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Opción 3: API REST de WordPress

```bash
# Backup usando la API (requiere autenticación)
USER="poccotheclub@gmail.com"
PASS="iRqs Zft0 UeDy Ip4l z8j0 gtCf"

curl -s "https://pocco.club/wp-json/wp/v2/pages/198" \
  -u "$USER:$PASS" \
  > backup_$(date +%Y%m%d_%H%M%S).json
```

## 📂 Estructura Recomendada

```
backups/
├── 2025-12-09_before-red-dot.html
├── 2025-12-09_before-button-fix.html
├── 2025-12-09_before-vip-scroll.html
└── latest.html  ← Siempre el backup más reciente
```

## 🔄 Restaurar desde un Backup

### Script de Restauración:

```php
<?php
// Script para restaurar desde un backup

$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

// CAMBIAR: Ruta al archivo de backup
$backup_file = '/path/to/backup_page_198_2025-12-09.html';

if (!file_exists($backup_file)) {
    die("❌ Archivo de backup no encontrado\n");
}

$content = file_get_contents($backup_file);

$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $pdo->prepare("
    UPDATE wp_posts
    SET post_content = :content,
        post_modified = NOW(),
        post_modified_gmt = UTC_TIMESTAMP()
    WHERE ID = 198
");
$stmt->bindParam(':content', $content);
$stmt->execute();

echo "✅ Backup restaurado exitosamente!\n";

// Limpiar caché
@file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");
sleep(1);
@file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");

echo "✅ Caché limpiado\n";
echo "🎯 Verifica en: https://pocco.club/eventos\n";

@unlink(__FILE__);
?>
```

## ⏰ Frecuencia Recomendada

- **Antes de cada modificación importante**: Siempre
- **Backup automático diario**: Recomendado
- **Backup semanal completo**: Recomendado

## 🗑️ Limpieza de Backups Antiguos

```bash
# Mantener solo los últimos 30 backups
ls -t backup_page_198_*.html | tail -n +31 | xargs rm -f
```

## 📋 Checklist de Backup

Antes de modificar la página 198:

- [ ] Crear backup con timestamp
- [ ] Verificar que el archivo de backup se creó correctamente
- [ ] Comprobar el tamaño del archivo (debe ser ~50-100 KB aprox)
- [ ] Guardar copia también en carpeta local
- [ ] Hacer la modificación
- [ ] Si algo sale mal, restaurar desde backup

## 🆘 Backup de Emergencia

Si no tienes un backup reciente, puedes obtener revisiones de WordPress:

```bash
# Ver revisiones disponibles
curl -s "https://pocco.club/wp-json/wp/v2/pages/198/revisions" \
  -u "usuario:contraseña"

# Descargar una revisión específica
curl -s "https://pocco.club/wp-json/wp/v2/pages/198/revisions/REVISION_ID" \
  -u "usuario:contraseña" \
  > backup_from_revision.json
```

---

**NOTA**: Esta carpeta debe mantenerse fuera del repositorio público si contiene información sensible.

**Última actualización**: 2025-12-09

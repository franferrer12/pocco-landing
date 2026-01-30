# 📚 Scripts de Ejemplo

Esta carpeta contiene scripts PHP reales que se usaron para hacer las optimizaciones del calendario de pocco.club.

## ⚠️ Importante

Estos scripts son **SOLO PARA REFERENCIA**. No los ejecutes directamente ya que algunos cambios podrían duplicarse o causar problemas.

Usa estos ejemplos para entender:
- Cómo conectar a la base de datos
- Cómo buscar y reemplazar código
- Cómo agregar CSS/JavaScript
- Cómo limpiar la caché
- Cómo auto-eliminar el script

## 📋 Lista de Scripts

### 1. Posicionamiento del Punto Rojo
- `position-red-dot-below-number.php` - Primera versión con top: 60%
- `adjust-red-dot-closer.php` - Ajuste a top: 65%
- `add-more-space-to-dot.php` - Versión final con top: 75%

### 2. Eliminación del Punto Blanco
- `remove-white-dot-completely.php` - Elimina el punto blanco antiguo

### 3. Botones de Navegación
- `change-button-to-pink-theme.php` - Primera versión con color rosa
- `fix-button-stuck-pink.php` - Arreglo del botón que se quedaba en color
- `change-button-to-red.php` - Versión final con color rojo

### 4. Sección VIPs
- `move-featured-vip-first-mobile.php` - Primera versión (mover DOM)
- `scroll-to-featured-vip-mobile.php` - Versión final (scroll suave)

## 🔍 Cómo Usar Estos Ejemplos

### Patrón Básico de Todos los Scripts:

```php
<?php
// 1. Conectar a la base de datos
$pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);

// 2. Obtener el contenido actual
$stmt = $pdo->prepare("SELECT post_content FROM wp_posts WHERE ID = 198");
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
$content = $result['post_content'];

// 3. Modificar el contenido
$content = str_replace($old_code, $new_code, $content);

// 4. Guardar cambios
$stmt = $pdo->prepare("UPDATE wp_posts SET post_content = :content WHERE ID = 198");
$stmt->bindParam(':content', $content);
$stmt->execute();

// 5. Limpiar caché
@file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");

// 6. Auto-eliminar
@unlink(__FILE__);
?>
```

## 💡 Tips

1. **Backup primero**: Siempre haz backup antes de modificar
2. **Testing**: Prueba primero en desarrollo si es posible
3. **Caché**: Siempre limpia la caché (2 veces)
4. **Auto-eliminar**: Todos los scripts deben auto-eliminarse
5. **Verificación**: Abre en modo incógnito para ver cambios reales

## 🚀 Comandos para Subir y Ejecutar

```bash
# 1. Variables de FTP
PASS_ENCODED="%2F%3DkMj%3Drz9%24%5D4.%5D-"
HOST="194.164.74.18"
USER="u381629691"

# 2. Subir script
curl -s --ftp-pasv -T /tmp/mi-script.php "ftp://$USER:$PASS_ENCODED@$HOST/domains/pocco.club/public_html/"

# 3. Ejecutar
curl -s "https://pocco.club/mi-script.php"

# 4. Verificar que se eliminó
curl -s "https://pocco.club/mi-script.php" # Debería dar 404
```

---

**Última actualización**: 2025-12-09

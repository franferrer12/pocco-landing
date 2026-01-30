<?php
/**
 * Template para modificar la página 198 (Eventos)
 *
 * INSTRUCCIONES:
 * 1. Copia este archivo a /tmp/
 * 2. Modifica la sección "TU CÓDIGO AQUÍ"
 * 3. Súbelo al servidor por FTP
 * 4. Ejecútalo accediendo a la URL
 * 5. El script se auto-elimina después de ejecutarse
 *
 * ⚠️ PRECAUCIÓN: Este script modifica código en producción
 * ⚠️ Siempre haz backup antes de modificar
 * ⚠️ Verifica el código antes de subirlo
 */

// ========================================
// CREDENCIALES DE LA BASE DE DATOS
// ========================================
$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

// ========================================
// CONFIGURACIÓN
// ========================================
$page_id = 198; // ID de la página de Eventos

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== MODIFICANDO PÁGINA $page_id ===\n\n";

    // Obtener el contenido actual
    $stmt = $pdo->prepare("SELECT post_content FROM wp_posts WHERE ID = :id");
    $stmt->bindParam(':id', $page_id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        die("❌ No se encontró la página con ID $page_id\n");
    }

    $content = $result['post_content'];
    $original_length = strlen($content);

    echo "📄 Página encontrada\n";
    echo "📊 Tamaño actual: " . number_format($original_length) . " caracteres\n\n";

    // ========================================
    // TU CÓDIGO AQUÍ
    // ========================================

    $changes = 0;

    // Ejemplo 1: Buscar y reemplazar CSS
    $old_css = ".calendar-day.has-event::after {
        background: #ff0000;
    }";

    $new_css = ".calendar-day.has-event::after {
        background: #00ff00;  /* Cambiar a verde */
    }";

    if (strpos($content, $old_css) !== false) {
        $content = str_replace($old_css, $new_css, $content);
        $changes++;
        echo "✅ CSS actualizado\n";
    } else {
        echo "ℹ️  CSS no encontrado (probablemente no necesita cambios)\n";
    }

    // Ejemplo 2: Agregar JavaScript
    $js_marker = "document.addEventListener('DOMContentLoaded', function() {";

    if (strpos($content, $js_marker) !== false) {
        $new_js = "\n\n        // Nuevo código JavaScript aquí\n        console.log('✅ Script cargado correctamente');\n\n        ";

        // Descomentar la siguiente línea para agregar el JavaScript:
        // $content = str_replace($js_marker, $js_marker . $new_js, $content);
        // $changes++;
        // echo "✅ JavaScript agregado\n";
    }

    // Ejemplo 3: Usar expresiones regulares
    // $pattern = '/\.calendar-day\.has-event::after\s*\{[^}]+\}/s';
    // if (preg_match($pattern, $content, $matches)) {
    //     echo "✅ Encontrado: " . $matches[0] . "\n";
    // }

    // ========================================
    // FIN DE TU CÓDIGO
    // ========================================

    if ($changes === 0) {
        echo "\n⚠️  No se realizaron cambios\n";
        echo "   Revisa el código y descomenta las líneas necesarias\n";
        die();
    }

    echo "\n📊 Total de cambios: $changes\n\n";

    $new_length = strlen($content);
    $diff = $new_length - $original_length;
    $diff_sign = $diff > 0 ? "+" : "";

    echo "📊 Nuevo tamaño: " . number_format($new_length) . " caracteres ($diff_sign$diff)\n\n";

    // Preguntar confirmación (comentar esta línea para ejecución automática)
    // echo "⚠️  Esto modificará la página en PRODUCCIÓN\n";
    // echo "   Presiona Enter para continuar o Ctrl+C para cancelar...";
    // fgets(STDIN);

    // Guardar cambios
    $stmt = $pdo->prepare("
        UPDATE wp_posts
        SET post_content = :content,
            post_modified = NOW(),
            post_modified_gmt = UTC_TIMESTAMP()
        WHERE ID = :id
    ");
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':id', $page_id);
    $stmt->execute();

    echo "✅ BASE DE DATOS ACTUALIZADA!\n\n";

    // Limpiar cache de LiteSpeed (2 veces para asegurar)
    echo "Limpiando caché de LiteSpeed...\n";
    @file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");
    sleep(1);
    @file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");

    echo "✅ Cache limpiado\n\n";
    echo "========================================\n";
    echo "🎉 ¡PÁGINA ACTUALIZADA EXITOSAMENTE!\n";
    echo "========================================\n\n";
    echo "🎯 Verifica en: https://pocco.club/eventos\n\n";
    echo "⚠️  IMPORTANTE: Si no ves los cambios:\n";
    echo "   1. Abre en modo incógnito (Ctrl+Shift+N)\n";
    echo "   2. O recarga con Ctrl+Shift+R\n";
    echo "   3. Verifica en móvil Y desktop\n\n";

    // Auto-eliminar el script
    @unlink(__FILE__);
    echo "✅ Script auto-eliminado del servidor\n";

} catch (PDOException $e) {
    die("❌ Error de base de datos: " . $e->getMessage() . "\n");
}
?>

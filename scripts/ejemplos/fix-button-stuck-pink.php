<?php
// Script para arreglar el botón que se queda en rosa

$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== ARREGLANDO BOTÓN QUE SE QUEDA EN ROSA ===\n\n";

    $stmt = $pdo->prepare("SELECT post_content FROM wp_posts WHERE ID = 198");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        die("❌ No se encontró la página\n");
    }

    $content = $result['post_content'];

    $changes = 0;

    // 1. Actualizar :hover para que SOLO aplique cuando el cursor está encima
    if (preg_match('/\.calendar-nav-button:hover\s*\{[^}]+\}/s', $content, $hover_match)) {
        $old_hover = $hover_match[0];

        $new_hover = ".calendar-nav-button:hover:not(:active) {
            background: #e91e63;
            border-color: #e91e63;
            transform: scale(1.1);
        }";

        $content = str_replace($old_hover, $new_hover, $content);
        $changes++;
        echo "✅ Hover actualizado para NO aplicar en :active\n";
    }

    // 2. Asegurar que :active vuelve a normal
    if (preg_match('/\.calendar-nav-button:active\s*\{[^}]+\}/s', $content, $active_match)) {
        $old_active = $active_match[0];

        $new_active = ".calendar-nav-button:active {
            background: var(--color-elevated-2) !important;
            border-color: var(--color-separator) !important;
            transform: scale(0.95);
        }";

        $content = str_replace($old_active, $new_active, $content);
        $changes++;
        echo "✅ Active actualizado con !important para forzar color normal\n";
    }

    // 3. Agregar :focus para que tampoco se quede en rosa
    $focus_css = "\n\n        .calendar-nav-button:focus {
            background: var(--color-elevated-2) !important;
            border-color: var(--color-separator) !important;
            outline: none;
        }";

    // Buscar donde insertar el CSS de focus
    if (preg_match('/\.calendar-nav-button:active\s*\{[^}]+\}/s', $content, $active_match)) {
        $insertion_point = $active_match[0];
        $new_block = $insertion_point . $focus_css;
        $content = str_replace($insertion_point, $new_block, $content);
        $changes++;
        echo "✅ CSS de :focus agregado para evitar que se quede en rosa\n";
    }

    // 4. Agregar JavaScript para remover focus después del click
    $js_marker = "document.addEventListener('DOMContentLoaded', function() {";

    if (strpos($content, $js_marker) !== false) {
        // Buscar el inicio del script y agregar el código
        $blur_code = "\n\n        // Remover focus de botones después de hacer clic\n        document.querySelectorAll('.calendar-nav-button').forEach(function(button) {\n            button.addEventListener('click', function() {\n                setTimeout(function() {\n                    button.blur();\n                }, 100);\n            });\n        });\n\n        ";

        $content = str_replace($js_marker, $js_marker . $blur_code, $content);
        $changes++;
        echo "✅ JavaScript agregado para remover focus después del click\n";
    }

    echo "\n📊 Total de cambios: $changes\n\n";

    // Guardar cambios
    $stmt = $pdo->prepare("UPDATE wp_posts SET post_content = :content, post_modified = NOW(), post_modified_gmt = UTC_TIMESTAMP() WHERE ID = 198");
    $stmt->bindParam(':content', $content);
    $stmt->execute();

    echo "✅ BASE DE DATOS ACTUALIZADA!\n\n";

    // Limpiar cache
    @file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");
    sleep(1);
    @file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");

    echo "✅ Cache limpiado\n\n";
    echo "🎯 Recarga con Ctrl+Shift+R\n";
    echo "   El botón ahora:\n";
    echo "   - Se pone ROSA solo al pasar el cursor\n";
    echo "   - Vuelve a color NORMAL después de hacer clic\n";
    echo "   - NO se queda en rosa\n";
    echo "   - El focus se remueve automáticamente\n\n";

    // Auto-eliminar
    @unlink(__FILE__);
    echo "✅ Script eliminado\n";

} catch (PDOException $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}
?>

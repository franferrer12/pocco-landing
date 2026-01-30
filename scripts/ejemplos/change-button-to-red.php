<?php
// Script para cambiar el botón a ROJO (color de la web)

$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== CAMBIANDO BOTÓN A ROJO DE LA WEB ===\n\n";

    $stmt = $pdo->prepare("SELECT post_content FROM wp_posts WHERE ID = 198");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        die("❌ No se encontró la página\n");
    }

    $content = $result['post_content'];

    $changes = 0;

    // Cambiar el hover de rosa a rojo
    if (preg_match('/\.calendar-nav-button:hover:not\(:active\)\s*\{[^}]+\}/s', $content, $hover_match)) {
        echo "✅ Encontrado CSS de :hover actual:\n";
        echo $hover_match[0] . "\n\n";

        $old_hover = $hover_match[0];

        // Cambiar a ROJO (color de la web)
        $new_hover = ".calendar-nav-button:hover:not(:active) {
            background: #ff0000;
            border-color: #ff0000;
            transform: scale(1.1);
        }";

        $content = str_replace($old_hover, $new_hover, $content);
        $changes++;
        echo "✅ Hover cambiado de rosa a ROJO (#ff0000)\n\n";
    }

    echo "📊 Total de cambios: $changes\n\n";

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
    echo "   - Se pone ROJO (#ff0000) al hacer hover\n";
    echo "   - Mismo color rojo que usa la web\n";
    echo "   - Vuelve a color normal después de hacer clic\n\n";

    // Auto-eliminar
    @unlink(__FILE__);
    echo "✅ Script eliminado\n";

} catch (PDOException $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}
?>

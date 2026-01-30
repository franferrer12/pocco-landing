<?php
// Script para mover el VIP recomendado primero en móvil

$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== MOVIENDO VIP RECOMENDADO PRIMERO EN MÓVIL ===\n\n";

    $stmt = $pdo->prepare("SELECT post_content FROM wp_posts WHERE ID = 198");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        die("❌ No se encontró la página\n");
    }

    $content = $result['post_content'];

    // Buscar el final del JavaScript (antes del </script>)
    $js_marker = "document.addEventListener('DOMContentLoaded', function() {";

    if (strpos($content, $js_marker) !== false) {
        // Agregar código JavaScript para reordenar VIPs en móvil
        $vip_reorder_code = "\n\n        // Mover VIP recomendado primero en móvil\n        function reorderVIPsOnMobile() {\n            if (window.innerWidth <= 768) {\n                const vipContainer = document.querySelector('.vip-cards');\n                if (vipContainer) {\n                    const featuredCard = vipContainer.querySelector('.vip-card.featured');\n                    if (featuredCard) {\n                        // Mover el VIP recomendado al inicio\n                        vipContainer.insertBefore(featuredCard, vipContainer.firstChild);\n                        console.log('✅ VIP recomendado movido al inicio en móvil');\n                    }\n                }\n            }\n        }\n\n        // Ejecutar al cargar la página\n        reorderVIPsOnMobile();\n\n        // También ejecutar si se cambia el tamaño de la ventana\n        let resizeTimer;\n        window.addEventListener('resize', function() {\n            clearTimeout(resizeTimer);\n            resizeTimer = setTimeout(function() {\n                reorderVIPsOnMobile();\n            }, 250);\n        });\n\n        ";

        $content = str_replace($js_marker, $js_marker . $vip_reorder_code, $content);
        echo "✅ JavaScript agregado para reordenar VIPs en móvil\n\n";

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
        echo "🎯 Recarga la página en MÓVIL\n";
        echo "   El VIP Cabina (recomendado) aparecerá PRIMERO\n";
        echo "   Orden en móvil: VIP Cabina, VIP Tarima, Supervip\n\n";

    } else {
        echo "❌ No se encontró el marcador JavaScript\n";
    }

    // Auto-eliminar
    @unlink(__FILE__);
    echo "✅ Script eliminado\n";

} catch (PDOException $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}
?>

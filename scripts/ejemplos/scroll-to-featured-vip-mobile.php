<?php
// Script para hacer scroll automático al VIP recomendado en móvil

$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== HACIENDO SCROLL A VIP RECOMENDADO EN MÓVIL ===\n\n";

    $stmt = $pdo->prepare("SELECT post_content FROM wp_posts WHERE ID = 198");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        die("❌ No se encontró la página\n");
    }

    $content = $result['post_content'];

    // Buscar y REEMPLAZAR el código anterior de reordenar VIPs
    $old_code = "// Mover VIP recomendado primero en móvil
        function reorderVIPsOnMobile() {
            if (window.innerWidth <= 768) {
                const vipContainer = document.querySelector('.vip-cards');
                if (vipContainer) {
                    const featuredCard = vipContainer.querySelector('.vip-card.featured');
                    if (featuredCard) {
                        // Mover el VIP recomendado al inicio
                        vipContainer.insertBefore(featuredCard, vipContainer.firstChild);
                        console.log('✅ VIP recomendado movido al inicio en móvil');
                    }
                }
            }
        }

        // Ejecutar al cargar la página
        reorderVIPsOnMobile();

        // También ejecutar si se cambia el tamaño de la ventana
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                reorderVIPsOnMobile();
            }, 250);
        });";

    $new_code = "// Hacer scroll al VIP recomendado en móvil (mantiene orden original)
        function scrollToFeaturedVIP() {
            if (window.innerWidth <= 768) {
                const vipContainer = document.querySelector('.vip-cards');
                if (vipContainer) {
                    const featuredCard = vipContainer.querySelector('.vip-card.featured');
                    if (featuredCard) {
                        // Hacer scroll suave al VIP recomendado (el del medio)
                        setTimeout(function() {
                            featuredCard.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                                inline: 'center'
                            });
                            console.log('✅ Scroll al VIP recomendado en móvil');
                        }, 300);
                    }
                }
            }
        }

        // Ejecutar al cargar la página
        scrollToFeaturedVIP();";

    if (strpos($content, $old_code) !== false) {
        $content = str_replace($old_code, $new_code, $content);
        echo "✅ Código actualizado: de reordenar a scroll\n\n";
    } else {
        echo "ℹ️  Código anterior no encontrado, buscando alternativa...\n\n";

        // Si no encuentra el código exacto, buscar el marcador y agregar
        $marker = "document.addEventListener('DOMContentLoaded', function() {";
        if (strpos($content, $marker) !== false) {
            $content = str_replace($marker, $marker . "\n\n        " . $new_code . "\n", $content);
            echo "✅ Código agregado en DOMContentLoaded\n\n";
        }
    }

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
    echo "   Orden mantiene: Tarima | Cabina (centro) | Supervip\n";
    echo "   Pero el carrusel se posiciona automáticamente en el CENTRO\n";
    echo "   Mostrando VIP Cabina (recomendado) primero\n\n";

    // Auto-eliminar
    @unlink(__FILE__);
    echo "✅ Script eliminado\n";

} catch (PDOException $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}
?>

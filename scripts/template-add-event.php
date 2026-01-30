<?php
/**
 * Template para agregar un nuevo evento al calendario
 *
 * INSTRUCCIONES:
 * 1. Copia este archivo a /tmp/
 * 2. Modifica las variables de configuración del evento
 * 3. Súbelo al servidor por FTP
 * 4. Ejecútalo accediendo a la URL
 * 5. El script se auto-elimina después de ejecutarse
 *
 * IMPORTANTE: Siempre limpia la caché de LiteSpeed después
 */

// ========================================
// CREDENCIALES DE LA BASE DE DATOS
// ========================================
$db_name = 'u381629691_VGByx';
$db_user = 'u381629691_melFW';
$db_pass = 'C9v9ju5G6B';
$db_host = '127.0.0.1';

// ========================================
// CONFIGURACIÓN DEL EVENTO
// ========================================
$event_title = "CAMBIAR: Título del Evento";
$event_date = "2025-12-31";                    // Formato: YYYY-MM-DD
$event_time = "23:00";                         // Formato: HH:MM
$event_description = "CAMBIAR: Descripción del evento aquí";
$event_location = "Pocco Club";

// ========================================
// NO MODIFICAR DEBAJO DE ESTA LÍNEA
// ========================================

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== AGREGANDO NUEVO EVENTO ===\n\n";
    echo "Título: $event_title\n";
    echo "Fecha: $event_date $event_time\n";
    echo "Descripción: $event_description\n\n";

    // Verificar si ya existe un evento con el mismo título y fecha
    $stmt = $pdo->prepare("
        SELECT ID FROM wp_posts
        WHERE post_title = :title
        AND post_type = 'tribe_events'
        AND post_status = 'publish'
    ");
    $stmt->bindParam(':title', $event_title);
    $stmt->execute();

    if ($stmt->fetch()) {
        die("⚠️  Ya existe un evento con este título. Si quieres duplicarlo, cambia el título ligeramente.\n");
    }

    // Insertar el evento
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

    // Agregar metadatos del evento
    $event_start = "$event_date $event_time:00";
    $event_end_date = date('Y-m-d', strtotime($event_date . ' +1 day'));
    $event_end = "$event_end_date 05:00:00"; // Termina a las 5 AM del día siguiente

    $meta_data = [
        '_EventStartDate' => $event_start,
        '_EventEndDate' => $event_end,
        '_EventVenueID' => "0",
        '_EventShowMapLink' => "1",
        '_EventShowMap' => "1",
        '_EventTimezone' => "Europe/Madrid",
        '_EventTimezoneAbbr' => "CET",
        '_EventURL' => "",
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

    // Limpiar cache de LiteSpeed (2 veces para asegurar)
    echo "Limpiando caché de LiteSpeed...\n";
    @file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");
    sleep(1);
    @file_get_contents("https://pocco.club/wp-json/litespeed/v1/purge_all");

    echo "✅ Cache limpiado\n\n";
    echo "========================================\n";
    echo "🎉 ¡EVENTO AGREGADO EXITOSAMENTE!\n";
    echo "========================================\n\n";
    echo "Detalles del evento:\n";
    echo "  ID: $event_id\n";
    echo "  Título: $event_title\n";
    echo "  Fecha: $event_date a las $event_time\n";
    echo "  Ubicación: $event_location\n\n";
    echo "🎯 Verifica en: https://pocco.club/eventos\n";
    echo "   - Busca el mes correcto en el calendario\n";
    echo "   - Verifica que aparezca el punto rojo en el día\n";
    echo "   - Haz clic para ver el popup con la información\n";
    echo "   - Prueba en móvil también\n\n";
    echo "⚠️  IMPORTANTE: Si no ves los cambios:\n";
    echo "   1. Abre en modo incógnito (Ctrl+Shift+N)\n";
    echo "   2. O recarga con Ctrl+Shift+R\n\n";

    // Auto-eliminar el script
    @unlink(__FILE__);
    echo "✅ Script auto-eliminado del servidor\n";

} catch (PDOException $e) {
    die("❌ Error de base de datos: " . $e->getMessage() . "\n");
}
?>

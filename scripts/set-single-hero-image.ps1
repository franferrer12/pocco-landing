# Script para configurar MBP-01345.jpg como ÚNICA imagen del hero
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "`n=== CONFIGURANDO IMAGEN ÚNICA DEL HERO ===" -ForegroundColor Cyan
Write-Host "Imagen: MBP-01345.jpg`n" -ForegroundColor White

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Backup
$backupFile = "D:\pocco-html-static\backup\index-before-single-hero.html"
Copy-Item $htmlFile $backupFile -Force
Write-Host "[BACKUP] Creado: $backupFile" -ForegroundColor Green

# Hero Desktop (línea 613) - Reemplazar el array completo de imágenes
Write-Host "`n[1] Modificando hero desktop..." -ForegroundColor Yellow

$oldDesktopPattern = 'data-settings="\{&quot;background_background&quot;:&quot;slideshow&quot;,&quot;background_slideshow_gallery&quot;:\[\{&quot;id&quot;:23394,&quot;url&quot;:&quot;images/pocco-01\.jpg&quot;\},\{&quot;id&quot;:23360,&quot;url&quot;:&quot;images/pocco-02\.jpg&quot;\},\{&quot;id&quot;:23361,&quot;url&quot;:&quot;images/pocco-03\.jpg&quot;\},\{&quot;id&quot;:23362,&quot;url&quot;:&quot;images/pocco-04\.jpg&quot;\},\{&quot;id&quot;:25479,&quot;url&quot;:&quot;images/pocco-05\.jpg&quot;\}\],&quot;background_slideshow_loop&quot;:&quot;yes&quot;,&quot;background_slideshow_slide_duration&quot;:5000,&quot;background_slideshow_slide_transition&quot;:&quot;fade&quot;,&quot;background_slideshow_transition_duration&quot;:500\}"'

$newDesktopSettings = 'data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;background_image&quot;:{&quot;url&quot;:&quot;images/MBP-01345.jpg&quot;,&quot;id&quot;:1345},&quot;background_position&quot;:&quot;center center&quot;,&quot;background_size&quot;:&quot;cover&quot;}"'

if ($content -match $oldDesktopPattern) {
    $content = $content -replace $oldDesktopPattern, $newDesktopSettings
    Write-Host "  [OK] Hero desktop actualizado a imagen única" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Patrón desktop no encontrado, buscando alternativa..." -ForegroundColor Yellow

    # Patrón más flexible
    $content = $content -replace 'data-element_type="container" data-settings="\{&quot;background_background&quot;:&quot;slideshow&quot;,&quot;background_slideshow_gallery&quot;:\[.*?\],&quot;background_slideshow_loop&quot;:&quot;yes&quot;,&quot;background_slideshow_slide_duration&quot;:5000,&quot;background_slideshow_slide_transition&quot;:&quot;fade&quot;,&quot;background_slideshow_transition_duration&quot;:500\}"', 'data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;background_image&quot;:{&quot;url&quot;:&quot;images/MBP-01345.jpg&quot;,&quot;id&quot;:1345},&quot;background_position&quot;:&quot;center center&quot;,&quot;background_size&quot;:&quot;cover&quot;}"'

    Write-Host "  [OK] Hero desktop actualizado (patrón flexible)" -ForegroundColor Green
}

# Hero Mobile (línea 619) - Reemplazar el array de imágenes
Write-Host "`n[2] Modificando hero mobile..." -ForegroundColor Yellow

$oldMobilePattern = 'data-settings="\{&quot;background_background&quot;:&quot;slideshow&quot;,&quot;background_slideshow_gallery&quot;:\[\{&quot;id&quot;:23142,&quot;url&quot;:&quot;images/pocco-01\.jpg&quot;\},\{&quot;id&quot;:23139,&quot;url&quot;:&quot;images/pocco-02\.jpg&quot;\},\{&quot;id&quot;:23140,&quot;url&quot;:&quot;images/pocco-03\.jpg&quot;\},\{&quot;id&quot;:23401,&quot;url&quot;:&quot;images/pocco-04\.jpg&quot;\}\],&quot;background_slideshow_loop&quot;:&quot;yes&quot;,&quot;background_slideshow_slide_duration&quot;:5000,&quot;background_slideshow_slide_transition&quot;:&quot;fade&quot;,&quot;background_slideshow_transition_duration&quot;:500\}"'

$newMobileSettings = 'data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;background_image&quot;:{&quot;url&quot;:&quot;images/MBP-01345.jpg&quot;,&quot;id&quot;:1345},&quot;background_position&quot;:&quot;center center&quot;,&quot;background_size&quot;:&quot;cover&quot;}"'

if ($content -match $oldMobilePattern) {
    $content = $content -replace $oldMobilePattern, $newMobileSettings
    Write-Host "  [OK] Hero mobile actualizado a imagen única" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Patrón mobile no encontrado, buscando alternativa..." -ForegroundColor Yellow

    # Patrón más flexible para mobile
    $content = $content -replace 'data-element_type="section" data-settings="\{&quot;background_background&quot;:&quot;slideshow&quot;,&quot;background_slideshow_gallery&quot;:\[.*?\],&quot;background_slideshow_loop&quot;:&quot;yes&quot;,&quot;background_slideshow_slide_duration&quot;:5000,&quot;background_slideshow_slide_transition&quot;:&quot;fade&quot;,&quot;background_slideshow_transition_duration&quot;:500\}"', 'data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;background_image&quot;:{&quot;url&quot;:&quot;images/MBP-01345.jpg&quot;,&quot;id&quot;:1345},&quot;background_position&quot;:&quot;center center&quot;,&quot;background_size&quot;:&quot;cover&quot;}"'

    Write-Host "  [OK] Hero mobile actualizado (patrón flexible)" -ForegroundColor Green
}

# Guardar cambios
$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "[COMPLETADO] Hero configurado con MBP-01345.jpg" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "Ahora solo se mostrará la imagen MBP-01345.jpg" -ForegroundColor White
Write-Host "sin slider, como imagen estática del hero.`n" -ForegroundColor Gray

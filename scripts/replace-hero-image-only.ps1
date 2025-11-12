# Script QUIRÚRGICO - Solo cambiar imagen del hero, sin tocar nada más
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "`n=== CAMBIANDO SOLO IMAGEN DEL HERO ===" -ForegroundColor Cyan
Write-Host "Imagen: MBP-01345.jpg`n" -ForegroundColor White

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = "D:\pocco-html-static\backup\index-before-hero-change-$timestamp.html"
Copy-Item $htmlFile $backupFile -Force
Write-Host "[BACKUP] $backupFile`n" -ForegroundColor Green

# SOLO cambiar el hero desktop (línea 613)
# De slideshow con múltiples imágenes a imagen estática única
Write-Host "[1] Cambiando hero DESKTOP..." -ForegroundColor Yellow

$oldDesktop = 'data-settings="{&quot;background_background&quot;:&quot;slideshow&quot;,&quot;background_slideshow_gallery&quot;:[{&quot;id&quot;:23394,&quot;url&quot;:&quot;images/pocco-01.jpg&quot;},{&quot;id&quot;:23360,&quot;url&quot;:&quot;images/pocco-02.jpg&quot;},{&quot;id&quot;:23361,&quot;url&quot;:&quot;images/pocco-03.jpg&quot;},{&quot;id&quot;:23362,&quot;url&quot;:&quot;images/pocco-04.jpg&quot;},{&quot;id&quot;:25479,&quot;url&quot;:&quot;images/pocco-05.jpg&quot;}],&quot;background_slideshow_loop&quot;:&quot;yes&quot;,&quot;background_slideshow_slide_duration&quot;:5000,&quot;background_slideshow_slide_transition&quot;:&quot;fade&quot;,&quot;background_slideshow_transition_duration&quot;:500}"'

$newDesktop = 'data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;background_image&quot;:{&quot;url&quot;:&quot;images/MBP-01345.jpg&quot;,&quot;id&quot;:1345},&quot;background_position&quot;:&quot;center center&quot;,&quot;background_size&quot;:&quot;cover&quot;}"'

if ($content -match [regex]::Escape($oldDesktop)) {
    $content = $content -replace [regex]::Escape($oldDesktop), $newDesktop
    Write-Host "  [OK] Hero desktop cambiado a MBP-01345.jpg" -ForegroundColor Green
} else {
    Write-Host "  [WARN] No se encontró el patrón exacto desktop" -ForegroundColor Yellow
}

# SOLO cambiar el hero mobile (línea 619)
Write-Host "`n[2] Cambiando hero MOBILE..." -ForegroundColor Yellow

$oldMobile = 'data-settings="{&quot;background_background&quot;:&quot;slideshow&quot;,&quot;background_slideshow_gallery&quot;:[{&quot;id&quot;:23142,&quot;url&quot;:&quot;images/pocco-01.jpg&quot;},{&quot;id&quot;:23139,&quot;url&quot;:&quot;images/pocco-02.jpg&quot;},{&quot;id&quot;:23140,&quot;url&quot;:&quot;images/pocco-03.jpg&quot;},{&quot;id&quot;:23401,&quot;url&quot;:&quot;images/pocco-04.jpg&quot;}],&quot;background_slideshow_loop&quot;:&quot;yes&quot;,&quot;background_slideshow_slide_duration&quot;:5000,&quot;background_slideshow_slide_transition&quot;:&quot;fade&quot;,&quot;background_slideshow_transition_duration&quot;:500}"'

$newMobile = 'data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;background_image&quot;:{&quot;url&quot;:&quot;images/MBP-01345.jpg&quot;,&quot;id&quot;:1345},&quot;background_position&quot;:&quot;center center&quot;,&quot;background_size&quot;:&quot;cover&quot;}"'

if ($content -match [regex]::Escape($oldMobile)) {
    $content = $content -replace [regex]::Escape($oldMobile), $newMobile
    Write-Host "  [OK] Hero mobile cambiado a MBP-01345.jpg" -ForegroundColor Green
} else {
    Write-Host "  [WARN] No se encontró el patrón exacto mobile" -ForegroundColor Yellow
}

# Guardar
$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "[COMPLETADO] Imagen del hero cambiada" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "Hero ahora muestra MBP-01345.jpg como imagen única." -ForegroundColor White
Write-Host "Todo lo demás permanece intacto.`n" -ForegroundColor Gray

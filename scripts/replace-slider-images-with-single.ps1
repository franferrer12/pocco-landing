# Mantener slideshow pero con solo UNA imagen: MBP-01345.jpg
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "`n=== MANTENIENDO SLIDESHOW CON UNA SOLA IMAGEN ===" -ForegroundColor Cyan
Write-Host "Imagen: MBP-01345.jpg`n" -ForegroundColor White

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = "D:\pocco-html-static\backup\index-single-slide-$timestamp.html"
Copy-Item $htmlFile $backupFile -Force
Write-Host "[BACKUP] $backupFile`n" -ForegroundColor Green

Write-Host "[1] Reemplazando array de imágenes en hero DESKTOP..." -ForegroundColor Yellow

# Desktop: Mantener slideshow pero con solo una imagen
$oldDesktopGallery = '\{&quot;id&quot;:23394,&quot;url&quot;:&quot;images/pocco-01\.jpg&quot;\},\{&quot;id&quot;:23360,&quot;url&quot;:&quot;images/pocco-02\.jpg&quot;\},\{&quot;id&quot;:23361,&quot;url&quot;:&quot;images/pocco-03\.jpg&quot;\},\{&quot;id&quot;:23362,&quot;url&quot;:&quot;images/pocco-04\.jpg&quot;\},\{&quot;id&quot;:25479,&quot;url&quot;:&quot;images/pocco-05\.jpg&quot;\}'

$newDesktopGallery = '{&quot;id&quot;:1345,&quot;url&quot;:&quot;images/MBP-01345.jpg&quot;}'

if ($content -match $oldDesktopGallery) {
    $content = $content -replace $oldDesktopGallery, $newDesktopGallery
    Write-Host "  [OK] Array de imágenes desktop reemplazado" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Patrón no encontrado exactamente" -ForegroundColor Yellow
}

Write-Host "`n[2] Reemplazando array de imágenes en hero MOBILE..." -ForegroundColor Yellow

# Mobile: Mantener slideshow pero con solo una imagen
$oldMobileGallery = '\{&quot;id&quot;:23142,&quot;url&quot;:&quot;images/pocco-01\.jpg&quot;\},\{&quot;id&quot;:23139,&quot;url&quot;:&quot;images/pocco-02\.jpg&quot;\},\{&quot;id&quot;:23140,&quot;url&quot;:&quot;images/pocco-03\.jpg&quot;\},\{&quot;id&quot;:23401,&quot;url&quot;:&quot;images/pocco-04\.jpg&quot;\}'

$newMobileGallery = '{&quot;id&quot;:1345,&quot;url&quot;:&quot;images/MBP-01345.jpg&quot;}'

if ($content -match $oldMobileGallery) {
    $content = $content -replace $oldMobileGallery, $newMobileGallery
    Write-Host "  [OK] Array de imágenes mobile reemplazado" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Patrón no encontrado exactamente" -ForegroundColor Yellow
}

# Guardar
$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "[COMPLETADO] Slideshow con imagen única" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "El slideshow mantiene su formato original" -ForegroundColor White
Write-Host "pero ahora solo muestra MBP-01345.jpg`n" -ForegroundColor Gray

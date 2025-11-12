# Forzar imagen del hero con estilo inline directo
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "`n=== FORZANDO IMAGEN CON ESTILO INLINE ===" -ForegroundColor Cyan

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Backup
$backupFile = "D:\pocco-html-static\backup\index-before-inline-style.html"
Copy-Item $htmlFile $backupFile -Force
Write-Host "[BACKUP] $backupFile`n" -ForegroundColor Green

Write-Host "[1] Agregando estilo inline al hero desktop..." -ForegroundColor Yellow

# Buscar el div del hero desktop y agregarle style inline
$pattern1 = '(<div class="elementor-element elementor-element-7518580[^>]*)(>)'
$replacement1 = '$1 style="background-image: url(''images/MBP-01345.jpg'') !important; background-size: cover !important; background-position: center !important; min-height: 100vh !important; width: 100% !important; display: block !important;"$2'

if ($content -match $pattern1) {
    $content = $content -replace $pattern1, $replacement1
    Write-Host "  [OK] Estilo inline agregado al hero desktop" -ForegroundColor Green
}

Write-Host "`n[2] Agregando estilo inline al hero mobile..." -ForegroundColor Yellow

# Buscar el section del hero mobile
$pattern2 = '(<section class="elementor-section[^>]*elementor-element-3eb860e[^>]*)(>)'
$replacement2 = '$1 style="background-image: url(''images/MBP-01345.jpg'') !important; background-size: cover !important; background-position: center !important; min-height: 100vh !important; width: 100% !important; display: block !important;"$2'

if ($content -match $pattern2) {
    $content = $content -replace $pattern2, $replacement2
    Write-Host "  [OK] Estilo inline agregado al hero mobile" -ForegroundColor Green
}

# Guardar
$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "[COMPLETADO] Estilos inline agregados" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "La imagen ahora está forzada con style inline." -ForegroundColor White
Write-Host "Esto debería funcionar incluso sin CSS de Elementor.`n" -ForegroundColor Gray

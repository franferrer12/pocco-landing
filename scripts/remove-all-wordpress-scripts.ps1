# Script AGRESIVO - Eliminar TODOS los scripts de WordPress/Elementor/Instagram
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "`n=== LIMPIEZA AGRESIVA DE SCRIPTS ===" -ForegroundColor Red

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Backup
$backupFile = "D:\pocco-html-static\backup\index-before-aggressive-cleanup.html"
Copy-Item $htmlFile $backupFile -Force
Write-Host "[BACKUP] $backupFile`n" -ForegroundColor Green

$changes = 0

# 1. Comentar TODOS los scripts que cargan JS externos (Elementor, Instagram, etc)
Write-Host "[1] Comentando scripts de Elementor..." -ForegroundColor Yellow
$patterns = @(
    '<script[^>]*src=[''"][^''"]*elementor[^''"]*[''"][^>]*></script>',
    '<script[^>]*id=[''"]elementor[^''"]*[''"][^>]*></script>',
    '<script[^>]*src=[^>]*sbi-scripts[^>]*></script>',
    '<script[^>]*src=[^>]*instagram[^>]*></script>',
    '<script[^>]*src=[^>]*webpack[^>]*></script>',
    '<script[^>]*id=[''"]swiper[^''"]*[''"][^>]*></script>',
    '<script[^>]*fancybox[^>]*></script>'
)

foreach ($pattern in $patterns) {
    $matches = [regex]::Matches($content, $pattern)
    if ($matches.Count -gt 0) {
        $content = [regex]::Replace($content, $pattern, '<!-- $0 -->')
        Write-Host "  [OK] Patrón comentado ($($matches.Count) matches)" -ForegroundColor Green
        $changes += $matches.Count
    }
}

# 2. Comentar bloques de script inline con configuraciones de Elementor
Write-Host "`n[2] Comentando configuraciones inline de Elementor..." -ForegroundColor Yellow
$inlinePatterns = @(
    '<script[^>]*id=[''"]elementor-frontend-js-before[''"][^>]*>.*?</script>',
    '<script[^>]*id=[''"]elementor-pro-frontend-js-before[''"][^>]*>.*?</script>',
    '<script[^>]*id=[''"]sbi_scripts-js-extra[''"][^>]*>.*?</script>'
)

foreach ($pattern in $inlinePatterns) {
    if ($content -match $pattern) {
        $content = $content -replace $pattern, '<!-- Inline script removed -->'
        Write-Host "  [OK] Script inline comentado" -ForegroundColor Green
        $changes++
    }
}

# 3. Comentar CSS de Instagram feed
Write-Host "`n[3] Comentando CSS de Instagram..." -ForegroundColor Yellow
$content = $content -replace '<link[^>]*sbi-styles[^>]*>', '<!-- Instagram CSS removed -->'
Write-Host "  [OK] CSS de Instagram comentado" -ForegroundColor Green
$changes++

# 4. Comentar divs de Instagram feed para evitar errores JS
Write-Host "`n[4] Comentando widgets de Instagram..." -ForegroundColor Yellow
$content = $content -replace '<div[^>]*class=[''"]sbi[^''"]*[''"][^>]*>.*?</div>', '<!-- Instagram widget removed -->'
Write-Host "  [OK] Widgets de Instagram comentados" -ForegroundColor Green
$changes++

# Guardar
$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "[COMPLETADO] $changes elementos eliminados" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "Scripts de WordPress/Elementor/Instagram eliminados." -ForegroundColor White
Write-Host "Página limpia, solo HTML/CSS esencial.`n" -ForegroundColor Gray

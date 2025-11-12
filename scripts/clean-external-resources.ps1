# Script para eliminar TODAS las referencias externas problemáticas
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "`n=== LIMPIANDO RECURSOS EXTERNOS ===" -ForegroundColor Cyan

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Backup
$backupFile = "D:\pocco-html-static\backup\index-before-cleanup.html"
Copy-Item $htmlFile $backupFile -Force
Write-Host "[BACKUP] $backupFile`n" -ForegroundColor Green

$changes = 0

# 1. Comentar TODOS los <link> de fitzclubmadrid.com
Write-Host "[1] Comentando CSS externos de fitzclubmadrid..." -ForegroundColor Yellow
$pattern1 = '<link[^>]*href=[''"]https://fitzclubmadrid\.com[^>]*>'
$matches = [regex]::Matches($content, $pattern1)
if ($matches.Count -gt 0) {
    $content = [regex]::Replace($content, $pattern1, '<!-- $0 -->')
    Write-Host "  [OK] $($matches.Count) links de CSS comentados" -ForegroundColor Green
    $changes += $matches.Count
}

# 2. Comentar canonical y og:url de fitzclubmadrid
Write-Host "`n[2] Limpiando meta tags de fitzclubmadrid..." -ForegroundColor Yellow
$content = $content -replace '<link rel="canonical" href="https://fitzclubmadrid\.com/"[^>]*>', '<!-- Canonical removed -->'
$content = $content -replace '<meta property="og:url" content="https://fitzclubmadrid\.com/"[^>]*>', '<!-- OG URL removed -->'
$content = $content -replace '<meta property="og:image" content="https://fitzclubmadrid\.com[^"]*"[^>]*>', '<!-- OG Image removed -->'
Write-Host "  [OK] Meta tags limpiados" -ForegroundColor Green
$changes += 3

# 3. Comentar feeds RSS de fitzclubmadrid
Write-Host "`n[3] Comentando RSS feeds..." -ForegroundColor Yellow
$content = $content -replace '<link rel="alternate"[^>]*href="https://fitzclubmadrid\.com[^>]*>', '<!-- $0 -->'
Write-Host "  [OK] RSS feeds comentados" -ForegroundColor Green
$changes++

# 4. Limpiar wpemojiSettings y referencias a fitzclubmadrid en scripts inline
Write-Host "`n[4] Limpiando scripts inline con fitzclubmadrid..." -ForegroundColor Yellow
$content = $content -replace 'https:\\\/\\\/fitzclubmadrid\.com', 'https:\\/\\/localhost'
Write-Host "  [OK] Referencias en scripts inline limpiadas" -ForegroundColor Green
$changes++

# 5. Comentar script de PixelYourSite
Write-Host "`n[5] Comentando PixelYourSite..." -ForegroundColor Yellow
$content = $content -replace "<script type='application/javascript'[^>]*id='pys-version-script'[^>]*>.*?</script>", '<!-- PixelYourSite removed -->'
Write-Host "  [OK] PixelYourSite comentado" -ForegroundColor Green
$changes++

# 6. Comentar referencias a fonts.googleapis con familia Syne (que falla)
Write-Host "`n[6] Limpiando fuente Syne problemática..." -ForegroundColor Yellow
$content = $content -replace '<link[^>]*fonts\.googleapis\.com[^>]*Syne[^>]*>', '<!-- Syne font removed -->'
Write-Host "  [OK] Fuente Syne removida" -ForegroundColor Green
$changes++

# 7. Añadir comentario al inicio del <style> con @font-face problemáticos
Write-Host "`n[7] Comentando @font-face con fuentes externas..." -ForegroundColor Yellow
# Buscar y comentar @font-face que usen fitzclubmadrid.com
$fontFacePattern = '@font-face\s*\{[^}]*url\([^)]*fitzclubmadrid\.com[^}]*\}'
$matches = [regex]::Matches($content, $fontFacePattern)
if ($matches.Count -gt 0) {
    foreach ($match in $matches) {
        $commented = "/* EXTERNAL FONT REMOVED: " + $match.Value + " */"
        $content = $content -replace [regex]::Escape($match.Value), $commented
    }
    Write-Host "  [OK] $($matches.Count) @font-face comentados" -ForegroundColor Green
    $changes += $matches.Count
}

# 8. Agregar meta viewport si no existe (para responsive)
if ($content -notmatch '<meta name="viewport"') {
    Write-Host "`n[8] Agregando meta viewport..." -ForegroundColor Yellow
    $content = $content -replace '<meta charset="UTF-8">', '<meta charset="UTF-8">' + "`n`t<meta name=`"viewport`" content=`"width=device-width, initial-scale=1.0`">"
    Write-Host "  [OK] Meta viewport agregado" -ForegroundColor Green
    $changes++
}

# Guardar
$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "[COMPLETADO] $changes elementos limpiados" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "Recursos externos de fitzclubmadrid.com eliminados." -ForegroundColor White
Write-Host "La página ahora solo usa recursos locales y Google Fonts.`n" -ForegroundColor Gray

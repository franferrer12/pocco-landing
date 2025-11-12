# Cambiar posición de la imagen a TOP (superior)
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "`n=== CAMBIANDO POSICIÓN A TOP ===" -ForegroundColor Cyan

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Backup
$backupFile = "D:\pocco-html-static\backup\index-before-top-position.html"
Copy-Item $htmlFile $backupFile -Force
Write-Host "[BACKUP] $backupFile`n" -ForegroundColor Green

Write-Host "[1] Cambiando background-position de center a top..." -ForegroundColor Yellow

# Cambiar center center a center top
$content = $content -replace '&quot;background_position&quot;:&quot;center center&quot;', '&quot;background_position&quot;:&quot;center top&quot;'

Write-Host "  [OK] Posición cambiada a 'center top'" -ForegroundColor Green

# Guardar
$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "[COMPLETADO] Imagen alineada desde arriba" -ForegroundColor Green
Write-Host "Background position cambiado a TOP" -ForegroundColor White

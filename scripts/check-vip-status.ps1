# Check all VIP button references in the file
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

Write-Host "=== Buscando todos los estilos del botón VIP ===" -ForegroundColor Cyan

# Find elementor-item-vip CSS
$pattern = '\.elementor-item-vip[^}]+\}'
$matches = [regex]::Matches($html, $pattern)

Write-Host "`nEncontrados $($matches.Count) bloques CSS para .elementor-item-vip:" -ForegroundColor Yellow

foreach ($match in $matches) {
    Write-Host "`n$($match.Value)" -ForegroundColor Green
}

# Check for any yellow color codes
Write-Host "`n=== Buscando colores amarillos ===" -ForegroundColor Cyan
if ($html -match '#F5E401|#FFE600') {
    Write-Host "ADVERTENCIA: Todavia hay referencias a amarillo en el archivo" -ForegroundColor Red
    $yellowMatches = [regex]::Matches($html, '#F5E401|#FFE600')
    Write-Host "Encontradas $($yellowMatches.Count) referencias"
} else {
    Write-Host "No hay referencias a amarillo" -ForegroundColor Green
}

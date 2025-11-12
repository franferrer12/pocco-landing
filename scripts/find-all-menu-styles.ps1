# Find all CSS that might affect the VIP button
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

Write-Host "=== Buscando CSS que afecta .elementor-item ===" -ForegroundColor Cyan

# Find .elementor-item styles
$pattern = '\.elementor-item[^{]*\{[^}]+\}'
$matches = [regex]::Matches($html, $pattern)

Write-Host "`nEncontrados $($matches.Count) bloques CSS:" -ForegroundColor Yellow

foreach ($match in $matches) {
    if ($match.Value -match 'color:') {
        Write-Host "`n$($match.Value)" -ForegroundColor Magenta
    }
}

Write-Host "`n=== Buscando estilos de navegacion ===" -ForegroundColor Cyan
$navPattern = '\.elementor-nav-menu[^{]*\{[^}]+color[^}]+\}'
$navMatches = [regex]::Matches($html, $navPattern)

foreach ($match in $navMatches) {
    Write-Host "`n$($match.Value)" -ForegroundColor Yellow
}

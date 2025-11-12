# Change Mesas VIP text color to black
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Find and replace white text color with black
$html = $html -replace '(\.elementor-item-vip \{[^}]+)color: #FFFFFF !important;', '$1color: #000000 !important;'

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "Texto del boton cambiado a negro" -ForegroundColor Green

# Change Mesas VIP text color to white
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Replace black with white
$html = $html -replace '(\.elementor-item-vip \{[^}]+)color: #000000 !important;', '$1color: #FFFFFF !important;'

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "Texto del boton en blanco" -ForegroundColor Green

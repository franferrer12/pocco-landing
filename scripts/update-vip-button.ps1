# Update Mesas VIP button - simpler approach
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Simple replacements
$html = $html -replace 'background: #F5E401 !important;', 'background: #520100 !important;'
$html = $html -replace 'color: #000000 !important;', 'color: #FFFFFF !important;'
$html = $html -replace 'border-radius: 25px !important;', 'border-radius: 0px !important;'
$html = $html -replace 'background: #FFE600 !important;', 'background: #7a0200 !important;'
$html = $html -replace 'box-shadow: 0 4px 12px rgba\(245, 228, 1, 0.4\);', 'box-shadow: 0 4px 12px rgba(82, 1, 0, 0.4);'

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Botón Mesas VIP actualizado correctamente" -ForegroundColor Green

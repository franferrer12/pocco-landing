# Fix VIP button - simple version
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Replace yellow to red
$html = $html -replace '#F5E401', '#520100'
$html = $html -replace '#FFE600', '#7a0200'
$html = $html -replace 'rgba\(245, 228, 1, 0\.4\)', 'rgba(82, 1, 0, 0.4)'
$html = $html -replace 'color: #000000 !important;', 'color: #FFFFFF !important;'
$html = $html -replace 'border-radius: 25px', 'border-radius: 0px'

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "Done" -ForegroundColor Green

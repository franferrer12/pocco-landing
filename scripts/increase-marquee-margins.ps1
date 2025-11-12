# Increase marquee margins
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Increase margins to 25px
$html = $html -replace 'margin-top: 15px !important;', 'margin-top: 25px !important;'
$html = $html -replace 'margin-bottom: 15px !important;', 'margin-bottom: 25px !important;'

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Margenes aumentados a 25px" -ForegroundColor Green

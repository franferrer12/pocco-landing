# Fix z-index so images go behind marquee texts
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Add CSS to ensure marquee texts are above the slider images and gradient
$zindexCSS = @"
/* Marquees por encima del slider */
.elementor-element-10c10ea8,
.elementor-element-302a54cc {
    position: relative !important;
    z-index: 10 !important;
}
"@

# Insert before the gradient CSS
$html = $html -replace '(/\* Degradado en hero slider)', "$zindexCSS`n`$1"

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Z-index ajustado - fotos por debajo de textos" -ForegroundColor Green

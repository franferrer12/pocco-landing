# Extend hero section and adjust gradient to show more image
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Add CSS to extend hero section height and ensure image coverage
$extendCSS = @"
/* Extender altura del hero y asegurar cobertura de imagen */
.elementor-element-7518580 {
    min-height: 100vh !important;
}
.elementor-element-7518580 .elementor-background-slideshow__slide__image {
    object-fit: cover !important;
    height: 100% !important;
}
.elementor-element-3eb860e {
    min-height: 100vh !important;
}
.elementor-element-3eb860e .elementor-background-slideshow__slide__image {
    object-fit: cover !important;
    height: 100% !important;
}
"@

# Insert before the marquee z-index CSS
$html = $html -replace '(/\* Marquees por encima del slider \*/)', "$extendCSS`n`$1"

# Also adjust gradient to be even more delayed
$oldGradient = @"
    background: linear-gradient\(to bottom,
        rgba\(0, 0, 0, 0\) 0%,
        rgba\(0, 0, 0, 0\) 75%,
        rgba\(0, 0, 0, 0\.3\) 85%,
        rgba\(0, 0, 0, 0\.7\) 93%,
        rgba\(0, 0, 0, 1\) 100%
    \);
"@

$newGradient = @"
    background: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 80%,
        rgba(0, 0, 0, 0.4) 90%,
        rgba(0, 0, 0, 0.8) 96%,
        rgba(0, 0, 0, 1) 100%
    );
"@

$html = $html -replace $oldGradient, $newGradient

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Hero extendido y degradado ajustado" -ForegroundColor Green

# Revert hero changes - remove extended height and restore original gradient
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Remove the extended height CSS
$removeCSS = @"
/\* Extender altura del hero y asegurar cobertura de imagen \*/
\.elementor-element-7518580 \{
    min-height: 100vh !important;
\}
\.elementor-element-7518580 \.elementor-background-slideshow__slide__image \{
    object-fit: cover !important;
    height: 100% !important;
\}
\.elementor-element-3eb860e \{
    min-height: 100vh !important;
\}
\.elementor-element-3eb860e \.elementor-background-slideshow__slide__image \{
    object-fit: cover !important;
    height: 100% !important;
\}

"@

$html = $html -replace $removeCSS, ""

# Restore gradient to original 60% start
$currentGradient = @"
    background: linear-gradient\(to bottom,
        rgba\(0, 0, 0, 0\) 0%,
        rgba\(0, 0, 0, 0\) 80%,
        rgba\(0, 0, 0, 0\.4\) 90%,
        rgba\(0, 0, 0, 0\.8\) 96%,
        rgba\(0, 0, 0, 1\) 100%
    \);
"@

$originalGradient = @"
    background: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 60%,
        rgba(0, 0, 0, 0.2) 70%,
        rgba(0, 0, 0, 0.5) 85%,
        rgba(0, 0, 0, 1) 100%
    );
"@

$html = $html -replace $currentGradient, $originalGradient

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Hero revertido al estado anterior" -ForegroundColor Green

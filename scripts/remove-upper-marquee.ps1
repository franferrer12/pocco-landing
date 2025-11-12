# Remove upper marquee and center lower one
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Hide the upper marquee (POCCO THE CLUB)
$html = $html -replace '(\.elementor-element-10c10ea8 \{[^}]+)display: block !important;', '$1display: none !important;'

# Center the lower marquee (de lo bueno POCCO)
# Remove negative margin and add centering
$html = $html -replace '\.elementor-element-302a54cc \{[^}]+margin-top: 10px !important;[^}]+\}', @"
.elementor-element-302a54cc {
    margin-top: 0px !important;
    position: absolute !important;
    top: 50% !important;
    left: 0 !important;
    right: 0 !important;
    transform: translateY(-50%) !important;
    width: 100% !important;
}
"@

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Marquee superior eliminado, inferior centrado" -ForegroundColor Green

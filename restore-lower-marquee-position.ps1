# Keep lower marquee in original position
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Restore original positioning for lower marquee (remove absolute positioning)
$oldCSS = @"
\.elementor-element-302a54cc \{
    margin-top: 0px !important;
    position: absolute !important;
    top: 50% !important;
    left: 0 !important;
    right: 0 !important;
    transform: translateY\(-50%\) !important;
    width: 100% !important;
\}
"@

$newCSS = @"
.elementor-element-302a54cc {
    margin-top: 10px !important;
}
"@

$html = $html -replace $oldCSS, $newCSS

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Marquee restaurado a posición original" -ForegroundColor Green

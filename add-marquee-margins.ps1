# Add 15px top and bottom margins to lower marquee
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Update the margin
$html = $html -replace '\.elementor-element-302a54cc \{\s*margin-top: 10px !important;\s*\}', @"
.elementor-element-302a54cc {
    margin-top: 15px !important;
    margin-bottom: 15px !important;
}
"@

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Margenes actualizados: 15px superior e inferior" -ForegroundColor Green

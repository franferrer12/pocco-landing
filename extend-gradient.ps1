# Extend image further down - delay gradient start
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Replace gradient to start much lower
$oldGradient = @"
    background: linear-gradient\(to bottom,
        rgba\(0, 0, 0, 0\) 0%,
        rgba\(0, 0, 0, 0\) 60%,
        rgba\(0, 0, 0, 0\.2\) 70%,
        rgba\(0, 0, 0, 0\.5\) 85%,
        rgba\(0, 0, 0, 1\) 100%
    \);
"@

$newGradient = @"
    background: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 75%,
        rgba(0, 0, 0, 0.3) 85%,
        rgba(0, 0, 0, 0.7) 93%,
        rgba(0, 0, 0, 1) 100%
    );
"@

$html = $html -replace $oldGradient, $newGradient

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Imagen extendida más abajo - degradado más tarde" -ForegroundColor Green

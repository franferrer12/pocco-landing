# Adjust gradient to start lower - visible in POCCO THE CLUB, gradient starts at "de lo bueno POCCO"
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Find and replace the gradient CSS
$oldGradient = @"
    background: linear-gradient\(to bottom,
        rgba\(0, 0, 0, 0\) 0%,
        rgba\(0, 0, 0, 0\) 40%,
        rgba\(0, 0, 0, 0\.3\) 60%,
        rgba\(0, 0, 0, 0\.7\) 80%,
        rgba\(0, 0, 0, 1\) 100%
    \);
"@

$newGradient = @"
    background: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 60%,
        rgba(0, 0, 0, 0.2) 70%,
        rgba(0, 0, 0, 0.5) 85%,
        rgba(0, 0, 0, 1) 100%
    );
"@

$html = $html -replace $oldGradient, $newGradient

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Degradado ajustado - empieza más abajo" -ForegroundColor Green

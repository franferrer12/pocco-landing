# Verify and fix VIP button
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

Write-Host "Verificando estado actual del botón VIP..." -ForegroundColor Cyan

# Check current state
if ($html -match 'background: #F5E401') {
    Write-Host "El botón está en AMARILLO - aplicando corrección..." -ForegroundColor Yellow
} elseif ($html -match 'background: #520100') {
    Write-Host "El botón YA está en ROJO" -ForegroundColor Green
}

# Force replace all yellow references to red
$html = $html -replace '#F5E401', '#520100'
$html = $html -replace '#FFE600', '#7a0200'
$html = $html -replace 'rgba\(245, 228, 1, 0\.4\)', 'rgba(82, 1, 0, 0.4)'

# Fix text color and border radius in the VIP section
if ($html -match '\.elementor-item-vip \{[^}]+color: #000000') {
    $html = $html -replace '(\.elementor-item-vip \{[^}]+)color: #000000 !important;', '$1color: #FFFFFF !important;'
}

if ($html -match 'border-radius: 25px !important;') {
    $html = $html -replace 'border-radius: 25px !important;', 'border-radius: 0px !important;'
}

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "`n✅ Botón actualizado a rojo #520100" -ForegroundColor Green

# Verify change
$verify = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8
if ($verify -match 'background: #520100') {
    Write-Host "✓ Verificación: Color ROJO aplicado correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error: El color no se aplicó" -ForegroundColor Red
}

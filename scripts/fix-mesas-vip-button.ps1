# Change Mesas VIP button to red color and square borders
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Replace the VIP button CSS
$oldCSS = @"
.elementor-item-vip \{
    background: #F5E401 !important;
    color: #000000 !important;
    padding: 10px 25px !important;
    border-radius: 25px !important;
    font-weight: 700 !important;
    transition: all 0.3s ease !important;
\}
.elementor-item-vip:hover \{
    background: #FFE600 !important;
    transform: translateY\(-2px\);
    box-shadow: 0 4px 12px rgba\(245, 228, 1, 0.4\);
\}
"@

$newCSS = @"
.elementor-item-vip {
    background: #520100 !important;
    color: #FFFFFF !important;
    padding: 10px 25px !important;
    border-radius: 0px !important;
    font-weight: 700 !important;
    transition: all 0.3s ease !important;
}
.elementor-item-vip:hover {
    background: #7a0200 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(82, 1, 0, 0.4);
}
"@

$html = $html -replace $oldCSS, $newCSS

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Botón Mesas VIP actualizado - rojo sin bordes redondeados" -ForegroundColor Green

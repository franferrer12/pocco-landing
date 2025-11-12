# Force VIP button text to white with maximum specificity
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Add ultra-specific CSS rule after the existing VIP button styles
$forceWhiteCSS = @"
/* Force white text on VIP button - maximum specificity */
.elementor-nav-menu .elementor-item.elementor-item-vip,
.elementor-nav-menu a.elementor-item-vip,
a.elementor-item.elementor-item-vip {
    color: #FFFFFF !important;
    background: #520100 !important;
    border-radius: 0px !important;
}
"@

# Insert after the existing .elementor-item-vip:hover rule
$html = $html -replace '(\.elementor-item-vip:hover \{[^}]+\})', "`$1`n$forceWhiteCSS"

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "CSS forzado con maxima especificidad" -ForegroundColor Green

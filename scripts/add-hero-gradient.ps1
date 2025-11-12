# Add gradient overlay to hero slider
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# CSS for gradient overlay - from transparent at top to black at bottom
$gradientCSS = @"
/* Degradado en hero slider - transición a negro */
.elementor-element-7518580::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 40%,
        rgba(0, 0, 0, 0.3) 60%,
        rgba(0, 0, 0, 0.7) 80%,
        rgba(0, 0, 0, 1) 100%
    );
    z-index: 1;
    pointer-events: none;
}
/* Asegurar que el contenido del hero esté por encima del degradado */
.elementor-element-7518580 > .elementor-container,
.elementor-element-7518580 > .e-con-inner {
    position: relative;
    z-index: 2;
}
/* Degradado para versión mobile */
.elementor-element-3eb860e::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 40%,
        rgba(0, 0, 0, 0.3) 60%,
        rgba(0, 0, 0, 0.7) 80%,
        rgba(0, 0, 0, 1) 100%
    );
    z-index: 1;
    pointer-events: none;
}
.elementor-element-3eb860e > .elementor-container {
    position: relative;
    z-index: 2;
}
"@

# Find the closing </style> tag and add CSS before it
$html = $html -replace '(\.ova-text-marquee-2\.duration-slow \.content-wrapper-2 \{\s*animation-duration: 40s !important;\s*\})\s*(</style>)', "`$1`n$gradientCSS`n`$2"

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Degradado agregado al hero slider" -ForegroundColor Green

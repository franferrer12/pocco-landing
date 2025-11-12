# Agregar CSS crítico para mostrar el hero
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "`n=== AGREGANDO CSS CRÍTICO ===" -ForegroundColor Cyan

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Backup
$backupFile = "D:\pocco-html-static\backup\index-before-critical-css.html"
Copy-Item $htmlFile $backupFile -Force
Write-Host "[BACKUP] $backupFile`n" -ForegroundColor Green

# CSS crítico para hacer funcionar el hero
$criticalCSS = @'
<style id="critical-css">
/* Reset básico */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: #000;
    color: #fff;
}

/* Hero principal con imagen */
.elementor-element-7518580,
.elementor-element-3eb860e {
    min-height: 100vh !important;
    height: 100vh !important;
    width: 100% !important;
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background-size: cover !important;
    background-position: center center !important;
    background-repeat: no-repeat !important;
}

/* Aplicar imagen de fondo directamente */
.elementor-element-7518580 {
    background-image: url('images/MBP-01345.jpg') !important;
}

.elementor-element-3eb860e {
    background-image: url('images/MBP-01345.jpg') !important;
}

/* Contenedor interno */
.e-con-inner,
.elementor-container {
    width: 100% !important;
    max-width: 1200px !important;
    margin: 0 auto !important;
    position: relative !important;
    z-index: 2 !important;
}

/* Marquee de texto */
.ova-text-marquee-2 {
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    z-index: 10;
    overflow: hidden;
    background: rgba(0,0,0,0.3);
    padding: 20px 0;
}

.ova-text-marquee-2 .content {
    display: flex;
    white-space: nowrap;
    animation: marquee 60s linear infinite;
}

@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

/* Secciones visibles */
section {
    width: 100%;
    display: block;
}

/* Hacer visible el contenido */
.elementor-section,
.e-con {
    width: 100% !important;
    display: block !important;
}

/* Ocultar elementos mobile en desktop y viceversa */
@media (min-width: 768px) {
    .elementor-hidden-desktop {
        display: none !important;
    }
}

@media (max-width: 767px) {
    .elementor-hidden-mobile {
        display: none !important;
    }
}
</style>
'@

# Insertar CSS crítico antes de </head>
Write-Host "[1] Insertando CSS crítico..." -ForegroundColor Yellow
if ($content -match '</head>') {
    $content = $content -replace '</head>', "$criticalCSS`n</head>"
    Write-Host "  [OK] CSS crítico agregado" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] No se encontró </head>" -ForegroundColor Red
}

# Guardar
$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "[COMPLETADO] CSS crítico agregado" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "El hero debería ser ahora visible con la imagen MBP-01345.jpg`n" -ForegroundColor White

# Fix Pocco Header - Restore 50/50 structure like Fitz
$html = Get-Content 'C:\Users\Equipo\Downloads\HOME FITZ.html' -Raw -Encoding UTF8

# Replace branding
$html = $html -replace 'Fitz Club Madrid','Pocco Club'
$html = $html -replace 'FITZ CLUB','POCCO CLUB'
$html = $html -replace 'Fitz Club','Pocco Club'
$html = $html -replace 'fitz club','pocco club'

# Replace logo
$html = $html -replace 'https://fitzclubmadrid\.com/wp-content/uploads/2022/03/image-17\.png','logo-pocco-header.png'

# Replace contact info
$html = $html -replace 'Calle de la Princesa, 1','Calle Guadassuar, 4'
$html = $html -replace 'Moncloa - Aravaca, 28013 Madrid','46600 Alzira, Valencia'
$html = $html -replace '28013 Madrid','46600 Alzira, Valencia'
$html = $html -replace '\+34 919 93 03 85','+34 614 868 148'
$html = $html -replace '919 93 03 85','614 868 148'
$html = $html -replace '697 570 801','614 868 148'
$html = $html -replace '34919930385','34614868148'

# Replace social media
$html = $html -replace 'reservas@fitzclubmadrid\.com','info@poccoclub.com'
$html = $html -replace '@fitzclub_','@pocco.club'
$html = $html -replace 'fitzclubmadrid\.com','poccoclub.com'

# Replace WhatsApp link
$html = $html -replace 'https://wa\.me/34919930385\?text=Hola!!%20Quiero%20reservar','https://wa.me/34614868148?text=Hola!!%20Quiero%20reservar%20mesa%20VIP'

# Replace slider images
$html = $html -replace 'Property-1Variant2-5\.png','pocco-01.jpg'
$html = $html -replace 'Property-1Variant3-3-1\.png','pocco-02.jpg'
$html = $html -replace 'Property-1Variant4-1-1\.png','pocco-03.jpg'
$html = $html -replace 'Property-1Variant5-1\.png','pocco-04.jpg'
$html = $html -replace 'Property-1Variant5-1-1\.png','pocco-04.jpg'
$html = $html -replace 'DSC8521-scaled\.jpg','pocco-05.jpg'
$html = $html -replace 'slider01\.png','pocco-01.jpg'
$html = $html -replace 'slider-02\.png','pocco-02.jpg'
$html = $html -replace 'slider-03\.png','pocco-03.jpg'

# Add custom CSS for Mesas VIP button styling
$customCSS = @"
<style>
.elementor-item-vip {
    background: #F5E401 !important;
    color: #000000 !important;
    padding: 10px 25px !important;
    border-radius: 25px !important;
    font-weight: 700 !important;
    transition: all 0.3s ease !important;
}
.elementor-item-vip:hover {
    background: #FFE600 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 228, 1, 0.4);
}
</style>
</head>
"@

$html = $html -replace '</head>',$customCSS

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Header restaurado con estructura 50/50 de Fitz" -ForegroundColor Green

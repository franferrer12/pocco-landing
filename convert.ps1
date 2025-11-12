# Convert Fitz to Pocco
$html = Get-Content 'D:\pocco-html-static\index.html' -Raw -Encoding UTF8

# Replace branding
$html = $html -replace 'Fitz Club Madrid','Pocco Club'
$html = $html -replace 'FITZ CLUB','POCCO CLUB'
$html = $html -replace 'Fitz Club','Pocco Club'
$html = $html -replace 'fitz club','pocco club'

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
$html = $html -replace 'fitzclub_','pocco.club'

# Replace slider images with Pocco photos
$html = $html -replace 'Property-1Variant2-5\.png','pocco-01.jpg'
$html = $html -replace 'Property-1Variant3-3-1\.png','pocco-02.jpg'
$html = $html -replace 'Property-1Variant4-1-1\.png','pocco-03.jpg'
$html = $html -replace 'Property-1Variant5-1\.png','pocco-04.jpg'
$html = $html -replace 'Property-1Variant5-1-1\.png','pocco-04.jpg'
$html = $html -replace 'DSC8521-scaled\.jpg','pocco-05.jpg'
$html = $html -replace 'slider01\.png','pocco-01.jpg'
$html = $html -replace 'slider-02\.png','pocco-02.jpg'
$html = $html -replace 'slider-03\.png','pocco-03.jpg'

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ HTML convertido a pocco.html" -ForegroundColor Green

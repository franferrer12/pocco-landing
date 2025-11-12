# Fix image paths after reorganization
$htmlFile = "D:\pocco-html-static\index.html"

Write-Host "Updating image paths in index.html..." -ForegroundColor Cyan

$content = Get-Content $htmlFile -Raw -Encoding UTF8

# Update image paths
$content = $content -replace 'pocco-01\.jpg', 'images/pocco-01.jpg'
$content = $content -replace 'pocco-02\.jpg', 'images/pocco-02.jpg'
$content = $content -replace 'pocco-03\.jpg', 'images/pocco-03.jpg'
$content = $content -replace 'pocco-04\.jpg', 'images/pocco-04.jpg'
$content = $content -replace 'pocco-05\.jpg', 'images/pocco-05.jpg'
$content = $content -replace 'logo-pocco-header\.png', 'images/logo-pocco-header.png'

$content | Out-File $htmlFile -Encoding UTF8 -NoNewline

Write-Host "[OK] Image paths updated!" -ForegroundColor Green

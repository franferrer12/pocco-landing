# Replace Fitz URLs with local pocco images in hero slider
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

Write-Host "Reemplazando imágenes del hero slider..." -ForegroundColor Cyan

# Replace pocco images URLs from fitzclubmadrid.com to local paths
$html = $html -replace 'https:\\\/\\\/fitzclubmadrid\.com\\\/wp-content\\\/uploads\\\/2024\\\/02\\\/pocco-01\.jpg','pocco-01.jpg'
$html = $html -replace 'https:\\\/\\\/fitzclubmadrid\.com\\\/wp-content\\\/uploads\\\/2024\\\/02\\\/pocco-02\.jpg','pocco-02.jpg'
$html = $html -replace 'https:\\\/\\\/fitzclubmadrid\.com\\\/wp-content\\\/uploads\\\/2024\\\/02\\\/pocco-03\.jpg','pocco-03.jpg'
$html = $html -replace 'https:\\\/\\\/fitzclubmadrid\.com\\\/wp-content\\\/uploads\\\/2024\\\/02\\\/pocco-04\.jpg','pocco-04.jpg'
$html = $html -replace 'https:\\\/\\\/fitzclubmadrid\.com\\\/wp-content\\\/uploads\\\/2025\\\/10\\\/pocco-05\.jpg','pocco-05.jpg'

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8

Write-Host "✅ Imágenes del hero actualizadas a rutas locales" -ForegroundColor Green

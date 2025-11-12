# Find images from fitzclubmadrid.com
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw

# Find all fitzclubmadrid image URLs
$pattern = 'https://fitzclubmadrid\.com/wp-content/uploads/[^"\s<>]+\.(jpg|png|jpeg)'
$matches = [regex]::Matches($html, $pattern)

Write-Host "Total images found: $($matches.Count)" -ForegroundColor Cyan
Write-Host "`nUnique images (first 30):" -ForegroundColor Yellow

$matches.Value | Select-Object -Unique | Select-Object -First 30 | ForEach-Object {
    $filename = Split-Path $_ -Leaf
    Write-Host "$filename -> $_"
}

# Find hero slider images in pocco.html
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw

# Pattern 1: background-image with url()
Write-Host "`n=== Pattern 1: background-image:url() ===" -ForegroundColor Yellow
$pattern1 = 'background-image:url\(["\']?(https://fitzclubmadrid\.com[^)"'']+)["\']?\)'
$matches1 = [regex]::Matches($html, $pattern1)
Write-Host "Found: $($matches1.Count)"
$matches1 | Select-Object -First 5 | ForEach-Object { Write-Host $_.Groups[1].Value }

# Pattern 2: background-image without quotes
Write-Host "`n=== Pattern 2: background-image (no quotes) ===" -ForegroundColor Yellow
$pattern2 = 'background-image:\s*url\((https://fitzclubmadrid\.com[^)]+)\)'
$matches2 = [regex]::Matches($html, $pattern2)
Write-Host "Found: $($matches2.Count)"
$matches2 | Select-Object -First 5 | ForEach-Object { Write-Host $_.Groups[1].Value }

# Pattern 3: Any fitzclubmadrid image URL
Write-Host "`n=== Pattern 3: All fitzclubmadrid.com URLs ===" -ForegroundColor Yellow
$pattern3 = 'https://fitzclubmadrid\.com/[^"\s<>]+\.(jpg|png|jpeg)'
$matches3 = [regex]::Matches($html, $pattern3)
Write-Host "Found: $($matches3.Count)"
$matches3 | Select-Object -First 10 -Unique | ForEach-Object { Write-Host $_.Value }

# Pattern 4: Search for hero/slider section
Write-Host "`n=== Pattern 4: Hero/Slider section ===" -ForegroundColor Yellow
if ($html -match 'elementor-element-[a-f0-9]+[^>]*hero|slider') {
    Write-Host "Found hero/slider element"
}

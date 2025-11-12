# Check if pocco images are already in the HTML
$lines = Get-Content 'D:\pocco-html-static\pocco.html'

Write-Host "=== Lines 552-560 ===" -ForegroundColor Cyan
552..560 | ForEach-Object {
    $lineNum = $_
    $content = $lines[$lineNum - 1]
    if ($content -match 'pocco-0[1-5]\.jpg') {
        Write-Host "Line $lineNum : $content" -ForegroundColor Green
    }
}

Write-Host "`n=== Searching for pocco-XX.jpg references ===" -ForegroundColor Yellow
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw
$pattern = 'pocco-0[1-5]\.jpg'
$matches = [regex]::Matches($html, $pattern)
Write-Host "Found $($matches.Count) references to pocco-0X.jpg images"

# Show context around first match
if ($matches.Count -gt 0) {
    $firstMatch = $matches[0]
    $start = [Math]::Max(0, $firstMatch.Index - 100)
    $length = [Math]::Min(300, $html.Length - $start)
    $context = $html.Substring($start, $length)
    Write-Host "`nContext around first match:" -ForegroundColor Cyan
    Write-Host $context
}

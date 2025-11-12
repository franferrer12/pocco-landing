# Remove extended height CSS completely
$html = Get-Content 'D:\pocco-html-static\pocco.html' -Raw -Encoding UTF8

# Find and remove the entire extended height section
$lines = $html -split "`n"
$output = @()
$skip = $false

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    # Start skipping when we find the comment
    if ($line -match '/\* Extender altura del hero') {
        $skip = $true
    }

    # Stop skipping after the last closing brace of this section
    if ($skip -and $line -match '^\}$' -and $i -gt 0 -and $lines[$i-1] -match 'height: 100%') {
        $skip = $false
        continue
    }

    # Add line if not skipping
    if (-not $skip) {
        $output += $line
    }
}

$html = $output -join "`n"

# Save
$html | Out-File -FilePath 'D:\pocco-html-static\pocco.html' -Encoding UTF8 -NoNewline

Write-Host "✅ CSS de altura extendida eliminado" -ForegroundColor Green

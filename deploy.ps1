# Stages deploy\ from dev\ for manual upload.
# Usage: .\deploy.ps1   (from anywhere; paths resolve relative to this script)
# deploy\ is gitignored — run this before every upload so the staging copy is always fresh.
# dev\ and deploy\ share identical production filenames, so the copy is verbatim.

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$dev = Join-Path $root 'dev'
$deploy = Join-Path $root 'deploy'

if (-not (Test-Path (Join-Path $dev 'index.html'))) { throw 'dev\index.html not found — aborting.' }

# Guard: versioned filenames (-v2, -v5, …) must never appear in dev\.
$stale = Get-ChildItem $dev -Recurse -Include '*.html', '*.css' -File |
  Select-String -Pattern 'index-v\d+\.html|styles-v\d+\.css'
if ($stale) {
  Write-Host 'Stale versioned references in dev\:'
  $stale | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber): $($_.Line.Trim())" }
  throw 'Fix the references above before deploying.'
}

if (Test-Path $deploy) { Remove-Item $deploy -Recurse -Force }
Copy-Item $dev $deploy -Recurse

Write-Host 'Staged in deploy\:'
Get-ChildItem $deploy -Recurse -File | Sort-Object FullName | ForEach-Object {
  '  {0,8:N0}  {1}' -f $_.Length, $_.FullName.Substring($deploy.Length + 1)
}

Write-Host ''
Write-Host 'Before uploading, delete these stale files on the server if present:'
Write-Host '  images/amg-logo-mulberry.png'
Write-Host '  images/house-country.webp'
Write-Host ''
Write-Host 'deploy\ is gitignored. Drag deploy\* to the server root.'

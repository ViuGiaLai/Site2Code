# Install skills from skills.sh into ai/skills/ structure
# Usage: .\scripts\install-skills.ps1

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ManifestPath = Join-Path $Root "scripts\skills-manifest.json"
$SkillsRoot = Join-Path $Root "ai\skills"
$AgentsRoot = Join-Path $Root ".agents\skills"

$manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json
$installedPackages = @{}
$failed = @()
$ok = 0
$skipped = 0

function Install-SkillPackage {
    param([string]$Package, [string]$SkillName)
    $key = "$Package@$SkillName"
    if ($installedPackages.ContainsKey($key)) { return $true }

    $skillDir = Join-Path $AgentsRoot $SkillName
    if (Test-Path (Join-Path $skillDir "SKILL.md")) {
        $installedPackages[$key] = $true
        return $true
    }

    Write-Host "Installing: $key" -ForegroundColor Cyan
    Push-Location $Root
    npx skills add $key -y --copy 2>&1 | Out-Null
    $success = $LASTEXITCODE -eq 0
    Pop-Location

    if ($success) {
        $installedPackages[$key] = $true
        return $true
    }
    Write-Host "  FAILED: $key" -ForegroundColor Red
    $failed += $key
    return $false
}

function Find-SkillDir {
    param([string]$SkillName)
    $dir = Join-Path $AgentsRoot $SkillName
    if (Test-Path (Join-Path $dir "SKILL.md")) { return $dir }
    Get-ChildItem $AgentsRoot -Directory -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -eq $SkillName
    } | Select-Object -First 1 -ExpandProperty FullName
}

function Copy-SkillFile {
    param([string]$Category, [string]$FileName, [string]$Package, [string]$SkillName)

    $targetPath = Join-Path (Join-Path $SkillsRoot $Category) $FileName

    if (Test-Path $targetPath) {
        $existing = Get-Content $targetPath -Raw -ErrorAction SilentlyContinue
        if ($existing -match '<!-- Source:' -or $existing -match 'CUSTOM STUB') {
            Write-Host "  SKIP: $Category/$FileName" -ForegroundColor DarkGray
            $script:skipped++
            return
        }
    }

    if (-not (Install-SkillPackage -Package $Package -SkillName $SkillName)) { return }

    $skillDir = Find-SkillDir -SkillName $SkillName
    $skillFile = if ($skillDir) { Join-Path $skillDir "SKILL.md" } else { $null }

    if ($skillFile -and (Test-Path $skillFile)) {
        $header = @"
<!-- Source: https://skills.sh/$Package/$SkillName -->
<!-- Installed via: npx skills add $Package@$SkillName -->

"@
        $content = Get-Content $skillFile -Raw
        Set-Content -Path $targetPath -Value ($header + $content) -Encoding UTF8
        Write-Host "  OK: $Category/$FileName" -ForegroundColor Green
        $script:ok++
    } else {
        Write-Host "  MISSING: $SkillName -> $Category/$FileName" -ForegroundColor Yellow
        $failed += "$Category/$FileName ($SkillName)"
    }
}

foreach ($category in $manifest.PSObject.Properties.Name) {
    $categoryPath = Join-Path $SkillsRoot $category
    New-Item -ItemType Directory -Force -Path $categoryPath | Out-Null

    foreach ($fileName in $manifest.$category.PSObject.Properties.Name) {
        $source = $manifest.$category.$fileName
        if ($source -match "^(.+)@(.+)$") {
            Copy-SkillFile -Category $category -FileName $fileName -Package $Matches[1] -SkillName $Matches[2]
        }
    }
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan
Write-Host "Copied: $ok | Skipped: $skipped | Packages installed: $($installedPackages.Count)"
if ($failed.Count -gt 0) {
    Write-Host "Failed/Missing ($($failed.Count)):" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "  - $_" }
}

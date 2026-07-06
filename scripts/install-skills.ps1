# Install skills from skills.sh into ai/skills/ structure
# Usage: .\scripts\install-skills.ps1

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ManifestPath = Join-Path $Root "scripts\skills-manifest.json"
$SkillsRoot = Join-Path $Root "ai\skills"
$AgentsRoot = Join-Path $Root ".agents\skills"

$manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json
$installed = @{}
$failed = @()

function Install-SkillPackage {
    param([string]$Source)
    if ($installed.ContainsKey($Source)) { return $true }
    Write-Host "Installing: $Source" -ForegroundColor Cyan
    Push-Location $Root
    $result = npx skills add $Source -y --copy 2>&1
    Pop-Location
    if ($LASTEXITCODE -eq 0) {
        $installed[$Source] = $true
        return $true
    }
    Write-Host "  FAILED: $Source" -ForegroundColor Red
    $failed += $Source
    return $false
}

function Find-SkillDir {
    param([string]$SkillName)
    $dir = Join-Path $AgentsRoot $SkillName
    if (Test-Path $dir) { return $dir }
    Get-ChildItem $AgentsRoot -Directory -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -eq $SkillName -or $_.Name -like "*$SkillName*"
    } | Select-Object -First 1 -ExpandProperty FullName
}

foreach ($category in $manifest.PSObject.Properties.Name) {
    $categoryPath = Join-Path $SkillsRoot $category
    New-Item -ItemType Directory -Force -Path $categoryPath | Out-Null
    $skills = $manifest.$category

    foreach ($fileName in $skills.PSObject.Properties.Name) {
        $source = $skills.$fileName
        $targetPath = Join-Path $categoryPath $fileName

        if ($source -match "^(.+)@(.+)$") {
            $package = $Matches[1]
            $skillName = $Matches[2]
        } else {
            Write-Host "Invalid source: $source" -ForegroundColor Yellow
            continue
        }

        if (Install-SkillPackage -Source $source) {
            $skillDir = Find-SkillDir -SkillName $skillName
            $skillFile = if ($skillDir) { Join-Path $skillDir "SKILL.md" } else { $null }

            if ($skillFile -and (Test-Path $skillFile)) {
                $header = @"
<!-- Source: https://skills.sh/$($package.Replace('/','/'))/$skillName -->
<!-- Installed via: npx skills add $source -->

"@
                $content = Get-Content $skillFile -Raw
                Set-Content -Path $targetPath -Value ($header + $content) -Encoding UTF8
                Write-Host "  OK: $category/$fileName" -ForegroundColor Green
            } else {
                Write-Host "  MISSING SKILL FILE: $skillName -> $targetPath" -ForegroundColor Yellow
                $failed += "$category/$fileName ($skillName)"
            }
        }
    }
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan
Write-Host "Installed packages: $($installed.Count)"
if ($failed.Count -gt 0) {
    Write-Host "Failed/Missing:" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "  - $_" }
}

#!/usr/bin/env pwsh

Write-Host "=== Pragyan Assessment Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"

# Test 1: Metadata
Write-Host "[1] Fetching metadata..." -ForegroundColor Yellow
try {
  $metaRes = Invoke-RestMethod -Uri "$baseUrl/assessment/metadata" -Method GET
  Write-Host "✓ Metadata retrieved successfully" -ForegroundColor Green
  Write-Host "  - Careers: $($metaRes.data.assessmentCoverage.totalJobRoles)" -ForegroundColor Gray
  Write-Host "  - Skills: $($metaRes.data.assessmentCoverage.totalSkillsInDataset)" -ForegroundColor Gray
  Write-Host "  - Interests: $($metaRes.data.assessmentCoverage.totalInterestsMapped)" -ForegroundColor Gray
} catch {
  Write-Host "✗ Metadata failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Questions with verbose output
Write-Host "[2] Fetching questions with verbose headers..." -ForegroundColor Yellow
try {
  $questionRes = Invoke-WebRequest -Uri "$baseUrl/assessment/questions" -Method GET -Verbose -UseBasicParsing
  $questionData = $questionRes.Content | ConvertFrom-Json
  Write-Host "✓ Questions retrieved" -ForegroundColor Green
  Write-Host "  - Status: $($questionRes.StatusCode)" -ForegroundColor Gray
  Write-Host "  - Count: $($questionData.data.Count)" -ForegroundColor Gray
  Write-Host "  - First 3 questions:" -ForegroundColor Gray
  $questionData.data | Select-Object -First 3 | ForEach-Object {
    Write-Host "    - [$($_.id)] $($_.question.Substring(0, 60))..." -ForegroundColor Gray
  }
} catch {
  Write-Host "✗ Questions failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Diagnostic Complete ===" -ForegroundColor Cyan

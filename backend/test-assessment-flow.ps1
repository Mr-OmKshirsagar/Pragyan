# Comprehensive Assessment Flow Test
$ErrorActionPreference = 'Stop'

Write-Host "=== Pragyan Assessment Flow E2E Test ===" -ForegroundColor Cyan
$baseUrl = "http://localhost:5000/api"

# Step 1: Login to get token
Write-Host "`n[1/5] Logging in..." -ForegroundColor Yellow
$loginBody = @{ email='pragyan-user@example.com'; password='StrongP@ss1' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType 'application/json'
$token = $loginRes.data.accessToken
$userId = $loginRes.data.user.id
Write-Host "✓ Login successful. UserID: $userId" -ForegroundColor Green

# Step 2: Fetch questions
Write-Host "`n[2/5] Fetching assessment questions..." -ForegroundColor Yellow
$questionsRes = Invoke-RestMethod -Uri "$baseUrl/assessment/questions" -Method GET
$questions = $questionsRes.data
Write-Host "✓ Retrieved $($questions.Count) questions" -ForegroundColor Green
Write-Host "  First question: $($questions[0].question)" -ForegroundColor Gray

# Step 3: Get next questions with sample answers
Write-Host "`n[3/5] Testing adaptive next-questions endpoint..." -ForegroundColor Yellow
$answers = @{
  'q1' = 'Programming'
  'q2' = 'Full Stack Development'
  'q3' = 'Problem Solving'
}
$nextBody = @{ answers = $answers; limit = 3 } | ConvertTo-Json
$nextRes = Invoke-RestMethod -Uri "$baseUrl/assessment/next" -Method POST -Body $nextBody -ContentType 'application/json'
$nextQuestions = $nextRes.data
Write-Host "✓ Received $($nextQuestions.Count) next questions" -ForegroundColor Green

# Step 4: Submit assessment
Write-Host "`n[4/5] Submitting assessment answers..." -ForegroundColor Yellow
$fullAnswers = @{
  'q1' = 'Programming'
  'q2' = 'System Design'
  'q3' = 'Problem Solving'
  'q4' = 'Python'
  'q5' = 'Machine Learning'
  'q6' = 'Data Analysis'
  'q7' = 'Remote work'
  'q8' = 'Continuous learning'
  'q9' = 'Mentoring'
  'q10' = '5+ years'
}
$submitBody = @{ answers = $fullAnswers } | ConvertTo-Json
$headers = @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' }
$submitRes = $null
$resultId = $null
try {
  $submitRes = Invoke-RestMethod -Uri "$baseUrl/assessment/submit" -Method POST -Body $submitBody -Headers $headers
  Write-Host "✓ Assessment submitted successfully" -ForegroundColor Green
  if ($submitRes.data.combinedMatches) {
    Write-Host "  Top match: $($submitRes.data.combinedMatches[0].career)" -ForegroundColor Gray
  }
  if ($submitRes.data.summary.suggestedCareers) {
    Write-Host "  Suggested careers: $($submitRes.data.summary.suggestedCareers -join ', ')" -ForegroundColor Gray
  }
  $resultId = $submitRes.data.persisted.id
} catch {
  Write-Host "✗ Assessment submission failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 5: Fetch assessment result
if ($resultId) {
  Write-Host "`n[5/5] Fetching assessment result..." -ForegroundColor Yellow
  try {
    $headers = @{ 'Authorization' = "Bearer $token" }
    $resultRes = Invoke-RestMethod -Uri "$baseUrl/assessment/result/$resultId" -Method GET -Headers $headers
    Write-Host "✓ Result retrieved successfully" -ForegroundColor Green
    Write-Host "  Suggested careers: $($resultRes.data.suggestedCareers -join ', ')" -ForegroundColor Gray
  } catch {
    Write-Host "✗ Failed to fetch result: $($_.Exception.Message)" -ForegroundColor Red
  }
}
else {
  Write-Host "`n[5/5] Skipping result fetch (no result ID)" -ForegroundColor Gray
}

# Step 6: Test metadata endpoint
Write-Host "`n[6/6] Fetching assessment metadata..." -ForegroundColor Yellow
$metadataRes = Invoke-RestMethod -Uri "$baseUrl/assessment/metadata" -Method GET
Write-Host "✓ Metadata retrieved" -ForegroundColor Green
Write-Host "  Coverage: $($metadataRes.data.assessmentCoverage.totalJobRoles) job roles, $($metadataRes.data.assessmentCoverage.totalSkillsInDataset) skills" -ForegroundColor Gray

Write-Host "`n=== Assessment Flow Test Complete ===" -ForegroundColor Cyan

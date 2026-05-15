# Usage: Run this in an elevated PowerShell if needed.
# This script will start the docker-compose file (if Docker is installed) and then
# attempt to run the initReplicaSet.js script to initialize the single-node replica set.

$composeFile = "docker-compose.mongo.yml"
$initScript = "scripts/initReplicaSet.js"

function Check-Docker {
    try {
        docker version | Out-Null
        return $true
    } catch {
        return $false
    }
}

if (-not (Check-Docker)) {
    Write-Host "Docker is not installed or not in PATH. Please install Docker Desktop and re-run this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting MongoDB replica set container..."
docker compose -f $composeFile up -d

Write-Host "Waiting 5 seconds for mongod to be reachable..."
Start-Sleep -Seconds 5

Write-Host "Running replica set initiation script..."
node $initScript "mongodb://localhost:27018" "rs0"

Write-Host "Done. If initiation succeeded, copy .env.replica to .env and restart the backend."

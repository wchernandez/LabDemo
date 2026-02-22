# Clean install script for Windows PowerShell
# Removes node_modules and package-lock.json, then reinstalls

Write-Host "Removing node_modules..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
    Write-Host "Done." -ForegroundColor Green
} else {
    Write-Host "node_modules not found, skipping." -ForegroundColor Gray
}

Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path package-lock.json) {
    Remove-Item -Force package-lock.json
    Write-Host "Done." -ForegroundColor Green
} else {
    Write-Host "package-lock.json not found, skipping." -ForegroundColor Gray
}

Write-Host "Running npm install..." -ForegroundColor Yellow
npm install

Write-Host "Running npm audit fix..." -ForegroundColor Yellow
npm audit fix

Write-Host "All done! Run 'npm run dev' to start." -ForegroundColor Green

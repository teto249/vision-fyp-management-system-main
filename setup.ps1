# Vision FYP Management System - Local Setup (PowerShell)
Write-Host "🚀 Vision FYP Management System - Local Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Setup Backend
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location Backend
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend setup failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""

# Setup Frontend
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Set-Location Frontend
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend setup failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start Backend:  cd Backend && npm run dev" -ForegroundColor White
Write-Host "2. Start Frontend: cd Frontend && npm run dev" -ForegroundColor White
Write-Host "3. Open: http://localhost:3001" -ForegroundColor White
Write-Host "4. Login: green-admin / admin123" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see LOCAL_SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Quick start with: npm run dev (from project root)" -ForegroundColor Yellow
Read-Host "Press Enter to continue"

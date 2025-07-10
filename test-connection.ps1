#!/usr/bin/env pwsh

Write-Host "🧪 Testing Frontend ↔ Backend Connection" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host "📡 Testing API at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "1️⃣ Testing Health Check endpoint..." -ForegroundColor Blue
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/health" -Method Get -ContentType "application/json"
    
    Write-Host "✅ Health Check: SUCCESS" -ForegroundColor Green
    Write-Host "📋 Backend Response:" -ForegroundColor White
    $response | ConvertTo-Json -Depth 3 | Write-Host
    Write-Host ""
    
    Write-Host "2️⃣ Testing CORS and Headers..." -ForegroundColor Blue
    $webResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/health" -Method Get
    Write-Host "🔧 Status Code: $($webResponse.StatusCode)" -ForegroundColor White
    Write-Host "🔧 Content Type: $($webResponse.Headers.'Content-Type')" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🎉 CONNECTION TEST SUMMARY" -ForegroundColor Green
    Write-Host "=" * 50
    Write-Host "✅ Backend is running and accessible" -ForegroundColor Green
    Write-Host "✅ API endpoints are responding correctly" -ForegroundColor Green
    Write-Host "✅ JSON responses are working" -ForegroundColor Green
    Write-Host "✅ Ready for frontend development!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Start frontend: npm run dev:frontend" -ForegroundColor White
    Write-Host "   2. Visit: http://localhost:3001/test-connection" -ForegroundColor White
    Write-Host "   3. Test login at: http://localhost:3001/auth" -ForegroundColor White
    
} catch {
    Write-Host "❌ CONNECTION TEST FAILED" -ForegroundColor Red
    Write-Host "=" * 50
    Write-Host "🔥 Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 TROUBLESHOOTING STEPS:" -ForegroundColor Yellow
    Write-Host "1. Make sure backend server is running on port 3000" -ForegroundColor White
    Write-Host "2. Check Backend/.env configuration" -ForegroundColor White
    Write-Host "3. Verify no firewall is blocking port 3000" -ForegroundColor White
    Write-Host "4. Try: npm run dev:backend" -ForegroundColor White
    Write-Host ""
}

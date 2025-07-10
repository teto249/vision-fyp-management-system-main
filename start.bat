@echo off
echo 🚀 Starting Vision FYP Management System
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd Frontend && npm run dev"

echo.
echo 🎉 Both servers are starting!
echo.
echo 📋 Access Points:
echo - Frontend: http://localhost:3001
echo - Backend:  http://localhost:3000
echo - Login:    green-admin / admin123
echo.
echo ⚠️  Wait a few seconds for servers to fully start
echo.
pause

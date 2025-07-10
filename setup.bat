@echo off
echo 🚀 Vision FYP Management System - Local Setup
echo =============================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

echo Setting up Backend...
cd Backend
echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend setup failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..

echo.
echo Setting up Frontend...
cd Frontend
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend setup failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Start Backend:  cd Backend && npm run dev
echo 2. Start Frontend: cd Frontend && npm run dev
echo 3. Open: http://localhost:3001
echo 4. Login: green-admin / admin123
echo.
echo 📖 For detailed instructions, see LOCAL_SETUP_GUIDE.md
pause

@echo off
echo 🚀 Vision FYP Management System - Deployment Preparation
echo.

echo 📂 Navigating to project directory...
cd /d "C:\Users\User\Desktop\SEM-7\PSM-2\Coding\vision-fyp-management-system-main"

echo.
echo 🔧 Testing frontend build...
cd Frontend
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed! Please fix errors before deployment.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

echo 📝 Deployment checklist:
echo.
echo 1. ✅ Frontend build tested successfully
echo 2. ⏳ Push code to GitHub repository
echo 3. ⏳ Deploy backend to Railway/Heroku
echo 4. ⏳ Deploy frontend to Vercel
echo 5. ⏳ Set environment variables
echo 6. ⏳ Test deployed application
echo.

echo 📚 For detailed instructions, see:
echo    - DEPLOYMENT-QUICK-START.md
echo    - DEPLOYMENT.md
echo.

echo 🎉 Ready for deployment!
echo.
pause

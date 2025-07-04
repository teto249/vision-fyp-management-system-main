@echo off
echo ==========================================
echo      Vision FYP Backend Verification
echo ==========================================
echo.

echo [1/3] Checking Node.js version...
node --version
echo.

echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
) else (
    echo Dependencies already installed ✓
)
echo.

echo [3/3] Starting backend server test...
echo Note: Server will start and run. Press Ctrl+C to stop.
echo.
echo Available endpoints:
echo - Health Check: http://localhost:3000/health
echo - API Base: http://localhost:3000/api/
echo.
echo ==========================================
echo             Starting Server...
echo ==========================================
echo.

node app.js

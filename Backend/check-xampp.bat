@echo off
echo ========================================
echo XAMPP MySQL Service Check
echo ========================================

echo.
echo Checking if XAMPP MySQL is running...

:: Check if MySQL process is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL service is running
) else (
    echo ❌ MySQL service is NOT running
    echo.
    echo To start MySQL:
    echo 1. Open XAMPP Control Panel
    echo 2. Click "Start" next to MySQL
    echo 3. Wait for green "Running" status
    echo.
    pause
    exit /b 1
)

echo.
echo Testing MySQL connection on port 3306...

:: Test if port 3306 is listening
netstat -an | find "3306" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Port 3306 is listening
) else (
    echo ❌ Port 3306 is not listening
    echo Check XAMPP MySQL configuration
)

echo.
echo Checking if phpMyAdmin is accessible...
echo Try opening: http://localhost/phpmyadmin

echo.
echo Running Node.js MySQL connection test...
node test-mysql-connection.js

pause

@echo off
REM =============================================================================
REM TutorConnect Setup Script (Windows)
REM =============================================================================
REM This script installs all dependencies for the entire project
REM =============================================================================

echo.
echo ============================================================================
echo TutorConnect Setup - Installing Dependencies
echo ============================================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/15] Installing root dependencies...
call npm install
if %errorlevel% neq 0 goto :error

echo [2/15] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 goto :error
cd ..

echo [3/15] Installing auth service dependencies...
cd services\auth
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [4/15] Installing users service dependencies...
cd services\users
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [5/15] Installing profiles service dependencies...
cd services\profiles
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [6/15] Installing bookings service dependencies...
cd services\bookings
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [7/15] Installing messaging service dependencies...
cd services\messaging
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [8/15] Installing reviews service dependencies...
cd services\reviews
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [9/15] Installing notifications service dependencies...
cd services\notifications
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [10/15] Installing analytics service dependencies...
cd services\analytics
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [11/15] Installing gamification service dependencies...
cd services\gamification
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [12/15] Installing earnings service dependencies...
cd services\earnings
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [13/15] Installing calendar service dependencies...
cd services\calendar
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo [14/15] Installing maps service dependencies...
cd services\maps
call npm install
if %errorlevel% neq 0 goto :error
cd ..\..

echo.
echo ============================================================================
echo Setup Complete!
echo ============================================================================
echo.
echo All dependencies installed successfully!
echo.
echo You can now run:
echo   npm run dev        - Start all services in development mode
echo   npm run dev:frontend - Start only the frontend
echo   npm run build      - Build for production
echo.

if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Copy env.example to .env and fill in your Supabase credentials
    echo.
)

pause
exit /b 0

:error
echo.
echo [ERROR] Installation failed!
echo Please check the error messages above and try again.
echo.
pause
exit /b 1

@echo off
REM =============================================================================
REM TutorConnect Development Startup Script (Windows)
REM =============================================================================
REM This script starts all services using npm run dev
REM =============================================================================

echo.
echo ============================================================================
echo TutorConnect - Starting Development Environment
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

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [WARNING] Root dependencies not installed!
    echo Run setup.bat first to install all dependencies.
    echo.
    choice /C YN /M "Do you want to run setup now?"
    if errorlevel 2 goto :end
    if errorlevel 1 call setup.bat
)

REM Check for .env file
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo.
    if exist "env.example" (
        echo Creating .env from env.example...
        copy env.example .env
        echo.
        echo [INFO] .env file created. Please edit it with your Supabase credentials.
        echo Press any key to continue after editing .env...
        pause
    ) else (
        echo [ERROR] env.example not found. Please create a .env file manually.
        pause
        exit /b 1
    )
)

echo.
echo Starting all services with concurrently...
echo.
echo Services will start on the following ports:
echo   Frontend:      http://localhost:3000
echo   Auth:          http://localhost:3001
echo   Users:         http://localhost:3002
echo   Profiles:      http://localhost:3003
echo   Bookings:      http://localhost:3004
echo   Messaging:     http://localhost:3005
echo   Reviews:       http://localhost:3006
echo   Notifications: http://localhost:3007
echo   Analytics:     http://localhost:3008
echo   Gamification:  http://localhost:3009
echo   Earnings:      http://localhost:3010
echo   Calendar:      http://localhost:3011
echo   Maps:          http://localhost:3012
echo.
echo Press Ctrl+C to stop all services
echo.

REM Start all services
npm run dev

:end
echo.
echo Development environment stopped.
pause

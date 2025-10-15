@echo off
REM =============================================================================
REM TutorConnect Port Cleanup Script (Windows)
REM =============================================================================
REM This script kills processes running on development ports
REM =============================================================================

echo.
echo ============================================================================
echo TutorConnect - Cleaning Up Development Ports
echo ============================================================================
echo.

echo Checking for processes on development ports...
echo.

REM Function to kill process on specific port
setlocal enabledelayedexpansion

REM Ports to clean
set PORTS=3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012

for %%P in (%PORTS%) do (
    echo Checking port %%P...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%P ^| findstr LISTENING') do (
        echo   Found process %%a on port %%P
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo   [OK] Killed process %%a
        ) else (
            echo   [INFO] Process %%a already stopped or access denied
        )
    )
)

echo.
echo ============================================================================
echo Port cleanup complete!
echo ============================================================================
echo.
echo You can now start the development environment with:
echo   npm run dev
echo   or
echo   start-dev.bat
echo.
pause

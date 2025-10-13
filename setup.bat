@echo off
REM =============================================================================
REM OnlyTutor Setup Script (Windows)
REM =============================================================================
REM This script installs all dependencies for the entire project
REM =============================================================================

echo.
echo ============================================================================
echo OnlyTutor Setup - Installing Dependencies
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

echo Node.js version:
node -v
echo npm version:
npm -v
echo.

echo [1/15] Installing root dependencies...
call npm install
if %errorlevel% neq 0 goto :error

echo [2/15] Installing frontend dependencies...
cd frontend
call npm install --loglevel=error
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
echo [15/15] Verifying installation...
echo.

REM Verify installations
set MISSING=0

if not exist "node_modules" (
    echo [ERROR] Root node_modules missing
    set MISSING=1
) else (
    echo [OK] Root dependencies installed
)

if not exist "frontend\node_modules" (
    echo [ERROR] Frontend node_modules missing
    set MISSING=1
) else (
    REM Check for critical frontend packages
    if not exist "frontend\node_modules\@vueuse\motion" (
        echo [WARNING] @vueuse/motion missing, reinstalling frontend...
        cd frontend
        call npm install --loglevel=error
        cd ..
    )
    if not exist "frontend\node_modules\vue" (
        echo [ERROR] Vue.js not installed in frontend
        set MISSING=1
    ) else (
        echo [OK] Frontend dependencies installed
    )
)

if not exist "services\auth\node_modules" (
    echo [ERROR] Auth service node_modules missing
    set MISSING=1
) else (
    echo [OK] Auth service dependencies installed
)

if not exist "services\users\node_modules" (
    echo [ERROR] Users service node_modules missing
    set MISSING=1
) else (
    echo [OK] Users service dependencies installed
)

if not exist "services\profiles\node_modules" (
    echo [ERROR] Profiles service node_modules missing
    set MISSING=1
) else (
    echo [OK] Profiles service dependencies installed
)

if not exist "services\bookings\node_modules" (
    echo [ERROR] Bookings service node_modules missing
    set MISSING=1
) else (
    echo [OK] Bookings service dependencies installed
)

if not exist "services\messaging\node_modules" (
    echo [ERROR] Messaging service node_modules missing
    set MISSING=1
) else (
    REM Check for critical messaging packages
    if not exist "services\messaging\node_modules\isomorphic-dompurify" (
        echo [WARNING] isomorphic-dompurify missing, reinstalling messaging...
        cd services\messaging
        call npm install --loglevel=error
        cd ..\..
    )
    echo [OK] Messaging service dependencies installed
)

if not exist "services\reviews\node_modules" (
    echo [ERROR] Reviews service node_modules missing
    set MISSING=1
) else (
    echo [OK] Reviews service dependencies installed
)

if not exist "services\notifications\node_modules" (
    echo [ERROR] Notifications service node_modules missing
    set MISSING=1
) else (
    echo [OK] Notifications service dependencies installed
)

if not exist "services\analytics\node_modules" (
    echo [ERROR] Analytics service node_modules missing
    set MISSING=1
) else (
    echo [OK] Analytics service dependencies installed
)

if not exist "services\gamification\node_modules" (
    echo [ERROR] Gamification service node_modules missing
    set MISSING=1
) else (
    echo [OK] Gamification service dependencies installed
)

if not exist "services\earnings\node_modules" (
    echo [ERROR] Earnings service node_modules missing
    set MISSING=1
) else (
    echo [OK] Earnings service dependencies installed
)

if not exist "services\calendar\node_modules" (
    echo [ERROR] Calendar service node_modules missing
    set MISSING=1
) else (
    REM Check for critical calendar packages
    if not exist "services\calendar\node_modules\axios" (
        echo [WARNING] axios missing, reinstalling calendar...
        cd services\calendar
        call npm install --loglevel=error
        cd ..\..
    )
    echo [OK] Calendar service dependencies installed
)

if not exist "services\maps\node_modules" (
    echo [ERROR] Maps service node_modules missing
    set MISSING=1
) else (
    echo [OK] Maps service dependencies installed
)

echo.
echo ============================================================================

if %MISSING%==0 (
    echo Setup Complete!
    echo ============================================================================
    echo.
    echo All dependencies installed successfully!
    echo.
    echo You can now run:
    echo   npm run dev            - Start all services in development mode
    echo   npm run dev:frontend   - Start only the frontend
    echo   npm run dev:messaging  - Start messaging service
    echo   npm run build          - Build for production
    echo.
) else (
    echo Setup Completed with Errors!
    echo ============================================================================
    echo.
    echo Some dependencies failed to install. Please check the errors above.
    echo.
)

if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Copy env.example to .env and fill in your Supabase credentials
    echo.
    if exist "env.example" (
        echo Creating .env from env.example...
        copy env.example .env
        echo.
        echo [INFO] .env file created. Please edit it with your credentials.
        echo.
    )
)

echo ============================================================================
echo.
pause
exit /b 0

:error
echo.
echo [ERROR] Installation failed!
echo Please check the error messages above and try again.
echo.
pause
exit /b 1

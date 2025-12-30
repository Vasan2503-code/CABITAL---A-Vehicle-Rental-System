@echo off
REM CABITAL Vehicle Rental System - Backend Startup Script

echo.
echo ========================================
echo CABITAL Backend Startup
echo ========================================
echo.
echo Starting Spring Boot backend...
echo Backend will run on http://localhost:8080
echo.

cd /d "%~dp0CabitalBackend\CabitalBackend"

REM Check if mvn is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Maven is not installed or not in PATH
    echo Please install Maven and add it to PATH
    pause
    exit /b 1
)

REM Clean and run
echo Running Maven clean install...
call mvn clean package -q -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo Error: Maven build failed
    pause
    exit /b 1
)

echo.
echo Build successful! Starting application...
echo.
call mvn spring-boot:run

pause

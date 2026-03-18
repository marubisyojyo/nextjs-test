@echo off
cd /d C:\Users\pcar\nextjs-test

echo =====================
echo Deploy Start
echo =====================

git add .

git diff --cached --quiet
if %errorlevel%==0 (
    echo No changes. Nothing to deploy.
    pause
    exit
)

set /p msg=Commit message:

git commit -m "%msg%"
if %errorlevel% neq 0 (
    echo Commit failed
    pause
    exit
)

git push origin main
if %errorlevel% neq 0 (
    echo Push failed
    pause
    exit
)

echo.
echo =====================
echo Deploy Complete
echo =====================

pause
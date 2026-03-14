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

git commit -m "update"
git push origin main

echo.
echo =====================
echo Deploy Complete
echo =====================

pause
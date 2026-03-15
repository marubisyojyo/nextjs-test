@echo off
cd C:\Users\pcar\nextjs-test

powershell -Command "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

npm run dev

pause
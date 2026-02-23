@echo off
set PATH=%PATH%;C:\nodejs
cd /d c:\cs-skins
echo Running npm install...
call C:\nodejs\npm.cmd install
echo.
echo === npm install done ===
echo.
echo Starting dev server...
call C:\nodejs\npm.cmd run dev

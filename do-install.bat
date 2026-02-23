@echo off
set PATH=C:\nodejs;%PATH%
cd /d c:\cs-skins
echo === npm install ===
call C:\nodejs\npm.cmd install 2>&1
echo EXIT CODE: %errorlevel%
echo.
dir node_modules /b 2>nul | find /c /v "" 
echo packages in node_modules
echo === DONE ===

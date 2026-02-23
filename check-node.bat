@echo off
echo Checking Node.js installation...
if exist "C:\Program Files\nodejs\node.exe" (
    echo Node.js found!
    "C:\Program Files\nodejs\node.exe" --version
    "C:\Program Files\nodejs\npm.cmd" --version
) else (
    echo Node.js NOT found at default location.
    dir "C:\Program Files\nodejs\" 2>nul
    echo.
    echo Checking other locations...
    where node 2>nul
)

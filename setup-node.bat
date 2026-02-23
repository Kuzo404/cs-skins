@echo off
echo === Node.js Setup ===
echo.
echo Downloading Node.js v20.18.0 (zip)...
curl -L -o "%TEMP%\node.zip" "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
echo.
echo Extracting to C:\nodejs ...
mkdir C:\nodejs 2>nul
cd /d %TEMP%
tar -xf node.zip
xcopy /E /Y /I "node-v20.18.0-win-x64\*" "C:\nodejs\"
echo.
echo Adding to system PATH...
setx PATH "%PATH%;C:\nodejs" /M 2>nul
if errorlevel 1 (
    echo Could not set system PATH. Trying user PATH...
    setx PATH "%PATH%;C:\nodejs"
)
echo.
echo Verifying...
set PATH=%PATH%;C:\nodejs
C:\nodejs\node.exe --version
C:\nodejs\npm.cmd --version
echo.
echo === DONE ===
echo Please restart your terminal, then run: npm install

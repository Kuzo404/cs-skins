@echo off
C:\nodejs\node.exe --version
if errorlevel 1 (
    echo Node.js not found at C:\nodejs
    dir C:\nodejs\ 2>nul
) else (
    echo Node.js OK!
)

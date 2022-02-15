@echo off
cd /d "%~dp0"

:: Example of Visual Studio Code startup script
:: for Windows with automatic workspace cleanup
:: (portable installation is assumed)

node.exe cleanup-workspaces.js -b data
@call "%ProgramFiles(x86)%\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
start Code.exe %*

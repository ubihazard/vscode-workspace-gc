@echo off
cd /d "%~dp0"

node cleanup-workspaces.js -b data
@call "%ProgramFiles(x86)%\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
start Code.exe %*

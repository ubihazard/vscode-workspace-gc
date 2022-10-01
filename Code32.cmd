@echo off

node "%~dp0cleanup-workspaces.js" -b "%~dp0data"
@call "%ProgramFiles(x86)%\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars32.bat"
start "Visual Studio Code" "%~dp0Code.exe" %*

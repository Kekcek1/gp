@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist "dist\windows\GhostsOfWesenberg-win\GhostsOfWesenberg.exe" (
  echo Не найдена Windows-сборка.
  echo Соберите её: python tools\build_all.py --windows
  pause
  exit /b 1
)
start "" "dist\windows\GhostsOfWesenberg-win\GhostsOfWesenberg.exe"

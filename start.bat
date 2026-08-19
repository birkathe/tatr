@echo off
set PATH=C:\Users\yurab\cs2-case-opener\tools\node;%PATH%
cd /d "%~dp0"
if not exist node_modules (
  echo Instalujem zavislosti...
  call npm install
)
echo.
echo Spustam Internet banking TB demo na http://localhost:5173
echo Prihlasenie: PID 1234567890 / heslo demo123
echo.
call npm run dev
pause

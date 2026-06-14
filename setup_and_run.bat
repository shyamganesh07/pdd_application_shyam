@echo off
echo === TradeMind AI — Setup Script ===
echo.

cd /d c:\Users\ganes\Videos\pdd_pwa\frontend

echo [1/3] Installing dependencies...
npm install

echo.
echo [2/3] Creating icons directory...
if not exist "public\icons" mkdir public\icons
copy /Y "C:\Users\ganes\.gemini\antigravity\brain\e11c382a-94b1-4e12-acbb-1529c8df0378\tradeedge_icon_1777965886204.png" "public\icons\icon-192.png"
copy /Y "C:\Users\ganes\.gemini\antigravity\brain\e11c382a-94b1-4e12-acbb-1529c8df0378\tradeedge_icon_1777965886204.png" "public\icons\icon-512.png"

echo.
echo [3/3] Starting frontend dev server...
start cmd /k "cd /d c:\Users\ganes\Videos\pdd_pwa\frontend && npm run dev"

echo.
echo Now start the backend in another terminal:
echo   cd c:\Users\ganes\Videos\pdd_pwa\backend
echo   python main.py
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
pause

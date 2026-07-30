@echo off
echo =========================================
echo Creating Clean ZIP for Sharing (WhatsApp/Drive)
echo =========================================
echo.

set OUTPUT_ZIP=project_code.zip

if exist "%OUTPUT_ZIP%" del "%OUTPUT_ZIP%"

C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$exclude = @('node_modules', '.venv', 'venv', '.git', '__pycache__', 'dist', '.vercel', 'build', '.DS_Store', 'project_code.zip', '.gradle', '.npm', '.next', '.idea', '.vscode'); $items = Get-ChildItem -Path . | Where-Object { $exclude -notcontains $_.Name }; Compress-Archive -Path $items.FullName -DestinationPath '%OUTPUT_ZIP%' -Force"

echo.
echo =========================================
echo SUCCESS! Created clean archive: project_code.zip
echo Size is minimal and safe for WhatsApp / Google Drive!
echo =========================================
pause

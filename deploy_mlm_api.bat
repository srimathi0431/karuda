@echo off
echo ========================================
echo DEPLOY MLM API TO VPS
echo ========================================
echo.

set VPS_IP=144.91.80.208
set VPS_USER=root
set VPS_PATH=/var/www/karuda/backend

echo Uploading updated main.py with MLM endpoints...
echo.

scp backend/main.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp backend/MLM_API_ENDPOINTS.md %VPS_USER%@%VPS_IP%:%VPS_PATH%/

echo.
echo ========================================
echo API FILE UPLOADED
echo ========================================
echo.
echo Now restart the backend service:
echo.
echo ssh %VPS_USER%@%VPS_IP%
echo systemctl restart karuda
echo systemctl status karuda
echo.
pause

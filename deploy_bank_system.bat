@echo off
echo ========================================
echo Deploying Bank Details System to VPS
echo ========================================
echo.

set VPS_HOST=root@srikaruda.shop
set BACKEND_PATH=/var/www/karuda/backend
set FRONTEND_PATH=/var/www/karuda/frontend

echo [1/5] Copying backend files...
scp backend\migrations\004_create_payment_settings.py %VPS_HOST%:%BACKEND_PATH%/migrations/
scp backend\run_payment_migration.py %VPS_HOST%:%BACKEND_PATH%/
scp backend\crud.py %VPS_HOST%:%BACKEND_PATH%/
scp backend\main.py %VPS_HOST%:%BACKEND_PATH%/
echo Backend files copied!
echo.

echo [2/5] Copying frontend files...
scp frontend\src\pages\admin\BankDetailsPage.jsx %VPS_HOST%:%FRONTEND_PATH%/src/pages/admin/
scp frontend\src\pages\user\UserDeposit.jsx %VPS_HOST%:%FRONTEND_PATH%/src/pages/user/
scp frontend\src\services\api.js %VPS_HOST%:%FRONTEND_PATH%/src/services/
scp frontend\src\App.jsx %VPS_HOST%:%FRONTEND_PATH%/src/
scp frontend\src\components\admin\AdminLayout.jsx %VPS_HOST%:%FRONTEND_PATH%/src/components/admin/
echo Frontend files copied!
echo.

echo [3/5] Running migration on VPS...
ssh %VPS_HOST% "cd %BACKEND_PATH% && python3 run_payment_migration.py"
echo Migration completed!
echo.

echo [4/5] Restarting backend service...
ssh %VPS_HOST% "systemctl restart karuda"
timeout /t 3 >nul
ssh %VPS_HOST% "systemctl status karuda --no-pager"
echo Backend restarted!
echo.

echo [5/5] Building frontend...
ssh %VPS_HOST% "cd %FRONTEND_PATH% && npm run build"
echo Frontend built!
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Testing endpoints...
curl -s https://srikaruda.shop/api/payment-settings
echo.
echo.
echo ========================================
echo Access admin panel: https://srikaruda.shop/admin/bank-details
echo Access user deposit: https://srikaruda.shop/account/deposit
echo ========================================
pause

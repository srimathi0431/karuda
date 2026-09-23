@echo off
echo ========================================
echo Deploying Admin User Detail System
echo ========================================
echo.

set VPS_USER=root
set VPS_IP=103.94.165.98
set VPS_PATH=/root/karudaa/backend

echo Step 1: Uploading backend files...
echo.

scp backend/mlm_crud.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp backend/main.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp backend/migrations/006_create_admin_tables.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/migrations/
scp backend/run_admin_migration.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/

echo.
echo Step 2: Running migration on VPS...
echo.

ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && source venv/bin/activate && python3 run_admin_migration.py"

echo.
echo Step 3: Restarting backend...
echo.

ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && pm2 restart karudaa-backend"

echo.
echo ========================================
echo Backend Deployment Complete!
echo ========================================
echo.
echo New Features Added:
echo ✅ Admin user detail page APIs
echo ✅ Wallet credit/debit by admin
echo ✅ Login history tracking
echo ✅ Admin actions logging
echo ✅ Complete user profile view
echo.
echo New Tables Created:
echo • login_history
echo • admin_actions_log
echo.
pause

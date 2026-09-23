@echo off
echo ========================================
echo DEPLOY MLM BACKEND TO VPS
echo ========================================
echo.

set VPS_IP=144.91.80.208
set VPS_USER=root
set VPS_PATH=/var/www/karuda/backend

echo Uploading MLM files to VPS...
echo.

REM Upload migration
scp backend/migrations/005_create_mlm_wallet_system.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/migrations/

REM Upload CRUD file
scp backend/mlm_crud.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/

REM Upload helper scripts
scp backend/run_mlm_migration.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp backend/test_mlm_system.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/

REM Upload cron jobs
scp backend/cron_process_monthly_payouts.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp backend/cron_check_achievements.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/

REM Upload documentation
scp backend/MLM_SYSTEM_BACKEND_SUMMARY.md %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp backend/MLM_QUICKSTART.md %VPS_USER%@%VPS_IP%:%VPS_PATH%/

echo.
echo ========================================
echo FILES UPLOADED SUCCESSFULLY
echo ========================================
echo.
echo Next steps:
echo 1. SSH into VPS: ssh %VPS_USER%@%VPS_IP%
echo 2. Run migration: cd %VPS_PATH% ^&^& source venv/bin/activate ^&^& python3 run_mlm_migration.py
echo 3. Test system: python3 test_mlm_system.py
echo 4. Setup cron jobs (see MLM_QUICKSTART.md)
echo.
pause

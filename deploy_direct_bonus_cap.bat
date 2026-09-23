@echo off
echo ========================================
echo Deploying Direct Bonus Cap System
echo ========================================
echo.
echo NEW RULE: Direct bonus capped at FIRST 2 referrals only!
echo.
echo Changes:
echo - Updated process_direct_bonus() function
echo - Added get_direct_bonus_status() function
echo - New API endpoint: /api/bonus/direct/{username}/status
echo.

set VPS_USER=root
set VPS_IP=103.94.165.98
set VPS_PATH=/root/karudaa/backend

echo Uploading updated backend files...
echo.

scp backend/mlm_crud.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp backend/main.py %VPS_USER%@%VPS_IP%:%VPS_PATH%/
scp DIRECT_BONUS_CAP_SYSTEM.md %VPS_USER%@%VPS_IP%:%VPS_PATH%/

echo.
echo Restarting backend service...
echo.

ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && pm2 restart karudaa-backend"

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Testing the new endpoint:
curl https://srikaruda.shop/api/bonus/direct/techney/status
echo.
echo.
echo DIRECT BONUS CAP SYSTEM ACTIVE:
echo ✅ Users get 10%% bonus for FIRST 2 direct referrals ONLY
echo ✅ 3rd+ referrals: NO direct bonus (₹0)
echo ✅ Matching bonus: STILL UNLIMITED!
echo ✅ New API: /api/bonus/direct/{username}/status
echo.
pause

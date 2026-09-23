@echo off
echo ====================================
echo Deploying Admin User Details Fix
echo ====================================

echo.
echo Step 1: Uploading fixed mlm_crud.py to VPS...
scp backend/mlm_crud.py root@srv1303984.ds.network:/var/www/karuda/backend/mlm_crud.py

echo.
echo Step 2: Restarting karuda service...
ssh root@srv1303984.ds.network "sudo systemctl restart karuda"

echo.
echo Step 3: Checking service status...
ssh root@srv1303984.ds.network "sudo systemctl status karuda"

echo.
echo Step 4: Watching logs (press Ctrl+C to exit)...
ssh root@srv1303984.ds.network "sudo journalctl -u karuda -f -n 50"

echo.
echo ====================================
echo Deployment Complete!
echo ====================================
pause

@echo off
echo ====================================
echo Direct Fix on VPS (In-Place Edit)
echo ====================================

echo.
echo Creating backup...
ssh root@srv1303984.ds.network "cp /var/www/karuda/backend/mlm_crud.py /var/www/karuda/backend/mlm_crud.py.backup"

echo.
echo Applying fixes...
ssh root@srv1303984.ds.network "sed -i 's/FROM package_enrollment/FROM package_enrollments/g' /var/www/karuda/backend/mlm_crud.py"

echo.
echo Verifying changes...
ssh root@srv1303984.ds.network "grep -n 'package_enrollment' /var/www/karuda/backend/mlm_crud.py | head -5"

echo.
echo Restarting service...
ssh root@srv1303984.ds.network "sudo systemctl restart karuda"

echo.
echo Waiting 3 seconds for service to start...
timeout /t 3 /nobreak >nul

echo.
echo Checking status...
ssh root@srv1303984.ds.network "sudo systemctl status karuda --no-pager"

echo.
echo ====================================
echo Fix Applied! Check logs above.
echo ====================================
pause

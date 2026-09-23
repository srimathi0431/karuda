@echo off
echo ========================================
echo Deploying Image Fix to VPS
echo ========================================
echo.

REM Replace YOUR_VPS_IP with your actual VPS IP address
set VPS_IP=YOUR_VPS_IP
set VPS_USER=root

echo Step 1: Uploading updated main.py...
scp "c:\Techneysoft apps\karudaa\backend\main.py" %VPS_USER%@%VPS_IP%:/var/www/karuda/backend/main.py

echo.
echo Step 2: Creating directories and setting permissions...
ssh %VPS_USER%@%VPS_IP% "cd /var/www/karuda/backend && mkdir -p images/products && cp images/*.png images/products/ 2>/dev/null || true && chown -R www-data:www-data images && chmod -R 755 images"

echo.
echo Step 3: Restarting backend service...
ssh %VPS_USER%@%VPS_IP% "systemctl restart karuda && sleep 2 && systemctl status karuda"

echo.
echo Step 4: Testing image access...
ssh %VPS_USER%@%VPS_IP% "curl -I https://srikaruda.shop/images/products/Kinnam.png"

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Check your site: https://srikaruda.shop
pause

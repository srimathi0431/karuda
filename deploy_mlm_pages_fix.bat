@echo off
echo ========================================
echo Deploying MLM Pages Fixes to VPS
echo ========================================
echo.
echo Fixes included:
echo 1. Username NULL issue (useAuth hook)
echo 2. Transaction loading issue (merge old + new)
echo.

echo Connecting to VPS and deploying frontend fixes...
echo.

ssh root@103.94.165.98 "cd /root/karudaa/frontend && git pull && npm run build && pm2 restart karudaa-frontend"

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Fixed Issues:
echo.
echo ✅ USERNAME NULL ISSUE:
echo    - BinaryTreeUser.jsx
echo    - MatchingTracker.jsx
echo    - UserWallets.jsx
echo    - IncomeReport.jsx
echo    - WithdrawPage.jsx
echo    - AwardsPage.jsx
echo    All pages now use useAuth() hook instead of localStorage
echo.
echo ✅ TRANSACTION LOADING ISSUE:
echo    - UserWallets.jsx now merges BOTH:
echo      * Old shopping system transactions
echo      * New MLM wallet transactions
echo    - All historical transactions now visible
echo.
pause

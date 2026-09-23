@echo off
echo ========================================
echo Testing Bank Details System
echo ========================================
echo.

echo [1/4] Testing public payment settings...
curl -s https://srikaruda.shop/api/payment-settings | python -m json.tool
echo.
echo.

echo [2/4] Testing admin payment settings...
curl -s https://srikaruda.shop/api/admin/payment-settings | python -m json.tool
echo.
echo.

echo [3/4] Testing deposit history...
curl -s "https://srikaruda.shop/api/user/karuda/deposit-history?limit=5" | python -m json.tool
echo.
echo.

echo [4/4] Testing backend health...
curl -s https://srikaruda.shop/api/health | python -m json.tool
echo.
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo Access URLs:
echo Admin Panel: https://srikaruda.shop/admin/bank-details
echo User Deposit: https://srikaruda.shop/account/deposit
echo.
pause

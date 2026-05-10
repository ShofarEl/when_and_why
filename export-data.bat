@echo off
echo ========================================
echo   Data Export Script
echo ========================================
echo.
echo Exporting participant data to CSV...
echo.

cd server
node scripts/exportToCSV.js

echo.
echo ========================================
echo Press any key to exit...
pause > nul

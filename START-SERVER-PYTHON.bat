@echo off
echo ========================================
echo Starting Local Server for Beej Sangh
echo ========================================
echo.
echo This will start a local web server at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo Starting server...
echo.

python -m http.server 8000

pause

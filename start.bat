@echo off
echo ========================================
echo E-Sport Platform - Demarrage
echo ========================================
echo.

echo Demarrage des services Docker...
docker-compose up -d

echo.
echo ========================================
echo Services demarres!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo pgAdmin:   http://localhost:5050
echo.
echo Pour voir les logs:
echo   docker-compose logs -f
echo.
echo Pour arreter:
echo   docker-compose down
echo.
echo ========================================
pause

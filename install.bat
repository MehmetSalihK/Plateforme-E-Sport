@echo off
echo ========================================
echo E-Sport Platform - Installation
echo ========================================
echo.

echo [1/4] Copie des variables d'environnement...
if not exist .env (
    copy .env.example .env
    echo Variables d'environnement copiees.
) else (
    echo .env existe deja.
)
echo.

echo [2/4] Installation des dependances backend...
cd backend
if exist package.json (
    call npm install
    echo Backend: dependances installees.
) else (
    echo Erreur: package.json introuvable dans backend/
)
cd ..
echo.

echo [3/4] Installation des dependances frontend...
cd frontend
if exist package.json (
    call npm install
    call npm install react-router-dom axios
    call npm install -D tailwindcss postcss autoprefixer
    echo Frontend: dependances installees.
) else (
    echo Erreur: package.json introuvable dans frontend/
)
cd ..
echo.

echo [4/4] Installation terminee!
echo.
echo ========================================
echo Prochaines etapes:
echo ========================================
echo 1. Editer le fichier .env avec vos configurations
echo 2. Demarrer PostgreSQL et Redis (ou utiliser Docker)
echo 3. Lancer le backend: cd backend ^&^& npm run dev
echo 4. Lancer le frontend: cd frontend ^&^& npm start
echo.
echo Ou utiliser Docker:
echo   docker-compose up -d
echo.
echo ========================================
pause

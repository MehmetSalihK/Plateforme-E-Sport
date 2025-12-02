# 🚀 Guide de Démarrage Rapide - E-Sport Platform

## Prérequis

- **Node.js** 20+ installé
- **Docker** et **Docker Compose** installés
- **Git** installé

## Installation et Lancement

### Option 1: Avec Docker (Recommandé)

```bash
# 1. Cloner le projet
cd C:\Users\Sketur60\Documents\Github\stage

# 2. Copier les variables d'environnement
copy .env.example .env

# 3. Lancer tous les services avec Docker
docker-compose up -d

# 4. Vérifier que les services sont démarrés
docker-compose ps

# Les services seront disponibles sur:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - pgAdmin: http://localhost:5050
```

### Option 2: Installation Manuelle

#### Backend

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env
copy .env.example .env

# 4. Démarrer PostgreSQL et Redis localement
# (ou utiliser Docker uniquement pour les bases de données)

# 5. Lancer le serveur en mode développement
npm run dev

# Le backend sera disponible sur http://localhost:5000
```

#### Frontend

```bash
# 1. Aller dans le dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Installer TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom axios

# 4. Lancer l'application
npm start

# Le frontend sera disponible sur http://localhost:3000
```

## Premiers Pas

### 1. Créer un Compte

1. Ouvrir http://localhost:3000
2. Cliquer sur "Inscription"
3. Remplir le formulaire:
   - Email: test@example.com
   - Pseudo: TestPlayer
   - Mot de passe: Test@2025Password!
4. Cliquer sur "S'inscrire"

### 2. Se Connecter

1. Utiliser les identifiants créés
2. Vous serez redirigé vers la page des tournois

### 3. Explorer la Plateforme

- **Tournois**: Voir tous les tournois disponibles
- **Classement**: Consulter le classement ELO global
- **Profil**: Gérer votre profil joueur

## Structure du Projet

```
stage/
├── backend/                 # API Node.js/TypeScript
│   ├── src/
│   │   ├── entities/       # Entités TypeORM
│   │   ├── routes/         # Routes API
│   │   ├── middlewares/    # Middlewares (auth, errors)
│   │   ├── utils/          # Utilitaires
│   │   └── main.ts         # Point d'entrée
│   └── package.json
│
├── frontend/                # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   └── App.tsx         # Composant principal
│   └── package.json
│
├── database/                # Scripts SQL
├── docs/                    # Documentation
├── docker-compose.yml       # Configuration Docker
└── README.md
```

## API Endpoints Disponibles

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir le token
- `GET /api/auth/me` - Profil utilisateur

### Tournois
- `GET /api/tournaments` - Liste des tournois
- `GET /api/tournaments/:id` - Détails d'un tournoi
- `POST /api/tournaments` - Créer un tournoi (Organizer)
- `PUT /api/tournaments/:id` - Modifier un tournoi
- `DELETE /api/tournaments/:id` - Supprimer un tournoi

### Joueurs
- `GET /api/players` - Liste des joueurs
- `GET /api/players/:id` - Détails d'un joueur
- `PUT /api/players/me` - Modifier son profil
- `GET /api/players/leaderboard/global` - Classement ELO

## Commandes Utiles

### Docker

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build

# Redémarrer un service
docker-compose restart backend
```

### Backend

```bash
# Mode développement (hot reload)
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Tests
npm test

# Linter
npm run lint
```

### Frontend

```bash
# Mode développement
npm start

# Build production
npm run build

# Tests
npm test
```

## Dépannage

### Le backend ne démarre pas

1. Vérifier que PostgreSQL et Redis sont démarrés
2. Vérifier les variables d'environnement dans `.env`
3. Vérifier les logs: `docker-compose logs backend`

### Le frontend ne se connecte pas au backend

1. Vérifier que le backend est démarré sur le port 5000
2. Vérifier la variable `REACT_APP_API_URL` dans `.env`
3. Vérifier la console du navigateur pour les erreurs CORS

### Erreur de base de données

1. Supprimer les volumes Docker: `docker-compose down -v`
2. Redémarrer: `docker-compose up -d`

## Prochaines Étapes

1. ✅ Créer des tournois
2. ✅ Implémenter le système de brackets
3. ✅ Ajouter la gestion des matchs
4. ✅ Implémenter WebSocket pour le temps réel
5. ✅ Ajouter le système d'équipes
6. ✅ Implémenter les notifications

## Support

Pour toute question ou problème:
- Consulter la documentation dans `/docs`
- Vérifier les logs avec `docker-compose logs`
- Contacter: contact@esport-platform.fr

---

**Bon développement ! 🚀**

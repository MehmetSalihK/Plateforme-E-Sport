# 🏆 Plateforme E-Sport - Gestion de Tournois

<div align="center">
  
  **🌍 Langues:**
  [🇫🇷 Français](README.md) | [🇬🇧 English](README_EN.md) | [🇹🇷 Türkçe](README_TR.md)
  
</div>

<div align="center">
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.0.0-339933.svg?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
</div>

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Architecture](#-architecture)
- [Sécurité](#-sécurité)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🎯 À Propos

Cette plateforme E-Sport est une solution complète permettant aux organisateurs de créer et gérer des tournois compétitifs, aux joueurs de s'inscrire et participer, et aux spectateurs de suivre les matchs en temps réel.

### Contexte du Projet

Développé dans le cadre d'un projet professionnel de Concepteur Développeur d'Applications (CDA), ce projet répond aux besoins croissants de la communauté E-Sport française en matière de gestion de tournois professionnels.

### Objectifs

- ✅ Automatiser la gestion complète des tournois E-Sport
- ✅ Fournir un système de classement ELO fiable
- ✅ Offrir une expérience temps réel aux participants
- ✅ Garantir la sécurité et la conformité RGPD
- ✅ Assurer une accessibilité optimale

---

## ✨ Fonctionnalités

### 🎮 Gestion des Tournois

- **Création et configuration** de tournois multi-formats (BO1, BO3, BO5, BO7)
- **Formats de brackets** : Simple élimination, double élimination, round-robin, swiss
- **Gestion des inscriptions** avec système de liste d'attente FIFO
- **Check-in automatique** avant le début du tournoi
- **Planification** des matchs avec gestion des horaires

### 🏅 Système de Brackets

- **Génération automatique** de brackets selon le format choisi
- **Seeding intelligent** basé sur le classement ELO
- **Progression automatique** des gagnants
- **Modification manuelle** possible pour les organisateurs
- **Visualisation interactive** de l'arbre du tournoi

### 👥 Gestion des Joueurs & Équipes

- **Profils joueurs** avec statistiques détaillées
- **Création d'équipes** avec système d'invitations
- **Historique complet** des matchs et tournois
- **Classement ELO** global et par jeu
- **Badges et récompenses** (à venir)

### ⚔️ Gestion des Matchs

- **Scoreboard en temps réel** via WebSocket
- **Mise à jour automatique** des scores
- **Validation** des résultats par les organisateurs
- **Calcul automatique** des changements ELO
- **Gestion des pénalités** et retards

---

## 🛠️ Technologies

### Backend

- **Runtime** : Node.js
- **Framework** : Express.js
- **Langage** : TypeScript
- **ORM** : TypeORM
- **Base de données** : MySQL 8.0

### Prérequis

- **Node.js** 20 LTS
- **MySQL** 8.0
- **npm** ou **yarn**

### Démarrage Rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-org/esport-platform.git
cd esport-platform

# 2. Configuration Backend
cd backend
cp .env.example .env
npm install
npm run db:create
npm run dev

# 3. Configuration Frontend
cd ../frontend
npm install
npm run dev
```

### Accès

- **Frontend** : http://localhost:3000
- **API Backend** : http://localhost:5000

---

## 📖 Utilisation

### Pour les Joueurs

1. **S'inscrire** sur la plateforme
2. **Compléter** votre profil joueur
3. **Parcourir** les tournois disponibles
4. **S'inscrire** à un tournoi
5. **Check-in** avant le début
6. **Jouer** vos matchs
7. **Consulter** vos statistiques et classement ELO

### Pour les Organisateurs

1. **Créer** un nouveau tournoi
2. **Configurer** les paramètres (format, bracket, règles)
3. **Publier** le tournoi
4. **Gérer** les inscriptions
5. **Générer** le bracket automatiquement
6. **Mettre à jour** les scores en temps réel

---

## 🏗️ Architecture

Le projet suit une architecture propre avec séparation des responsabilités :

- **Frontend** : Composants React, Hooks, Context API
- **Backend** : Pattern Controller-Service-Repository
- **Base de données** : Schéma relationnel avec index optimisés

---

## 🔒 Sécurité

- **Authentification** : JWT sécurisé avec refresh tokens
- **Hachage** : Bcrypt pour les mots de passe
- **Protection des données** : Validation et nettoyage des entrées
- **CORS** : Configuré pour la sécurité

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/SuperFonctionnalite`)
3. **Commit** vos changements (`git commit -m 'Ajout SuperFonctionnalite'`)
4. **Push** vers la branche (`git push origin feature/SuperFonctionnalite`)
5. **Ouvrir** une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**Fait avec ❤️ pour la communauté E-Sport française**

[⬆ Retour en haut](#-plateforme-e-sport---gestion-de-tournois)

</div>

# Spécification API REST - Plateforme E-Sport

## 📋 Informations Générales

### Base URL
```
Development:    http://localhost:5000/api/v1
Production:     https://api.esport-platform.fr/api/v1
```

### Authentication
Toutes les routes protégées nécessitent un JWT Bearer Token:
```
Authorization: Bearer <access_token>
```

### Format des Réponses
Toutes les réponses suivent ce format standard:

**Succès**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie"
}
```

**Erreur**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description de l'erreur",
    "details": { ... }
  }
}
```

### Codes HTTP
- `200 OK` - Succès
- `201 Created` - Ressource créée
- `204 No Content` - Suppression réussie
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Non authentifié
- `403 Forbidden` - Non autorisé
- `404 Not Found` - Ressource introuvable
- `409 Conflict` - Conflit (ex: email déjà utilisé)
- `422 Unprocessable Entity` - Validation échouée
- `429 Too Many Requests` - Rate limit dépassé
- `500 Internal Server Error` - Erreur serveur

### Pagination
Les listes sont paginées par défaut:

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sort` (ex: `elo_rating:desc`)

**Réponse**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🔐 Authentication & Authorization

### POST /auth/register
Inscription d'un nouvel utilisateur

**Public**: ✅

**Request Body**:
```json
{
  "email": "player@example.com",
  "password": "SecureP@ssw0rd!",
  "firstName": "Jean",
  "lastName": "Dupont",
  "pseudo": "JD_Pro",
  "acceptTerms": true
}
```

**Validation**:
- Email: format valide, unique
- Password: min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
- Pseudo: 3-50 caractères, alphanumérique + underscore

**Response** `201`:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "player@example.com",
      "role": "player",
      "isEmailVerified": false
    },
    "message": "Compte créé. Vérifiez votre email."
  }
}
```

---

### POST /auth/login
Connexion utilisateur

**Public**: ✅

**Request Body**:
```json
{
  "email": "player@example.com",
  "password": "SecureP@ssw0rd!"
}
```

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": 1,
      "email": "player@example.com",
      "role": "player",
      "pseudo": "JD_Pro"
    }
  }
}
```

---

### POST /auth/refresh
Rafraîchir le token d'accès

**Public**: ✅

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

---

### POST /auth/logout
Déconnexion (invalide le refresh token)

**Auth Required**: ✅

**Response** `204`: No Content

---

### POST /auth/forgot-password
Demande de réinitialisation de mot de passe

**Public**: ✅

**Request Body**:
```json
{
  "email": "player@example.com"
}
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Email de réinitialisation envoyé"
}
```

---

### POST /auth/reset-password
Réinitialiser le mot de passe

**Public**: ✅

**Request Body**:
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecureP@ssw0rd!"
}
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Mot de passe réinitialisé avec succès"
}
```

---

## 🏆 Tournaments

### GET /tournaments
Liste des tournois

**Public**: ✅

**Query Parameters**:
- `status` (draft|open|ongoing|completed)
- `game` (string)
- `search` (string)
- `page`, `limit`, `sort`

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Championship League of Legends 2025",
      "slug": "championship-lol-2025",
      "game": "League of Legends",
      "status": "open",
      "maxParticipants": 64,
      "currentParticipants": 32,
      "format": "BO3",
      "bracketType": "single_elimination",
      "startDate": "2025-12-15T14:00:00Z",
      "registrationDeadline": "2025-12-10T23:59:59Z",
      "coverImageUrl": "https://cdn.example.com/tournaments/1/cover.jpg",
      "organizer": {
        "id": 5,
        "pseudo": "TournamentMaster"
      },
      "prizePool": 5000.00,
      "currency": "EUR"
    }
  ],
  "pagination": { ... }
}
```

---

### GET /tournaments/:id
Détails d'un tournoi

**Public**: ✅

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Championship League of Legends 2025",
    "slug": "championship-lol-2025",
    "game": "League of Legends",
    "description": "Tournoi compétitif...",
    "rulesText": "Règlement complet...",
    "status": "open",
    "maxParticipants": 64,
    "currentParticipants": 32,
    "format": "BO3",
    "bracketType": "single_elimination",
    "startDate": "2025-12-15T14:00:00Z",
    "endDate": "2025-12-15T22:00:00Z",
    "registrationStart": "2025-12-01T00:00:00Z",
    "registrationDeadline": "2025-12-10T23:59:59Z",
    "checkInStart": "2025-12-15T12:00:00Z",
    "checkInDeadline": "2025-12-15T13:45:00Z",
    "eloEnabled": true,
    "eloKFactor": 32,
    "coverImageUrl": "https://cdn.example.com/tournaments/1/cover.jpg",
    "bannerImageUrl": "https://cdn.example.com/tournaments/1/banner.jpg",
    "prizePool": 5000.00,
    "currency": "EUR",
    "isPublic": true,
    "isFeatured": true,
    "organizer": {
      "id": 5,
      "pseudo": "TournamentMaster",
      "email": "organizer@example.com"
    },
    "createdAt": "2025-11-20T10:00:00Z",
    "updatedAt": "2025-12-01T08:30:00Z"
  }
}
```

---

### POST /tournaments
Créer un tournoi

**Auth Required**: ✅ (Organizer, Admin)

**Request Body**:
```json
{
  "name": "Championship League of Legends 2025",
  "game": "League of Legends",
  "description": "Tournoi compétitif...",
  "rulesText": "Règlement complet...",
  "maxParticipants": 64,
  "format": "BO3",
  "bracketType": "single_elimination",
  "startDate": "2025-12-15T14:00:00Z",
  "registrationDeadline": "2025-12-10T23:59:59Z",
  "eloEnabled": true,
  "prizePool": 5000.00,
  "isPublic": true
}
```

**Response** `201`:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "championship-lol-2025",
    ...
  },
  "message": "Tournoi créé avec succès"
}
```

---

### PUT /tournaments/:id
Modifier un tournoi

**Auth Required**: ✅ (Organizer propriétaire, Admin)

**Request Body**: (mêmes champs que POST, tous optionnels)

**Response** `200`:
```json
{
  "success": true,
  "data": { ... },
  "message": "Tournoi mis à jour"
}
```

---

### DELETE /tournaments/:id
Supprimer un tournoi

**Auth Required**: ✅ (Organizer propriétaire, Admin)

**Response** `204`: No Content

---

### POST /tournaments/:id/register
S'inscrire à un tournoi

**Auth Required**: ✅ (Player)

**Request Body**:
```json
{
  "participantType": "player",
  "teamId": null
}
```

**Response** `201`:
```json
{
  "success": true,
  "data": {
    "registrationId": 42,
    "tournamentId": 1,
    "playerId": 10,
    "status": "confirmed",
    "seedPosition": 15,
    "registeredAt": "2025-12-05T14:30:00Z"
  },
  "message": "Inscription confirmée"
}
```

**Errors**:
- `409` - Tournoi complet
- `409` - Déjà inscrit
- `422` - Inscriptions fermées

---

### DELETE /tournaments/:id/register
Se désinscrire d'un tournoi

**Auth Required**: ✅ (Player inscrit)

**Response** `204`: No Content

---

### POST /tournaments/:id/check-in
Check-in pour un tournoi

**Auth Required**: ✅ (Player inscrit)

**Response** `200`:
```json
{
  "success": true,
  "message": "Check-in effectué",
  "data": {
    "checkedIn": true,
    "checkedInAt": "2025-12-15T12:45:00Z"
  }
}
```

---

### GET /tournaments/:id/participants
Liste des participants

**Public**: ✅

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "player": {
        "id": 10,
        "pseudo": "ProGamer123",
        "eloRating": 1850,
        "avatarUrl": "https://cdn.example.com/avatars/10.jpg"
      },
      "seedPosition": 1,
      "checkedIn": true,
      "status": "confirmed"
    }
  ]
}
```

---

### GET /tournaments/:id/bracket
Bracket du tournoi

**Public**: ✅

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "tournamentId": 1,
    "type": "single_elimination",
    "totalRounds": 6,
    "currentRound": 3,
    "isFinalized": false,
    "rounds": [
      {
        "id": 1,
        "roundNumber": 1,
        "name": "Round of 64",
        "isCompleted": true,
        "matches": [
          {
            "id": 1,
            "matchNumber": 1,
            "participant1": {
              "id": 10,
              "pseudo": "ProGamer123",
              "seed": 1
            },
            "participant2": {
              "id": 25,
              "pseudo": "Challenger99",
              "seed": 64
            },
            "winner": {
              "id": 10,
              "pseudo": "ProGamer123"
            },
            "status": "completed",
            "score": {
              "participant1": 2,
              "participant2": 0
            },
            "bestOf": 3,
            "scheduledAt": "2025-12-15T14:00:00Z",
            "completedAt": "2025-12-15T15:30:00Z"
          }
        ]
      }
    ]
  }
}
```

---

## 👤 Players

### GET /players
Liste des joueurs

**Public**: ✅

**Query Parameters**:
- `search` (pseudo)
- `minElo`, `maxElo`
- `sort` (elo_rating:desc, wins:desc, etc.)

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "pseudo": "ProGamer123",
      "avatarUrl": "https://cdn.example.com/avatars/10.jpg",
      "countryCode": "FR",
      "eloRating": 1850,
      "totalMatches": 150,
      "wins": 95,
      "losses": 55,
      "winRate": 63.33
    }
  ],
  "pagination": { ... }
}
```

---

### GET /players/:id
Profil d'un joueur

**Public**: ✅

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": 10,
    "pseudo": "ProGamer123",
    "avatarUrl": "https://cdn.example.com/avatars/10.jpg",
    "bio": "Joueur professionnel League of Legends",
    "countryCode": "FR",
    "eloRating": 1850,
    "totalMatches": 150,
    "wins": 95,
    "losses": 55,
    "winRate": 63.33,
    "rank": 15,
    "recentMatches": [
      {
        "id": 523,
        "tournament": "Championship LoL 2025",
        "opponent": "Challenger99",
        "result": "win",
        "score": "2-0",
        "eloChange": +15,
        "completedAt": "2025-12-15T15:30:00Z"
      }
    ],
    "teams": [
      {
        "id": 5,
        "name": "Team Alpha",
        "tag": "ALPHA",
        "role": "member"
      }
    ]
  }
}
```

---

### PUT /players/me
Modifier son profil joueur

**Auth Required**: ✅ (Player)

**Request Body**:
```json
{
  "pseudo": "NewPseudo",
  "bio": "Nouvelle bio",
  "countryCode": "FR",
  "avatarUrl": "https://cdn.example.com/avatars/new.jpg"
}
```

**Response** `200`:
```json
{
  "success": true,
  "data": { ... },
  "message": "Profil mis à jour"
}
```

---

### GET /players/:id/statistics
Statistiques détaillées d'un joueur

**Public**: ✅

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "overall": {
      "totalMatches": 150,
      "wins": 95,
      "losses": 55,
      "winRate": 63.33,
      "currentElo": 1850,
      "peakElo": 1920,
      "averageEloChange": +5.2
    },
    "byTournament": [
      {
        "tournamentId": 1,
        "tournamentName": "Championship LoL 2025",
        "matchesPlayed": 8,
        "wins": 6,
        "losses": 2,
        "finalPosition": 4,
        "eloChange": +45
      }
    ],
    "eloHistory": [
      {
        "date": "2025-12-15",
        "elo": 1850
      }
    ]
  }
}
```

---

### GET /players/leaderboard
Classement ELO global

**Public**: ✅

**Query Parameters**:
- `game` (optionnel)
- `page`, `limit`

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "player": {
        "id": 10,
        "pseudo": "ProGamer123",
        "avatarUrl": "...",
        "countryCode": "FR"
      },
      "eloRating": 2150,
      "totalMatches": 250,
      "winRate": 68.5
    }
  ],
  "pagination": { ... }
}
```

---

## 👥 Teams

### GET /teams
Liste des équipes

**Public**: ✅

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Team Alpha",
      "tag": "ALPHA",
      "logoUrl": "https://cdn.example.com/teams/5/logo.png",
      "memberCount": 5,
      "captain": {
        "id": 10,
        "pseudo": "ProGamer123"
      },
      "isActive": true
    }
  ]
}
```

---

### POST /teams
Créer une équipe

**Auth Required**: ✅ (Player)

**Request Body**:
```json
{
  "name": "Team Alpha",
  "tag": "ALPHA",
  "description": "Équipe compétitive...",
  "logoUrl": "https://cdn.example.com/logo.png"
}
```

**Response** `201`:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Team Alpha",
    "tag": "ALPHA",
    "captainId": 10,
    ...
  },
  "message": "Équipe créée avec succès"
}
```

---

### POST /teams/:id/invite
Inviter un joueur

**Auth Required**: ✅ (Captain de l'équipe)

**Request Body**:
```json
{
  "playerId": 15
}
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Invitation envoyée"
}
```

---

### POST /teams/:id/join
Rejoindre une équipe (accepter invitation)

**Auth Required**: ✅ (Player invité)

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "teamId": 5,
    "playerId": 15,
    "role": "member",
    "joinedAt": "2025-12-01T10:00:00Z"
  },
  "message": "Vous avez rejoint l'équipe"
}
```

---

### DELETE /teams/:id/members/:playerId
Retirer un membre

**Auth Required**: ✅ (Captain)

**Response** `204`: No Content

---

## 🎮 Matches

### GET /matches
Liste des matchs

**Public**: ✅

**Query Parameters**:
- `status` (pending|ongoing|completed)
- `tournamentId`
- `playerId`

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 523,
      "tournament": {
        "id": 1,
        "name": "Championship LoL 2025"
      },
      "roundNumber": 3,
      "matchNumber": 5,
      "participant1": {
        "id": 10,
        "pseudo": "ProGamer123"
      },
      "participant2": {
        "id": 25,
        "pseudo": "Challenger99"
      },
      "status": "ongoing",
      "bestOf": 3,
      "currentScore": {
        "participant1": 1,
        "participant2": 0
      },
      "scheduledAt": "2025-12-15T16:00:00Z",
      "startedAt": "2025-12-15T16:05:00Z"
    }
  ]
}
```

---

### GET /matches/:id
Détails d'un match

**Public**: ✅

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "id": 523,
    "tournament": { ... },
    "roundNumber": 3,
    "matchNumber": 5,
    "participant1": { ... },
    "participant2": { ... },
    "winner": null,
    "status": "ongoing",
    "bestOf": 3,
    "score": {
      "participant1": 1,
      "participant2": 0
    },
    "scheduledAt": "2025-12-15T16:00:00Z",
    "startedAt": "2025-12-15T16:05:00Z",
    "completedAt": null,
    "nextMatchId": 262,
    "result": null
  }
}
```

---

### PUT /matches/:id/score
Mettre à jour le score

**Auth Required**: ✅ (Organizer du tournoi, Admin)

**Request Body**:
```json
{
  "participant1Score": 2,
  "participant2Score": 1
}
```

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "matchId": 523,
    "score": {
      "participant1": 2,
      "participant2": 1
    },
    "status": "completed",
    "winnerId": 10
  },
  "message": "Score mis à jour"
}
```

---

### POST /matches/:id/validate
Valider le résultat d'un match

**Auth Required**: ✅ (Organizer, Admin)

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "matchId": 523,
    "validated": true,
    "eloChanges": {
      "participant1": +15,
      "participant2": -15
    }
  },
  "message": "Résultat validé"
}
```

---

## 🔔 Notifications

### GET /notifications
Notifications de l'utilisateur

**Auth Required**: ✅

**Query Parameters**:
- `isRead` (true|false)
- `type`

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 150,
      "type": "match_starting",
      "title": "Votre match commence bientôt",
      "message": "Votre match contre Challenger99 commence dans 15 minutes",
      "linkUrl": "/tournaments/1/matches/523",
      "isRead": false,
      "sentAt": "2025-12-15T15:45:00Z"
    }
  ],
  "unreadCount": 5
}
```

---

### PUT /notifications/:id/read
Marquer comme lu

**Auth Required**: ✅

**Response** `200`:
```json
{
  "success": true,
  "message": "Notification marquée comme lue"
}
```

---

### PUT /notifications/read-all
Tout marquer comme lu

**Auth Required**: ✅

**Response** `200`:
```json
{
  "success": true,
  "message": "Toutes les notifications marquées comme lues"
}
```

---

## 👑 Admin

### GET /admin/users
Gestion des utilisateurs

**Auth Required**: ✅ (Admin)

**Response** `200`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "role": "player",
      "isActive": true,
      "isEmailVerified": true,
      "lastLoginAt": "2025-12-01T10:00:00Z",
      "createdAt": "2025-01-15T08:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### PUT /admin/users/:id/role
Modifier le rôle d'un utilisateur

**Auth Required**: ✅ (Admin)

**Request Body**:
```json
{
  "role": "organizer"
}
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Rôle mis à jour"
}
```

---

### PUT /admin/users/:id/block
Bloquer/Débloquer un utilisateur

**Auth Required**: ✅ (Admin)

**Request Body**:
```json
{
  "isActive": false,
  "reason": "Violation des règles"
}
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Utilisateur bloqué"
}
```

---

### GET /admin/statistics
Statistiques globales

**Auth Required**: ✅ (Admin)

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 5420,
      "active": 4850,
      "newThisMonth": 320
    },
    "tournaments": {
      "total": 150,
      "ongoing": 12,
      "completed": 125
    },
    "matches": {
      "total": 8500,
      "completedToday": 45
    },
    "activity": {
      "dailyActiveUsers": 850,
      "averageMatchDuration": "25 minutes"
    }
  }
}
```

---

## 📤 File Upload

### POST /upload/image
Upload d'image

**Auth Required**: ✅

**Request**: `multipart/form-data`
```
file: <binary>
type: avatar|cover|banner|logo
```

**Response** `200`:
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/uploads/abc123.jpg",
    "filename": "abc123.jpg",
    "size": 245680,
    "mimeType": "image/jpeg"
  }
}
```

**Validation**:
- Formats acceptés: JPG, PNG, WebP
- Taille max: 5 MB
- Dimensions max: 4096x4096

---

## 🔒 Sécurité

### Rate Limiting
```
Authentication endpoints: 5 req/min
API endpoints (authenticated): 100 req/min
API endpoints (public): 30 req/min
```

### CSRF Protection
Toutes les mutations (POST, PUT, DELETE) nécessitent un token CSRF:
```
X-CSRF-Token: <token>
```

### CORS
```
Allowed Origins: https://esport-platform.fr
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Authorization, Content-Type, X-CSRF-Token
```

---

## 🌐 WebSocket Events

### Connection
```javascript
const socket = io('wss://api.esport-platform.fr', {
  auth: {
    token: accessToken
  }
});
```

### Events

**Client → Server**:
- `join_tournament` - Rejoindre la room d'un tournoi
- `join_match` - Rejoindre la room d'un match
- `leave_tournament`
- `leave_match`

**Server → Client**:
- `tournament_updated` - Mise à jour tournoi
- `match_score_updated` - Score mis à jour
- `match_started` - Match démarré
- `match_completed` - Match terminé
- `notification` - Nouvelle notification

**Exemple**:
```javascript
// Rejoindre un match
socket.emit('join_match', { matchId: 523 });

// Écouter les mises à jour de score
socket.on('match_score_updated', (data) => {
  console.log('New score:', data.score);
});
```

---

## 📝 Codes d'Erreur

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Données invalides |
| `UNAUTHORIZED` | Non authentifié |
| `FORBIDDEN` | Non autorisé |
| `NOT_FOUND` | Ressource introuvable |
| `CONFLICT` | Conflit (email existant, etc.) |
| `TOURNAMENT_FULL` | Tournoi complet |
| `REGISTRATION_CLOSED` | Inscriptions fermées |
| `ALREADY_REGISTERED` | Déjà inscrit |
| `INVALID_CREDENTIALS` | Identifiants invalides |
| `ACCOUNT_LOCKED` | Compte verrouillé |
| `EMAIL_NOT_VERIFIED` | Email non vérifié |
| `RATE_LIMIT_EXCEEDED` | Trop de requêtes |
| `INTERNAL_ERROR` | Erreur serveur |

---

**Version API**: 1.0  
**Dernière mise à jour**: Décembre 2025  
**Documentation Swagger**: https://api.esport-platform.fr/swagger

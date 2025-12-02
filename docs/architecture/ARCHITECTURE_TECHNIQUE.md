# Architecture Technique - Plateforme E-Sport

## 📋 Vue d'Ensemble

### Objectif du Document
Ce document décrit l'architecture technique complète de la plateforme de gestion de tournois E-Sport, conçue selon les standards professionnels et les recommandations de sécurité ANSSI.

### Principes Directeurs
- **Sécurité par conception** (Security by Design)
- **Architecture multi-couches** (Multi-tier Architecture)
- **Séparation des responsabilités** (Separation of Concerns)
- **Scalabilité horizontale** (Horizontal Scalability)
- **Haute disponibilité** (High Availability)
- **Maintenabilité** (Maintainability)

---

## 🏗️ Architecture Globale

### Modèle Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEURS                             │
│              (Visiteurs, Joueurs, Organisateurs, Admins)        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REVERSE PROXY (NGINX)                       │
│  • Terminaison SSL/TLS                                          │
│  • Load Balancing                                               │
│  • Rate Limiting                                                │
│  • Compression GZIP                                             │
└────────────┬────────────────────────────┬───────────────────────┘
             │                            │
             │ HTTP                       │ WebSocket
             ▼                            ▼
┌──────────────────────────┐   ┌──────────────────────────────────┐
│   FRONTEND (SPA)         │   │   WEBSOCKET SERVER               │
│   • React/Vue            │   │   • SignalR/Socket.IO            │
│   • TailwindCSS          │   │   • Temps réel                   │
│   • State Management     │   │   • Notifications push           │
└──────────┬───────────────┘   └────────────┬─────────────────────┘
           │                                 │
           │ REST API (HTTPS)                │
           ▼                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY / BACKEND                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              COUCHE PRÉSENTATION (Controllers)             │ │
│  │  • AuthController      • TournamentController              │ │
│  │  • PlayerController    • MatchController                   │ │
│  │  • TeamController      • AdminController                   │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼───────────────────────────────────┐ │
│  │         MIDDLEWARES (Sécurité & Validation)                │ │
│  │  • Authentication JWT  • CSRF Protection                   │ │
│  │  • Authorization RBAC  • Input Validation                  │ │
│  │  • Rate Limiting       • Audit Logging                     │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼───────────────────────────────────┐ │
│  │              COUCHE MÉTIER (Services)                      │ │
│  │  • TournamentService   • BracketService                    │ │
│  │  • PlayerService       • EloService                        │ │
│  │  • TeamService         • NotificationService               │ │
│  │  • MatchService        • AuthService                       │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼───────────────────────────────────┐ │
│  │           COUCHE DOMAINE (Algorithmes)                     │ │
│  │  • EloCalculator       • BracketGenerator                  │ │
│  │  • MatchScheduler      • PenaltyCalculator                 │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼───────────────────────────────────┐ │
│  │         COUCHE DONNÉES (Repositories)                      │ │
│  │  • UserRepository      • TournamentRepository              │ │
│  │  • PlayerRepository    • MatchRepository                   │ │
│  │  • TeamRepository      • BracketRepository                 │ │
│  └────────────────────────┬───────────────────────────────────┘ │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            │ ORM (Entity Framework/Hibernate)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BASE DE DONNÉES (PostgreSQL)                   │
│  • Tables normalisées                                           │
│  • Index optimisés                                              │
│  • Contraintes d'intégrité                                      │
│  • Triggers & Procédures stockées                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SERVICES EXTERNES                             │
│  • Service Email (SMTP)                                         │
│  • Stockage Fichiers (S3/Azure Blob)                           │
│  • Cache (Redis)                                                │
│  • Queue Messages (RabbitMQ)                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Architecture Frontend

### Stack Technologique
- **Framework**: React 18+ ou Vue 3+
- **Langage**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit / Pinia
- **Routing**: React Router / Vue Router
- **HTTP Client**: Axios
- **WebSocket**: Socket.IO Client / SignalR Client
- **Validation**: Yup / Zod
- **Testing**: Jest + React Testing Library / Vitest

### Structure des Composants

```
Component Hierarchy:
App
├── Layout
│   ├── Header (Navigation, User Menu)
│   ├── Sidebar (Admin/Organizer)
│   └── Footer
├── Pages
│   ├── Home
│   ├── Tournaments
│   │   ├── TournamentList
│   │   └── TournamentDetails
│   │       ├── TournamentInfo
│   │       ├── BracketView
│   │       ├── ParticipantsList
│   │       └── MatchSchedule
│   ├── Profile
│   │   ├── PlayerStats
│   │   ├── MatchHistory
│   │   └── TeamMemberships
│   ├── Team
│   │   ├── TeamDetails
│   │   ├── TeamMembers
│   │   └── TeamInvitations
│   └── Admin
│       ├── Dashboard
│       ├── UserManagement
│       └── SystemConfig
└── Common Components
    ├── Button, Input, Modal
    ├── Notification, Loader
    └── DataTable, Chart
```

### Gestion d'État

**Store Redux/Pinia**:
```
State:
├── auth
│   ├── user
│   ├── token
│   ├── refreshToken
│   └── isAuthenticated
├── tournaments
│   ├── list
│   ├── current
│   └── filters
├── matches
│   ├── live
│   └── history
├── notifications
│   ├── unread
│   └── list
└── ui
    ├── loading
    ├── errors
    └── modals
```

### Sécurité Frontend

1. **Protection XSS**
   - Échappement automatique (React/Vue)
   - Sanitization des inputs utilisateur
   - Content Security Policy (CSP)

2. **Protection CSRF**
   - Token CSRF dans headers
   - SameSite cookies

3. **Validation**
   - Validation côté client (UX)
   - Validation serveur obligatoire (sécurité)

4. **Authentification**
   - JWT stocké en mémoire ou httpOnly cookie
   - Refresh token rotation
   - Auto-logout sur expiration

---

## ⚙️ Architecture Backend

### Stack Technologique (Option .NET Core)
- **Framework**: ASP.NET Core 8.0
- **Langage**: C# 12
- **ORM**: Entity Framework Core
- **WebSocket**: SignalR
- **Authentication**: JWT Bearer
- **Validation**: FluentValidation
- **Logging**: Serilog
- **Testing**: xUnit + Moq

### Stack Technologique (Option Node.js)
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS / Express
- **Langage**: TypeScript
- **ORM**: TypeORM / Prisma
- **WebSocket**: Socket.IO
- **Authentication**: Passport.js + JWT
- **Validation**: class-validator
- **Testing**: Jest

### Couches Backend

#### 1. Couche Présentation (Controllers)

**Responsabilités**:
- Recevoir les requêtes HTTP
- Valider les données d'entrée (DTO)
- Appeler les services métier
- Retourner les réponses formatées
- Gestion des erreurs HTTP

**Exemple**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class TournamentController : ControllerBase
{
    private readonly ITournamentService _tournamentService;
    
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<TournamentDto>>> GetTournaments(
        [FromQuery] TournamentFilterDto filters)
    {
        var tournaments = await _tournamentService.GetTournamentsAsync(filters);
        return Ok(tournaments);
    }
    
    [HttpPost]
    [Authorize(Roles = "Organizer,Admin")]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult<TournamentDto>> CreateTournament(
        [FromBody] CreateTournamentDto dto)
    {
        var tournament = await _tournamentService.CreateTournamentAsync(dto);
        return CreatedAtAction(nameof(GetTournament), 
            new { id = tournament.Id }, tournament);
    }
}
```

#### 2. Couche Métier (Services)

**Responsabilités**:
- Implémenter la logique métier
- Orchestrer les opérations complexes
- Appliquer les règles de gestion
- Gérer les transactions
- Appeler les repositories

**Exemple**:
```csharp
public class TournamentService : ITournamentService
{
    private readonly ITournamentRepository _tournamentRepository;
    private readonly IBracketService _bracketService;
    private readonly INotificationService _notificationService;
    private readonly IEloService _eloService;
    
    public async Task<TournamentDto> CreateTournamentAsync(
        CreateTournamentDto dto)
    {
        // Validation métier
        await ValidateTournamentRulesAsync(dto);
        
        // Création du tournoi
        var tournament = new Tournament
        {
            Name = dto.Name,
            Game = dto.Game,
            MaxParticipants = dto.MaxParticipants,
            Format = dto.Format,
            StartDate = dto.StartDate,
            Status = TournamentStatus.Draft
        };
        
        // Sauvegarde
        await _tournamentRepository.CreateAsync(tournament);
        
        // Génération du bracket si nécessaire
        if (dto.AutoGenerateBracket)
        {
            await _bracketService.GenerateBracketAsync(tournament.Id);
        }
        
        // Notification
        await _notificationService.NotifyTournamentCreatedAsync(tournament);
        
        return MapToDto(tournament);
    }
}
```

#### 3. Couche Domaine (Algorithmes)

**Responsabilités**:
- Algorithmes métier purs
- Calculs complexes (ELO, brackets)
- Logique sans dépendances externes
- Testabilité maximale

**Exemple - Algorithme ELO**:
```csharp
public class EloCalculator
{
    private const int K_FACTOR = 32;
    
    public (int newRatingWinner, int newRatingLoser) CalculateNewRatings(
        int ratingWinner, int ratingLoser, double scoreWinner = 1.0)
    {
        double expectedWinner = CalculateExpectedScore(ratingWinner, ratingLoser);
        double expectedLoser = CalculateExpectedScore(ratingLoser, ratingWinner);
        
        int newRatingWinner = ratingWinner + 
            (int)(K_FACTOR * (scoreWinner - expectedWinner));
        int newRatingLoser = ratingLoser + 
            (int)(K_FACTOR * ((1 - scoreWinner) - expectedLoser));
        
        return (newRatingWinner, newRatingLoser);
    }
    
    private double CalculateExpectedScore(int ratingA, int ratingB)
    {
        return 1.0 / (1.0 + Math.Pow(10, (ratingB - ratingA) / 400.0));
    }
}
```

**Exemple - Génération de Bracket**:
```csharp
public class BracketGenerator
{
    public Bracket GenerateSingleEliminationBracket(
        List<Participant> participants)
    {
        int participantCount = participants.Count;
        int rounds = (int)Math.Ceiling(Math.Log2(participantCount));
        int totalSlots = (int)Math.Pow(2, rounds);
        
        // Création des rounds
        var bracket = new Bracket
        {
            Type = BracketType.SingleElimination,
            Rounds = new List<Round>()
        };
        
        // Génération des matchs pour chaque round
        for (int roundIndex = 0; roundIndex < rounds; roundIndex++)
        {
            int matchesInRound = totalSlots / (int)Math.Pow(2, roundIndex + 1);
            var round = new Round
            {
                RoundNumber = roundIndex + 1,
                Matches = new List<Match>()
            };
            
            for (int matchIndex = 0; matchIndex < matchesInRound; matchIndex++)
            {
                round.Matches.Add(new Match
                {
                    MatchNumber = matchIndex + 1,
                    Status = MatchStatus.Pending
                });
            }
            
            bracket.Rounds.Add(round);
        }
        
        // Assignation des participants au premier round
        AssignParticipantsToFirstRound(bracket, participants);
        
        return bracket;
    }
    
    private void AssignParticipantsToFirstRound(
        Bracket bracket, List<Participant> participants)
    {
        // Seeding basé sur le classement ELO
        var seededParticipants = participants
            .OrderByDescending(p => p.EloRating)
            .ToList();
        
        var firstRound = bracket.Rounds[0];
        int participantIndex = 0;
        
        foreach (var match in firstRound.Matches)
        {
            if (participantIndex < seededParticipants.Count)
            {
                match.Participant1 = seededParticipants[participantIndex++];
            }
            if (participantIndex < seededParticipants.Count)
            {
                match.Participant2 = seededParticipants[participantIndex++];
            }
        }
    }
}
```

#### 4. Couche Données (Repositories)

**Responsabilités**:
- Accès aux données
- Requêtes optimisées
- Gestion du cache
- Abstraction de la base de données

**Exemple**:
```csharp
public class TournamentRepository : ITournamentRepository
{
    private readonly ApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    
    public async Task<List<Tournament>> GetActiveAsync()
    {
        return await _context.Tournaments
            .Where(t => t.Status == TournamentStatus.Active)
            .Include(t => t.Participants)
            .Include(t => t.Bracket)
            .OrderBy(t => t.StartDate)
            .ToListAsync();
    }
    
    public async Task<Tournament> GetByIdAsync(int id)
    {
        string cacheKey = $"tournament_{id}";
        
        if (!_cache.TryGetValue(cacheKey, out Tournament tournament))
        {
            tournament = await _context.Tournaments
                .Include(t => t.Participants)
                .Include(t => t.Bracket)
                    .ThenInclude(b => b.Rounds)
                        .ThenInclude(r => r.Matches)
                .FirstOrDefaultAsync(t => t.Id == id);
            
            if (tournament != null)
            {
                _cache.Set(cacheKey, tournament, TimeSpan.FromMinutes(10));
            }
        }
        
        return tournament;
    }
}
```

### Middlewares

#### Authentication Middleware
```csharp
public class JwtAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    
    public async Task InvokeAsync(HttpContext context, 
        IJwtTokenValidator tokenValidator)
    {
        var token = ExtractTokenFromHeader(context.Request);
        
        if (!string.IsNullOrEmpty(token))
        {
            var principal = await tokenValidator.ValidateTokenAsync(token);
            if (principal != null)
            {
                context.User = principal;
            }
        }
        
        await _next(context);
    }
}
```

#### Security Headers Middleware
```csharp
public class SecurityHeadersMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Add("X-Frame-Options", "DENY");
        context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
        context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
        context.Response.Headers.Add("Content-Security-Policy", 
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
        
        await _next(context);
    }
}
```

#### Audit Logging Middleware
```csharp
public class AuditLoggingMiddleware
{
    public async Task InvokeAsync(HttpContext context, 
        IAuditLogService auditService)
    {
        var auditLog = new AuditLog
        {
            UserId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            Action = $"{context.Request.Method} {context.Request.Path}",
            IpAddress = context.Connection.RemoteIpAddress?.ToString(),
            Timestamp = DateTime.UtcNow
        };
        
        await _next(context);
        
        auditLog.StatusCode = context.Response.StatusCode;
        await auditService.LogAsync(auditLog);
    }
}
```

---

## 💾 Architecture Base de Données

### Choix Technologique: PostgreSQL

**Justification**:
- Open source et gratuit
- Performance excellente
- Support JSON natif
- Transactions ACID
- Extensibilité
- Communauté active

### Principes de Conception

1. **Normalisation**: 3NF minimum
2. **Index**: Sur clés étrangères et colonnes fréquemment requêtées
3. **Contraintes**: Intégrité référentielle stricte
4. **Triggers**: Audit automatique
5. **Partitionnement**: Pour tables volumineuses (logs, historique)

### Schéma Relationnel (voir DATABASE_SCHEMA.md pour détails)

**Tables Principales**:
- `users` - Utilisateurs du système
- `players` - Profils joueurs
- `teams` - Équipes
- `tournaments` - Tournois
- `brackets` - Arbres de tournois
- `matches` - Matchs
- `registrations` - Inscriptions
- `waiting_lists` - Listes d'attente
- `notifications` - Notifications
- `audit_logs` - Logs d'audit

---

## 🔌 Architecture WebSocket

### Technologie: SignalR (.NET) / Socket.IO (Node.js)

### Hubs

**TournamentHub**:
- Mises à jour en temps réel des tournois
- Changements de statut
- Nouvelles inscriptions

**MatchHub**:
- Scores en direct
- Progression des matchs
- Résultats

**NotificationHub**:
- Notifications push
- Alertes système
- Messages personnalisés

### Exemple d'Implémentation

```csharp
public class MatchHub : Hub
{
    private readonly IMatchService _matchService;
    
    public async Task JoinMatchRoom(int matchId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"match_{matchId}");
    }
    
    public async Task UpdateScore(int matchId, int participant1Score, int participant2Score)
    {
        // Vérification des permissions
        if (!await _matchService.CanUpdateScoreAsync(matchId, Context.User))
        {
            throw new HubException("Unauthorized");
        }
        
        // Mise à jour du score
        await _matchService.UpdateScoreAsync(matchId, participant1Score, participant2Score);
        
        // Broadcast aux clients
        await Clients.Group($"match_{matchId}")
            .SendAsync("ScoreUpdated", new
            {
                MatchId = matchId,
                Participant1Score = participant1Score,
                Participant2Score = participant2Score,
                Timestamp = DateTime.UtcNow
            });
    }
}
```

---

## 🔐 Architecture Sécurité

### Authentification

**JWT (JSON Web Tokens)**:
```
Access Token:
- Durée de vie: 15 minutes
- Contenu: userId, role, permissions
- Stockage: Memory (frontend)

Refresh Token:
- Durée de vie: 7 jours
- Stockage: HttpOnly Cookie
- Rotation automatique
```

### Authorization (RBAC)

**Rôles**:
- Visitor (anonymous)
- Player
- Organizer
- Administrator

**Permissions**:
```
Player:
  - tournament:view
  - tournament:register
  - profile:edit
  - team:create
  - team:join

Organizer (hérite Player):
  - tournament:create
  - tournament:edit
  - tournament:delete
  - bracket:manage
  - match:update

Admin (hérite Organizer):
  - user:manage
  - system:configure
  - audit:view
  - statistics:view
```

### Protection OWASP Top 10

1. **Injection SQL**: Requêtes préparées (ORM)
2. **Broken Authentication**: JWT + MFA optionnel
3. **Sensitive Data Exposure**: Chiffrement HTTPS, bcrypt passwords
4. **XML External Entities**: Pas d'XML parsing
5. **Broken Access Control**: RBAC strict
6. **Security Misconfiguration**: Headers sécurisés
7. **XSS**: Échappement automatique, CSP
8. **Insecure Deserialization**: Validation stricte
9. **Components with Known Vulnerabilities**: Dépendances à jour
10. **Insufficient Logging**: Audit complet

---

## 📊 Performance et Scalabilité

### Stratégies de Cache

**Redis Cache**:
- Tournois actifs (TTL: 10 min)
- Classements ELO (TTL: 5 min)
- Sessions utilisateur

**In-Memory Cache**:
- Configuration système
- Données de référence

### Optimisations Base de Données

- Index sur colonnes fréquemment requêtées
- Requêtes paginées (limit/offset)
- Eager loading pour relations
- Connection pooling

### Load Balancing

- NGINX reverse proxy
- Round-robin entre instances backend
- Session sticky pour WebSocket

---

## 🚀 Déploiement

### Environnements

1. **Development**: Local (Docker Compose)
2. **Test**: CI/CD automatisé
3. **Pre-production**: Environnement staging
4. **Production**: Haute disponibilité

### Infrastructure

```
Production:
├── Load Balancer (NGINX)
├── Frontend (3 instances)
├── Backend API (3 instances)
├── WebSocket Server (2 instances)
├── PostgreSQL (Primary + Replica)
├── Redis (Cluster)
└── File Storage (S3/Azure Blob)
```

### Monitoring

- **Logs**: Serilog → ELK Stack
- **Metrics**: Prometheus + Grafana
- **APM**: Application Insights / New Relic
- **Uptime**: Pingdom / UptimeRobot

---

## 📚 Technologies Recommandées

### Option 1: .NET Stack
- **Backend**: ASP.NET Core 8.0
- **Frontend**: React 18 + TypeScript
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **WebSocket**: SignalR
- **ORM**: Entity Framework Core 8

### Option 2: Node.js Stack
- **Backend**: NestJS + TypeScript
- **Frontend**: Vue 3 + TypeScript
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **WebSocket**: Socket.IO
- **ORM**: Prisma

### Services Communs
- **Reverse Proxy**: NGINX
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: SonarQube
- **Testing**: Jest/xUnit + Cypress

---

## ✅ Standards de Qualité

### Code Coverage
- **Minimum**: 70%
- **Objectif**: 85%
- **Critique**: 100% sur algorithmes métier

### Code Quality
- **SonarQube**: Grade A minimum
- **Linting**: ESLint/StyleCop
- **Formatting**: Prettier/EditorConfig

### Documentation
- **API**: OpenAPI/Swagger complet
- **Code**: Commentaires XML/JSDoc
- **Architecture**: Diagrammes à jour

---

## 🔄 Évolutions Futures

### Phase 2 (Post-MVP)
- Système de chat intégré
- Streaming Twitch/YouTube
- Application mobile (React Native)
- IA pour prédictions de matchs
- Système de paris virtuels
- Multi-langue (i18n)

### Scalabilité
- Microservices (si nécessaire)
- Event sourcing pour historique
- CQRS pour séparation lecture/écriture
- Kubernetes pour orchestration

---

**Document rédigé par**: Équipe Architecture  
**Version**: 1.0  
**Date**: Décembre 2025  
**Statut**: Approuvé

# Schéma de Base de Données - Plateforme E-Sport

## 📋 Vue d'Ensemble

### Technologie
- **SGBD**: PostgreSQL 16+
- **ORM**: Entity Framework Core / Prisma / TypeORM
- **Normalisation**: 3NF (Troisième Forme Normale)
- **Encodage**: UTF-8
- **Collation**: fr_FR.UTF-8

### Principes de Conception
1. **Intégrité référentielle** stricte avec contraintes FK
2. **Index** sur toutes les clés étrangères et colonnes fréquemment requêtées
3. **Triggers** pour audit automatique et mise à jour des timestamps
4. **Contraintes CHECK** pour validation des données
5. **Soft delete** pour préserver l'historique
6. **Partitionnement** pour tables volumineuses (logs, historique)

---

## 🗂️ Schéma Relationnel Complet

### Diagramme ERD (Entity Relationship Diagram)

```
┌─────────────────┐         ┌──────────────────┐
│     users       │────────<│    players       │
│─────────────────│         │──────────────────│
│ id (PK)         │         │ id (PK)          │
│ email           │         │ user_id (FK)     │
│ password_hash   │         │ pseudo           │
│ role            │         │ elo_rating       │
│ is_active       │         │ total_matches    │
│ created_at      │         │ wins             │
│ updated_at      │         │ losses           │
└─────────────────┘         └──────────────────┘
         │                           │
         │                           │
         │                  ┌────────┴────────┐
         │                  │                 │
         │         ┌────────▼──────┐  ┌──────▼──────────┐
         │         │ team_members  │  │ registrations   │
         │         │───────────────│  │─────────────────│
         │         │ id (PK)       │  │ id (PK)         │
         │         │ team_id (FK)  │  │ tournament_id   │
         │         │ player_id (FK)│  │ player_id (FK)  │
         │         │ role          │  │ status          │
         │         │ joined_at     │  │ registered_at   │
         │         └───────────────┘  └─────────────────┘
         │                  │                 │
         │                  │                 │
         │         ┌────────▼──────┐          │
         │         │     teams     │          │
         │         │───────────────│          │
         │         │ id (PK)       │          │
         │         │ name          │          │
         │         │ tag           │          │
         │         │ captain_id    │          │
         │         │ created_at    │          │
         │         └───────────────┘          │
         │                                    │
         │                                    │
         │         ┌──────────────────────────▼────┐
         └────────>│      tournaments               │
                   │────────────────────────────────│
                   │ id (PK)                        │
                   │ name                           │
                   │ game                           │
                   │ organizer_id (FK → users)      │
                   │ max_participants               │
                   │ format (BO1/BO3/BO5)           │
                   │ bracket_type                   │
                   │ status                         │
                   │ start_date                     │
                   │ end_date                       │
                   │ registration_deadline          │
                   │ elo_enabled                    │
                   │ cover_image_url                │
                   │ rules_text                     │
                   │ created_at                     │
                   │ updated_at                     │
                   └────────────────┬───────────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
          ┌────────▼──────┐  ┌──────▼──────┐  ┌────▼──────────┐
          │ waiting_lists │  │  brackets   │  │ notifications │
          │───────────────│  │─────────────│  │───────────────│
          │ id (PK)       │  │ id (PK)     │  │ id (PK)       │
          │ tournament_id │  │ tourn_id    │  │ user_id (FK)  │
          │ player_id     │  │ type        │  │ tournament_id │
          │ position      │  │ created_at  │  │ type          │
          │ added_at      │  └─────┬───────┘  │ message       │
          └───────────────┘        │          │ is_read       │
                                   │          │ sent_at       │
                          ┌────────▼────────┐ └───────────────┘
                          │     rounds      │
                          │─────────────────│
                          │ id (PK)         │
                          │ bracket_id (FK) │
                          │ round_number    │
                          │ name            │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │     matches     │
                          │─────────────────│
                          │ id (PK)         │
                          │ round_id (FK)   │
                          │ match_number    │
                          │ participant1_id │
                          │ participant2_id │
                          │ winner_id       │
                          │ status          │
                          │ scheduled_at    │
                          │ started_at      │
                          │ completed_at    │
                          │ next_match_id   │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────────┐
                          │   match_results     │
                          │─────────────────────│
                          │ id (PK)             │
                          │ match_id (FK)       │
                          │ participant1_score  │
                          │ participant2_score  │
                          │ participant1_elo_ch │
                          │ participant2_elo_ch │
                          │ validated_by (FK)   │
                          │ validated_at        │
                          └─────────────────────┘

┌──────────────────────┐      ┌─────────────────────┐
│  player_statistics   │      │     audit_logs      │
│──────────────────────│      │─────────────────────│
│ id (PK)              │      │ id (PK)             │
│ player_id (FK)       │      │ user_id (FK)        │
│ tournament_id (FK)   │      │ action              │
│ matches_played       │      │ entity_type         │
│ wins                 │      │ entity_id           │
│ losses               │      │ ip_address          │
│ elo_change           │      │ user_agent          │
│ created_at           │      │ timestamp           │
└──────────────────────┘      │ details (JSONB)     │
                              └─────────────────────┘
```

---

## 📊 Tables Détaillées

### 1. Table `users`

**Description**: Comptes utilisateurs du système

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'player',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT chk_role CHECK (role IN ('player', 'organizer', 'admin')),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;
```

**Colonnes clés**:
- `role`: Rôle de l'utilisateur (player, organizer, admin)
- `is_active`: Compte actif ou suspendu
- `failed_login_attempts`: Protection contre brute force
- `locked_until`: Verrouillage temporaire du compte
- `deleted_at`: Soft delete (RGPD)

---

### 2. Table `players`

**Description**: Profils joueurs avec statistiques ELO

```sql
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    avatar_url VARCHAR(500),
    bio TEXT,
    country_code CHAR(2),
    elo_rating INT NOT NULL DEFAULT 1200,
    total_matches INT NOT NULL DEFAULT 0,
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0,
    win_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_matches > 0 
        THEN (wins::DECIMAL / total_matches * 100) 
        ELSE 0 END
    ) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_player_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_elo_range CHECK (elo_rating >= 0 AND elo_rating <= 5000),
    CONSTRAINT chk_stats_positive CHECK (
        total_matches >= 0 AND wins >= 0 AND losses >= 0
    ),
    CONSTRAINT chk_stats_coherent CHECK (total_matches = wins + losses)
);

-- Index
CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_players_elo ON players(elo_rating DESC);
CREATE INDEX idx_players_pseudo ON players(pseudo);
```

**Colonnes calculées**:
- `win_rate`: Taux de victoire calculé automatiquement

---

### 3. Table `teams`

**Description**: Équipes de joueurs

```sql
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tag VARCHAR(10) NOT NULL UNIQUE,
    captain_id INT NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT fk_team_captain FOREIGN KEY (captain_id) 
        REFERENCES players(id) ON DELETE RESTRICT,
    CONSTRAINT chk_tag_format CHECK (tag ~* '^[A-Z0-9]{2,10}$')
);

-- Index
CREATE INDEX idx_teams_captain ON teams(captain_id);
CREATE INDEX idx_teams_tag ON teams(tag);
CREATE UNIQUE INDEX idx_teams_name_active ON teams(name) 
    WHERE deleted_at IS NULL;
```

---

### 4. Table `team_members`

**Description**: Membres des équipes

```sql
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    
    CONSTRAINT fk_member_team FOREIGN KEY (team_id) 
        REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_member_player FOREIGN KEY (player_id) 
        REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT chk_member_role CHECK (role IN ('captain', 'member', 'substitute')),
    CONSTRAINT uq_active_membership UNIQUE (team_id, player_id, left_at)
);

-- Index
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_player ON team_members(player_id);
CREATE INDEX idx_team_members_active ON team_members(team_id, player_id) 
    WHERE left_at IS NULL;
```

---

### 5. Table `tournaments`

**Description**: Tournois E-Sport

```sql
CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    game VARCHAR(100) NOT NULL,
    organizer_id INT NOT NULL,
    description TEXT,
    rules_text TEXT,
    max_participants INT NOT NULL,
    current_participants INT NOT NULL DEFAULT 0,
    format VARCHAR(20) NOT NULL DEFAULT 'BO1',
    bracket_type VARCHAR(50) NOT NULL DEFAULT 'single_elimination',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    prize_pool DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    registration_start TIMESTAMP NOT NULL,
    registration_deadline TIMESTAMP NOT NULL,
    check_in_start TIMESTAMP,
    check_in_deadline TIMESTAMP,
    elo_enabled BOOLEAN NOT NULL DEFAULT true,
    elo_k_factor INT DEFAULT 32,
    cover_image_url VARCHAR(500),
    banner_image_url VARCHAR(500),
    is_public BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT fk_tournament_organizer FOREIGN KEY (organizer_id) 
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_format CHECK (format IN ('BO1', 'BO3', 'BO5', 'BO7')),
    CONSTRAINT chk_bracket_type CHECK (
        bracket_type IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')
    ),
    CONSTRAINT chk_status CHECK (
        status IN ('draft', 'open', 'ongoing', 'completed', 'cancelled')
    ),
    CONSTRAINT chk_max_participants CHECK (max_participants >= 2 AND max_participants <= 1024),
    CONSTRAINT chk_dates CHECK (
        start_date > registration_start AND
        registration_deadline <= start_date
    ),
    CONSTRAINT chk_participants_limit CHECK (current_participants <= max_participants)
);

-- Index
CREATE INDEX idx_tournaments_organizer ON tournaments(organizer_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_game ON tournaments(game);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX idx_tournaments_slug ON tournaments(slug);
CREATE INDEX idx_tournaments_public ON tournaments(is_public, status) 
    WHERE deleted_at IS NULL;
```

**Statuts possibles**:
- `draft`: Brouillon (non publié)
- `open`: Inscriptions ouvertes
- `ongoing`: En cours
- `completed`: Terminé
- `cancelled`: Annulé

---

### 6. Table `tournament_registrations`

**Description**: Inscriptions aux tournois

```sql
CREATE TABLE tournament_registrations (
    id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL,
    player_id INT,
    team_id INT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    seed_position INT,
    checked_in BOOLEAN NOT NULL DEFAULT false,
    checked_in_at TIMESTAMP,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    CONSTRAINT fk_registration_tournament FOREIGN KEY (tournament_id) 
        REFERENCES tournaments(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_player FOREIGN KEY (player_id) 
        REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_team FOREIGN KEY (team_id) 
        REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT chk_participant_type CHECK (
        (player_id IS NOT NULL AND team_id IS NULL) OR
        (player_id IS NULL AND team_id IS NOT NULL)
    ),
    CONSTRAINT chk_registration_status CHECK (
        status IN ('pending', 'confirmed', 'cancelled', 'disqualified')
    ),
    CONSTRAINT uq_tournament_participant UNIQUE (tournament_id, player_id, team_id)
);

-- Index
CREATE INDEX idx_registrations_tournament ON tournament_registrations(tournament_id);
CREATE INDEX idx_registrations_player ON tournament_registrations(player_id);
CREATE INDEX idx_registrations_team ON tournament_registrations(team_id);
CREATE INDEX idx_registrations_status ON tournament_registrations(tournament_id, status);
```

---

### 7. Table `waiting_lists`

**Description**: Files d'attente pour tournois complets

```sql
CREATE TABLE waiting_lists (
    id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL,
    player_id INT,
    team_id INT,
    position INT NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notified_at TIMESTAMP,
    expired_at TIMESTAMP,
    
    CONSTRAINT fk_waiting_tournament FOREIGN KEY (tournament_id) 
        REFERENCES tournaments(id) ON DELETE CASCADE,
    CONSTRAINT fk_waiting_player FOREIGN KEY (player_id) 
        REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT fk_waiting_team FOREIGN KEY (team_id) 
        REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT chk_waiting_participant CHECK (
        (player_id IS NOT NULL AND team_id IS NULL) OR
        (player_id IS NULL AND team_id IS NOT NULL)
    ),
    CONSTRAINT uq_waiting_position UNIQUE (tournament_id, position)
);

-- Index
CREATE INDEX idx_waiting_tournament ON waiting_lists(tournament_id, position);
CREATE INDEX idx_waiting_player ON waiting_lists(player_id);
```

---

### 8. Table `brackets`

**Description**: Arbres de tournoi

```sql
CREATE TABLE brackets (
    id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    total_rounds INT NOT NULL,
    current_round INT NOT NULL DEFAULT 1,
    is_finalized BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bracket_tournament FOREIGN KEY (tournament_id) 
        REFERENCES tournaments(id) ON DELETE CASCADE,
    CONSTRAINT chk_bracket_type CHECK (
        type IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')
    ),
    CONSTRAINT chk_rounds CHECK (total_rounds > 0 AND current_round <= total_rounds)
);

-- Index
CREATE INDEX idx_brackets_tournament ON brackets(tournament_id);
```

---

### 9. Table `rounds`

**Description**: Rounds dans un bracket

```sql
CREATE TABLE rounds (
    id SERIAL PRIMARY KEY,
    bracket_id INT NOT NULL,
    round_number INT NOT NULL,
    name VARCHAR(100),
    is_completed BOOLEAN NOT NULL DEFAULT false,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT fk_round_bracket FOREIGN KEY (bracket_id) 
        REFERENCES brackets(id) ON DELETE CASCADE,
    CONSTRAINT uq_bracket_round UNIQUE (bracket_id, round_number)
);

-- Index
CREATE INDEX idx_rounds_bracket ON rounds(bracket_id, round_number);
```

---

### 10. Table `matches`

**Description**: Matchs individuels

```sql
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    round_id INT NOT NULL,
    match_number INT NOT NULL,
    participant1_id INT,
    participant2_id INT,
    participant1_type VARCHAR(20),
    participant2_type VARCHAR(20),
    winner_id INT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    next_match_id INT,
    loser_match_id INT,
    best_of INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_match_round FOREIGN KEY (round_id) 
        REFERENCES rounds(id) ON DELETE CASCADE,
    CONSTRAINT fk_match_next FOREIGN KEY (next_match_id) 
        REFERENCES matches(id) ON DELETE SET NULL,
    CONSTRAINT fk_match_loser FOREIGN KEY (loser_match_id) 
        REFERENCES matches(id) ON DELETE SET NULL,
    CONSTRAINT chk_match_status CHECK (
        status IN ('pending', 'ready', 'ongoing', 'completed', 'cancelled', 'walkover')
    ),
    CONSTRAINT chk_participant_types CHECK (
        participant1_type IN ('player', 'team') AND
        participant2_type IN ('player', 'team')
    ),
    CONSTRAINT chk_best_of CHECK (best_of IN (1, 3, 5, 7))
);

-- Index
CREATE INDEX idx_matches_round ON matches(round_id);
CREATE INDEX idx_matches_participants ON matches(participant1_id, participant2_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_scheduled ON matches(scheduled_at);
```

---

### 11. Table `match_results`

**Description**: Résultats détaillés des matchs

```sql
CREATE TABLE match_results (
    id SERIAL PRIMARY KEY,
    match_id INT NOT NULL UNIQUE,
    participant1_score INT NOT NULL DEFAULT 0,
    participant2_score INT NOT NULL DEFAULT 0,
    participant1_elo_before INT,
    participant2_elo_before INT,
    participant1_elo_after INT,
    participant2_elo_after INT,
    participant1_elo_change INT GENERATED ALWAYS AS 
        (participant1_elo_after - participant1_elo_before) STORED,
    participant2_elo_change INT GENERATED ALWAYS AS 
        (participant2_elo_after - participant2_elo_before) STORED,
    validated_by INT,
    validated_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_result_match FOREIGN KEY (match_id) 
        REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_result_validator FOREIGN KEY (validated_by) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_scores_positive CHECK (
        participant1_score >= 0 AND participant2_score >= 0
    )
);

-- Index
CREATE INDEX idx_results_match ON match_results(match_id);
CREATE INDEX idx_results_validator ON match_results(validated_by);
```

---

### 12. Table `player_statistics`

**Description**: Statistiques par joueur et par tournoi

```sql
CREATE TABLE player_statistics (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL,
    tournament_id INT NOT NULL,
    matches_played INT NOT NULL DEFAULT 0,
    wins INT NOT NULL DEFAULT 0,
    losses INT NOT NULL DEFAULT 0,
    elo_change INT NOT NULL DEFAULT 0,
    final_position INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_stats_player FOREIGN KEY (player_id) 
        REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT fk_stats_tournament FOREIGN KEY (tournament_id) 
        REFERENCES tournaments(id) ON DELETE CASCADE,
    CONSTRAINT uq_player_tournament_stats UNIQUE (player_id, tournament_id)
);

-- Index
CREATE INDEX idx_stats_player ON player_statistics(player_id);
CREATE INDEX idx_stats_tournament ON player_statistics(tournament_id);
```

---

### 13. Table `notifications`

**Description**: Notifications utilisateur

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link_url VARCHAR(500),
    tournament_id INT,
    match_id INT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_tournament FOREIGN KEY (tournament_id) 
        REFERENCES tournaments(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_match FOREIGN KEY (match_id) 
        REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT chk_notification_type CHECK (
        type IN ('tournament_created', 'registration_confirmed', 'match_scheduled',
                 'match_starting', 'match_completed', 'tournament_completed',
                 'waiting_list_available', 'team_invitation', 'system')
    )
);

-- Index
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_sent ON notifications(sent_at DESC);
CREATE INDEX idx_notifications_expires ON notifications(expires_at) 
    WHERE expires_at IS NOT NULL;
```

---

### 14. Table `audit_logs`

**Description**: Logs d'audit pour sécurité et conformité RGPD

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10),
    request_path VARCHAR(500),
    status_code INT,
    details JSONB,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- Index
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);

-- Partitionnement par mois (pour performance)
-- CREATE TABLE audit_logs_2025_12 PARTITION OF audit_logs
--     FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');
```

---

## 🔧 Triggers et Fonctions

### Trigger: Mise à jour automatique de `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer à toutes les tables concernées
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- (répéter pour toutes les tables avec updated_at)
```

### Trigger: Mise à jour du compteur de participants

```sql
CREATE OR REPLACE FUNCTION update_tournament_participants_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
        UPDATE tournaments 
        SET current_participants = current_participants + 1
        WHERE id = NEW.tournament_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
        UPDATE tournaments 
        SET current_participants = current_participants + 1
        WHERE id = NEW.tournament_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
        UPDATE tournaments 
        SET current_participants = current_participants - 1
        WHERE id = NEW.tournament_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
        UPDATE tournaments 
        SET current_participants = current_participants - 1
        WHERE id = OLD.tournament_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tournament_participants
    AFTER INSERT OR UPDATE OR DELETE ON tournament_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_tournament_participants_count();
```

### Fonction: Calcul ELO

```sql
CREATE OR REPLACE FUNCTION calculate_elo_change(
    rating_a INT,
    rating_b INT,
    score_a DECIMAL,
    k_factor INT DEFAULT 32
)
RETURNS TABLE(new_rating_a INT, new_rating_b INT) AS $$
DECLARE
    expected_a DECIMAL;
    expected_b DECIMAL;
BEGIN
    expected_a := 1.0 / (1.0 + POWER(10, (rating_b - rating_a)::DECIMAL / 400.0));
    expected_b := 1.0 / (1.0 + POWER(10, (rating_a - rating_b)::DECIMAL / 400.0));
    
    new_rating_a := rating_a + ROUND(k_factor * (score_a - expected_a));
    new_rating_b := rating_b + ROUND(k_factor * ((1 - score_a) - expected_b));
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
```

---

## 📈 Vues Matérialisées

### Vue: Classement ELO Global

```sql
CREATE MATERIALIZED VIEW player_leaderboard AS
SELECT 
    p.id,
    p.pseudo,
    p.avatar_url,
    p.elo_rating,
    p.total_matches,
    p.wins,
    p.losses,
    p.win_rate,
    RANK() OVER (ORDER BY p.elo_rating DESC) as rank
FROM players p
WHERE p.total_matches >= 5
ORDER BY p.elo_rating DESC;

CREATE UNIQUE INDEX idx_leaderboard_id ON player_leaderboard(id);

-- Rafraîchir toutes les heures
-- SELECT refresh_materialized_view_concurrently('player_leaderboard');
```

### Vue: Statistiques Tournois

```sql
CREATE MATERIALIZED VIEW tournament_statistics AS
SELECT 
    t.id,
    t.name,
    t.game,
    t.status,
    t.current_participants,
    t.max_participants,
    COUNT(DISTINCT m.id) as total_matches,
    COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.id END) as completed_matches,
    t.start_date,
    t.end_date
FROM tournaments t
LEFT JOIN brackets b ON b.tournament_id = t.id
LEFT JOIN rounds r ON r.bracket_id = b.id
LEFT JOIN matches m ON m.round_id = r.id
GROUP BY t.id;

CREATE UNIQUE INDEX idx_tournament_stats_id ON tournament_statistics(id);
```

---

## 🔐 Sécurité Base de Données

### Rôles et Permissions

```sql
-- Rôle application (backend)
CREATE ROLE esport_app WITH LOGIN PASSWORD 'secure_password_here';
GRANT CONNECT ON DATABASE esport_platform TO esport_app;
GRANT USAGE ON SCHEMA public TO esport_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO esport_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO esport_app;

-- Rôle lecture seule (analytics)
CREATE ROLE esport_readonly WITH LOGIN PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE esport_platform TO esport_readonly;
GRANT USAGE ON SCHEMA public TO esport_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO esport_readonly;
```

### Row Level Security (RLS)

```sql
-- Activer RLS sur table sensible
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs ne voient que leurs propres données
CREATE POLICY user_isolation_policy ON users
    FOR ALL
    USING (id = current_setting('app.current_user_id')::INT);

-- Politique: Les admins voient tout
CREATE POLICY admin_all_access ON users
    FOR ALL
    TO esport_app
    USING (
        current_setting('app.current_user_role', true) = 'admin'
    );
```

---

## 📊 Optimisations Performance

### Index Composites

```sql
-- Recherche de tournois
CREATE INDEX idx_tournaments_search ON tournaments(game, status, start_date)
    WHERE deleted_at IS NULL AND is_public = true;

-- Historique de matchs d'un joueur
CREATE INDEX idx_matches_player_history ON matches(participant1_id, participant2_id, completed_at)
    WHERE status = 'completed';

-- Notifications non lues
CREATE INDEX idx_notifications_unread ON notifications(user_id, sent_at DESC)
    WHERE is_read = false;
```

### Statistiques Automatiques

```sql
-- Analyser régulièrement les tables
ANALYZE users;
ANALYZE tournaments;
ANALYZE matches;
```

---

## 💾 Backup et Maintenance

### Script de Backup

```bash
#!/bin/bash
# backup.sh
pg_dump -h localhost -U esport_app -F c -b -v -f \
    "backup_$(date +%Y%m%d_%H%M%S).dump" esport_platform
```

### Nettoyage des Données

```sql
-- Supprimer les notifications expirées
DELETE FROM notifications 
WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

-- Archiver les anciens logs d'audit (> 1 an)
-- (déplacer vers table d'archive ou exporter)
```

---

## 📚 Données de Référence

### Jeux Supportés

```sql
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO games (name, slug) VALUES
    ('League of Legends', 'league-of-legends'),
    ('Counter-Strike 2', 'counter-strike-2'),
    ('Valorant', 'valorant'),
    ('Rocket League', 'rocket-league'),
    ('Fortnite', 'fortnite');
```

---

**Document rédigé par**: Équipe Architecture  
**Version**: 1.0  
**Date**: Décembre 2025  
**Statut**: Approuvé

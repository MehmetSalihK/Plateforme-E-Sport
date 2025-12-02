# Guide de Sécurité - ANSSI & RGPD

## 📋 Vue d'Ensemble

Ce document détaille l'implémentation des mesures de sécurité conformes aux recommandations de l'ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information) et au RGPD (Règlement Général sur la Protection des Données).

---

## 🔐 1. Authentification

### 1.1 Politique de Mots de Passe (ANSSI)

**Exigences minimales**:
- Longueur minimale: 12 caractères
- Complexité: 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
- Pas de mots du dictionnaire
- Pas de données personnelles (nom, prénom, email)
- Historique: Les 5 derniers mots de passe interdits

**Implémentation**:
```csharp
public class PasswordValidator
{
    private const int MIN_LENGTH = 12;
    private static readonly Regex PasswordRegex = new Regex(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$"
    );
    
    public ValidationResult Validate(string password)
    {
        if (password.Length < MIN_LENGTH)
            return ValidationResult.Error("Le mot de passe doit contenir au moins 12 caractères");
            
        if (!PasswordRegex.IsMatch(password))
            return ValidationResult.Error("Le mot de passe ne respecte pas les critères de complexité");
            
        if (ContainsCommonWords(password))
            return ValidationResult.Error("Le mot de passe est trop commun");
            
        return ValidationResult.Success();
    }
}
```

### 1.2 Hachage des Mots de Passe

**Algorithme**: Argon2id (recommandé ANSSI) ou bcrypt

**Configuration Argon2id**:
```csharp
var config = new Argon2Config
{
    Type = Argon2Type.Argon2id,
    Version = Argon2Version.Nineteen,
    TimeCost = 3,        // Itérations
    MemoryCost = 65536,  // 64 MB
    Lanes = 4,           // Parallélisme
    Threads = 2,
    HashLength = 32,     // 256 bits
    Salt = GenerateRandomSalt(16)
};

string hashedPassword = Argon2.Hash(password, config);
```

**Vérification**:
```csharp
bool isValid = Argon2.Verify(hashedPassword, password);
```

### 1.3 Protection contre Brute Force

**Mesures**:
1. **Rate Limiting**: 5 tentatives par IP/15 minutes
2. **Account Locking**: Verrouillage après 5 échecs
3. **Délai progressif**: 2^n secondes entre tentatives
4. **CAPTCHA**: Après 3 échecs

**Implémentation**:
```csharp
public class LoginAttemptService
{
    private readonly IMemoryCache _cache;
    
    public async Task<bool> CanAttemptLogin(string email, string ipAddress)
    {
        string key = $"login_attempts_{email}_{ipAddress}";
        int attempts = _cache.Get<int>(key);
        
        if (attempts >= 5)
        {
            await LockAccount(email, TimeSpan.FromMinutes(30));
            return false;
        }
        
        return true;
    }
    
    public void RecordFailedAttempt(string email, string ipAddress)
    {
        string key = $"login_attempts_{email}_{ipAddress}";
        int attempts = _cache.Get<int>(key) + 1;
        _cache.Set(key, attempts, TimeSpan.FromMinutes(15));
    }
}
```

---

## 🔑 2. Gestion des Tokens JWT

### 2.1 Configuration JWT Sécurisée

**Access Token**:
- Durée de vie: 15 minutes
- Algorithme: HS256 (HMAC-SHA256)
- Clé secrète: 256 bits minimum
- Stockage: Mémoire (frontend)

**Refresh Token**:
- Durée de vie: 7 jours
- Stockage: HttpOnly Cookie (SameSite=Strict)
- Rotation automatique
- Révocation possible

**Génération**:
```csharp
public string GenerateAccessToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim("jti", Guid.NewGuid().ToString()), // Token ID unique
        new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
    };
    
    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"])
    );
    
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    
    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(15),
        signingCredentials: credentials
    );
    
    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### 2.2 Validation JWT

```csharp
public ClaimsPrincipal ValidateToken(string token)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]);
    
    var validationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = _configuration["Jwt:Issuer"],
        ValidAudience = _configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero // Pas de tolérance
    };
    
    try
    {
        var principal = tokenHandler.ValidateToken(
            token, validationParameters, out var validatedToken
        );
        
        // Vérifier que c'est bien un JWT avec HS256
        if (validatedToken is JwtSecurityToken jwtToken &&
            jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256))
        {
            return principal;
        }
    }
    catch (SecurityTokenException)
    {
        return null;
    }
    
    return null;
}
```

### 2.3 Révocation de Tokens

**Liste noire Redis**:
```csharp
public async Task RevokeToken(string tokenId)
{
    await _redis.SetAsync(
        $"revoked_token:{tokenId}",
        "1",
        TimeSpan.FromMinutes(15) // Durée de vie du token
    );
}

public async Task<bool> IsTokenRevoked(string tokenId)
{
    return await _redis.ExistsAsync($"revoked_token:{tokenId}");
}
```

---

## 🛡️ 3. Protection OWASP Top 10

### 3.1 Injection SQL

**Prévention**: Utilisation exclusive de requêtes préparées (ORM)

```csharp
// ❌ DANGEREUX - Injection SQL possible
string query = $"SELECT * FROM users WHERE email = '{email}'";

// ✅ SÉCURISÉ - Requête préparée
var user = await _context.Users
    .Where(u => u.Email == email)
    .FirstOrDefaultAsync();
```

### 3.2 Cross-Site Scripting (XSS)

**Prévention**:
1. **Échappement automatique** (React/Vue)
2. **Content Security Policy (CSP)**
3. **Sanitization des inputs**

**CSP Header**:
```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self'; " +
        "connect-src 'self' wss://api.esport-platform.fr; " +
        "frame-ancestors 'none';"
    );
    await next();
});
```

**Sanitization**:
```csharp
public string SanitizeInput(string input)
{
    return HttpUtility.HtmlEncode(input)
        .Replace("<script>", "")
        .Replace("</script>", "")
        .Replace("javascript:", "");
}
```

### 3.3 Cross-Site Request Forgery (CSRF)

**Protection Double Submit Cookie**:

**Backend**:
```csharp
[ValidateAntiForgeryToken]
[HttpPost]
public async Task<IActionResult> CreateTournament([FromBody] CreateTournamentDto dto)
{
    // Action protégée
}
```

**Frontend**:
```typescript
// Récupérer le token CSRF
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

// L'inclure dans toutes les requêtes
axios.post('/api/tournaments', data, {
  headers: {
    'X-CSRF-Token': csrfToken
  }
});
```

### 3.4 Broken Access Control

**Authorization Middleware**:
```csharp
public class RoleAuthorizationFilter : IAuthorizationFilter
{
    private readonly string[] _allowedRoles;
    
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        
        if (!user.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }
        
        var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
        
        if (!_allowedRoles.Contains(userRole))
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}
```

**Usage**:
```csharp
[Authorize(Roles = "Organizer,Admin")]
[HttpPost("tournaments")]
public async Task<IActionResult> CreateTournament(...)
```

### 3.5 Security Misconfiguration

**Headers de Sécurité**:
```csharp
public class SecurityHeadersMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // Empêcher le sniffing MIME
        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        
        // Protection clickjacking
        context.Response.Headers.Add("X-Frame-Options", "DENY");
        
        // Protection XSS (legacy)
        context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
        
        // Politique de référent
        context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
        
        // HSTS (HTTPS strict)
        context.Response.Headers.Add("Strict-Transport-Security", 
            "max-age=31536000; includeSubDomains; preload");
        
        // Permissions Policy
        context.Response.Headers.Add("Permissions-Policy",
            "geolocation=(), microphone=(), camera=()");
        
        await next(context);
    }
}
```

### 3.6 Sensitive Data Exposure

**Chiffrement des données sensibles**:
```csharp
public class DataEncryptionService
{
    private readonly byte[] _key;
    
    public string Encrypt(string plainText)
    {
        using var aes = Aes.Create();
        aes.Key = _key;
        aes.GenerateIV();
        
        using var encryptor = aes.CreateEncryptor();
        using var ms = new MemoryStream();
        
        ms.Write(aes.IV, 0, aes.IV.Length);
        
        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
        {
            sw.Write(plainText);
        }
        
        return Convert.ToBase64String(ms.ToArray());
    }
}
```

**Ne jamais logger de données sensibles**:
```csharp
// ❌ DANGEREUX
_logger.LogInformation($"User {email} logged in with password {password}");

// ✅ SÉCURISÉ
_logger.LogInformation($"User {email} logged in successfully");
```

---

## 📊 4. Audit et Logging

### 4.1 Logs d'Audit

**Événements à logger**:
- Authentification (succès/échec)
- Modifications de données sensibles
- Changements de permissions
- Accès aux données personnelles
- Erreurs de sécurité

**Implémentation**:
```csharp
public class AuditLogService
{
    public async Task LogAsync(AuditLog log)
    {
        log.Timestamp = DateTime.UtcNow;
        log.IpAddress = _httpContext.Connection.RemoteIpAddress?.ToString();
        log.UserAgent = _httpContext.Request.Headers["User-Agent"];
        
        await _context.AuditLogs.AddAsync(log);
        await _context.SaveChangesAsync();
    }
}

// Usage
await _auditLog.LogAsync(new AuditLog
{
    UserId = currentUserId,
    Action = "UPDATE_TOURNAMENT",
    EntityType = "Tournament",
    EntityId = tournamentId,
    Details = JsonSerializer.Serialize(changes)
});
```

### 4.2 Monitoring et Alertes

**Événements critiques à monitorer**:
- Tentatives de connexion échouées répétées
- Accès non autorisés (403)
- Erreurs serveur (500)
- Modifications de rôles
- Suppressions de données

**Configuration Alertes**:
```yaml
# prometheus-alerts.yml
groups:
  - name: security
    rules:
      - alert: HighFailedLoginRate
        expr: rate(failed_login_attempts[5m]) > 10
        annotations:
          summary: "Taux élevé de tentatives de connexion échouées"
          
      - alert: UnauthorizedAccessAttempts
        expr: rate(http_requests_total{status="403"}[5m]) > 5
        annotations:
          summary: "Tentatives d'accès non autorisées"
```

---

## 🇪🇺 5. Conformité RGPD

### 5.1 Principes Fondamentaux

1. **Licéité, loyauté, transparence**
2. **Limitation des finalités**
3. **Minimisation des données**
4. **Exactitude**
5. **Limitation de la conservation**
6. **Intégrité et confidentialité**
7. **Responsabilité**

### 5.2 Droits des Utilisateurs

#### Droit d'Accès
```csharp
[HttpGet("me/data")]
public async Task<IActionResult> GetMyData()
{
    var userId = GetCurrentUserId();
    
    var userData = new
    {
        User = await _userRepository.GetByIdAsync(userId),
        Player = await _playerRepository.GetByUserIdAsync(userId),
        Tournaments = await _tournamentRepository.GetByPlayerAsync(userId),
        Matches = await _matchRepository.GetByPlayerAsync(userId),
        Notifications = await _notificationRepository.GetByUserAsync(userId),
        AuditLogs = await _auditLogRepository.GetByUserAsync(userId)
    };
    
    return Ok(userData);
}
```

#### Droit à l'Effacement
```csharp
[HttpDelete("me")]
public async Task<IActionResult> DeleteMyAccount()
{
    var userId = GetCurrentUserId();
    
    // Soft delete (conservation légale 3 ans)
    await _userService.SoftDeleteAsync(userId);
    
    // Anonymisation des données
    await _userService.AnonymizeUserDataAsync(userId);
    
    // Log RGPD
    await _auditLog.LogAsync(new AuditLog
    {
        UserId = userId,
        Action = "RGPD_DELETE_ACCOUNT",
        Details = "User requested account deletion"
    });
    
    return NoContent();
}
```

#### Droit à la Portabilité
```csharp
[HttpGet("me/export")]
public async Task<IActionResult> ExportMyData()
{
    var userId = GetCurrentUserId();
    var userData = await _userService.GetAllUserDataAsync(userId);
    
    var json = JsonSerializer.Serialize(userData, new JsonSerializerOptions
    {
        WriteIndented = true
    });
    
    var bytes = Encoding.UTF8.GetBytes(json);
    
    return File(bytes, "application/json", $"my_data_{DateTime.UtcNow:yyyyMMdd}.json");
}
```

### 5.3 Consentement

**Collecte du consentement**:
```csharp
public class RegisterDto
{
    [Required]
    public bool AcceptTerms { get; set; }
    
    public bool AcceptMarketing { get; set; } = false;
}

// Enregistrement du consentement
var consent = new UserConsent
{
    UserId = user.Id,
    ConsentType = "terms_and_conditions",
    ConsentGiven = true,
    ConsentDate = DateTime.UtcNow,
    IpAddress = GetClientIp(),
    UserAgent = GetUserAgent()
};
await _context.UserConsents.AddAsync(consent);
```

### 5.4 Durée de Conservation

| Donnée | Durée | Justification |
|--------|-------|---------------|
| Comptes actifs | Illimitée | Nécessaire au service |
| Comptes inactifs (>2 ans) | Suppression | RGPD minimisation |
| Logs d'audit | 3 ans | Obligation légale |
| Données de paiement | 0 (non stockées) | PCI-DSS |
| Adresses IP (logs) | 6 mois | Sécurité |
| Cookies analytics | 13 mois | CNIL |

**Nettoyage automatique**:
```csharp
public class DataRetentionService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Supprimer comptes inactifs > 2 ans
            await DeleteInactiveAccountsAsync();
            
            // Anonymiser anciens logs > 3 ans
            await AnonymizeOldLogsAsync();
            
            // Supprimer notifications expirées
            await DeleteExpiredNotificationsAsync();
            
            // Attendre 24h
            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
}
```

### 5.5 Registre des Traitements

**Exemple d'entrée**:
```
Traitement: Gestion des comptes utilisateurs
Finalité: Permettre l'authentification et la participation aux tournois
Base légale: Exécution du contrat
Catégories de données: Identité, contact, données de connexion
Destinataires: Équipe technique, hébergeur (OVH)
Transferts hors UE: Non
Durée de conservation: Durée du compte + 3 ans (logs)
Mesures de sécurité: Chiffrement, contrôle d'accès, audit
```

---

## 🔒 6. Sécurité Infrastructure

### 6.1 HTTPS Obligatoire

**Configuration NGINX**:
```nginx
server {
    listen 80;
    server_name esport-platform.fr;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name esport-platform.fr;
    
    ssl_certificate /etc/letsencrypt/live/esport-platform.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/esport-platform.fr/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
}
```

### 6.2 Rate Limiting

**Configuration NGINX**:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

location /api/auth {
    limit_req zone=auth_limit burst=3 nodelay;
}

location /api {
    limit_req zone=api_limit burst=20 nodelay;
}
```

### 6.3 Firewall & Network Security

**Règles iptables**:
```bash
# Bloquer tout par défaut
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Autoriser loopback
iptables -A INPUT -i lo -j ACCEPT

# Autoriser connexions établies
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Autoriser SSH (port personnalisé)
iptables -A INPUT -p tcp --dport 2222 -j ACCEPT

# Autoriser HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Protection DDoS
iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
```

---

## ✅ Checklist Sécurité

### Authentification
- [x] Politique de mots de passe forte
- [x] Hachage Argon2id/bcrypt
- [x] Protection brute force
- [x] JWT sécurisés
- [x] Refresh token rotation
- [x] MFA (optionnel)

### Authorization
- [x] RBAC implémenté
- [x] Principe du moindre privilège
- [x] Validation côté serveur

### Protection OWASP
- [x] Injection SQL (ORM)
- [x] XSS (CSP, échappement)
- [x] CSRF (tokens)
- [x] Broken Access Control
- [x] Security Misconfiguration
- [x] Sensitive Data Exposure

### RGPD
- [x] Droit d'accès
- [x] Droit à l'effacement
- [x] Droit à la portabilité
- [x] Consentement explicite
- [x] Durée de conservation
- [x] Registre des traitements

### Infrastructure
- [x] HTTPS obligatoire
- [x] TLS 1.2+ uniquement
- [x] Rate limiting
- [x] Firewall configuré
- [x] Logs centralisés
- [x] Monitoring actif

### Audit
- [x] Logs d'audit complets
- [x] Alertes sécurité
- [x] Tests de pénétration
- [x] Scan vulnérabilités
- [x] Code review sécurité

---

**Document rédigé par**: Responsable Sécurité  
**Version**: 1.0  
**Date**: Décembre 2025  
**Statut**: Approuvé

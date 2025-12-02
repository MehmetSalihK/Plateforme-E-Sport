import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { Utilisateur, RoleUtilisateur } from '../entities/utilisateur.entity';

const TOURS_SALT = 12;
const SECRET_JWT: Secret = process.env.JWT_SECRET || 'votre_cle_secrete_jwt_a_changer_en_production';
const EXPIRATION_JWT: string = process.env.JWT_EXPIRATION_MINUTES || '15m';
const EXPIRATION_REFRESH: string = process.env.JWT_REFRESH_EXPIRATION_DAYS || '7d';

export interface PayloadJwt {
    utilisateurId: number;
    email: string;
    role: RoleUtilisateur;
}

export class UtilsAuth {
    // Hasher un mot de passe
    static async hasherMotDePasse(motDePasse: string): Promise<string> {
        return bcrypt.hash(motDePasse, TOURS_SALT);
    }

    // Vérifier un mot de passe
    static async verifierMotDePasse(motDePasse: string, hash: string): Promise<boolean> {
        return bcrypt.compare(motDePasse, hash);
    }

    // Générer un token d'accès
    static genererTokenAcces(utilisateur: Utilisateur): string {
        const payload: PayloadJwt = {
            utilisateurId: utilisateur.id,
            email: utilisateur.email,
            role: utilisateur.role
        };

        // @ts-ignore - TypeScript overload resolution issue with jsonwebtoken
        return jwt.sign(payload, SECRET_JWT, {
            expiresIn: EXPIRATION_JWT,
            issuer: process.env.JWT_ISSUER || 'esport-platform',
            audience: process.env.JWT_AUDIENCE || 'esport-platform-users'
        });
    }

    // Générer un token de rafraîchissement
    static genererTokenRafraichissement(utilisateur: Utilisateur): string {
        const payload: PayloadJwt = {
            utilisateurId: utilisateur.id,
            email: utilisateur.email,
            role: utilisateur.role
        };

        // @ts-ignore - TypeScript overload resolution issue with jsonwebtoken
        return jwt.sign(payload, SECRET_JWT, {
            expiresIn: EXPIRATION_REFRESH,
            issuer: process.env.JWT_ISSUER || 'esport-platform',
            audience: process.env.JWT_AUDIENCE || 'esport-platform-users'
        });
    }

    // Vérifier un token
    static verifierToken(token: string): PayloadJwt {
        try {
            return jwt.verify(token, SECRET_JWT, {
                issuer: process.env.JWT_ISSUER || 'esport-platform',
                audience: process.env.JWT_AUDIENCE || 'esport-platform-users'
            }) as PayloadJwt;
        } catch (erreur) {
            throw new Error('Token invalide');
        }
    }

    // Valider un mot de passe
    static validerMotDePasse(motDePasse: string): { valide: boolean; erreurs: string[] } {
        const erreurs: string[] = [];

        if (motDePasse.length < 12) {
            erreurs.push('Le mot de passe doit contenir au moins 12 caractères');
        }

        if (!/[a-z]/.test(motDePasse)) {
            erreurs.push('Le mot de passe doit contenir au moins une minuscule');
        }

        if (!/[A-Z]/.test(motDePasse)) {
            erreurs.push('Le mot de passe doit contenir au moins une majuscule');
        }

        if (!/\d/.test(motDePasse)) {
            erreurs.push('Le mot de passe doit contenir au moins un chiffre');
        }

        if (!/[@$!%*?&]/.test(motDePasse)) {
            erreurs.push('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)');
        }

        return {
            valide: erreurs.length === 0,
            erreurs
        };
    }
}

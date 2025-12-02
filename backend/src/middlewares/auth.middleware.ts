import { Request, Response, NextFunction } from 'express';
import { UtilsAuth } from '../utils/auth.utils';
import { ErreurApp } from './gestionErreurs';
import { RoleUtilisateur } from '../entities/utilisateur.entity';

// Extension de l'interface Request pour inclure l'utilisateur
export interface RequeteAuth extends Request {
    utilisateur?: {
        utilisateurId: number;
        email: string;
        role: RoleUtilisateur;
    };
}

// Middleware d'authentification
export const authentifier = (req: RequeteAuth, res: Response, next: NextFunction) => {
    try {
        const enteteAuth = req.headers.authorization;

        if (!enteteAuth || !enteteAuth.startsWith('Bearer ')) {
            throw new ErreurApp(401, 'Aucun token fourni');
        }

        const token = enteteAuth.substring(7);
        const payload = UtilsAuth.verifierToken(token);

        req.utilisateur = payload;
        next();
    } catch (erreur) {
        next(new ErreurApp(401, 'Token invalide ou expiré'));
    }
};

// Middleware d'autorisation par rôle
export const autoriser = (...roles: RoleUtilisateur[]) => {
    return (req: RequeteAuth, res: Response, next: NextFunction) => {
        if (!req.utilisateur) {
            return next(new ErreurApp(401, 'Non authentifié'));
        }

        if (!roles.includes(req.utilisateur.role)) {
            return next(new ErreurApp(403, 'Permissions insuffisantes'));
        }

        next();
    };
};

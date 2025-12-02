import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Classe d'erreur personnalisée pour l'application
export class ErreurApp extends Error {
    constructor(
        public codeStatut: number,
        public message: string,
        public estOperationnelle = true
    ) {
        super(message);
        Object.setPrototypeOf(this, ErreurApp.prototype);
    }
}

// Gestionnaire d'erreurs global
export const gestionnaireErreurs = (
    err: Error | ErreurApp,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ErreurApp) {
        logger.error(`${err.codeStatut} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.status(err.codeStatut).json({
            succes: false,
            erreur: {
                message: err.message,
                codeStatut: err.codeStatut
            }
        });
    }

    // Erreurs inattendues
    logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, err);

    return res.status(500).json({
        succes: false,
        erreur: {
            message: process.env.NODE_ENV === 'production'
                ? 'Erreur interne du serveur'
                : err.message,
            codeStatut: 500
        }
    });
};

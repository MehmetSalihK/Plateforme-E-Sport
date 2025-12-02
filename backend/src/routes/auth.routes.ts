import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Utilisateur, RoleUtilisateur } from '../entities/utilisateur.entity';
import { Joueur } from '../entities/joueur.entity';
import { UtilsAuth } from '../utils/auth.utils';
import { ErreurApp } from '../middlewares/gestionErreurs';
import { authentifier } from '../middlewares/auth.middleware';

const routeur = Router();
const depotUtilisateurs = AppDataSource.getRepository(Utilisateur);
const depotJoueurs = AppDataSource.getRepository(Joueur);

// Inscription
routeur.post('/inscription', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, motDePasse, pseudo, prenom, nom } = req.body;

        // Validation des champs requis
        if (!email || !motDePasse || !pseudo) {
            throw new ErreurApp(400, 'Email, mot de passe et pseudo sont requis');
        }

        // Validation du mot de passe
        const validationMdp = UtilsAuth.validerMotDePasse(motDePasse);
        if (!validationMdp.valide) {
            throw new ErreurApp(400, validationMdp.erreurs.join(', '));
        }

        // Vérifier si l'utilisateur existe déjà
        const utilisateurExistant = await depotUtilisateurs.findOne({ where: { email } });
        if (utilisateurExistant) {
            throw new ErreurApp(409, 'Cet email est déjà enregistré');
        }

        // Vérifier si le pseudo existe déjà
        const joueurExistant = await depotJoueurs.findOne({ where: { pseudo } });
        if (joueurExistant) {
            throw new ErreurApp(409, 'Ce pseudo est déjà pris');
        }

        // Créer l'utilisateur
        const hashMotDePasse = await UtilsAuth.hasherMotDePasse(motDePasse);
        const utilisateur = depotUtilisateurs.create({
            email,
            motDePasseHash: hashMotDePasse,
            prenom,
            nom,
            role: RoleUtilisateur.JOUEUR
        });

        await depotUtilisateurs.save(utilisateur);

        // Créer le profil joueur
        const joueur = depotJoueurs.create({
            utilisateurId: utilisateur.id,
            pseudo,
            classementElo: 1200
        });

        await depotJoueurs.save(joueur);

        res.status(201).json({
            succes: true,
            message: 'Utilisateur inscrit avec succès',
            donnees: {
                id: utilisateur.id,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });
    } catch (erreur) {
        next(erreur);
    }
});

// Connexion
routeur.post('/connexion', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, motDePasse } = req.body;

        if (!email || !motDePasse) {
            throw new ErreurApp(400, 'Email et mot de passe sont requis');
        }

        // Trouver l'utilisateur
        const utilisateur = await depotUtilisateurs.findOne({ where: { email } });
        if (!utilisateur) {
            throw new ErreurApp(401, 'Identifiants invalides');
        }

        // Vérifier si le compte est verrouillé
        if (utilisateur.verrouillageJusqua && utilisateur.verrouillageJusqua > new Date()) {
            throw new ErreurApp(403, 'Compte temporairement verrouillé. Veuillez réessayer plus tard.');
        }

        // Vérifier le mot de passe
        const motDePasseValide = await UtilsAuth.verifierMotDePasse(motDePasse, utilisateur.motDePasseHash);
        if (!motDePasseValide) {
            // Incrémenter les tentatives échouées
            utilisateur.tentativesConnexionEchouees += 1;

            if (utilisateur.tentativesConnexionEchouees >= 5) {
                utilisateur.verrouillageJusqua = new Date(Date.now() + 30 * 60 * 1000); // Verrouiller pour 30 minutes
            }

            await depotUtilisateurs.save(utilisateur);
            throw new ErreurApp(401, 'Identifiants invalides');
        }

        // Réinitialiser les tentatives échouées
        utilisateur.tentativesConnexionEchouees = 0;
        utilisateur.verrouillageJusqua = null as any;
        utilisateur.derniereConnexion = new Date();
        await depotUtilisateurs.save(utilisateur);

        // Générer les tokens
        const tokenAcces = UtilsAuth.genererTokenAcces(utilisateur);
        const tokenRafraichissement = UtilsAuth.genererTokenRafraichissement(utilisateur);

        res.json({
            succes: true,
            donnees: {
                tokenAcces,
                tokenRafraichissement,
                expireDans: 900, // 15 minutes en secondes
                utilisateur: {
                    id: utilisateur.id,
                    email: utilisateur.email,
                    role: utilisateur.role
                }
            }
        });
    } catch (erreur) {
        next(erreur);
    }
});

// Rafraîchir le token
routeur.post('/rafraichir', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tokenRafraichissement } = req.body;

        if (!tokenRafraichissement) {
            throw new ErreurApp(400, 'Token de rafraîchissement requis');
        }

        const payload = UtilsAuth.verifierToken(tokenRafraichissement);
        const utilisateur = await depotUtilisateurs.findOne({ where: { id: payload.utilisateurId } });

        if (!utilisateur) {
            throw new ErreurApp(401, 'Token de rafraîchissement invalide');
        }

        const nouveauTokenAcces = UtilsAuth.genererTokenAcces(utilisateur);

        res.json({
            succes: true,
            donnees: {
                tokenAcces: nouveauTokenAcces,
                expireDans: 900
            }
        });
    } catch (erreur) {
        next(erreur);
    }
});

// Obtenir l'utilisateur actuel
routeur.get('/moi', authentifier, async (req: any, res: Response, next: NextFunction) => {
    try {
        const utilisateur = await depotUtilisateurs.findOne({
            where: { id: req.utilisateur.utilisateurId },
            select: ['id', 'email', 'prenom', 'nom', 'role', 'emailVerifie', 'creeLe']
        });

        if (!utilisateur) {
            throw new ErreurApp(404, 'Utilisateur non trouvé');
        }

        const joueur = await depotJoueurs.findOne({ where: { utilisateurId: utilisateur.id } });

        res.json({
            succes: true,
            donnees: {
                ...utilisateur,
                joueur
            }
        });
    } catch (erreur) {
        next(erreur);
    }
});

export default routeur;

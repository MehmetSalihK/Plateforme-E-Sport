import { Router, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Tournoi, StatutTournoi } from '../entities/tournoi.entity';
import { ErreurApp } from '../middlewares/gestionErreurs';
import { authentifier, autoriser, RequeteAuth } from '../middlewares/auth.middleware';
import { RoleUtilisateur } from '../entities/utilisateur.entity';

const routeur = Router();
const depotTournois = AppDataSource.getRepository(Tournoi);

// Obtenir tous les tournois (public)
routeur.get('/', async (req: RequeteAuth, res: Response, next: NextFunction) => {
    try {
        const { statut, jeu, recherche, page = 1, limite = 20 } = req.query;

        const constructeurRequete = depotTournois.createQueryBuilder('tournoi')
            .leftJoinAndSelect('tournoi.organisateur', 'organisateur')
            .where('tournoi.supprimeLe IS NULL');

        if (statut) {
            constructeurRequete.andWhere('tournoi.statut = :statut', { statut });
        }

        if (jeu) {
            constructeurRequete.andWhere('tournoi.jeu = :jeu', { jeu });
        }

        if (recherche) {
            constructeurRequete.andWhere(
                '(tournoi.nom ILIKE :recherche OR tournoi.description ILIKE :recherche)',
                { recherche: `%${recherche}%` }
            );
        }

        const sauter = (Number(page) - 1) * Number(limite);
        constructeurRequete.skip(sauter).take(Number(limite));
        constructeurRequete.orderBy('tournoi.dateDebut', 'DESC');

        const [tournois, total] = await constructeurRequete.getManyAndCount();

        res.json({
            succes: true,
            donnees: tournois,
            pagination: {
                page: Number(page),
                limite: Number(limite),
                total,
                totalPages: Math.ceil(total / Number(limite))
            }
        });
    } catch (erreur) {
        next(erreur);
    }
});

// Obtenir un tournoi par ID (public)
routeur.get('/:id', async (req: RequeteAuth, res: Response, next: NextFunction) => {
    try {
        const tournoi = await depotTournois.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['organisateur']
        });

        if (!tournoi) {
            throw new ErreurApp(404, 'Tournoi non trouvé');
        }

        res.json({
            succes: true,
            donnees: tournoi
        });
    } catch (erreur) {
        next(erreur);
    }
});

// Créer un tournoi (Organisateur/Admin uniquement)
routeur.post('/',
    authentifier,
    autoriser(RoleUtilisateur.ORGANISATEUR, RoleUtilisateur.ADMIN),
    async (req: RequeteAuth, res: Response, next: NextFunction) => {
        try {
            const {
                nom,
                jeu,
                description,
                texteRegles,
                maxParticipants,
                format,
                typeBracket,
                dateDebut,
                finInscriptions,
                eloActive,
                cagnotte,
                estPublic
            } = req.body;

            // Validation
            if (!nom || !jeu || !maxParticipants || !dateDebut || !finInscriptions) {
                throw new ErreurApp(400, 'Champs requis manquants');
            }

            if (maxParticipants < 2 || maxParticipants > 1024) {
                throw new ErreurApp(400, 'Le nombre maximum de participants doit être entre 2 et 1024');
            }

            const dateDebutObj = new Date(dateDebut);
            const finInscriptionsObj = new Date(finInscriptions);

            if (dateDebutObj <= new Date()) {
                throw new ErreurApp(400, 'La date de début doit être dans le futur');
            }

            if (finInscriptionsObj >= dateDebutObj) {
                throw new ErreurApp(400, 'La date de fin des inscriptions doit être avant la date de début');
            }

            // Générer le slug
            const slug = nom.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            // Créer le tournoi
            const tournoi = depotTournois.create({
                nom,
                slug: `${slug}-${Date.now()}`,
                jeu,
                organisateurId: req.utilisateur!.utilisateurId,
                description,
                texteRegles,
                maxParticipants,
                format,
                typeBracket,
                dateDebut: dateDebutObj,
                debutInscriptions: new Date(),
                finInscriptions: finInscriptionsObj,
                eloActive: eloActive !== false,
                cagnotte,
                estPublic: estPublic !== false,
                statut: StatutTournoi.BROUILLON
            });

            await depotTournois.save(tournoi);

            res.status(201).json({
                succes: true,
                message: 'Tournoi créé avec succès',
                donnees: tournoi
            });
        } catch (erreur) {
            next(erreur);
        }
    }
);

// Mettre à jour un tournoi (Propriétaire/Admin uniquement)
routeur.put('/:id',
    authentifier,
    autoriser(RoleUtilisateur.ORGANISATEUR, RoleUtilisateur.ADMIN),
    async (req: RequeteAuth, res: Response, next: NextFunction) => {
        try {
            const tournoi = await depotTournois.findOne({
                where: { id: parseInt(req.params.id) }
            });

            if (!tournoi) {
                throw new ErreurApp(404, 'Tournoi non trouvé');
            }

            // Vérifier la propriété
            if (tournoi.organisateurId !== req.utilisateur!.utilisateurId && req.utilisateur!.role !== RoleUtilisateur.ADMIN) {
                throw new ErreurApp(403, 'Vous ne pouvez modifier que vos propres tournois');
            }

            // Mettre à jour les champs
            Object.assign(tournoi, req.body);
            await depotTournois.save(tournoi);

            res.json({
                succes: true,
                message: 'Tournoi mis à jour avec succès',
                donnees: tournoi
            });
        } catch (erreur) {
            next(erreur);
        }
    }
);

// Supprimer un tournoi (Propriétaire/Admin uniquement)
routeur.delete('/:id',
    authentifier,
    autoriser(RoleUtilisateur.ORGANISATEUR, RoleUtilisateur.ADMIN),
    async (req: RequeteAuth, res: Response, next: NextFunction) => {
        try {
            const tournoi = await depotTournois.findOne({
                where: { id: parseInt(req.params.id) }
            });

            if (!tournoi) {
                throw new ErreurApp(404, 'Tournoi non trouvé');
            }

            // Vérifier la propriété
            if (tournoi.organisateurId !== req.utilisateur!.utilisateurId && req.utilisateur!.role !== RoleUtilisateur.ADMIN) {
                throw new ErreurApp(403, 'Vous ne pouvez supprimer que vos propres tournois');
            }

            // Suppression douce
            tournoi.supprimeLe = new Date();
            await depotTournois.save(tournoi);

            res.status(204).send();
        } catch (erreur) {
            next(erreur);
        }
    }
);

export default routeur;

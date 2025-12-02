import { Router, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Joueur } from '../entities/joueur.entity';
import { ErreurApp } from '../middlewares/gestionErreurs';
import { authentifier, RequeteAuth } from '../middlewares/auth.middleware';

const routeur = Router();
const depotJoueurs = AppDataSource.getRepository(Joueur);

// Obtenir tous les joueurs (public)
routeur.get('/', async (req: RequeteAuth, res: Response, next: NextFunction) => {
    try {
        const { recherche, eloMin, eloMax, page = 1, limite = 20, tri = 'classementElo:desc' } = req.query;

        const constructeurRequete = depotJoueurs.createQueryBuilder('joueur')
            .leftJoinAndSelect('joueur.utilisateur', 'utilisateur');

        if (recherche) {
            constructeurRequete.andWhere('joueur.pseudo ILIKE :recherche', { recherche: `%${recherche}%` });
        }

        if (eloMin) {
            constructeurRequete.andWhere('joueur.classementElo >= :eloMin', { eloMin: Number(eloMin) });
        }

        if (eloMax) {
            constructeurRequete.andWhere('joueur.classementElo <= :eloMax', { eloMax: Number(eloMax) });
        }

        // Tri
        const [champTri, ordreTri] = (tri as string).split(':');
        constructeurRequete.orderBy(`joueur.${champTri}`, ordreTri.toUpperCase() as 'ASC' | 'DESC');

        const sauter = (Number(page) - 1) * Number(limite);
        constructeurRequete.skip(sauter).take(Number(limite));

        const [joueurs, total] = await constructeurRequete.getManyAndCount();

        res.json({
            succes: true,
            donnees: joueurs,
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

// Obtenir un joueur par ID (public)
routeur.get('/:id', async (req: RequeteAuth, res: Response, next: NextFunction) => {
    try {
        const joueur = await depotJoueurs.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['utilisateur']
        });

        if (!joueur) {
            throw new ErreurApp(404, 'Joueur non trouvé');
        }

        res.json({
            succes: true,
            donnees: joueur
        });
    } catch (erreur) {
        next(erreur);
    }
});

// Mettre à jour le profil joueur (authentifié)
routeur.put('/moi', authentifier, async (req: RequeteAuth, res: Response, next: NextFunction) => {
    try {
        const joueur = await depotJoueurs.findOne({
            where: { utilisateurId: req.utilisateur!.utilisateurId }
        });

        if (!joueur) {
            throw new ErreurApp(404, 'Profil joueur non trouvé');
        }

        const { pseudo, biographie, codePays, urlAvatar } = req.body;

        // Vérifier si le pseudo est déjà pris
        if (pseudo && pseudo !== joueur.pseudo) {
            const joueurExistant = await depotJoueurs.findOne({ where: { pseudo } });
            if (joueurExistant) {
                throw new ErreurApp(409, 'Ce pseudo est déjà pris');
            }
            joueur.pseudo = pseudo;
        }

        if (biographie !== undefined) joueur.biographie = biographie;
        if (codePays !== undefined) joueur.codePays = codePays;
        if (urlAvatar !== undefined) joueur.urlAvatar = urlAvatar;

        await depotJoueurs.save(joueur);

        res.json({
            succes: true,
            message: 'Profil mis à jour avec succès',
            donnees: joueur
        });
    } catch (erreur) {
        next(erreur);
    }
});

// Obtenir le classement (public)
routeur.get('/classement/global', async (req: RequeteAuth, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limite = 100 } = req.query;

        const sauter = (Number(page) - 1) * Number(limite);

        const [joueurs, total] = await depotJoueurs.findAndCount({
            where: {}, // Minimum 5 matchs pour apparaître dans le classement
            order: { classementElo: 'DESC' },
            skip: sauter,
            take: Number(limite),
            relations: ['utilisateur']
        });

        // Ajouter le rang
        const joueursAvecRang = joueurs.map((joueur, index) => ({
            ...joueur,
            rang: sauter + index + 1
        }));

        res.json({
            succes: true,
            donnees: joueursAvecRang,
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

export default routeur;

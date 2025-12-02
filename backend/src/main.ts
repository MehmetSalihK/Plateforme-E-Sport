import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { AppDataSource } from './config/database';
import { gestionnaireErreurs } from './middlewares/gestionErreurs';
import { logger } from './utils/logger';
import routesAuth from './routes/auth.routes';
import routesTournois from './routes/tournois.routes';
import routesJoueurs from './routes/joueurs.routes';
import routesMatchs from './routes/matchs.routes';
import routesEquipes from './routes/equipes.routes';

const app = express();
const serveurHttp = createServer(app);
const io = new Server(serveurHttp, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true
    }
});

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', routesAuth);
app.use('/api/tournois', routesTournois);
app.use('/api/joueurs', routesJoueurs);
app.use('/api/matchs', routesMatchs);
app.use('/api/equipes', routesEquipes);

// Vérification de santé
app.get('/health', (req, res) => {
    res.json({ statut: 'OK', horodatage: new Date().toISOString() });
});

// Gestion des erreurs
app.use(gestionnaireErreurs);

// WebSocket
io.on('connection', (socket) => {
    logger.info(`Client connecté: ${socket.id}`);

    socket.on('rejoindre_tournoi', (tournoiId: number) => {
        socket.join(`tournoi_${tournoiId}`);
        logger.info(`Socket ${socket.id} a rejoint le tournoi ${tournoiId}`);
    });

    socket.on('rejoindre_match', (matchId: number) => {
        socket.join(`match_${matchId}`);
        logger.info(`Socket ${socket.id} a rejoint le match ${matchId}`);
    });

    socket.on('disconnect', () => {
        logger.info(`Client déconnecté: ${socket.id}`);
    });
});

// Rendre io disponible globalement
app.set('io', io);

// Connexion à la base de données et démarrage du serveur
const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        logger.info('Base de données connectée avec succès');

        serveurHttp.listen(PORT, () => {
            logger.info(`Serveur démarré sur le port ${PORT}`);
            logger.info(`Environnement: ${process.env.NODE_ENV || 'development'}`);
        });
    })
    .catch((erreur) => {
        logger.error('Échec de la connexion à la base de données:', erreur);
        process.exit(1);
    });

export { io };
